import type { HID } from "node-hid";
import { ByteArray } from "../byte_array";
import { ChargeStatus } from "../battery_state";
import { mapAxis, mapBatteryLevel } from "../hid_provider";
import {
  AccessInput,
  AccessButton1,
  AccessButton2,
} from "../access_hid";
import {
  AccessInputId,
  AccessHIDState,
  DefaultAccessHIDState,
} from "./access_hid_state";

export { AccessInputId, type AccessHIDState, DefaultAccessHIDState };

/** Supports a connection to a physical or virtual DualSense Access device */
export abstract class AccessHIDProvider {
  /** HID vendorId for a DualSense Access controller */
  static readonly vendorId: number = 0x054c;
  /** HID productId for a DualSense Access controller */
  static readonly productId: number = 0x0e5f;
  /** HID usagePage for a DualSense Access controller */
  static readonly usagePage: number = 0x0001;
  /** HID usage for a DualSense Access controller */
  static readonly usage: number = 0x0005;

  /** Global set of device paths currently claimed by a provider instance */
  static readonly claimedDevices = new Set<string>();

  /** Callback to use for new input events */
  public onData: (state: AccessHIDState) => void = () => {};

  /** Callback to use for Error events */
  public onError: (error: Error) => void = () => {};

  /** Callback fired the moment a device is fully attached and ready for I/O */
  public onConnect: () => void = () => {};

  /** Callback fired the moment a device detaches (cleanly or via error) */
  public onDisconnect: () => void = () => {};

  /** Unique identifier for the connected device (path or serial) */
  public deviceId?: string;

  /** Hardware serial number of the connected device */
  public serialNumber?: string;

  /** Search for a controller and connect to it */
  abstract connect(): void | Promise<void>;

  /** Stop accepting input from the controller */
  abstract disconnect(): void;

  /** Returns true if a device is currently connected and working */
  abstract get connected(): boolean;

  /** The underlying HID device handle */
  abstract device?: HIDDevice | HID;

  /** Returns true if a device is connected wirelessly */
  abstract wireless?: boolean;

  /** Debug: The most recent HID report buffer */
  abstract buffer?: Buffer | DataView;

  /** Converts the HID report to a simpler format */
  abstract process(input: unknown): AccessHIDState;

  /** Write to the HID device */
  abstract write(data: Uint8Array): Promise<void>;

  /** Read a feature report from the device */
  abstract readFeatureReport(
    reportId: number,
    length?: number
  ): Promise<Uint8Array>;

  /** Send a feature report to the device */
  abstract sendFeatureReport(
    reportId: number,
    data: Uint8Array
  ): Promise<void>;

  /**
   * Selects the correct method for reading the report.
   */
  protected processReport(buffer: ByteArray): AccessHIDState {
    const reportId = buffer.readUint8(0);

    switch (reportId) {
      case 0x01:
        return this.wireless
          ? this.processBluetoothInputReport01(buffer)
          : this.processUsbInputReport01(buffer);
      case 0x31:
        return this.processBluetoothInputReport31(buffer);

      default:
        this.onError(
          new Error(
            `Cannot process report, unexpected report id: ${reportId}`
          )
        );
        this.disconnect();
        return { ...DefaultAccessHIDState };
    }
  }

  /** Reset the provider state when the device is disconnected */
  protected reset(): void {
    const wasAttached = this.device !== undefined;
    if (this.deviceId) {
      AccessHIDProvider.claimedDevices.delete(this.deviceId);
    }
    this.device = undefined;
    this.wireless = undefined;
    this.buffer = undefined;
    this.deviceId = undefined;
    this.serialNumber = undefined;
    this.onData(DefaultAccessHIDState);
    if (wasAttached) this.onDisconnect();
  }

  /**
   * Process a BT input report 0x01 (limited mode, pre-Feature 0x05).
   * Only has the mapped DualSense-compatible header, no Access-specific data.
   */
  protected processBluetoothInputReport01(
    _buffer: ByteArray
  ): AccessHIDState {
    // BT 0x01 only contains the mapped DualSense-compatible header.
    // Without the Access-specific section, we can't read raw buttons,
    // raw stick, battery, or profile. Return default state.
    return { ...DefaultAccessHIDState };
  }

  /** Process BT input report 0x31 (full mode, offset +1 from USB) */
  protected processBluetoothInputReport31(
    buffer: ByteArray
  ): AccessHIDState {
    const o = AccessInput.BT_OFFSET; // +1
    return this.parseAccessReport(buffer, o);
  }

  /** Process USB input report 0x01 (full Access report) */
  protected processUsbInputReport01(buffer: ByteArray): AccessHIDState {
    return this.parseAccessReport(buffer, 0);
  }

  /** Parse Access-specific fields from the report buffer at the given offset */
  private parseAccessReport(
    buffer: ByteArray,
    offset: number
  ): AccessHIDState {
    const rawButtons1 = buffer.readUint8(AccessInput.RAW_BUTTONS_1 + offset);
    const rawButtons2 = buffer.readUint8(AccessInput.RAW_BUTTONS_2 + offset);
    const batteryByte = buffer.readUint8(AccessInput.BATTERY + offset);
    const profileByte = buffer.readUint8(AccessInput.PROFILE + offset);

    return {
      [AccessInputId.B1]: (rawButtons1 & AccessButton1.B1) > 0,
      [AccessInputId.B2]: (rawButtons1 & AccessButton1.B2) > 0,
      [AccessInputId.B3]: (rawButtons1 & AccessButton1.B3) > 0,
      [AccessInputId.B4]: (rawButtons1 & AccessButton1.B4) > 0,
      [AccessInputId.B5]: (rawButtons1 & AccessButton1.B5) > 0,
      [AccessInputId.B6]: (rawButtons1 & AccessButton1.B6) > 0,
      [AccessInputId.B7]: (rawButtons1 & AccessButton1.B7) > 0,
      [AccessInputId.B8]: (rawButtons1 & AccessButton1.B8) > 0,
      [AccessInputId.Center]: (rawButtons2 & AccessButton2.CENTER) > 0,
      [AccessInputId.StickClick]: (rawButtons2 & AccessButton2.STICK) > 0,
      [AccessInputId.PS]: (rawButtons2 & AccessButton2.PS) > 0,
      [AccessInputId.Profile]: (rawButtons2 & AccessButton2.PROFILE) > 0,
      [AccessInputId.StickX]: mapAxis(
        buffer.readUint8(AccessInput.RAW_STICK_X + offset)
      ),
      [AccessInputId.StickY]: mapAxis(
        buffer.readUint8(AccessInput.RAW_STICK_Y + offset)
      ),
      [AccessInputId.BatteryLevel]: mapBatteryLevel(batteryByte),
      [AccessInputId.BatteryStatus]: (batteryByte >> 4) as ChargeStatus,
      [AccessInputId.ProfileId]: (profileByte & 0x07) || 1,
    };
  }
}
