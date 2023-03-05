import {
  HIDProvider,
  DualsenseHIDState,
  InputId,
  mapAxis,
  mapTrigger,
} from "./hid_provider";

export class WebHIDProvider extends HIDProvider {
  private device?: HIDDevice;
  public wireless: boolean = true; // TODO: Not sure what to check

  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.hid) throw new Error("WebHID not supported by this browser");

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (device === this.device) this.device = undefined;
    });
    navigator.hid.addEventListener("connect", ({ device }) => {
      if (!this.device) this.attach(device);
    });
  }

  attach(device: HIDDevice): void {
    device
      .open()
      .then(() => {
        this.device = device;
        this.device.addEventListener("inputreport", ({ data }) => {
          this.onData(this.process(data));
        });
      })
      .catch((err: Error) => {
        this.onError(err);
      });
  }

  /**
   * You need to get HID device permissions from an interactive
   * component, like a button. This returns a callback for triggering
   * the permissions request.
   */
  getRequest(): () => Promise<unknown> {
    return () =>
      navigator.hid
        .requestDevice({
          filters: [
            {
              vendorId: HIDProvider.vendorId,
              productId: HIDProvider.productId,
            },
          ],
        })
        .then((devices: HIDDevice[]) => {
          if (devices.length === 0) {
            return this.onError(new Error(`No controllers available`));
          }
          this.attach(devices[0]);
        })
        .catch((err: Error) => {
          this.onError(err);
        });
  }

  connect(): void {
    // Nothing to be done.
  }

  get connected(): boolean {
    return this.device !== undefined;
  }

  disconnect(): void {
    if (this.device) {
      this.device.close().finally(() => {
        this.device = undefined;
        this.wireless = false;
      });
    }
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.device) return;
    return this.device.sendFeatureReport(0, data);
  }

  process(buffer: DataView): DualsenseHIDState {
    // Bluetooth buffer starts with an extra byte
    const report = new DataView(buffer.buffer, this.wireless ? 2 : 1);

    const mainButtons = report.getUint8(7);
    const miscButtons = report.getUint8(8);
    const lastButtons = report.getUint8(9);
    const dpad = (mainButtons << 4) >> 4;

    return {
      [InputId.LeftAnalogX]: mapAxis(report.getUint8(0)),
      [InputId.LeftAnalogY]: -mapAxis(report.getUint8(1)),
      [InputId.RightAnalogX]: mapAxis(report.getUint8(2)),
      [InputId.RightAnalogY]: -mapAxis(report.getUint8(3)),
      [InputId.LeftTrigger]: mapTrigger(report.getUint8(4)),
      [InputId.RightTrigger]: mapTrigger(report.getUint8(5)),
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
      [InputId.GyroX]: report.getUint16(15, true),
      [InputId.GyroY]: report.getUint16(17, true),
      [InputId.GyroZ]: report.getUint16(19, true),
      [InputId.AccelX]: report.getUint16(21, true),
      [InputId.AccelY]: report.getUint16(23, true),
      [InputId.AccelZ]: report.getUint16(25, true),
      [InputId.TouchId0]: report.getUint8(32) & 0x7f,
      [InputId.TouchContact0]: (report.getUint8(32) & 0x80) === 0,
      [InputId.TouchX0]: mapAxis(
        (report.getUint16(33, true) << 20) >> 20,
        1920
      ),
      [InputId.TouchY0]: mapAxis(report.getUint16(34, true) >> 4, 1080),
      [InputId.TouchId1]: report.getUint8(36) & 0x7f,
      [InputId.TouchContact1]: (report.getUint8(36) & 0x80) === 0,
      [InputId.TouchX1]: mapAxis(
        (report.getUint16(37, true) << 20) >> 20,
        1920
      ),
      [InputId.TouchY1]: mapAxis(report.getUint16(38, true) >> 4, 1080),
      [InputId.Status]: (report.getUint8(53) & 4) > 0,
    };
  }
}
