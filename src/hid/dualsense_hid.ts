import { CommandScopeA, CommandScopeB, LedOptions, PulseOptions, Brightness, MuteLedMode } from "./command";
import {
  HIDProvider,
  DualsenseHIDState,
  DefaultDualsenseHIDState,
} from "./hid_provider";
import { computeBluetoothReportChecksum } from "./bt_checksum";
import { FirmwareInfo, DefaultFirmwareInfo, readFirmwareInfo } from "./firmware_info";
import { FactoryInfo, DefaultFactoryInfo, readFactoryInfo } from "./factory_info";
import { readMacAddress } from "./pairing_info";

export type HIDCallback = (state: DualsenseHIDState) => void;
export type ErrorCallback = (error: Error) => void;
export type ReadyCallback = () => void;
export type ConnectionCallback = (connected: boolean) => void;

const SCOPE_A = 1;
const SCOPE_B = 2;

interface CommandByte {
  index: number;
  value: number;
}

interface CommandEvent {
  scope: CommandByte;
  values: CommandByte[];
}

/** Coordinates a HIDProvider and tracks the latest HID state */
export class DualsenseHID {
  /** Subscribers waiting for HID state updates */
  private readonly subscribers = new Set<HIDCallback>();
  /** Subscribers waiting for error updates */
  private readonly errorSubscribers = new Set<ErrorCallback>();
  /** Subscribers waiting for firmware/factory info to become available */
  private readonly readySubscribers = new Set<ReadyCallback>();
  /** Subscribers tracking transport-level connect/disconnect events */
  private readonly connectionSubscribers = new Set<ConnectionCallback>();
  /** True once firmware/factory info has been loaded for the current connection */
  private identityResolved = false;
  /** Pending retry timer for identity loading after a transient failure */
  private identityRetryTimer?: ReturnType<typeof setTimeout>;
  /** Number of identity-load attempts made for the current connection */
  private identityRetryCount = 0;
  /** Queue of pending HID commands */
  private pendingCommands: CommandEvent[] = [];
  /** Most recent HID state of the device */
  public state: DualsenseHIDState = { ...DefaultDualsenseHIDState };
  /** Firmware and hardware information, populated after connection */
  public firmwareInfo: FirmwareInfo = DefaultFirmwareInfo;
  /** Factory information (serial, color, board revision), populated after connection */
  public factoryInfo: FactoryInfo = DefaultFactoryInfo;
  /** Bluetooth MAC address from Feature Report 0x09, populated after connection */
  public macAddress?: string;

  constructor(
    readonly provider: HIDProvider,
    refreshRate: number = 30,
  ) {
    provider.onData = this.set.bind(this);
    provider.onError = this.handleError.bind(this);
    provider.onConnect = () => {
      // Keep cached firmware/factory info from the prior session so that
      // consumers see identity details immediately on a reconnection
      // event. The background loadIdentity() call will verify and refresh
      // the cache — if the hardware identity turns out different (e.g. a
      // different controller grabbed the same slot), the fields get
      // overwritten then.
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

    setInterval(() => {
      if (this.pendingCommands.length > 0) {
        (async () => {
          const command = [...this.pendingCommands];
          this.pendingCommands = [];
          await provider.write(
            DualsenseHID.buildFeatureReport(
              command,
              Boolean(provider.wireless),
            ),
          );
        })().catch((err) => {
          this.handleError(
            new Error(`HID write failed: ${JSON.stringify(err)}`),
          );
        });
      }
    }, 1000 / refreshRate);
  }

  public get wireless(): boolean {
    return this.provider.wireless ?? false;
  }

  /** Register a handler for HID state updates */
  public register(callback: HIDCallback): void {
    this.subscribers.add(callback);
  }

  /** Cancel a previously registered handler */
  public unregister(callback: HIDCallback): void {
    this.subscribers.delete(callback);
  }

  /** Add a subscriber for errors */
  public on(type: "error" | string, callback: ErrorCallback): void {
    if (type === "error") this.errorSubscribers.add(callback);
  }

  /**
   * Subscribe to notification when firmware/factory info finishes loading
   * after a connect. Fires once per connection — either when identity has
   * been resolved, or when we've given up retrying. If identity is already
   * resolved at the time of subscription, the callback fires synchronously.
   */
  public onReady(callback: ReadyCallback): () => void {
    if (this.identityResolved) {
      callback();
      return () => {};
    }
    this.readySubscribers.add(callback);
    return () => this.readySubscribers.delete(callback);
  }

  /** True if firmware/factory info has been loaded (or given up on) for the current connection */
  public get ready(): boolean {
    return this.identityResolved;
  }

  /**
   * Subscribe to transport-level connect/disconnect events. Useful for
   * mirroring connection state into an Input without polling. Returns
   * an unsubscribe function.
   */
  public onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionSubscribers.add(callback);
    return () => this.connectionSubscribers.delete(callback);
  }

