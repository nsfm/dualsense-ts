import { HIDProvider } from "./hid_provider";

/** Known DualSense body colors, keyed by the 2-char code from the serial number */
export const DualsenseColorMap: Record<string, string> = {
  "00": "White",
  "01": "Midnight Black",
  "02": "Cosmic Red",
  "03": "Nova Pink",
  "04": "Galactic Purple",
  "05": "Starlight Blue",
  "06": "Grey Camouflage",
  "07": "Volcanic Red",
  "08": "Sterling Silver",
  "09": "Cobalt Blue",
  "10": "Chroma Teal",
  "11": "Chroma Indigo",
  "12": "Chroma Pearl",
  "30": "30th Anniversary",
  Z1: "God of War Ragnarok",
  Z2: "Spider-Man 2",
  Z3: "Astro Bot",
  Z4: "Fortnite",
  Z6: "The Last of Us",
  ZB: "Icon Blue Limited Edition",
  ZE: "Genshin Impact",
};

/** Board revision names, keyed by the character at serial position 1 */
const BoardRevisionMap: Record<string, string> = {
  "1": "BDM-010",
  "2": "BDM-020",
  "3": "BDM-030",
  "4": "BDM-040",
  "5": "BDM-050",
};

/** Factory information derived from the controller's serial number */
export interface FactoryInfo {
  /** Raw serial number string */
  serialNumber: string;
  /** Controller body color name (e.g. "Cosmic Red"), or undefined if unknown */
  colorName?: string;
  /** Raw 2-character color code from the serial number */
  colorCode: string;
  /** Board revision (e.g. "BDM-030"), or undefined if unknown */
  boardRevision?: string;
}

/** Feature report IDs for the test command protocol */
const SEND_REPORT_ID = 0x80;
const RECV_REPORT_ID = 0x81;
/** Report size for test command feature reports (report ID + 63 bytes payload) */
const REPORT_SIZE = 64;

/** Test command device/action IDs */
const DEVICE_SYSTEM = 0x01;
const ACTION_READ_SERIAL = 0x13;

/** Test command response status values */
const STATUS_COMPLETE = 0x02;

/**
 * Send a test command via Feature Report 0x80 and poll 0x81 for the response.
 * Returns the result data bytes (after the header), or undefined on failure.
 */
async function sendTestCommand(
  provider: HIDProvider,
  deviceId: number,
  actionId: number,
  maxAttempts: number = 20,
): Promise<Uint8Array | undefined> {
  // Build the send report: report ID at byte 0, then payload.
  // The provider handles platform differences (WebHID strips byte 0, adds CRC for BT).
  const sendBuf = new Uint8Array(REPORT_SIZE).fill(0);
  sendBuf[0] = SEND_REPORT_ID;
  sendBuf[1] = deviceId;
  sendBuf[2] = actionId;

  await provider.sendFeatureReport(SEND_REPORT_ID, sendBuf);

  // Poll for response
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(50);

    const response = await provider.readFeatureReport(RECV_REPORT_ID, REPORT_SIZE);
    if (response.length === 0) continue;

    // Response layout: [reportId, deviceId, actionId, status, ...data]
    // Note: node-hid includes the report ID at byte 0; WebHID may not.
    // Find the actual start based on whether byte 0 is the report ID.
    const offset = response[0] === RECV_REPORT_ID ? 1 : 0;
    const respDevice = response[offset];
    const respAction = response[offset + 1];
    const respStatus = response[offset + 2];

    if (respDevice !== deviceId || respAction !== actionId) continue;
    if (respStatus === STATUS_COMPLETE) {
      return response.slice(offset + 3);
    }
  }

  return undefined;
}

/** Decode a byte array as ASCII, stopping at null terminator */
function decodeAscii(data: Uint8Array, offset: number, length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  return str;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Read factory info (serial number, body color, board revision) from a connected controller.
 *
 * Requires firmware support: hardwareInfo >= 777 and mainFirmwareVersion >= 65655.
 * Use the values from FirmwareInfo (Feature Report 0x20) to check this gate.
 *
 * @param provider The HID provider for the connected controller
 * @param hardwareInfo Hardware info word from FirmwareInfo
 * @param mainFwVersionRaw Raw uint32 main firmware version from FirmwareInfo
 */
export async function readFactoryInfo(
  provider: HIDProvider,
  hardwareInfo: number,
  mainFwVersionRaw: number,
): Promise<FactoryInfo | undefined> {
  // Firmware gate check
  if ((hardwareInfo & 0xffff) < 777 || mainFwVersionRaw < 65655) {
    return undefined;
  }

  try {
    const result = await sendTestCommand(provider, DEVICE_SYSTEM, ACTION_READ_SERIAL);
    if (!result) return undefined;

    const serialNumber = decodeAscii(result, 0, 32);
    if (serialNumber.length < 6) return undefined;

    const colorCode = serialNumber.slice(4, 6);
    const revisionChar = serialNumber.slice(1, 2);

    return {
      serialNumber,
      colorName: DualsenseColorMap[colorCode],
      colorCode,
      boardRevision: BoardRevisionMap[revisionChar],
    };
  } catch {
    return undefined;
  }
}
