import { InputId } from "../id";

export * from "../id";

/** Maps a HID input of 0...n to -1...1 */
export function mapAxis(value: number, max: number = 255): number {
  return (2 / max) * Math.max(0, Math.min(max, value)) - 1;
}

/** Maps a HID input of 0...255 to 0...1 */
export function mapTrigger(value: number): number {
  return (1 / 255) * Math.max(0, Math.min(255, value));
}

/** Describes an observation of the input state of a Dualsense controller */
export interface DualsenseHIDState {
  [InputId.LeftAnalogX]: number;
  [InputId.LeftAnalogY]: number;
  [InputId.RightAnalogX]: number;
  [InputId.RightAnalogY]: number;
  [InputId.LeftTrigger]: number;
  [InputId.RightTrigger]: number;
  [InputId.Triangle]: boolean;
  [InputId.Circle]: boolean;
  [InputId.Cross]: boolean;
  [InputId.Square]: boolean;
  [InputId.Dpad]: number;
  [InputId.Up]: boolean;
  [InputId.Down]: boolean;
  [InputId.Left]: boolean;
  [InputId.Right]: boolean;
  [InputId.RightAnalogButton]: boolean;
  [InputId.LeftAnalogButton]: boolean;
  [InputId.Options]: boolean;
  [InputId.Create]: boolean;
  [InputId.RightTriggerButton]: boolean;
  [InputId.LeftTriggerButton]: boolean;
  [InputId.RightBumper]: boolean;
  [InputId.LeftBumper]: boolean;
  [InputId.Playstation]: boolean;
  [InputId.TouchButton]: boolean;
  [InputId.Mute]: boolean;
  [InputId.Status]: boolean;
  [InputId.TouchX0]: number;
  [InputId.TouchY0]: number;
  [InputId.TouchContact0]: boolean;
  [InputId.TouchId0]: number;
  [InputId.TouchX1]: number;
  [InputId.TouchY1]: number;
  [InputId.TouchContact1]: boolean;
  [InputId.TouchId1]: number;
  [InputId.GyroX]: number;
  [InputId.GyroY]: number;
  [InputId.GyroZ]: number;
  [InputId.AccelX]: number;
  [InputId.AccelY]: number;
  [InputId.AccelZ]: number;
}

/** Supports a connection to a physical or virtual Dualsense device */
export abstract class HIDProvider {
  /** HID vendorId for a Dualsense controller */
  static readonly vendorId: number = 1356;
  /** HID productId for a Dualsense controller */
  static readonly productId: number = 3302;

  /** Callback to use for new input events */
  public onData: (state: DualsenseHIDState) => void = () => {};

  /** Callback to use for Error events */
  public onError: (error: Error) => void = () => {};

  /** Search for a controller and connect to it */
  abstract connect(): void;

  /** Stop accepting input from the controller */
  abstract disconnect(): void;

  /** Returns true if a device is currently connected and working */
  abstract get connected(): boolean;

  /** Returns true if a device is connected wirelessly */
  abstract wireless: boolean;

  /** Converts the HID report to a simpler format */
  abstract process(input: unknown): DualsenseHIDState;

  /** Write to the HID device */
  abstract write(data: Uint8Array): Promise<void>;

  /** Treat the device as if it were connected over Bluetooth */
  setWireless(): void {
    this.wireless = true;
  }

  /** Treat the device as if it were connected over USB */
  setWired(): void {
    this.wireless = false;
  }
}