  /**
   * Stable hardware identity for this controller, derived from the most
   * trustworthy info available. Prefers the Bluetooth MAC address (from
   * Feature Report 0x09, works on every transport and platform), then
   * falls back to the factory serial, then firmware deviceInfo.
   * Returns undefined until identity info has been read.
   */
  public get identity(): string | undefined {
    if (this.macAddress) {
      return `mac:${this.macAddress}`;
    }
    if (this.factoryInfo.serialNumber !== DefaultFactoryInfo.serialNumber) {
      return `serial:${this.factoryInfo.serialNumber}`;
    }
    if (this.firmwareInfo.deviceInfo !== DefaultFirmwareInfo.deviceInfo) {
      return `device:${this.firmwareInfo.deviceInfo}`;
    }
    return undefined;
  }

  /** Update the HID state and pass it along to all state subscribers */
  private set(state: DualsenseHIDState): void {
    this.state = state;
    this.subscribers.forEach((callback) => callback(state));
  }

  /** Pass errors along to all error subscribers */
  private handleError(error: Error): void {
    this.errorSubscribers.forEach((callback) => callback(error));
  }

  /** Maximum identity-load retry attempts per connection */
  private static readonly IDENTITY_MAX_ATTEMPTS = 5;
  /** Backoff schedule (ms) for identity-load retries */
  private static readonly IDENTITY_BACKOFF_MS = [500, 1500, 3000, 5000];

  /**
   * Attempt to read firmware + factory info for the current connection,
   * with retry on failure. Marks identity as resolved on success or after
   * exhausting all attempts (so consumers don't wait forever).
   *
   * If cached firmware/factory info exists from a prior session, identity
   * is resolved immediately (so the connection event has full details),
   * then a background verification re-reads the device to confirm.
   */
  private async loadIdentity(): Promise<void> {
    if (!this.provider.connected) return;

    // Fast path: if we already have cached identity from a prior session,
    // mark resolved immediately so consumers see it on the connection event.
    // Then continue to the verification read below.
    const hadCachedIdentity = this.identity !== undefined;
    if (hadCachedIdentity) {
      this.markIdentityResolved();
    }

    this.identityRetryCount += 1;

    try {
      // Read MAC address first — simple feature report, no firmware gate.
      const mac = await readMacAddress(this.provider);
      if (mac) this.macAddress = mac;

      // Always read fresh from the device (bypass the idempotency cache).
      const fw = await readFirmwareInfo(this.provider);
      if (fw) {
        this.firmwareInfo = fw;
        this.firmwareFetch = Promise.resolve(fw);

        const fi = await readFactoryInfo(
          this.provider,
          fw.hardwareInfo,
          fw.mainFirmwareVersionRaw,
        );
        this.factoryInfo = fi ?? DefaultFactoryInfo;
        this.factoryFetch = Promise.resolve(this.factoryInfo);

        if (!hadCachedIdentity) {
          this.markIdentityResolved();
        }
        return;
      }
    } catch {
      // Treat throws the same as undefined — fall through to retry logic.
    }

    // Failure — clear in-flight promises so the next attempt can retry.
    this.firmwareFetch = undefined;
    this.factoryFetch = undefined;

    if (
      this.identityRetryCount >= DualsenseHID.IDENTITY_MAX_ATTEMPTS ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !this.provider.connected
    ) {
      this.markIdentityResolved();
      return;
    }

    const delay =
      DualsenseHID.IDENTITY_BACKOFF_MS[
        Math.min(
          this.identityRetryCount - 1,
          DualsenseHID.IDENTITY_BACKOFF_MS.length - 1,
        )
      ];
    this.identityRetryTimer = setTimeout(() => {
      this.identityRetryTimer = undefined;
      void this.loadIdentity();
    }, delay);
  }

  /** Mark identity loading as complete and notify subscribers */
  private markIdentityResolved(): void {
    if (this.identityResolved) return;
    this.identityResolved = true;
    this.identityRetryCount = 0;
    const callbacks = Array.from(this.readySubscribers);
    this.readySubscribers.clear();
    callbacks.forEach((cb) => cb());
  }

  /** Cancel any pending identity-load retry */
  private cancelIdentityRetry(): void {
    if (this.identityRetryTimer) {
      clearTimeout(this.identityRetryTimer);
      this.identityRetryTimer = undefined;
    }
    this.identityRetryCount = 0;
  }

  /** In-flight firmware info fetch, deduped across callers within a connection */
  private firmwareFetch?: Promise<FirmwareInfo>;
  /** In-flight factory info fetch, deduped across callers within a connection */
  private factoryFetch?: Promise<FactoryInfo>;

  /**
   * Read firmware info from the controller (Feature Report 0x20).
   * Idempotent: returns the cached value if already fetched, or the
   * in-flight promise if a fetch is already underway.
   */
  public fetchFirmwareInfo(): Promise<FirmwareInfo> {
    if (this.firmwareInfo !== DefaultFirmwareInfo) return Promise.resolve(this.firmwareInfo);
    if (this.firmwareFetch) return this.firmwareFetch;
    this.firmwareFetch = readFirmwareInfo(this.provider).then((info) => {
      this.firmwareInfo = info ?? DefaultFirmwareInfo;
      return this.firmwareInfo;
    });
    return this.firmwareFetch;
  }

