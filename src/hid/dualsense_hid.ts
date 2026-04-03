import { CommandScopeA, CommandScopeB, LedOptions, PulseOptions, Brightness } from "./command";
import {
  HIDProvider,
  DualsenseHIDState,
  DefaultDualsenseHIDState,
} from "./hid_provider";
import { computeBluetoothReportChecksum } from "./bt_checksum";

export type HIDCallback = (state: DualsenseHIDState) => void;
export type ErrorCallback = (error: Error) => void;

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
  /** Queue of pending HID commands */
  private pendingCommands: CommandEvent[] = [];
  /** Most recent HID state of the device */
  public state: DualsenseHIDState = { ...DefaultDualsenseHIDState };

  constructor(
    readonly provider: HIDProvider,
    refreshRate: number = 30,
  ) {
    provider.onData = this.set.bind(this);
    provider.onError = this.handleError.bind(this);

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

  /** Update the HID state and pass it along to all state subscribers */
  private set(state: DualsenseHIDState): void {
    this.state = state;
    this.subscribers.forEach((callback) => callback(state));
  }

  /** Pass errors along to all error subscribers */
  private handleError(error: Error): void {
    this.errorSubscribers.forEach((callback) => callback(error));
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

  /** Set microphone LED on or off */
  public setMicrophoneLED(on: boolean): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.MicrophoneLED },
      values: [{ index: 9, value: on ? 1 : 0 }],
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
