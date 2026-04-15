import type { HID, Device } from "node-hid";
import { ByteArray } from "../byte_array";
import { AccessHIDProvider, AccessHIDState } from "./access_hid_provider";
import { computeFeatureReportChecksum } from "../bt_checksum";

export interface AccessNodeHIDProviderOptions {
  /** Connect only to the device at this specific path */
  devicePath?: string;
  /** Prefer the device with this serial number */
  serialNumber?: string;
}

/** Information about an available DualSense Access device */
export interface AccessDeviceInfo {
  /** Unique device path (platform-specific) */
  path: string;
  /** Hardware serial number, if available */
  serialNumber?: string;
  /** Whether the device is connected wirelessly */
  wireless: boolean;
}

export class AccessNodeHIDProvider extends AccessHIDProvider {
  public device?: HID;
  public wireless?: boolean;
  public buffer?: Buffer;

  private connecting = false;
  /** Target device path — mutable so the manager can update it */
  public targetPath?: string;
  /** Target serial number — stable identifier for reconnection */
  public targetSerial?: string;

  constructor(options: AccessNodeHIDProviderOptions = {}) {
    super();
    this.targetPath = options.devicePath;
    this.targetSerial = options.serialNumber;
  }

  /** List all available DualSense Access controllers */
  static async enumerate(): Promise<AccessDeviceInfo[]> {
    let nodeHid: typeof import("node-hid");
    try {
      nodeHid = await import("node-hid");
    } catch {
      return [];
    }

    const controllers = nodeHid
      .devices(AccessHIDProvider.vendorId, AccessHIDProvider.productId)
      .filter(
        (d) =>
          d.usagePage === AccessHIDProvider.usagePage &&
          d.usage === AccessHIDProvider.usage
      );

    return controllers
      .filter((d: Device): d is Device & { path: string } => Boolean(d.path))
      .map((d) => ({
        path: d.path,
        serialNumber: d.serialNumber ?? undefined,
        wireless: d.interface === -1,
      }));
  }

  async connect(): Promise<void> {
    if (this.connecting) return;
    if (typeof window !== "undefined")
      return this.onError(
        new Error("Attempted to use node-hid in browser environment")
      );

    this.connecting = true;
    let nodeHid: typeof import("node-hid");
    try {
      nodeHid = await import("node-hid");
    } catch (err) {
      this.connecting = false;
      return this.onError(
        new Error(
          `Could not import 'node-hid'. Did you add it?\nError: ${
            err instanceof Error ? err.message : "???"
          }`
        )
      );
    }

    try {
      this.disconnect();
      const { HID, devices } = nodeHid;
      const allDevices = devices(
        AccessHIDProvider.vendorId,
        AccessHIDProvider.productId
      );

      // Filter to the correct HID usage (gamepad). BT devices expose
      // multiple hidraw nodes — only one has the right usagePage/usage.
      const controllers = allDevices.filter(
        (d) =>
          d.usagePage === AccessHIDProvider.usagePage &&
          d.usage === AccessHIDProvider.usage
      );

      // Find a suitable controller: targeted path, then serial match, then first unclaimed
      let target = this.targetPath
        ? controllers.find((d) => d.path === this.targetPath)
        : undefined;

      if (!target && this.targetSerial) {
        target = controllers.find(
          (d) =>
            d.serialNumber === this.targetSerial &&
            d.path &&
            !AccessHIDProvider.claimedDevices.has(d.path)
        );
        if (target?.path != null) {
          this.targetPath = target.path;
        }
      }

      if (!target && !this.targetPath && !this.targetSerial) {
        target = controllers.find(
          (d) => d.path && !AccessHIDProvider.claimedDevices.has(d.path)
        );
      }

      if (!target?.path) {
        return;
      }

      this.wireless = target.interface === -1;

      const device = new HID(target.path);

      this.deviceId = target.path;
      this.serialNumber = target.serialNumber ?? undefined;
      AccessHIDProvider.claimedDevices.add(target.path);

      // Read Feature Report 0x05 to trigger BT full mode (same as DualSense).
      // No IMU calibration to parse — Access has no IMU.
      try {
        device.getFeatureReport(0x05, 41);
      } catch {
        /* non-fatal — USB doesn't strictly need this */
      }

      device.on("data", (arg: Buffer) => {
        this.buffer = arg;
        this.onData(this.process(arg));
      });
      device.on("error", (err: Error) => {
        this.disconnect();
        this.onError(err);
      });

      this.device = device;
      this.onConnect();
    } catch (err) {
      this.onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      this.connecting = false;
    }
  }

  write(data: Uint8Array): Promise<void> {
    if (!this.device) return Promise.resolve();
    this.device.write(Array.from(data));
    return Promise.resolve();
  }

  readFeatureReport(reportId: number, length: number): Promise<Uint8Array> {
    if (!this.device)
      return Promise.reject(new Error("No device connected"));
    const buf = this.device.getFeatureReport(reportId, length);
    return Promise.resolve(new Uint8Array(buf));
  }

  sendFeatureReport(_reportId: number, data: Uint8Array): Promise<void> {
    if (!this.device) return Promise.resolve();
    if (this.wireless) {
      const reportId = data[0];
      const payload = new Uint8Array(64);
      payload.set(data.slice(1));
      const crc = computeFeatureReportChecksum(reportId, payload);
      const off = payload.length - 4;
      payload[off] = crc & 0xff;
      payload[off + 1] = (crc >>> 8) & 0xff;
      payload[off + 2] = (crc >>> 16) & 0xff;
      payload[off + 3] = (crc >>> 24) & 0xff;
      const buf = new Uint8Array(1 + payload.length);
      buf[0] = reportId;
      buf.set(payload, 1);
      this.device.sendFeatureReport(Array.from(buf));
    } else {
      this.device.sendFeatureReport(Array.from(data));
    }
    return Promise.resolve();
  }

  get connected(): boolean {
    return this.device !== undefined;
  }

  disconnect(): void {
    if (this.device) {
      this.device.removeAllListeners();
      this.device.close();
    }
    this.reset();
  }

  process(buffer: Buffer): AccessHIDState {
    const report: ByteArray = {
      length: buffer.length,
      readUint8(offset) {
        return buffer.readUint8(offset);
      },
      readUint16LE(offset) {
        return buffer.readUint16LE(offset);
      },
      readUint32LE(offset) {
        return buffer.readUint32LE(offset);
      },
    };
    return this.processReport(report);
  }
}
