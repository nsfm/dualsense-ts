import { HID, devices } from "node-hid";
import { EventEmitter } from "events";

import { InputId } from "./ids";

// Controller identifiers for USB connections
export interface USBHid {
  vendorId: 1356;
  productId: 3302;
  interface: 3;
}

// Controller identifiers for Bluetooth connections
export interface BTHid {
  vendorId: 1356;
  productId: 3302;
  interface: -1;
}

export type DualsenseHIDState = {
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
  [InputId.TouchpadButton]: boolean;
  [InputId.Mute]: boolean;
  [InputId.TouchpadX1]: number;
  [InputId.TouchpadY1]: number;
  [InputId.TouchpadX2]: number;
  [InputId.TouchpadY2]: number;
};

// Maps a HID input from 0...255, to -1...1
export function mapAxis(value: number): number {
  return (2 / 255) * Math.max(0, Math.min(255, value)) - 1;
}

// Maps a HID input from 0...255, to 0...1
export function mapTrigger(value: number): number {
  return (1 / 255) * Math.max(0, Math.min(255, value));
}

export class DualsenseHID extends EventEmitter {
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
    [InputId.TouchpadButton]: false,
    [InputId.Mute]: false,
    [InputId.TouchpadX1]: 0,
    [InputId.TouchpadY1]: 0,
    [InputId.TouchpadX2]: 0,
    [InputId.TouchpadY2]: 0,
  };

  private device: HID;
  private wireless: boolean = false;

  static readonly vendorId: number = 1356;
  static readonly productId: number = 3302;

  constructor() {
    super();
    this.device = this.connect();
  }

  private process(buffer: Buffer): void {
    const states = [...buffer];
    const buttonState: number = states[8];
    const misc: number = states[9];
    const misc2: number = states[10];

    Object.assign(this.state, {
      [InputId.LeftAnalogX]: mapAxis(states[1]),
      [InputId.LeftAnalogY]: -mapAxis(states[2]),
      [InputId.RightAnalogX]: mapAxis(states[3]),
      [InputId.RightAnalogY]: -mapAxis(states[4]),
      [InputId.LeftTrigger]: mapTrigger(states[5]),
      [InputId.RightTrigger]: mapTrigger(states[6]),
      [InputId.Triangle]: (buttonState & (1 << 7)) != 0,
      [InputId.Circle]: (buttonState & (1 << 6)) != 0,
      [InputId.Cross]: (buttonState & (1 << 5)) != 0,
      [InputId.Square]: (buttonState & (1 << 4)) != 0,
      [InputId.Up]: [0, 1, 7].includes(buttonState & 0x0f),
      [InputId.Down]: [3, 4, 5].includes(buttonState & 0x0f),
      [InputId.Left]: [5, 6, 7].includes(buttonState & 0x0f),
      [InputId.Right]: [1, 2, 3].includes(buttonState & 0x0f),
      [InputId.RightAnalogButton]: (misc & (1 << 7)) != 0,
      [InputId.LeftAnalogButton]: (misc & (1 << 6)) != 0,
      [InputId.Options]: (misc & (1 << 5)) != 0,
      [InputId.Create]: (misc & (1 << 4)) != 0,
      [InputId.RightTriggerButton]: (misc & (1 << 3)) != 0,
      [InputId.LeftTriggerButton]: (misc & (1 << 2)) != 0,
      [InputId.RightBumper]: (misc & (1 << 1)) != 0,
      [InputId.LeftBumper]: (misc & (1 << 0)) != 0,
      [InputId.Playstation]: (misc2 & (1 << 0)) != 0,
      [InputId.TouchpadButton]: (misc2 & 0x02) != 0,
      [InputId.Mute]: (misc2 & 0x04) != 0,
    });

    this.emit("input", this);
  }

  private processBluetooth(buffer: Buffer): void {
    const states = [...buffer];
    const shapes: number = states[9] & 0xf0;
    const dpad: number = states[9] & 0x0f;
    const misc: number = states[10];
    const misc2: number = states[11];

    Object.assign(this.state, {
      [InputId.LeftAnalogX]: mapAxis(states[2]),
      [InputId.LeftAnalogY]: -mapAxis(states[3]),
      [InputId.RightAnalogX]: mapAxis(states[4]),
      [InputId.RightAnalogY]: -mapAxis(states[5]),
      [InputId.LeftTrigger]: mapTrigger(states[6]),
      [InputId.RightTrigger]: mapTrigger(states[7]),
      [InputId.Triangle]: (shapes & (1 << 7)) !== 0,
      [InputId.Circle]: (shapes & (1 << 6)) !== 0,
      [InputId.Cross]: (shapes & (1 << 5)) !== 0,
      [InputId.Square]: (shapes & (1 << 4)) !== 0,
      [InputId.Up]: [0, 1, 7].includes(dpad),
      [InputId.Down]: [3, 4, 5].includes(dpad),
      [InputId.Left]: [5, 6, 7].includes(dpad),
      [InputId.Right]: [1, 2, 3].includes(dpad),
      [InputId.RightAnalogButton]: (misc & (1 << 7)) !== 0,
      [InputId.LeftAnalogButton]: (misc & (1 << 6)) !== 0,
      [InputId.Options]: (misc & (1 << 5)) !== 0,
      [InputId.Create]: (misc & (1 << 4)) !== 0,
      [InputId.RightTriggerButton]: (misc & (1 << 3)) !== 0,
      [InputId.LeftTriggerButton]: (misc & (1 << 2)) !== 0,
      [InputId.RightBumper]: (misc & (1 << 1)) !== 0,
      [InputId.LeftBumper]: (misc & (1 << 0)) !== 0,
      [InputId.Playstation]: (misc2 & (1 << 0)) !== 0,
      [InputId.TouchpadButton]: (misc2 & 0x02) !== 0,
      [InputId.Mute]: (misc2 & 0x04) !== 0,
    });

    this.emit("input", this);
  }

  private handleError(error: unknown): void {
    console.error(error);
    setTimeout(() => {
      this.device = this.connect();
    }, 50);
  }

  private disconnect(): void {
    if (this.device) {
      try {
        this.device.removeAllListeners();
        this.device.close();
      } catch (e) {
        console.error(e);
      }
    }
  }

  private connect(): HID {
    this.disconnect();

    const controllers = devices(DualsenseHID.vendorId, DualsenseHID.productId);
    if (controllers.length === 0 || !controllers[0].path) {
      throw new Error(`No controllers (${devices().length} other devices)`);
    }

    if (controllers[0].interface === -1) this.wireless = true;

    const controller = new HID(controllers[0].path);
    controller.on(
      "data",
      this.wireless ? this.processBluetooth.bind(this) : this.process.bind(this)
    );
    controller.on("error", this.handleError.bind(this));
    return controller;
  }
}
// 64 bytes
export type USBHidBuffer = [
  1,
  128,
  129,
  124,
  127,
  0,
  0,
  254,
  8,
  0,
  0,
  0,
  3,
  100,
  240,
  196,
  7,
  0,
  251,
  255,
  249,
  255,
  166,
  2,
  24,
  32,
  229,
  0,
  57,
  27,
  190,
  122,
  20,
  128,
  0,
  0,
  0,
  128,
  0,
  0,
  0,
  0,
  9,
  9,
  0,
  0,
  0,
  0,
  0,
  134,
  45,
  190,
  122,
  41,
  24,
  0,
  231,
  128,
  6,
  235,
  119,
  157,
  118,
  6
];

