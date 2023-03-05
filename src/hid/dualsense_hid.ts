import { CommandScopeA, CommandScopeB, TriggerMode, PlayerID } from "./command";
import { HIDProvider, DualsenseHIDState, InputId } from "./hid_provider";

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
  public state: DualsenseHIDState = {
    [InputId.LeftAnalogX]: 0,
    [InputId.LeftAnalogY]: 0,
    [InputId.RightAnalogX]: 0,
    [InputId.RightAnalogY]: 0,
    [InputId.LeftTrigger]: 0,
    [InputId.RightTrigger]: 0,
    [InputId.Triangle]: false,
    [InputId.Circle]: false,
    [InputId.Cross]: false,
    [InputId.Square]: false,
    [InputId.Dpad]: 0,
    [InputId.Up]: false,
    [InputId.Down]: false,
    [InputId.Left]: false,
    [InputId.Right]: false,
    [InputId.RightAnalogButton]: false,
    [InputId.LeftAnalogButton]: false,
    [InputId.Options]: false,
    [InputId.Create]: false,
    [InputId.RightTriggerButton]: false,
    [InputId.LeftTriggerButton]: false,
    [InputId.RightBumper]: false,
    [InputId.LeftBumper]: false,
    [InputId.Playstation]: false,
    [InputId.TouchButton]: false,
    [InputId.Mute]: false,
    [InputId.Status]: false,
    [InputId.TouchX0]: 0,
    [InputId.TouchY0]: 0,
    [InputId.TouchContact0]: false,
    [InputId.TouchId0]: 0,
    [InputId.TouchX1]: 0,
    [InputId.TouchY1]: 0,
    [InputId.TouchContact1]: false,
    [InputId.TouchId1]: 0,
    [InputId.GyroX]: 0,
    [InputId.GyroY]: 0,
    [InputId.GyroZ]: 0,
    [InputId.AccelX]: 0,
    [InputId.AccelY]: 0,
    [InputId.AccelZ]: 0,
  };

  constructor(readonly provider: HIDProvider, refreshRate: number = 30) {
    provider.onData = this.set.bind(this);
    provider.onError = this.handleError.bind(this);

    setInterval(() => {
      if (this.pendingCommands.length > 0) {
        (async () => {
          const command = [...this.pendingCommands];
          this.pendingCommands = [];
          await provider.write(DualsenseHID.buildFeatureReport(command));
        })().catch((err) => {
          this.handleError(
            new Error(`HID write failed: ${JSON.stringify(err)}`)
          );
        });
      }
    }, 1000 / refreshRate);
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
  private static buildFeatureReport(events: CommandEvent[]): Uint8Array {
    const report = new Uint8Array(46).fill(0);
    report[0] = 0x2;
    report[1] = events
      .filter(({ scope: { index } }) => index === SCOPE_A)
      .reduce<number>((acc: number, { scope: { value } }) => {
        return acc | value;
      }, 0x00);
    report[2] = events
      .filter(({ scope: { index } }) => index === SCOPE_B)
      .reduce<number>((acc: number, { scope: { value } }) => {
        return acc | value;
      }, 0x00);

    events.forEach(({ values }) => {
      values.forEach(({ index, value }) => {
        report[index] = value;
      });
    });
    return report;
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

  /** Set left trigger resistance and behavior */
  public setLeftTriggerFeedback(mode: TriggerMode, forces: number[]): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_A, value: CommandScopeA.LeftTriggerFeedback },
      values: [
        { index: 22, value: mode },
        ...forces.map((force, index) => ({ index: 23 + index, value: force })),
      ],
    });
  }

  /** Set right trigger resistance and behavior */
  public setRightTriggerFeedback(mode: TriggerMode, forces: number[]): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_A, value: CommandScopeA.RightTriggerFeedback },
      values: [
        { index: 11, value: mode },
        ...forces.map((force, index) => ({ index: 12 + index, value: force })),
      ],
    });
  }

  /** Set microphone LED brightness */
  public setMicrophoneLED(brightness: number): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.MicrophoneLED },
      values: [{ index: 9, value: brightness }],
    });
  }

  /** Set player ID LEDs */
  public setPlayerId(id: PlayerID): void {
    this.pendingCommands.push({
      scope: { index: SCOPE_B, value: CommandScopeB.PlayerLeds },
      values: [{ index: 44, value: id }],
    });
  }
}
