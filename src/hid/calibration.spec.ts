import {
  parseIMUCalibration,
  resolveCalibration,
  rawInt16,
  applyCal,
  DefaultResolvedCalibration,
} from "./calibration";

// Real Feature Report 0x05 captured from two DualSense controllers
const USB_REPORT_05 = new Uint8Array([
  0x05, 0x00, 0x00, 0xff, 0xff, 0xfc, 0xff, 0x7d, 0x22, 0x83, 0xdd, 0x7f,
  0x22, 0x7c, 0xdd, 0x9a, 0x22, 0x61, 0xdd, 0x1c, 0x02, 0x1c, 0x02, 0x09,
  0x20, 0xdf, 0xdf, 0xc5, 0x1f, 0xc7, 0xdf, 0xf4, 0x1f, 0xef, 0xdf, 0x04,
  0x00, 0x00, 0x00, 0x00, 0x00,
]);

const BT_REPORT_05 = new Uint8Array([
  0x05, 0x02, 0x00, 0xfa, 0xff, 0xf6, 0xff, 0x61, 0x22, 0xa4, 0xdd, 0xa8,
  0x22, 0x52, 0xdd, 0x89, 0x23, 0x65, 0xdc, 0x1c, 0x02, 0x1c, 0x02, 0x06,
  0x20, 0xfa, 0xdf, 0x29, 0x20, 0xd7, 0xdf, 0xfc, 0x1f, 0x04, 0xe0, 0x06,
  0x00, 0x02, 0x60, 0x0c, 0x2a,
]);

describe("rawInt16", () => {
  it("assembles positive int16 from two bytes", () => {
    expect(rawInt16(0xff, 0x7f)).toBe(32767);
  });

  it("assembles negative int16 from two bytes", () => {
    expect(rawInt16(0x00, 0x80)).toBe(-32768);
  });

  it("assembles zero", () => {
    expect(rawInt16(0x00, 0x00)).toBe(0);
  });

  it("assembles -1 from 0xff, 0xff", () => {
    expect(rawInt16(0xff, 0xff)).toBe(-1);
  });
});

describe("parseIMUCalibration", () => {
  it("parses USB report with report-ID prefix", () => {
    const cal = parseIMUCalibration(USB_REPORT_05);

    expect(cal.gyro.pitch.bias).toBe(0);
    expect(cal.gyro.yaw.bias).toBe(-1);
    expect(cal.gyro.roll.bias).toBe(-4);

    expect(cal.gyro.pitch.plus).toBe(8829);
    expect(cal.gyro.pitch.minus).toBe(-8829);
    expect(cal.gyro.yaw.plus).toBe(8831);
    expect(cal.gyro.yaw.minus).toBe(-8836);
    expect(cal.gyro.roll.plus).toBe(8858);
    expect(cal.gyro.roll.minus).toBe(-8863);

    expect(cal.gyro.speedPlus).toBe(540);
    expect(cal.gyro.speedMinus).toBe(540);

    expect(cal.accel.x.plus).toBe(8201);
    expect(cal.accel.x.minus).toBe(-8225);
    expect(cal.accel.y.plus).toBe(8133);
    expect(cal.accel.y.minus).toBe(-8249);
    expect(cal.accel.z.plus).toBe(8180);
    expect(cal.accel.z.minus).toBe(-8209);
  });

  it("parses BT report with report-ID prefix", () => {
    const cal = parseIMUCalibration(BT_REPORT_05);

    expect(cal.gyro.pitch.bias).toBe(2);
    expect(cal.gyro.yaw.bias).toBe(-6);
    expect(cal.gyro.roll.bias).toBe(-10);

    expect(cal.gyro.speedPlus).toBe(540);
    expect(cal.gyro.speedMinus).toBe(540);
  });

  it("handles buffer without report-ID prefix", () => {
    // Strip the 0x05 prefix
    const stripped = USB_REPORT_05.slice(1);
    const cal = parseIMUCalibration(stripped);

    expect(cal.gyro.pitch.bias).toBe(0);
    expect(cal.gyro.yaw.bias).toBe(-1);
    expect(cal.gyro.roll.bias).toBe(-4);
  });
});

