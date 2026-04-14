import {
  AccessOutput,
  AccessMutator,
  AccessScopeB,
  AccessLedFlags1,
} from "../access_hid";
import {
  AccessHIDProvider,
  AccessHIDState,
  DefaultAccessHIDState,
} from "./access_hid_provider";
import { AccessProfileLedMode } from "./access_hid_state";
import { computeBluetoothReportChecksum } from "../bt_checksum";
import {
  FirmwareInfo,
  DefaultFirmwareInfo,
  readFirmwareInfo as readFirmwareInfoDS,
} from "../firmware_info";
import {
  FactoryInfo,
  DefaultFactoryInfo,
  readFactoryInfo as readFactoryInfoDS,
} from "../factory_info";
import { readMacAddress as readMacAddressDS } from "../pairing_info";
import type { HIDProvider } from "../hid_provider";

export type AccessHIDCallback = (state: AccessHIDState) => void;
export type AccessErrorCallback = (error: Error) => void;
export type AccessReadyCallback = () => void;
export type AccessConnectionCallback = (connected: boolean) => void;

// ── Identity loading adapters ──
// The existing readFirmwareInfo/readMacAddress/readFactoryInfo accept
// HIDProvider. AccessHIDProvider has the same readFeatureReport/sendFeatureReport
// signatures. We cast through `unknown` to reuse the existing implementations
// without duplicating their parsing logic.

function readMacAddress(
  provider: AccessHIDProvider
): Promise<string | undefined> {
  return readMacAddressDS(provider as unknown as HIDProvider);
}

function readFirmwareInfo(
  provider: AccessHIDProvider
): Promise<FirmwareInfo | undefined> {
  return readFirmwareInfoDS(provider as unknown as HIDProvider);
}

function readFactoryInfo(
  provider: AccessHIDProvider,
  hardwareInfo: number,
  mainFwVersionRaw: number
): Promise<FactoryInfo | undefined> {
  return readFactoryInfoDS(
    provider as unknown as HIDProvider,
    hardwareInfo,
    mainFwVersionRaw
  );
}

// ── Output report builder types ──

const MUTATOR = 1;
const SCOPE_B = 2;

interface CommandByte {
  index: number;
  value: number;
}

interface CommandEvent {
  scope: CommandByte;
  values: CommandByte[];
}

/** Coordinates an AccessHIDProvider and tracks the latest HID state */
export class AccessHID {
  private readonly subscribers = new Set<AccessHIDCallback>();
  private readonly errorSubscribers = new Set<AccessErrorCallback>();
  private readonly readySubscribers = new Set<AccessReadyCallback>();
  private readonly connectionSubscribers = new Set<AccessConnectionCallback>();
  private identityResolved = false;
  private identityRetryTimer?: ReturnType<typeof setTimeout>;
  private identityRetryCount = 0;
  private pendingCommands: CommandEvent[] = [];
  public state: AccessHIDState = { ...DefaultAccessHIDState };
  public firmwareInfo: FirmwareInfo = DefaultFirmwareInfo;
  public factoryInfo: FactoryInfo = DefaultFactoryInfo;
  public macAddress?: string;

  private commandTimer?: ReturnType<typeof setInterval>;

  constructor(
    readonly provider: AccessHIDProvider,
    refreshRate: number = 30
  ) {
    provider.onData = this.set.bind(this);
    provider.onError = this.handleError.bind(this);
    provider.onConnect = () => {
      this.firmwareFetch = undefined;
      this.factoryFetch = undefined;
      this.identityResolved = false;
      this.cancelIdentityRetry();
      this.connectionSubscribers.forEach((cb) => cb(true));
      void this.loadIdentity();
    };
    provider.onDisconnect = () => {
      this.cancelIdentityRetry();
      this.connectionSubscribers.forEach((cb) => cb(false));
    };

    this.commandTimer = setInterval(() => {
      if (this.pendingCommands.length > 0) {
        (async () => {
          const command = [...this.pendingCommands];
          this.pendingCommands = [];
          await provider.write(
            AccessHID.buildOutputReport(
              command,
              Boolean(provider.wireless)
            )
          );
        })().catch((err) => {
          this.handleError(
            new Error(`HID write failed: ${JSON.stringify(err)}`)
          );
        });
      }
    }, 1000 / refreshRate);
  }

  public dispose(): void {
    if (this.commandTimer) {
      clearInterval(this.commandTimer);
      this.commandTimer = undefined;
    }
    this.cancelIdentityRetry();
  }

  public get wireless(): boolean {
    return this.provider.wireless ?? false;
  }

  public register(callback: AccessHIDCallback): void {
    this.subscribers.add(callback);
  }