// 78 bytes
export type BTHidBuffer = [
  49, // Static
  225, // Incrementing constantly
  128, // Left Analog X
  129, // Left Analog Y
  125, // Right Analog X
  127, // Right Analog Y
  0, // Left Trigger
  0, // Right Trigger
  1, // Static?
  8, // Shapes buttons and dpad
  0, // Bumpers (1, 2) Trigger btn (4, 8) menu (32) create (16) stick clicks (64, 128)
  0, // Mute (4) PS (1) Touchpad click (2)
  0, // Static?
  149, // Incrementing ...
  18, //
  143, //
  199, // ... Incrementing
  1, // Accelerometer...?
  0, // Accelerometer...?
  248, // Accelerometer...?
  255, // Also responds to motion
  247,
  255,
  30,
  3,
  40,
  32,
  240,
  0,
  168,
  254,
  201,
  2,
  18,
  128,
  0,
  0,
  0,
  128,
  0, // Related to multi touch
  0, // Multi touch
  0, // Multi touch
  0, // Touchpad touch direction? figure 8 triggers full range
  9, // Static...
  9,
  0,
  0,
  0,
  0,
  0, // ...static
  119, // Incrementing...
  4,
  202,
  2, // ...Incrementing
  9, // Static ...
  0, // Mute state - 0 unmuted, 4 muted - other LEDs?
  0, // ... Static
  66, // Incrementing ...
  237,
  8,
  99,
  244,
  73,
  28,
  220, // ... incrementing
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  0, // Static
  3, // Incrementing
  211, // Incrementing
  128, // Incrementing
  155 // Incrementing
];