describe("resolveCalibration", () => {
  const cal = parseIMUCalibration(USB_REPORT_05);
  const resolved = resolveCalibration(cal);

  it("sets gyro bias from raw calibration", () => {
    expect(resolved.gyroPitch.bias).toBe(0);
    expect(resolved.gyroYaw.bias).toBe(-1);
    expect(resolved.gyroRoll.bias).toBe(-4);
  });

  it("sets accel bias to center of plus/minus", () => {
    // x: (8201 + -8225) / 2 = -12
    expect(resolved.accelX.bias).toBe(-12);
    // y: (8133 + -8249) / 2 = -58
    expect(resolved.accelY.bias).toBe(-58);
    // z: (8180 + -8209) / 2 = -14.5
    expect(resolved.accelZ.bias).toBeCloseTo(-14.5);
  });

  it("normalises gyro scale so the widest axis has scale = 1/32767", () => {
    // Roll has the widest range: 8858 - (-8863) = 17721
    // So roll scale = maxRange / rollRange / 32767 = 1 / 32767
    expect(resolved.gyroRoll.scale).toBeCloseTo(1 / 32767, 10);
  });

  it("boosts narrower gyro axes to match the widest", () => {
    // pitch range = 8829 - (-8829) = 17658
    // pitch scale = 17721 / 17658 / 32767
    const pitchRange = 8829 - -8829;
    const maxRange = 8858 - -8863;
    expect(resolved.gyroPitch.scale).toBeCloseTo(maxRange / pitchRange / 32767, 10);
    expect(resolved.gyroPitch.scale).toBeGreaterThan(resolved.gyroRoll.scale);
  });

  it("normalises accel scale so the widest axis has scale = 1/32767", () => {
    // x range = 8201 - (-8225) = 16426
    // y range = 8133 - (-8249) = 16382
    // z range = 8180 - (-8209) = 16389
    // widest is x (16426)
    expect(resolved.accelX.scale).toBeCloseTo(1 / 32767, 10);
  });

  it("handles zero-range gracefully", () => {
    const zeroCal = parseIMUCalibration(USB_REPORT_05);
    zeroCal.gyro.pitch.plus = 0;
    zeroCal.gyro.pitch.minus = 0;
    const res = resolveCalibration(zeroCal);
    // Should fall back to default scale, not NaN or Infinity
    expect(res.gyroPitch.scale).toBe(1 / 32767);
    expect(Number.isFinite(res.gyroPitch.scale)).toBe(true);
  });
});

describe("applyCal", () => {
  it("returns 0 when raw equals bias (default calibration)", () => {
    expect(applyCal(0, DefaultResolvedCalibration.gyroPitch)).toBe(0);
  });

  it("maps +32767 to +1 with default calibration", () => {
    expect(applyCal(32767, DefaultResolvedCalibration.gyroPitch)).toBeCloseTo(1, 5);
  });

  it("maps -32768 to -1 with default calibration", () => {
    expect(applyCal(-32768, DefaultResolvedCalibration.gyroPitch)).toBeCloseTo(-1, 3);
  });

  it("subtracts bias before scaling", () => {
    const factors = { bias: 100, scale: 1 / 32767 };
    // raw=100 → (100-100) * scale = 0
    expect(applyCal(100, factors)).toBe(0);
    // raw=200 → (200-100) / 32767
    expect(applyCal(200, factors)).toBeCloseTo(100 / 32767, 8);
  });

  it("clamps to [-1, 1]", () => {
    const factors = { bias: 0, scale: 1 / 100 };
    expect(applyCal(200, factors)).toBe(1);
    expect(applyCal(-200, factors)).toBe(-1);
  });

  it("applies real USB calibration correctly", () => {
    const cal = parseIMUCalibration(USB_REPORT_05);
    const resolved = resolveCalibration(cal);

    // A raw gyro pitch reading of 0 (resting, bias=0) should map to ~0
    expect(applyCal(0, resolved.gyroPitch)).toBeCloseTo(0, 5);

    // A raw gyro yaw reading of -1 (resting, bias=-1) should map to ~0
    expect(applyCal(-1, resolved.gyroYaw)).toBeCloseTo(0, 5);

    // A raw accel reading at the center should map to ~0
    // accelX center = -12
    expect(applyCal(-12, resolved.accelX)).toBeCloseTo(0, 5);
  });
});

describe("calibration integration", () => {
  it("produces different results per controller for the same raw value", () => {
    const usbResolved = resolveCalibration(parseIMUCalibration(USB_REPORT_05));
    const btResolved = resolveCalibration(parseIMUCalibration(BT_REPORT_05));

    // Raw 1000 on gyro pitch:
    // USB bias=0, BT bias=2 → slightly different centered values
    const usbResult = applyCal(1000, usbResolved.gyroPitch);
    const btResult = applyCal(1000, btResolved.gyroPitch);

    expect(usbResult).not.toBe(btResult);
    // Both should be small positive values
    expect(usbResult).toBeGreaterThan(0);
    expect(btResult).toBeGreaterThan(0);
  });

  it("resting gyro reads closer to zero with calibration than without", () => {
    const btCal = parseIMUCalibration(BT_REPORT_05);
    const btResolved = resolveCalibration(btCal);

    // BT gyro roll bias = -10. A raw reading of -10 at rest:
    // Without calibration: (-10) / 32767 ≈ -0.000305
    const uncalibrated = -10 / 32767;
    // With calibration: (-10 - (-10)) * scale = 0
    const calibrated = applyCal(-10, btResolved.gyroRoll);

    expect(Math.abs(calibrated)).toBeLessThan(Math.abs(uncalibrated));
    expect(calibrated).toBeCloseTo(0, 10);
  });
});
