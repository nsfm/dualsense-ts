import { ByteArray } from "./byte_array";
import { HIDProvider, DualsenseHIDState } from "./hid_provider";

export interface WebHIDProviderOptions {
  /** Attach to this specific HIDDevice instead of discovering one */
  device?: HIDDevice;
}

/** Callback invoked for each device selected via the WebHID permission dialog */
export type WebHIDDeviceCallback = (device: HIDDevice) => void;

export class WebHIDProvider extends HIDProvider {
  public device?: HIDDevice;
  public wireless?: boolean;
  public buffer?: DataView;

  private readonly targetDevice?: HIDDevice;

  constructor(options: WebHIDProviderOptions = {}) {
    super();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.hid) throw new Error("WebHID not supported by this browser");

    this.targetDevice = options.device;

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (device === this.device) {
        this.device = undefined;
        this.disconnect();
      }
    });
    navigator.hid.addEventListener("connect", ({ device }) => {
      if (!this.device && !this.targetDevice) this.attach(device);
    });

    // If a specific device was provided, attach immediately
    if (this.targetDevice) {
      this.attach(this.targetDevice);
    }
  }

  /**
   * WebHID API doesn't indicate whether we are connected through the controller's
   * USB or Bluetooth interface. The protocol is different depending on the connection
   * type so we will try to detect it based on the collection information.
   */
  detectConnectionType(): void {
    this.wireless = undefined;
    if (!this.device) {
      return;
    }

    for (const c of this.device.collections) {
      if (
        c.usagePage !== HIDProvider.usagePage ||
        c.usage !== HIDProvider.usage
      ) {
        continue;
      }

      // Compute the maximum input report byte length and compare against known values.
      const maxInputReportBytes = (c.inputReports ?? []).reduce(
        (max, report) => {
          return Math.max(
            max,
            (report.items ?? []).reduce((sum, item) => {
              return sum + (item.reportSize ?? 0) * (item.reportCount ?? 0);
            }, 0)
          );
        },
        0
      );

      if (maxInputReportBytes == 504) {
        this.wireless = false;
      } else if (maxInputReportBytes == 616) {
        this.wireless = true;
      }
    }
  }

  /** Derive a stable identity string for a WebHID device */
  private static deviceKey(device: HIDDevice): string {
    // WebHID does not expose serial numbers or paths directly.
    // We use the product name + vendor/product ids as a coarse key, but
    // because multiple identical controllers may be connected, append the
    // device object's own identity via its collections fingerprint.
    const collections = device.collections
      .map((c) => `${String(c.usagePage)}:${String(c.usage)}`)
      .join(";");
    return `${device.vendorId}:${device.productId}:${collections}:${device.productName}`;
  }

  attach(device: HIDDevice): void {
    const key = WebHIDProvider.deviceKey(device);
    if (HIDProvider.claimedDevices.has(key)) {
      return; // Already claimed by another instance
    }

    device
      .open()
      .then(() => {
        this.device = device;
        this.deviceId = key;
        HIDProvider.claimedDevices.add(key);
        this.detectConnectionType();

        // Enable accelerometer, gyro, touchpad
        return this.device.receiveFeatureReport(0x05);
      })
      .then(() => {
        if (!this.device) throw Error("Controller disconnected before setup");
        this.device.addEventListener("inputreport", ({ reportId, data }) => {
          this.buffer = data;
          this.onData(this.process({ reportId, buffer: data }));
        });
      })
      .catch((err: Error) => {
        this.onError(err);
        this.disconnect();
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
              usagePage: HIDProvider.usagePage,
              usage: HIDProvider.usage,
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

  /**
   * Request permission for multiple devices at once. Returns a callback
   * suitable for use as an onClick handler. The `onDevice` callback is
   * invoked once per selected device with the raw HIDDevice handle.
   */
  static getMultiRequest(
    onDevice: WebHIDDeviceCallback,
    onError?: (error: Error) => void
  ): () => Promise<void> {
    return () =>
      navigator.hid
        .requestDevice({
          filters: [
            {
              vendorId: HIDProvider.vendorId,
              productId: HIDProvider.productId,
              usagePage: HIDProvider.usagePage,
              usage: HIDProvider.usage,
            },
          ],
        })
        .then((devices: HIDDevice[]) => {
          devices.forEach((device) => onDevice(device));
        })
        .catch((err: Error) => {
          onError?.(err);
        });
  }

  /** List already-permitted Dualsense devices */
  static async enumerate(): Promise<HIDDevice[]> {
    const all = await navigator.hid.getDevices();
    return all.filter(
      (d) =>
        d.vendorId === HIDProvider.vendorId &&
        d.productId === HIDProvider.productId
    );
  }

  connect(): void {
    // Nothing to be done.
  }

  get connected(): boolean {
    return this.device !== undefined;
  }

  disconnect(): void {
    if (this.device) {
      this.device.close().finally(() => this.reset());
    } else {
      this.reset();
    }
  }

  async write(data: Uint8Array): Promise<void> {
    if (!this.device) return;
    const reportId = data[0];
    const payload = data.slice(1);
    return this.device.sendReport(reportId, payload);
  }

  process({
    reportId,
    buffer,
  }: {
    reportId: number;
    buffer: DataView;
  }): DualsenseHIDState {
    // DataView does not report the first byte (the report id), we simulate it
    const report: ByteArray = {
      length: buffer.byteLength + 1,
      readUint8(offset) {
        return offset > 0 ? buffer.getUint8(offset - 1) : reportId;
      },
      readUint16LE(offset) {
        return offset > 0
          ? buffer.getUint16(offset - 1, true)
          : (reportId << 8) | buffer.getUint8(0);
      },
    };

    return this.processReport(report);
  }
}
