import type { HID, Device } from "node-hid";
import { ByteArray } from "./byte_array";
import { HIDProvider, DualsenseHIDState, DualsenseDeviceInfo } from "./hid_provider";

export interface NodeHIDProviderOptions {
  /** Connect only to the device at this specific path */
  devicePath?: string;
  /** Prefer the device with this serial number (stable across USB/BT switches) */
  serialNumber?: string;
}

export class NodeHIDProvider extends HIDProvider {
  public device?: HID;
  public wireless?: boolean;
  public buffer?: Buffer;

  private connecting = false;
  /** Target device path — mutable so the manager can update it on USB/BT switches */
  public targetPath?: string;
  /** Target serial number — stable identifier for reconnection */
  public targetSerial?: string;

  constructor(options: NodeHIDProviderOptions = {}) {
    super();
    this.targetPath = options.devicePath;
    this.targetSerial = options.serialNumber;
  }

  /** List all available Dualsense controllers */
  static async enumerate(): Promise<DualsenseDeviceInfo[]> {
    let nodeHid: typeof import("node-hid");
    try {
      nodeHid = await import("node-hid");
    } catch {
      return [];
    }

    const controllers = nodeHid.devices(
      HIDProvider.vendorId,
      HIDProvider.productId
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
      const controllers = devices(
        HIDProvider.vendorId,
        HIDProvider.productId
      );

      // Find a suitable controller: targeted path, then serial match, then first unclaimed
      let target = this.targetPath
        ? controllers.find((d) => d.path === this.targetPath)
        : undefined;

      // Fall back to serial match (handles USB/BT switches where path changes)
      if (!target && this.targetSerial) {
        target = controllers.find(
          (d) =>
            d.serialNumber === this.targetSerial &&
            d.path &&
            !HIDProvider.claimedDevices.has(d.path)
        );
        if (target?.path != null) {
          this.targetPath = target.path;
        }
      }

      // No specific target: grab first unclaimed device
      if (!target && !this.targetPath && !this.targetSerial) {
        target = controllers.find(
          (d) => d.path && !HIDProvider.claimedDevices.has(d.path)
        );
      }

      if (!target?.path) {
        return this.onError(
          new Error(`No controllers (${devices().length} other devices)`)
        );
      }

      // Detect connection type
      this.wireless = target.interface === -1;

      const device = new HID(target.path);

      // Claim this device
      this.deviceId = target.path;
      this.serialNumber = target.serialNumber ?? undefined;
      HIDProvider.claimedDevices.add(target.path);

      // Enable accelerometer, gyro, touchpad
      device.getFeatureReport(0x05, 41);

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
      this.onError(
        err instanceof Error ? err : new Error(String(err))
      );
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
    if (!this.device) return Promise.reject(new Error("No device connected"));
    const buf = this.device.getFeatureReport(reportId, length);
    return Promise.resolve(new Uint8Array(buf));
  }

  sendFeatureReport(_reportId: number, data: Uint8Array): Promise<void> {
    if (!this.device) return Promise.resolve();
    // node-hid sendFeatureReport expects the report ID as the first byte of the buffer
    this.device.sendFeatureReport(Array.from(data));
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

  process(buffer: Buffer): DualsenseHIDState {
    const report: ByteArray = {
      length: buffer.length,
      readUint8(offset) {
        return buffer.readUint8(offset);
      },
      readUint16LE(offset) {
        return buffer.readUint16LE(offset);
      },
    };
    return this.processReport(report);
  }
}
