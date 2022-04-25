import { HID, devices } from "node-hid";
import { EventEmitter } from "events";

import { InputId } from "../ids";

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
      [InputId.LeftAnalogX]: states[1] - 127,
      [InputId.LeftAnalogY]: states[2] - 127,
      [InputId.RightAnalogX]: states[3] - 127,
      [InputId.RightAnalogY]: states[4] - 127,
      [InputId.LeftTrigger]: states[5],
      [InputId.RightTrigger]: states[6],
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
    if (!controllers[0]?.path) {
      throw new Error(`No controllers (${devices().length} other devices)`);
    }

    const controller = new HID(controllers[0].path);
    controller.on("data", this.process.bind(this));
    controller.on("error", this.handleError.bind(this));
    return controller;
  }
}
