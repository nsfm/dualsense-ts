import { HID, devices } from "node-hid";

export default class DualSense {
  private readonly controller: HID;

  static readonly vendorId: number = 1356;
  static readonly productId: number = 3302;

  constructor() {
    this.controller = this.connect();
  }

  private connect(): HID {
    const controllers = devices(DualSense.vendorId, DualSense.productId);
    if (controllers.length === 0)
      throw new Error(
        `No DualSense devices found (${
          devices().length
        } other devices detected)`
      );

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

  public setColor([r, g, b]: Uint8Array): void {
    const command = Buffer.alloc(48, 0);

    [
      [0x2, 0],
      [0x4, 2],
      [r, 45],
      [g, 46],
      [b, 47],
    ].forEach((byte: [value: number, offset: number]) =>
      command.writeInt8(...byte)
    );

    this.controller.write(command);
  }
}
