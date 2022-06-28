import { HIDProvider, DualsenseHIDState, InputId } from "./hid_provider";

export type HIDCallback = (state: DualsenseHIDState) => void;

/**
 * Coordinates a HIDProvider and tracks the latest HID state.
 */
export class DualsenseHID {
  private readonly subscribers = new Set<HIDCallback>();

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

  constructor(private provider: HIDProvider) {
    provider.onData = this.set.bind(this);
    provider.onError = this.handleError.bind(this);
  }

  /**
   * Register a handler for HID state updates.
   */
  public register(callback: (state: DualsenseHIDState) => void): void {
    this.subscribers.add(callback);
  }

  /**
   * Cancel a previously registered handler.
   */
  public unregister(callback: (state: DualsenseHIDState) => void): void {
    this.subscribers.delete(callback);
  }

  private set(state: DualsenseHIDState): void {
    this.state = state;
    this.subscribers.forEach((callback) => callback(state));
  }

  private handleError(error: unknown): void {
    console.error(error);
    setTimeout(() => {
      this.provider.disconnect();
      this.provider.connect();
    }, 50);
  }
}
