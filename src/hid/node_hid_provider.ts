import { ByteArray } from "./byte_array";
import {
  HIDProvider,
  DualsenseHIDState,
} from "./hid_provider";

interface HIDable {
  close: () => void;
  removeAllListeners: () => void;
  write: (data: Buffer | number[]) => void;
  sendFeatureReport: (data: Buffer | number[]) => void;
}

export class NodeHIDProvider extends HIDProvider {
  private device?: HIDable;
  public wireless?: boolean;

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
      this.wireless = undefined;
    }
  }

  process(buffer: Buffer): DualsenseHIDState {
    const report: ByteArray = {
      length: buffer.length,
      readUint8(offset) {
        return buffer.readUint8(offset)
      },
      readUint16LE(offset) {
        return buffer.readUint16LE(offset);
      }
    };

    this.autodetectConnectionType(report);
    return this.wireless ? this.processBluetoothInputReport01(report) : this.processUsbInputReport01(report);
  }
}
