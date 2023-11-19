import type { HID } from "node-hid";
import { ByteArray } from "./byte_array";
import { HIDProvider, DualsenseHIDState } from "./hid_provider";

export class NodeHIDProvider extends HIDProvider {
  public device?: HID;
  public wireless?: boolean;
  public buffer?: Buffer;

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

        // Detect connection type
        this.wireless = controllers[0].interface === -1;

        const device = new HID(controllers[0].path);

        // Enable accelerometer, gyro, touchpad
        device.getFeatureReport(0x05, 41);

        device.on("data", (arg: Buffer) => {
          this.buffer = arg;
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
    }
    this.reset();
  }

  process(buffer: Buffer): DualsenseHIDState {
    const report: ByteArray = {
      length: buffer.length,
      readUint8(offset) {
        return buffer.readUint8(offset);
      },
      readUint16LE(offset) {
        return buffer.readUint16LE(offset);
      },
    };
    return this.processReport(report);
  }
}
