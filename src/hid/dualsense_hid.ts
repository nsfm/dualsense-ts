import { HID, devices } from "node-hid";

export class DualsenseHID {
  private readonly controller: HID;

  static readonly vendorId: number = 1356;
  static readonly productId: number = 3302;

  constructor() {
    this.controller = this.connect();
  }

  private connect(): HID {
    const controllers = devices(DualsenseHID.vendorId, DualsenseHID.productId);
    if (!controllers[0]) {
      throw new Error(`No controllers (${devices().length} other devices)`);
    }
    if (!controllers[0].path) {
      throw new Error(`Detected a controller with no path: ${controllers[0]}`);
    }
    return new HID(controllers[0].path);
  }

  public close(): void {
    this.controller.close();
  }

  public on(callback: (event: unknown) => void) {
    return this.controller.on("data", callback);
  }

  public onError(callback: (event: unknown) => void) {
    return this.controller.on("error", callback);
  }
}
