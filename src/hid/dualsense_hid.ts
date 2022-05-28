import { HID, devices } from "node-hid";
import { EventEmitter } from "events";

import { InputId } from "./ids";

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

// Maps a HID input of 0...255 to -1...1
export function mapAxis(value: number): number {
  return (2 / 255) * Math.max(0, Math.min(255, value)) - 1;
}

// Maps a HID input of 0...255 to 0...1
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

  private device: HID;
  private wireless: boolean = false;

  static readonly vendorId: number = 1356;
  static readonly productId: number = 3302;

  constructor() {
    super();
    this.device = this.connect();
  }

  /**
   * Unpacks a Dualsense HID report.
   */
  private process(buffer: Buffer): void {
    // Bluetooth buffer starts with an extra byte
    const report = buffer.subarray(this.wireless ? 2 : 1);

    const { state } = this;
    state[InputId.LeftAnalogX] = mapAxis(report.readUint8(0));
    state[InputId.LeftAnalogY] = -mapAxis(report.readUint8(1));
    state[InputId.RightAnalogX] = mapAxis(report.readUint8(2));
    state[InputId.RightAnalogY] = -mapAxis(report.readUint8(3));
    state[InputId.LeftTrigger] = mapTrigger(report.readUint8(4));
    state[InputId.RightTrigger] = mapTrigger(report.readUint8(5));
    // 6 is a sequence byte
    const mainButtons = report.readUint8(7);
    state[InputId.Triangle] = (mainButtons & 128) > 0;
    state[InputId.Circle] = (mainButtons & 64) > 0;
    state[InputId.Cross] = (mainButtons & 32) > 0;
    state[InputId.Square] = (mainButtons & 16) > 0;
    state[InputId.Up] = (mainButtons & 8) > 0;
    state[InputId.Down] = (mainButtons & 4) > 0;
    state[InputId.Left] = (mainButtons & 2) > 0;
    state[InputId.Right] = (mainButtons & 1) > 0;
    const miscButtons = report.readUint8(8);
    state[InputId.LeftTriggerButton] = (miscButtons & 4) > 0;
    state[InputId.RightTriggerButton] = (miscButtons & 8) > 0;
    state[InputId.LeftBumper] = (miscButtons & 1) > 0;
    state[InputId.RightBumper] = (miscButtons & 2) > 0;
    state[InputId.Create] = (miscButtons & 16) > 0;
    state[InputId.Options] = (miscButtons & 32) > 0;
    state[InputId.LeftAnalogButton] = (miscButtons & 64) > 0;
    state[InputId.RightAnalogButton] = (miscButtons & 128) > 0;
    const lastButtons = report.readUint8(9);
    state[InputId.Playstation] = (lastButtons & 1) > 0;
    state[InputId.TouchButton] = (lastButtons & 2) > 0;
    state[InputId.Mute] = (lastButtons & 4) > 0;
    // The other 5 bits are unused
    // 5 reserved bytes
    state[InputId.GyroX] = report.readUint16LE(15);
    state[InputId.GyroY] = report.readUint16LE(17);
    state[InputId.GyroZ] = report.readUint16LE(19);
    state[InputId.AccelX] = report.readUint16LE(21);
    state[InputId.AccelY] = report.readUint16LE(23);
    state[InputId.AccelZ] = report.readUint16LE(25);
    // 4 bytes for sensor timestamp (32LE)
    // 1 reserved byte
    state[InputId.TouchId0] = report.readUint8(32) & 0x7f;
    state[InputId.TouchContact0] = (report.readUint8(32) & 0x80) === 0;
    state[InputId.TouchX0] = (report.readUint16LE(33) << 20) >> 20;
    state[InputId.TouchY0] = report.readUint16LE(34) >> 4;

    state[InputId.TouchId1] = report.readUint8(36) & 0x7f;
    state[InputId.TouchContact1] = (report.readUint8(36) & 0x80) === 0;
    state[InputId.TouchX1] = (report.readUint16LE(37) << 20) >> 20;
    state[InputId.TouchY1] = report.readUint16LE(38) >> 4;
    // 12 reserved bytes
    state[InputId.Status] = (report.readUint8(53) & 4) > 0;

    this.emit("input", state);
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
    controller.on("data", this.process.bind(this));
    controller.on("error", this.handleError.bind(this));
    return controller;
  }
}