  public unregister(callback: AccessHIDCallback): void {
    this.subscribers.delete(callback);
  }

  public on(type: string, callback: AccessErrorCallback): void {
    if (type === "error") this.errorSubscribers.add(callback);
  }

  public onReady(callback: AccessReadyCallback): () => void {
    if (this.identityResolved) {
      callback();
      return () => {};
    }
    this.readySubscribers.add(callback);
    return () => this.readySubscribers.delete(callback);
  }

  public get ready(): boolean {
    return this.identityResolved;
  }

  public onConnectionChange(
    callback: AccessConnectionCallback
  ): () => void {
    this.connectionSubscribers.add(callback);
    return () => this.connectionSubscribers.delete(callback);
  }

  public get identity(): string | undefined {
    if (this.macAddress) return `mac:${this.macAddress}`;
    if (this.factoryInfo.serialNumber !== DefaultFactoryInfo.serialNumber)
      return `serial:${this.factoryInfo.serialNumber}`;
    if (this.firmwareInfo.deviceInfo !== DefaultFirmwareInfo.deviceInfo)
      return `device:${this.firmwareInfo.deviceInfo}`;
    return undefined;
  }

  private set(state: AccessHIDState): void {
    this.state = state;
    this.subscribers.forEach((callback) => callback(state));
  }

  private handleError(error: Error): void {
    this.errorSubscribers.forEach((callback) => callback(error));
  }

  // ── Identity loading ──

  private static readonly IDENTITY_MAX_ATTEMPTS = 5;
  private static readonly IDENTITY_BACKOFF_MS = [500, 1500, 3000, 5000];

  private async loadIdentity(): Promise<void> {
    if (!this.provider.connected) return;

    const hadCachedIdentity = this.identity !== undefined;
    if (hadCachedIdentity) this.markIdentityResolved();

    this.identityRetryCount += 1;

    try {
      const mac = await readMacAddress(this.provider);
      if (mac) this.macAddress = mac;

      const fw = await readFirmwareInfo(this.provider);
      if (fw) {
        this.firmwareInfo = fw;
        this.firmwareFetch = Promise.resolve(fw);

        const fi = await readFactoryInfo(
          this.provider,
          fw.hardwareInfo,
          fw.mainFirmwareVersionRaw
        );
        this.factoryInfo = fi ?? DefaultFactoryInfo;
        this.factoryFetch = Promise.resolve(this.factoryInfo);

        if (!hadCachedIdentity) this.markIdentityResolved();
        return;
      }
    } catch {
      // Fall through to retry logic
    }

    this.firmwareFetch = undefined;
    this.factoryFetch = undefined;

    if (
      this.identityRetryCount >= AccessHID.IDENTITY_MAX_ATTEMPTS ||
      !this.provider.connected
    ) {
      this.markIdentityResolved();
      return;
    }

    const delay =
      AccessHID.IDENTITY_BACKOFF_MS[
        Math.min(
          this.identityRetryCount - 1,
          AccessHID.IDENTITY_BACKOFF_MS.length - 1
        )
      ];
    this.identityRetryTimer = setTimeout(() => {
      this.identityRetryTimer = undefined;
      void this.loadIdentity();
    }, delay);
  }

  private markIdentityResolved(): void {
    if (this.identityResolved) return;
    this.identityResolved = true;
    this.identityRetryCount = 0;
    const callbacks = Array.from(this.readySubscribers);
    this.readySubscribers.clear();
    callbacks.forEach((cb) => cb());
  }

  private cancelIdentityRetry(): void {
    if (this.identityRetryTimer) {
      clearTimeout(this.identityRetryTimer);
      this.identityRetryTimer = undefined;
    }
    this.identityRetryCount = 0;
  }

  private firmwareFetch?: Promise<FirmwareInfo>;
  private factoryFetch?: Promise<FactoryInfo>;

  public fetchFirmwareInfo(): Promise<FirmwareInfo> {
    if (this.firmwareInfo !== DefaultFirmwareInfo)
      return Promise.resolve(this.firmwareInfo);
    if (this.firmwareFetch) return this.firmwareFetch;
    this.firmwareFetch = readFirmwareInfo(this.provider).then((info) => {
      this.firmwareInfo = info ?? DefaultFirmwareInfo;
      return this.firmwareInfo;
    });
    return this.firmwareFetch;
  }

  public fetchFactoryInfo(): Promise<FactoryInfo> {
    if (this.factoryInfo !== DefaultFactoryInfo)
      return Promise.resolve(this.factoryInfo);
    if (this.factoryFetch) return this.factoryFetch;
    if (this.firmwareInfo === DefaultFirmwareInfo)
      return Promise.resolve(DefaultFactoryInfo);
    const fwInfo = this.firmwareInfo;
    this.factoryFetch = readFactoryInfo(
      this.provider,
      fwInfo.hardwareInfo,
      fwInfo.mainFirmwareVersionRaw
    ).then((info) => {
      this.factoryInfo = info ?? DefaultFactoryInfo;
      return this.factoryInfo;
    });
    return this.factoryFetch;
  }

