/**
 * IMU calibration data from Feature Report 0x05.
 *
 * The DualSense stores per-unit factory calibration for the gyroscope and
 * accelerometer.  Reading and applying these offsets and scale factors
 * removes bias drift and normalises per-axis sensitivity, giving more
 * accurate motion data than the hardcoded mapping.
 *
 * Layout mirrors the Linux kernel hid-playstation.c interpretation of
 * Feature Report 0x05 (41 bytes including the report-ID prefix).
 */

import type { HIDProvider } from "./hid_provider";

// ---------------------------------------------------------------------------
// Raw calibration data
// ---------------------------------------------------------------------------

/** Per-axis calibration parameters for one gyro axis */
export interface GyroAxisCalibration {
  /** Resting-state bias (raw int16 counts) */
  bias: number;
  /** Raw count at +reference rotation rate */
  plus: number;
  /** Raw count at −reference rotation rate */
  minus: number;
}

/** Per-axis calibration parameters for one accelerometer axis */
export interface AccelAxisCalibration {
  /** Raw count at +1 g */
  plus: number;
  /** Raw count at −1 g */
  minus: number;
}

/** Full IMU calibration data parsed from Feature Report 0x05 */
export interface IMUCalibration {
  gyro: {
    pitch: GyroAxisCalibration;
    yaw: GyroAxisCalibration;
    roll: GyroAxisCalibration;
    /** Reference rotation-rate magnitude (positive direction) */
    speedPlus: number;
    /** Reference rotation-rate magnitude (negative direction) */
    speedMinus: number;
  };
  accel: {
    x: AccelAxisCalibration;
    y: AccelAxisCalibration;
    z: AccelAxisCalibration;
  };
}

// ---------------------------------------------------------------------------
// Resolved (precomputed) calibration — ready for per-sample application
// ---------------------------------------------------------------------------

/** Precomputed bias + scale for a single axis */
export interface AxisCalibrationFactors {
  /** Value to subtract from the raw int16 */
  bias: number;
  /** Multiplier: calibrated = (raw − bias) × scale, then clamp to [−1, 1] */
  scale: number;
}

/**
 * Precomputed calibration factors for all six IMU axes.
 *
 * Per-sample application: `calibrated = clamp((raw − bias) × scale, −1, 1)`
 */
