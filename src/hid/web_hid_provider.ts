import { ByteArray } from "./byte_array";
import {
  HIDProvider,
  DualsenseHIDState,
  InputId,
  mapAxis,
  mapTrigger,
} from "./hid_provider";

export class WebHIDProvider extends HIDProvider {
  private device?: HIDDevice;
  public wireless?: boolean;

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
        this.device.addEventListener("inputreport", ({ reportId, data }) => {
          this.onData(this.process({ reportId, buffer: data }));
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
        this.wireless = undefined;
      });
    }
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.device) return;
    return this.device.sendFeatureReport(0, data);
  }

  process({ reportId, buffer }: { reportId: number; buffer: DataView }): DualsenseHIDState {
    // DataView does not report the first byte (the report id), we simulate it
    const report: ByteArray = {      
      length: buffer.byteLength + 1,
      readUint8(offset) {
        return offset > 0 ? buffer.getUint8(offset - 1) : reportId;
      },
      readUint16LE(offset) {
        return offset > 0 ? buffer.getUint16(offset - 1) : ((reportId << 8) | buffer.getUint8(1));
      }
    };

    this.autodetectConnectionType(report);
    return this.wireless ? this.processBluetoothInputReport01(report) : this.processUsbInputReport01(report);
  }
}
