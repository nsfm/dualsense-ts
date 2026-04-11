import { ByteArray } from "./byte_array";
import { HIDProvider, DualsenseHIDState } from "./hid_provider";
import { computeFeatureReportChecksum } from "./bt_checksum";

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
        // Let disconnect() → reset() handle nulling this.device so that
        // reset() can detect the device was attached and fire onDisconnect.
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
  static deviceKey(device: HIDDevice): string {
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

    const openPromise = device.opened ? Promise.resolve() : device.open();
    openPromise
      .then(() => {
        this.device = device;
        this.deviceId = key;
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
        console.log("[WebHID] attach: firing onConnect");
        this.onConnect();
      })
      .catch((err: Error) => {
        console.log("[WebHID] attach: error", err.message);
        this.onError(err);
        this.disconnect();
      });
  }

  /**
   * Detach the current HIDDevice (if any) and attach a different one in place.
   * Used by the manager to transplant a freshly-discovered device into an
   * existing slot's provider after identity matching, so the consumer's
   * Dualsense reference survives reconnection.
   *
   * The new device must already be open (or openable) — we close the old one,
   * release its claim, and run the standard attach() flow on the new one.
   */
  replaceDevice(device: HIDDevice): void {
    // Tear down the existing device without firing the disconnect cascade
    // (we don't want subscribers to see a disconnect/reconnect blip).
    if (this.device) {
      const old = this.device;
      const oldKey = this.deviceId;
      this.device = undefined;
      if (oldKey) HIDProvider.claimedDevices.delete(oldKey);
      // Best-effort close; failures are non-fatal.
      old.close().catch(() => {});
    }
    this.attach(device);
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
      const dev = this.device;
      // Reset synchronously so claimedDevices is freed immediately —
      // otherwise a rapid disconnect/reconnect can race: the browser's
      // connect event arrives before close() resolves, and attach() sees
      // the key still claimed and silently bails out.
      this.reset();
      dev.close().catch(() => {});
    } else {
      this.reset();
    }
  }

  async readFeatureReport(reportId: number): Promise<Uint8Array> {
    if (!this.device) throw new Error("No device connected");
    const view = await this.device.receiveFeatureReport(reportId);
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
  }

  async sendFeatureReport(reportId: number, data: Uint8Array): Promise<void> {
    if (!this.device) return;

    // WebHID sendFeatureReport takes the report ID separately.
    // data[0] is the report ID (for node-hid compat); strip it for WebHID.
    const rawPayload = data.slice(1);

    // Pad to the expected payload length from the HID descriptor
    const expectedLength = this.getFeatureReportLength(reportId);
    const payload = expectedLength > 0 && rawPayload.length < expectedLength
      ? new Uint8Array(expectedLength)
      : new Uint8Array(rawPayload);

    if (expectedLength > rawPayload.length) {
      payload.set(rawPayload);
    }

    // Bluetooth requires CRC-32 in the last 4 bytes of the payload
    if (this.wireless) {
      const crc = computeFeatureReportChecksum(reportId, payload);
      const off = payload.length - 4;
      payload[off] = crc & 0xff;
      payload[off + 1] = (crc >>> 8) & 0xff;
      payload[off + 2] = (crc >>> 16) & 0xff;
      payload[off + 3] = (crc >>> 24) & 0xff;
    }

    await this.device.sendFeatureReport(reportId, payload);
  }

  /** Query the HID descriptor for the expected payload length of a feature report */
  private getFeatureReportLength(reportId: number): number {
    if (!this.device) return 0;
    for (const c of this.device.collections) {
      const report = (c.featureReports ?? []).find((r) => r.reportId === reportId);
      if (report) {
        return (report.items ?? []).reduce(
          (sum, item) => sum + Math.ceil(((item.reportSize ?? 0) * (item.reportCount ?? 0)) / 8),
          0,
        );
      }
    }
    return 0;
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
