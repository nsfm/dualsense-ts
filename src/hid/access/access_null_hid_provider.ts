import {
  AccessHIDProvider,
  AccessHIDState,
  DefaultAccessHIDState,
} from "./access_hid_provider";

/**
 * A no-op HID provider that never connects. Used for placeholder DualsenseAccess
 * instances in environments where no HID backend is available.
 */
export class AccessNullHIDProvider extends AccessHIDProvider {
  public device = undefined;
  public wireless = undefined;
  public buffer = undefined;

  connect(): void {}
  disconnect(): void {}
  get connected(): boolean {
    return false;
  }
  process(): AccessHIDState {
    return { ...DefaultAccessHIDState };
  }
  async write(): Promise<void> {}
  readFeatureReport(): Promise<Uint8Array> {
    return Promise.resolve(new Uint8Array(0));
  }
  async sendFeatureReport(): Promise<void> {}
}
