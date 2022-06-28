import { HID, devices } from "node-hid";

import { HIDProvider } from "./hid_provider";

export class NodeHIDProvider extends HIDProvider {
  private device?: HID;
  public wireless: boolean = false;

  connect(): void {
    this.disconnect();

    const controllers = devices(HIDProvider.vendorId, HIDProvider.productId);
    if (controllers.length === 0 || !controllers[0].path) {
      throw new Error(`No controllers (${devices().length} other devices)`);
    }

    if (controllers[0].interface === -1) this.wireless = true;

    this.device = new HID(controllers[0].path);
    this.device.on("data", (arg: Buffer) => {
      this.onData(arg);
    });
    this.device.on("error", (err: Error) => {
      this.onError(err);
    });
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
}