export interface ResolvedCalibration {
  gyroPitch: AxisCalibrationFactors;
  gyroYaw: AxisCalibrationFactors;
  gyroRoll: AxisCalibrationFactors;
  accelX: AxisCalibrationFactors;
  accelY: AxisCalibrationFactors;
  accelZ: AxisCalibrationFactors;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

/** Identity calibration: zero bias, uniform 1/32767 scale */
export const DefaultResolvedCalibration: ResolvedCalibration = {
  gyroPitch: { bias: 0, scale: 1 / 32767 },
  gyroYaw: { bias: 0, scale: 1 / 32767 },
  gyroRoll: { bias: 0, scale: 1 / 32767 },
  accelX: { bias: 0, scale: 1 / 32767 },
  accelY: { bias: 0, scale: 1 / 32767 },
  accelZ: { bias: 0, scale: 1 / 32767 },
};

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

const REPORT_ID = 0x05;
const REPORT_LENGTH = 41;

function readInt16LE(buf: Uint8Array, offset: number): number {
  let v = buf[offset] | (buf[offset + 1] << 8);
  if (v > 0x7fff) v -= 0x10000;
  return v;
}

/**
 * Parse Feature Report 0x05 into an {@link IMUCalibration}.
 *
 * The report may or may not include the report-ID byte as the first
 * element depending on platform — the parser auto-detects.
 */
export function parseIMUCalibration(buf: Uint8Array): IMUCalibration {
  const off = buf[0] === REPORT_ID ? 1 : 0;

  return {
    gyro: {
      pitch: {
        bias: readInt16LE(buf, off + 0),
        plus: readInt16LE(buf, off + 6),
        minus: readInt16LE(buf, off + 8),
      },
      yaw: {
        bias: readInt16LE(buf, off + 2),
        plus: readInt16LE(buf, off + 10),
        minus: readInt16LE(buf, off + 12),
      },
      roll: {
        bias: readInt16LE(buf, off + 4),
        plus: readInt16LE(buf, off + 14),
        minus: readInt16LE(buf, off + 16),
      },
      speedPlus: readInt16LE(buf, off + 18),
      speedMinus: readInt16LE(buf, off + 20),
    },
    accel: {
      x: { plus: readInt16LE(buf, off + 22), minus: readInt16LE(buf, off + 24) },
      y: { plus: readInt16LE(buf, off + 26), minus: readInt16LE(buf, off + 28) },
      z: { plus: readInt16LE(buf, off + 30), minus: readInt16LE(buf, off + 32) },
    },
  };
}

// ---------------------------------------------------------------------------
// Resolution: raw calibration → precomputed factors
// ---------------------------------------------------------------------------

/**
 * Precompute per-axis bias and scale from raw calibration data.
 *
 * **Gyroscope:** Removes resting-state bias and normalises per-axis
 * sensitivity so that the same physical rotation rate produces the same
 * numeric value on all three axes.  The most-sensitive axis (largest
 * raw range) maps exactly to [-1, 1] at full scale; less-sensitive
 * axes are boosted to match, with ≤ 4% clipping at extreme values.
 *
 * **Accelerometer:** Removes the zero-point offset (manufacturing
 * tolerance) and normalises per-axis sensitivity the same way.
 */
export function resolveCalibration(cal: IMUCalibration): ResolvedCalibration {
  const pitchRange = cal.gyro.pitch.plus - cal.gyro.pitch.minus;
  const yawRange = cal.gyro.yaw.plus - cal.gyro.yaw.minus;
  const rollRange = cal.gyro.roll.plus - cal.gyro.roll.minus;
  const maxGyroRange = Math.max(
    Math.abs(pitchRange),
    Math.abs(yawRange),
    Math.abs(rollRange),
  );

  const xRange = cal.accel.x.plus - cal.accel.x.minus;
  const yRange = cal.accel.y.plus - cal.accel.y.minus;
  const zRange = cal.accel.z.plus - cal.accel.z.minus;
  const maxAccelRange = Math.max(
    Math.abs(xRange),
    Math.abs(yRange),
    Math.abs(zRange),
  );

  function gyroScale(range: number): number {
    return range !== 0 ? maxGyroRange / range / 32767 : 1 / 32767;
  }
  function accelScale(range: number): number {
    return range !== 0 ? maxAccelRange / range / 32767 : 1 / 32767;
  }

  return {
    gyroPitch: { bias: cal.gyro.pitch.bias, scale: gyroScale(pitchRange) },
    gyroYaw: { bias: cal.gyro.yaw.bias, scale: gyroScale(yawRange) },
    gyroRoll: { bias: cal.gyro.roll.bias, scale: gyroScale(rollRange) },
    accelX: {
      bias: (cal.accel.x.plus + cal.accel.x.minus) / 2,
      scale: accelScale(xRange),
    },
    accelY: {
      bias: (cal.accel.y.plus + cal.accel.y.minus) / 2,
      scale: accelScale(yRange),
    },
    accelZ: {
      bias: (cal.accel.z.plus + cal.accel.z.minus) / 2,
      scale: accelScale(zRange),
    },
  };
}

// ---------------------------------------------------------------------------
// Reading from device
// ---------------------------------------------------------------------------

/**
 * Read and parse IMU calibration from a connected controller.
 * Returns undefined if the report cannot be read.
 */
export async function readIMUCalibration(
  provider: HIDProvider,
): Promise<IMUCalibration | undefined> {
  try {
    const buf = await provider.readFeatureReport(REPORT_ID, REPORT_LENGTH);
    if (!buf || buf.length < 35) return undefined;
    return parseIMUCalibration(buf);
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Per-sample helpers
// ---------------------------------------------------------------------------

/**
 * Assemble two raw report bytes into a signed int16.
 */
export function rawInt16(lo: number, hi: number): number {
  let v = (hi << 8) | lo;
  if (v > 0x7fff) v -= 0x10000;
  return v;
}

/**
 * Apply precomputed calibration to a single axis sample.
 * `calibrated = clamp((raw − bias) × scale, −1, 1)`
 */
export function applyCal(raw: number, factors: AxisCalibrationFactors): number {
  const v = (raw - factors.bias) * factors.scale;
  return v > 1 ? 1 : v < -1 ? -1 : v;
}