  /**
   * Read factory info (serial number, body color, board revision) from the controller.
   * Requires firmware info to be fetched first for feature gating.
   * Idempotent across the lifetime of a single connection.
   */
  public fetchFactoryInfo(): Promise<FactoryInfo> {
    if (this.factoryInfo !== DefaultFactoryInfo) return Promise.resolve(this.factoryInfo);
    if (this.factoryFetch) return this.factoryFetch;
    if (this.firmwareInfo === DefaultFirmwareInfo) return Promise.resolve(DefaultFactoryInfo);
    const fwInfo = this.firmwareInfo;
    this.factoryFetch = readFactoryInfo(
      this.provider,
      fwInfo.hardwareInfo,
      fwInfo.mainFirmwareVersionRaw,
    ).then((info) => {
      this.factoryInfo = info ?? DefaultFactoryInfo;
      return this.factoryInfo;
    });
    return this.factoryFetch;
  }

  /** Condense all pending commands into one HID feature report */
  private static buildFeatureReport(
    events: CommandEvent[],
    wireless: boolean,
  ): Uint8Array {
    const usbReport = new Uint8Array(48).fill(0);
    usbReport[0] = 0x2;
    usbReport[1] = events
      .filter(({ scope: { index } }) => index === SCOPE_A)
      .reduce<number>((acc: number, { scope: { value } }) => {
        return acc | value;
      }, 0x00);
    usbReport[2] = events
      .filter(({ scope: { index } }) => index === SCOPE_B)
      .reduce<number>((acc: number, { scope: { value } }) => {
        return acc | value;
      }, 0x00);

    events.forEach(({ values }) => {
      values.forEach(({ index, value }) => {
        usbReport[index] = value;
      });
    });

    if (!wireless) return usbReport;

    // Bluetooth output report (0x31) layout differs from USB:
    // - Adds a constant byte at index 1 (0x02)
    // - Shifts the USB payload indices by +1
    // - Appends a checksum at bytes 74..77 (little-endian)
    const btReport = new Uint8Array(78).fill(0);
    btReport[0] = 0x31;
    btReport[1] = 0x02;

    // Copy USB scopes + payload, shifted by +1.
    btReport[2] = usbReport[1];
    btReport[3] = usbReport[2];
    for (let i = 3; i < usbReport.length; i++) {
      btReport[i + 1] = usbReport[i];
    }

    const crc = computeBluetoothReportChecksum(btReport);
    btReport[74] = crc & 0xff;
    btReport[75] = (crc >>> 8) & 0xff;
    btReport[76] = (crc >>> 16) & 0xff;
    btReport[77] = (crc >>> 24) & 0xff;

    return btReport;
  }

  /** Set intensity for left and right rumbles */
  public setRumble(left: number, right: number): void {
    this.pendingCommands.push({
      scope: {
        index: SCOPE_A,
        value: CommandScopeA.PrimaryRumble | CommandScopeA.HapticRumble,
      },
      values: [
        { index: 3, value: right },
        { index: 4, value: left },
      ],
    });
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.MotorPower },
      values: [],
    });
  }

  /** Set left trigger effect from an 11-byte effect block */
  public setLeftTriggerFeedback(block: Uint8Array): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_A, value: CommandScopeA.LeftTriggerFeedback },
      values: Array.from(block, (value, i) => ({ index: 22 + i, value })),
    });
  }

  /** Set right trigger effect from an 11-byte effect block */
  public setRightTriggerFeedback(block: Uint8Array): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_A, value: CommandScopeA.RightTriggerFeedback },
      values: Array.from(block, (value, i) => ({ index: 11 + i, value })),
    });
  }

  /** Set microphone mute LED mode */
  public setMicrophoneLED(mode: MuteLedMode): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.MicrophoneLED },
      values: [{ index: 9, value: mode }],
    });
  }

  /** Set player indicator LEDs from a 5-bit bitmask and brightness */
  public setPlayerLeds(bitmask: number, brightness: Brightness = Brightness.High): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.PlayerLeds },
      values: [
        { index: 44, value: bitmask & 0x1f },
        { index: 43, value: brightness },
        { index: 39, value: LedOptions.PlayerLedBrightness },
      ],
    });
  }

  /** Set the light bar color and pulse effect */
  public setLightbar(
    r: number,
    g: number,
    b: number,
    pulse: PulseOptions = PulseOptions.Off,
  ): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.TouchpadLeds },
      values: [
        { index: 45, value: r },
        { index: 46, value: g },
        { index: 47, value: b },
      ],
    });
    // Override firmware animation to take direct control of the light bar
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.PlayerLeds },
      values: [
        { index: 39, value: LedOptions.Both },
        { index: 42, value: pulse },
      ],
    });
  }
}
