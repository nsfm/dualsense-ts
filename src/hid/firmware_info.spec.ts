import { formatFirmwareVersion, DefaultFirmwareInfo } from "./firmware_info";

describe("formatFirmwareVersion", () => {
  it("formats a typical version", () => {
    expect(formatFirmwareVersion({ major: 2, minor: 3, patch: 456 })).toBe(
      "2.3.456"
    );
  });

  it("formats a zeroed version", () => {
    expect(formatFirmwareVersion({ major: 0, minor: 0, patch: 0 })).toBe(
      "0.0.0"
    );
  });

  it("formats single-digit values", () => {
    expect(formatFirmwareVersion({ major: 1, minor: 0, patch: 1 })).toBe(
      "1.0.1"
    );
  });
});

describe("DefaultFirmwareInfo", () => {
  it("has unknown build date and time", () => {
    expect(DefaultFirmwareInfo.buildDate).toBe("unknown");
    expect(DefaultFirmwareInfo.buildTime).toBe("unknown");
  });

  it("has zeroed numeric fields", () => {
    expect(DefaultFirmwareInfo.firmwareType).toBe(0);
    expect(DefaultFirmwareInfo.softwareSeries).toBe(0);
    expect(DefaultFirmwareInfo.hardwareInfo).toBe(0);
    expect(DefaultFirmwareInfo.mainFirmwareVersionRaw).toBe(0);
    expect(DefaultFirmwareInfo.updateImageInfo).toBe(0);
  });

  it("has zeroed version structs", () => {
    expect(DefaultFirmwareInfo.mainFirmwareVersion).toEqual({
      major: 0,
      minor: 0,
      patch: 0,
    });
    expect(DefaultFirmwareInfo.sblFirmwareVersion).toEqual({
      major: 0,
      minor: 0,
      patch: 0,
    });
    expect(DefaultFirmwareInfo.spiderDspFirmwareVersion).toEqual({
      major: 0,
      minor: 0,
      patch: 0,
    });
  });

  it("has placeholder string fields", () => {
    expect(DefaultFirmwareInfo.deviceInfo).toBe("unknown");
    expect(DefaultFirmwareInfo.updateVersion).toBe("00.00");
    expect(DefaultFirmwareInfo.dspFirmwareVersion).toBe("0000_0000");
  });
});
