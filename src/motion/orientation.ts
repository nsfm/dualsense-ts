/**
 * High-level orientation tracker for the DualSense controller.
 *
 * Wraps the Madgwick AHRS filter and provides:
 *   - Fused orientation as Euler angles and quaternion
 *   - Accelerometer-only tilt (no drift, no yaw — useful for
 *     gravity-reference applications like steering)
 *   - Automatic unit conversion from the library's [-1, 1] calibrated
 *     values to the rad/s and g units the filter expects
 *
 * DualSense IMU hardware constants:
 *   Gyroscope:     ±2000 deg/s full scale → 1.0 = 2000 deg/s
 *   Accelerometer: ±4 g full scale        → 0.25 ≈ 1 g
 */

import { MadgwickFilter } from "./madgwick";
import { type Quaternion, type EulerAngles, IDENTITY, toEuler } from "./quaternion";

/**
 * Convert our [-1, 1] calibrated gyro value to rad/s.
 * Full scale is ±2000 deg/s = ±34.9066 rad/s.
 */
const GYRO_SCALE = 2000 * (Math.PI / 180); // ≈ 34.9066

export interface OrientationParams {
  /**
   * Madgwick filter gain. Higher = more accelerometer trust (less drift,
   * more noise). Lower = smoother but driftier.
   *
   * - 0.01–0.04: very smooth, noticeable drift over minutes
   * - 0.05–0.15: general purpose (default 0.1)
   * - 0.2–0.5:  aggressive correction, jittery under vibration
   */
  beta?: number;
}

export class Orientation {
  // ---- Public state (read these in your game loop) ----

  /** Fused orientation as Euler angles (radians, updated each sample). */
  pitch = 0;
  yaw = 0;
  roll = 0;

  /** Fused orientation as a unit quaternion [w, x, y, z]. */
  quaternion: Quaternion = [...IDENTITY];

  /**
   * Tilt derived from the accelerometer gravity vector alone.
   * No drift, but also no yaw — only pitch and roll.
   * Noisy during motion; best used when the controller is relatively still.
   */
  tiltPitch = 0;
  tiltRoll = 0;

  // ---- Configuration ----

  /** Madgwick filter gain. Can be adjusted at runtime. */
  get beta(): number {
    return this.filter.beta;
  }
  set beta(v: number) {
    this.filter.beta = v;
  }

  // ---- Internals ----
  private readonly filter: MadgwickFilter;

  constructor(params?: OrientationParams) {
    this.filter = new MadgwickFilter(params?.beta ?? 0.1);
  }

  /** Reset to identity orientation (call when zeroing the view). */
  reset(): void {
    this.filter.reset();
    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;
    this.quaternion = [...IDENTITY];
    this.tiltPitch = 0;
    this.tiltRoll = 0;
  }

  /**
   * Incorporate one IMU sample. Called automatically by the Dualsense
   * class on each HID report — you don't normally call this yourself.
   *
   * @param gx  Calibrated gyro X (pitch), [-1, 1]
   * @param gy  Calibrated gyro Y (yaw),   [-1, 1]
   * @param gz  Calibrated gyro Z (roll),  [-1, 1]
   * @param ax  Calibrated accel X, [-1, 1]
   * @param ay  Calibrated accel Y, [-1, 1]
   * @param az  Calibrated accel Z, [-1, 1]
   * @param dt  Time delta in seconds
   */
  update(
    gx: number,
    gy: number,
    gz: number,
    ax: number,
    ay: number,
    az: number,
    dt: number,
  ): void {
    // Remap DualSense axes to Madgwick's Z-up convention.
    // DualSense: X = right, Y = up (gravity), Z = forward
    // Madgwick:  X = right, Y = forward,      Z = up (gravity)
    // Mapping:   filter(X, Y, Z) = DS(X, -Z, Y)
    this.filter.update(
      gx * GYRO_SCALE,       // filter X = DS X (pitch axis)
      -gz * GYRO_SCALE,      // filter Y = -DS Z (negated forward)
      gy * GYRO_SCALE,       // filter Z = DS Y (gravity axis → up)
      ax,                    // accel X unchanged
      -az,                   // accel Y = -DS Z
      ay,                    // accel Z = DS Y (gravity)
      dt,
    );

    // Extract Euler angles and remap back to DualSense frame
    this.quaternion = this.filter.q;
    const euler: EulerAngles = toEuler(this.quaternion);
    this.pitch = euler.pitch;   // filter X rotation → DS pitch (forward/back)
    this.yaw = euler.roll;      // filter Z rotation → DS yaw (left/right turn)
    this.roll = -euler.yaw;     // filter Y rotation → DS roll (side tilt, negated)

    // Accelerometer-only tilt (gravity reference)
    // DualSense axes: X = lateral, Y = vertical (up at rest), Z = forward
    // Pitch = forward/back tilt (around X): gravity shifts from Y toward Z
    // Roll  = side-to-side tilt (around Z): gravity shifts from Y toward X
    const aNorm = Math.sqrt(ax * ax + ay * ay + az * az);
    if (aNorm > 0) {
      const nax = ax / aNorm;
      const nay = ay / aNorm;
      const naz = az / aNorm;
      this.tiltPitch = Math.atan2(-naz, nay);
      this.tiltRoll = Math.atan2(nax, Math.sqrt(nay * nay + naz * naz));
    }
  }
}
