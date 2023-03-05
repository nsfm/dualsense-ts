import {
  HIDProvider,
  DualsenseHIDState,
  InputId,
  mapAxis,
  mapTrigger,
} from "./hid_provider";

interface HIDable {
  close: () => void;
  removeAllListeners: () => void;
  write: (data: Buffer | number[]) => void;
  sendFeatureReport: (data: Buffer | number[]) => void;
}

export class NodeHIDProvider extends HIDProvider {
  private device?: HIDable;
  public wireless: boolean = false;

  async connect(): Promise<void> {
    if (typeof window !== "undefined")
      return this.onError(
        new Error("Attempted to use node-hid in browser environment")
      );

    return import("node-hid")
      .then(({ HID, devices }) => {
        this.disconnect();

        const controllers = devices(
          HIDProvider.vendorId,
          HIDProvider.productId
        );
        if (controllers.length === 0 || !controllers[0].path) {
          return this.onError(
            new Error(`No controllers (${devices().length} other devices)`)
          );
        }

        if (controllers[0].interface === -1) this.wireless = true;

        const device = new HID(controllers[0].path);
        device.on("data", (arg: Buffer) => {
          this.onData(this.process(arg));
        });
        device.on("error", (err: Error) => {
          this.onError(err);
        });

        this.device = device;
      })
      .catch((err) => {
        this.onError(
          new Error(
            `Could not import 'node-hid'. Did you add it?\nError: ${
              err instanceof Error ? err.message : "???"
            }`
          )
        );
      });
  }

  write(data: Uint8Array): Promise<void> {
    if (!this.device) return Promise.resolve();
    this.device.write(Array.from(data));
    return Promise.resolve();
  }

  get connected(): boolean {
    return this.device !== undefined;
  }

  disconnect(): void {
    if (this.device) {
      this.device.removeAllListeners();
      this.device.close();
      this.device = undefined;
      this.wireless = false;
    }
  }

  process(buffer: Buffer): DualsenseHIDState {
    // Bluetooth buffer starts with an extra byte
    const report = buffer.subarray(this.wireless ? 2 : 1);

    const mainButtons = report.readUint8(7);
    const miscButtons = report.readUint8(8);
    const lastButtons = report.readUint8(9);
    const dpad = (mainButtons << 4) >> 4;

    return {
      [InputId.LeftAnalogX]: mapAxis(report.readUint8(0)),
      [InputId.LeftAnalogY]: -mapAxis(report.readUint8(1)),
      [InputId.RightAnalogX]: mapAxis(report.readUint8(2)),
      [InputId.RightAnalogY]: -mapAxis(report.readUint8(3)),
      [InputId.LeftTrigger]: mapTrigger(report.readUint8(4)),
      [InputId.RightTrigger]: mapTrigger(report.readUint8(5)),
      // 6 is a sequence byte
      [InputId.Triangle]: (mainButtons & 128) > 0,
      [InputId.Circle]: (mainButtons & 64) > 0,
      [InputId.Cross]: (mainButtons & 32) > 0,
      [InputId.Square]: (mainButtons & 16) > 0,
      [InputId.Dpad]: dpad,
      [InputId.Up]: dpad < 2 || dpad === 7,
      [InputId.Down]: dpad > 2 && dpad < 6,
      [InputId.Left]: dpad > 4 && dpad < 8,
      [InputId.Right]: dpad > 0 && dpad < 4,
      [InputId.LeftTriggerButton]: (miscButtons & 4) > 0,
      [InputId.RightTriggerButton]: (miscButtons & 8) > 0,
      [InputId.LeftBumper]: (miscButtons & 1) > 0,
      [InputId.RightBumper]: (miscButtons & 2) > 0,
      [InputId.Create]: (miscButtons & 16) > 0,
      [InputId.Options]: (miscButtons & 32) > 0,
      [InputId.LeftAnalogButton]: (miscButtons & 64) > 0,
      [InputId.RightAnalogButton]: (miscButtons & 128) > 0,
      [InputId.Playstation]: (lastButtons & 1) > 0,
      [InputId.TouchButton]: (lastButtons & 2) > 0,
      [InputId.Mute]: (lastButtons & 4) > 0,
      // The other 5 bits are unused
      // 5 reserved bytes
      [InputId.GyroX]: report.readUint16LE(15),
      [InputId.GyroY]: report.readUint16LE(17),
      [InputId.GyroZ]: report.readUint16LE(19),
      [InputId.AccelX]: report.readUint16LE(21),
      [InputId.AccelY]: report.readUint16LE(23),
      [InputId.AccelZ]: report.readUint16LE(25),
      // 4 bytes for sensor timestamp (32LE)
      // 1 reserved byte
      [InputId.TouchId0]: report.readUint8(32) & 0x7f,
      [InputId.TouchContact0]: (report.readUint8(32) & 0x80) === 0,
      [InputId.TouchX0]: mapAxis((report.readUint16LE(33) << 20) >> 20, 1920),
      [InputId.TouchY0]: mapAxis(report.readUint16LE(34) >> 4, 1080),
      [InputId.TouchId1]: report.readUint8(36) & 0x7f,
      [InputId.TouchContact1]: (report.readUint8(36) & 0x80) === 0,
      [InputId.TouchX1]: mapAxis((report.readUint16LE(37) << 20) >> 20, 1920),
      [InputId.TouchY1]: mapAxis(report.readUint16LE(38) >> 4, 1080),
      // 12 reserved bytes
      [InputId.Status]: (report.readUint8(53) & 4) > 0,
    };
  }
}
