export abstract class HIDProvider {
  static readonly vendorId: number = 1356;
  static readonly productId: number = 3302;

  public onData: (buffer: Buffer) => void = () => {}
  public onError: (error: Error) => void = () => {}

  /**
   * Search for a controller and connect to it.
   */
  abstract connect(): void;

  /**
   * Stop accepting input from the controller.
   */
  abstract disconnect(): void;

  /**
   * Returns true if a device is currently connected and working.
   */
  abstract get connected(): boolean;

  /**
   * Returns true if a device is connected wirelessly.
   */
  abstract get wireless(): boolean;
}
