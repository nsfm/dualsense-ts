import { HIDProvider } from "./hid_provider";

/** Parsed firmware version in major.minor.patch format */
export interface FirmwareVersion {
  major: number;
  minor: number;
  patch: number;
}

/** Firmware and hardware information from Feature Report 0x20 */
export interface FirmwareInfo {
  /** Firmware build date (e.g. "Apr 14 2023") */
  buildDate: string;
  /** Firmware build time (e.g. "12:34:56") */
  buildTime: string;
  /** Firmware type (2 or 3 indicates production firmware) */
  firmwareType: number;
  /** Software series identifier */
  softwareSeries: number;
  /** Hardware info word (lower 16 bits used for feature gating) */
  hardwareInfo: number;
  /** Main firmware version */
  mainFirmwareVersion: FirmwareVersion;
  /** Raw uint32 main firmware version (used for feature gating) */
  mainFirmwareVersionRaw: number;
  /** Device info (raw hex string) */
  deviceInfo: string;
  /** Update version (formatted as HH.LL hex) */
  updateVersion: string;
  /** Update image info */
  updateImageInfo: number;
  /** SBL (second bootloader) firmware version */
  sblFirmwareVersion: FirmwareVersion;
  /** DSP firmware version (formatted as HHHH_LLLL hex) */
  dspFirmwareVersion: string;
  /** Spider DSP firmware version */
  spiderDspFirmwareVersion: FirmwareVersion;
}

/** Format a FirmwareVersion as "major.minor.patch" */
export function formatFirmwareVersion(v: FirmwareVersion): string {
  return `${v.major}.${v.minor}.${v.patch}`;
}

/** Feature report ID for firmware information */
const REPORT_ID = 0x20;
/** Expected report length (report ID + 63 bytes of data) */
const REPORT_LENGTH = 64;

/** Parse a uint32 version into major.minor.patch */
function parseVersion(ver: number): FirmwareVersion {
  return {
    major: (ver >>> 24) & 0xff,
    minor: (ver >>> 16) & 0xff,
    patch: ver & 0xffff,
  };
}

/** Format a uint16 as HH.LL hex */
function formatUpdateVersion(ver: number): string {
  const hi = ((ver >>> 8) & 0xff).toString(16).padStart(2, "0");
  const lo = (ver & 0xff).toString(16).padStart(2, "0");
  return `${hi}.${lo}`;
}

/** Format a uint32 as HHHH_LLLL hex */
function formatDspVersion(ver: number): string {
  const hi = ((ver >>> 16) & 0xffff).toString(16).padStart(4, "0");
  const lo = (ver & 0xffff).toString(16).padStart(4, "0");
  return `${hi}_${lo}`;
}

/** Read a null-terminated ASCII string from a buffer */
function readString(data: Uint8Array, offset: number, length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    const byte = data[offset + i];
    if (byte === 0) break;
    str += String.fromCharCode(byte);
  }
  return str;
}

/** Read a little-endian uint16 from a buffer */
function readUint16LE(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8);
}

/** Read a little-endian uint32 from a buffer */
function readUint32LE(data: Uint8Array, offset: number): number {
  return (
    data[offset] |
    (data[offset + 1] << 8) |
    (data[offset + 2] << 16) |
    ((data[offset + 3] << 24) >>> 0)
  );
}

/** Convert bytes to a hex string */
function toHex(data: Uint8Array, offset: number, length: number): string {
  return Array.from(data.slice(offset, offset + length))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Read and parse Feature Report 0x20 from a connected controller.
 * Returns undefined if the report cannot be read.
 */
export async function readFirmwareInfo(
  provider: HIDProvider,
): Promise<FirmwareInfo | undefined> {
  try {
    const data = await provider.readFeatureReport(REPORT_ID, REPORT_LENGTH);

    // Offsets are from byte 1 (after the report ID byte)
    const base = 1;

    return {
      buildDate: readString(data, base, 11),
      buildTime: readString(data, base + 11, 8),
      firmwareType: readUint16LE(data, base + 19),
      softwareSeries: readUint16LE(data, base + 21),
      hardwareInfo: readUint32LE(data, base + 23),
      mainFirmwareVersion: parseVersion(readUint32LE(data, base + 27)),
      mainFirmwareVersionRaw: readUint32LE(data, base + 27),
      deviceInfo: toHex(data, base + 31, 12),
      updateVersion: formatUpdateVersion(readUint16LE(data, base + 43)),
      updateImageInfo: data[base + 45],
      sblFirmwareVersion: parseVersion(readUint32LE(data, base + 47)),
      dspFirmwareVersion: formatDspVersion(readUint32LE(data, base + 51)),
      spiderDspFirmwareVersion: parseVersion(readUint32LE(data, base + 55)),
    };
  } catch {
    return undefined;
  }
}
