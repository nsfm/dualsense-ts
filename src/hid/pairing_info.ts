import { HIDProvider } from "./hid_provider";

/** Feature report ID for pairing info */
const REPORT_ID = 0x09;
/** Expected report length (report ID + 19 bytes) */
const REPORT_LENGTH = 20;

/**
 * Read the controller's Bluetooth MAC address from Feature Report 0x09.
 * Works over both USB and Bluetooth on all platforms.
 * Returns the MAC as a colon-separated hex string (e.g. "AA:BB:CC:DD:EE:FF"),
 * or undefined if the report cannot be read.
 */
export async function readMacAddress(
  provider: HIDProvider,
): Promise<string | undefined> {
  try {
    const data = await provider.readFeatureReport(REPORT_ID, REPORT_LENGTH);

    // Bytes 1–6 contain the MAC in little-endian order
    const mac: string[] = [];
    for (let i = 6; i >= 1; i--) {
      mac.push(data[i].toString(16).padStart(2, "0"));
    }

    const result = mac.join(":");
    // Reject all-zero MACs (no pairing info available)
    if (result === "00:00:00:00:00:00") return undefined;
    return result;
  } catch {
    return undefined;
  }
}
