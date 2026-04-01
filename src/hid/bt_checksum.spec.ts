import { computeBluetoothReportChecksum } from "./bt_checksum";

describe("computeBluetoothReportChecksum", () => {
  it("should produce a known-good checksum for a zeroed report", () => {
    const buffer = new Uint8Array(78).fill(0);
    expect(computeBluetoothReportChecksum(buffer)).toBe(0x0eaa90a9);
  });

  it("should produce a known-good checksum for a minimal BT output report", () => {
    const buffer = new Uint8Array(78).fill(0);
    buffer[0] = 0x31;
    buffer[1] = 0x02;
    expect(computeBluetoothReportChecksum(buffer)).toBe(0xf7e7a126);
  });
});
