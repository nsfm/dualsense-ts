import { HIDProvider } from "./hid_provider";

export class WebHIDProvider extends HIDProvider {
  private device?: HIDDevice;
  public wireless: boolean = false;

  connect(): void {
    this.disconnect();

    navigator.hid
      .requestDevice({
        filters: [
          { vendorId: HIDProvider.vendorId, productId: HIDProvider.productId },
        ],
      })
      .then((devices: HIDDevice[]) => {
        if (devices.length === 0) {
          return this.onError(new Error(`No controllers available`));
        }

        devices[0].open().then(() => {
          this.device = devices[0];
          this.device.addEventListener("inputreport", ({ data }) => { this.onData(data) })
        }).catch((err: Error) => { this.onError(err) })

        if (controllers[0].interface === -1) this.wireless = true;
      })
      .catch((err) => {
        this.onError(err);
      });
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
}
