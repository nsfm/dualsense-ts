import { HIDProvider, DualsenseHIDState, DefaultDualsenseHIDState } from "./hid_provider";

/**
 * A no-op HID provider that never connects. Used for placeholder Dualsense
 * instances in environments where no HID backend is available (e.g. browsers
 * without WebHID support).
 */
export class NullHIDProvider extends HIDProvider {
  public device = undefined;
  public wireless = undefined;
  public buffer = undefined;

  connect(): void {}
  disconnect(): void {}
  get connected(): boolean { return false; }
  process(): DualsenseHIDState { return { ...DefaultDualsenseHIDState }; }
  async write(): Promise<void> {}
  readFeatureReport(): Promise<Uint8Array> { return Promise.resolve(new Uint8Array(0)); }
  async sendFeatureReport(): Promise<void> {}
}