  // ── Output report builder ──

  /**
   * Build an Access output report from pending commands.
   *
   * USB: 32 bytes, report ID 0x02
   * BT: 78 bytes, report ID 0x31, constant 0x02 at [1], CRC32 at [74-77]
   *
   * USB layout: [0]=reportId, [1]=mutator, [2]=scopeB, [3..31]=payload
   * BT layout: [0]=0x31, [1]=0x02, [2]=mutator, [3]=scopeB, [4..73]=payload, [74-77]=CRC
   */
  private static buildOutputReport(
    events: CommandEvent[],
    wireless: boolean
  ): Uint8Array {
    const usbReport = new Uint8Array(AccessOutput.USB_SIZE).fill(0);
    usbReport[0] = AccessOutput.REPORT_ID_USB;
    usbReport[MUTATOR] = events
      .filter(({ scope: { index } }) => index === MUTATOR)
      .reduce<number>((acc, { scope: { value } }) => acc | value, 0x00);
    usbReport[SCOPE_B] = events
      .filter(({ scope: { index } }) => index === SCOPE_B)
      .reduce<number>((acc, { scope: { value } }) => acc | value, 0x00);

    events.forEach(({ values }) => {
      values.forEach(({ index, value }) => {
        usbReport[index] = value;
      });
    });

    if (!wireless) return usbReport;

    // BT: shift USB bytes +1, prepend report ID 0x31 and constant 0x02
    const btReport = new Uint8Array(AccessOutput.BT_SIZE).fill(0);
    btReport[0] = AccessOutput.REPORT_ID_BT;
    btReport[1] = AccessOutput.BT_CONSTANT;

    // Copy mutator + scope B + payload, shifted by +1
    btReport[2] = usbReport[1]; // mutator
    btReport[3] = usbReport[2]; // scope B
    for (let i = 3; i < usbReport.length; i++) {
      btReport[i + 1] = usbReport[i];
    }

    // BT requires scope B LED flag for lightbar over BT
    if (usbReport[MUTATOR] & AccessMutator.LED) {
      btReport[3] |= AccessScopeB.LED;
    }

    const crc = computeBluetoothReportChecksum(btReport);
    btReport[AccessOutput.BT_CRC_OFFSET] = crc & 0xff;
    btReport[AccessOutput.BT_CRC_OFFSET + 1] = (crc >>> 8) & 0xff;
    btReport[AccessOutput.BT_CRC_OFFSET + 2] = (crc >>> 16) & 0xff;
    btReport[AccessOutput.BT_CRC_OFFSET + 3] = (crc >>> 24) & 0xff;

    return btReport;
  }

  // ── Output methods ──

  /** Set the lightbar RGB color */
  public setLightbar(r: number, g: number, b: number): void {
    this.pendingCommands.push({
      scope: { index: MUTATOR, value: AccessMutator.LED },
      values: [
        { index: AccessOutput.LIGHTBAR_R, value: r },
        { index: AccessOutput.LIGHTBAR_G, value: g },
        { index: AccessOutput.LIGHTBAR_B, value: b },
      ],
    });
  }

  /** Set the profile LED animation mode */
  public setProfileLeds(mode: AccessProfileLedMode): void {
    this.pendingCommands.push({
      scope: { index: MUTATOR, value: AccessMutator.STATUS_LED },
      values: [
        {
          index: AccessOutput.LED_FLAGS_1,
          value: AccessLedFlags1.PROFILE_AND_STATUS,
        },
        { index: AccessOutput.LED_FLAGS_2, value: mode },
      ],
    });
  }

  /** Set the player indicator pattern (0=off, 1–4=player number) */
  public setPlayerIndicator(pattern: number): void {
    this.pendingCommands.push({
      scope: { index: MUTATOR, value: AccessMutator.PLAYER_INDICATOR_LED },
      values: [{ index: AccessOutput.PLAYER_INDICATOR, value: pattern }],
    });
  }

  /** Set the status LED on or off */
  public setStatusLed(on: boolean): void {
    this.pendingCommands.push({
      scope: { index: MUTATOR, value: AccessMutator.STATUS_LED },
      values: [
        {
          index: AccessOutput.LED_FLAGS_1,
          value: AccessLedFlags1.PROFILE_AND_STATUS,
        },
        { index: AccessOutput.STATUS_LED, value: on ? 1 : 0 },
      ],
    });
  }
}
