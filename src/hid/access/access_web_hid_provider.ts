import { ByteArray } from "../byte_array";
import { AccessHIDProvider, AccessHIDState } from "./access_hid_provider";
import { computeFeatureReportChecksum } from "../bt_checksum";

export interface AccessWebHIDProviderOptions {
  /** Attach to this specific HIDDevice instead of discovering one */
  device?: HIDDevice;
}

/** Callback invoked for each device selected via the WebHID permission dialog */
export type AccessWebHIDDeviceCallback = (device: HIDDevice) => void;

export class AccessWebHIDProvider extends AccessHIDProvider {
  public device?: HIDDevice;
  public wireless?: boolean;
  public buffer?: DataView;

  private readonly targetDevice?: HIDDevice;

  constructor(options: AccessWebHIDProviderOptions = {}) {
    super();
    if (!navigator.hid)
      throw new Error("WebHID not supported by this browser");

    this.targetDevice = options.device;

    navigator.hid.addEventListener("disconnect", ({ device }) => {
      if (device === this.device) {
        this.disconnect();
      }
    });
    navigator.hid.addEventListener("connect", ({ device }) => {
      if (!this.device && !this.targetDevice) this.attach(device);
    });

    if (this.targetDevice) {
      this.attach(this.targetDevice);
    }
  }

  /**
   * Detect USB vs BT by checking for Feature Report 0x63 in the HID descriptor.
   * Present in BT descriptor, absent in USB.
   */
  detectConnectionType(): void {
    this.wireless = undefined;
    if (!this.device) return;

    for (const c of this.device.collections) {
      if (
        c.usagePage !== AccessHIDProvider.usagePage ||
        c.usage !== AccessHIDProvider.usage
      ) {
        continue;
      }

      const hasFeature63 = (c.featureReports ?? []).some(
        (r) => r.reportId === 0x63
      );
      this.wireless = hasFeature63;
      return;
    }
  }

  /** Derive a stable identity string for a WebHID device */
  private static deviceKey(device: HIDDevice): string {
    const collections = device.collections
      .map((c) => `${String(c.usagePage)}:${String(c.usage)}`)
      .join(";");
    return `${device.vendorId}:${device.productId}:${collections}:${device.productName}`;
  }

  attach(device: HIDDevice): void {
    const key = AccessWebHIDProvider.deviceKey(device);

    const openPromise = device.opened ? Promise.resolve() : device.open();
    openPromise
      .then(() => {
        this.device = device;
        this.deviceId = key;
        this.detectConnectionType();

        // Read Feature Report 0x05 to trigger BT full mode (non-fatal over USB)
        return this.device.receiveFeatureReport(0x05).catch(() => {});
      })
      .then(() => {
        if (!this.device) throw Error("Controller disconnected before setup");
        this.device.addEventListener("inputreport", ({ reportId, data }) => {
          this.buffer = data;
          this.onData(this.process({ reportId, buffer: data }));
        });
        this.onConnect();
      })
      .catch((err: Error) => {
        this.onError(err);
        this.disconnect();
      });
  }

  /**
   * Detach the current HIDDevice and attach a different one in place.
   * Used by the manager to transplant a freshly-discovered device.
   */
  replaceDevice(device: HIDDevice): void {
    if (this.device) {
      const old = this.device;
      const oldKey = this.deviceId;
      this.device = undefined;
      if (oldKey) AccessHIDProvider.claimedDevices.delete(oldKey);
      old.close().catch(() => {});
    }
    this.attach(device);
  }

  /**
   * Returns a callback for triggering the WebHID permissions request
   * filtered to Access controllers.
   */
  getRequest(): () => Promise<unknown> {
    return () =>
      navigator.hid
        .requestDevice({
          filters: [
            {
              vendorId: AccessHIDProvider.vendorId,
              productId: AccessHIDProvider.productId,
              usagePage: AccessHIDProvider.usagePage,
              usage: AccessHIDProvider.usage,
            },
          ],
        })
        .then((devices: HIDDevice[]) => {
          if (devices.length === 0) {
            return this.onError(
              new Error(`No Access controllers available`)
            );
          }
          this.attach(devices[0]);
        })
        .catch((err: Error) => {
          this.onError(err);
        });
  }

  /** Request permission for multiple Access devices at once */
  static getMultiRequest(
    onDevice: AccessWebHIDDeviceCallback,
    onError?: (error: Error) => void
  ): () => Promise<void> {
    return () =>
      navigator.hid
        .requestDevice({
          filters: [
            {
              vendorId: AccessHIDProvider.vendorId,
              productId: AccessHIDProvider.productId,
              usagePage: AccessHIDProvider.usagePage,
              usage: AccessHIDProvider.usage,
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

  /** List already-permitted Access devices */
  static async enumerate(): Promise<HIDDevice[]> {
    const all = await navigator.hid.getDevices();
    return all.filter(
      (d) =>
        d.vendorId === AccessHIDProvider.vendorId &&
        d.productId === AccessHIDProvider.productId
    );
  }

  connect(): void {}

  get connected(): boolean {
    return this.device !== undefined;
  }

  disconnect(): void {
    if (this.device) {
      const dev = this.device;
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

    const rawPayload = data.slice(1);

    const expectedLength = this.getFeatureReportLength(reportId);
    const payload =
      expectedLength > 0 && rawPayload.length < expectedLength
        ? new Uint8Array(expectedLength)
        : new Uint8Array(rawPayload);

    if (expectedLength > rawPayload.length) {
      payload.set(rawPayload);
    }

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
      const report = (c.featureReports ?? []).find(
        (r) => r.reportId === reportId
      );
      if (report) {
        return (report.items ?? []).reduce(
          (sum, item) =>
            sum +
            Math.ceil(
              ((item.reportSize ?? 0) * (item.reportCount ?? 0)) / 8
            ),
          0
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
  }): AccessHIDState {
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
      readUint32LE(offset) {
        return offset > 0
          ? buffer.getUint32(offset - 1, true)
          : (reportId << 24) |
              (buffer.getUint8(2) << 16) |
              buffer.getUint16(0, true);
      },
    };

    return this.processReport(report);
  }
}
