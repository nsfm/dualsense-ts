/**
 * Madgwick AHRS (Attitude and Heading Reference System) filter.
 *
 * Fuses 3-axis gyroscope and 3-axis accelerometer data into a stable
 * orientation quaternion using gradient-descent-based correction.
 *
 * Reference: Sebastian Madgwick, "An efficient orientation filter for
 * inertial and inertial/magnetic sensor arrays" (2010).
 *
 * Zero dependencies. The algorithm is ~40 lines of arithmetic.
 */

import { type Quaternion, IDENTITY } from "./quaternion";

export class MadgwickFilter {
  /** Current orientation estimate. */
  q: Quaternion = [...IDENTITY];

  /**
   * Filter gain. Higher values trust the accelerometer more — less
   * drift but more high-frequency noise. Lower values give smoother
   * tracking but allow more gyro drift.
   *
   * Typical range: 0.01 (very smooth) to 0.5 (aggressive correction).
   * Default 0.1 is a good general-purpose starting point.
   */
  beta: number;

  constructor(beta = 0.1) {
    this.beta = beta;
  }

  /** Reset to identity orientation. */
  reset(): void {
    this.q = [...IDENTITY];
  }

  /**
   * Incorporate one IMU sample.
   *
   * @param gx  Gyroscope X (pitch) in **rad/s**
   * @param gy  Gyroscope Y (yaw)   in **rad/s**
   * @param gz  Gyroscope Z (roll)  in **rad/s**
   * @param ax  Accelerometer X (any consistent unit — normalized internally)
   * @param ay  Accelerometer Y
   * @param az  Accelerometer Z
   * @param dt  Time delta in **seconds** since last sample
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
    let [q0, q1, q2, q3] = this.q;

    // ---- Normalize accelerometer ----
    let norm = Math.sqrt(ax * ax + ay * ay + az * az);
    if (norm === 0) return; // free-fall or no data — gyro only would diverge
    norm = 1 / norm;
    ax *= norm;
    ay *= norm;
    az *= norm;

    // ---- Precomputed terms ----
    const _2q0 = 2 * q0;
    const _2q1 = 2 * q1;
    const _2q2 = 2 * q2;
    const _2q3 = 2 * q3;
    const _4q0 = 4 * q0;
    const _4q1 = 4 * q1;
    const _4q2 = 4 * q2;
    const _8q1 = 8 * q1;
    const _8q2 = 8 * q2;
    const q0q0 = q0 * q0;
    const q1q1 = q1 * q1;
    const q2q2 = q2 * q2;
    const q3q3 = q3 * q3;

    // ---- Gradient descent corrective step ----
    // Objective: align estimated gravity direction with measured gravity.
    let s0 =
      _4q0 * q2q2 + _2q2 * ax + _4q0 * q1q1 - _2q1 * ay;
    let s1 =
      _4q1 * q3q3 - _2q3 * ax + 4 * q0q0 * q1 - _2q0 * ay - _4q1 +
      _8q1 * q1q1 + _8q1 * q2q2 + _4q1 * az;
    let s2 =
      4 * q0q0 * q2 + _2q0 * ax + _4q2 * q3q3 - _2q3 * ay - _4q2 +
      _8q2 * q1q1 + _8q2 * q2q2 + _4q2 * az;
    let s3 =
      4 * q1q1 * q3 - _2q1 * ax + 4 * q2q2 * q3 - _2q2 * ay;

    const sNorm = s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3;
    if (sNorm > 0) {
      norm = 1 / Math.sqrt(sNorm);
      s0 *= norm;
      s1 *= norm;
      s2 *= norm;
      s3 *= norm;
    }
    // When sNorm ≈ 0, the accel already matches the estimated gravity
    // direction — no correction needed, just integrate gyro.

    // ---- Quaternion rate from gyroscope ----
    const qDot0 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
    const qDot1 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
    const qDot2 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
    const qDot3 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

    // ---- Fuse: gyro integration minus gradient correction ----
    q0 += (qDot0 - (sNorm > 0 ? this.beta * s0 : 0)) * dt;
    q1 += (qDot1 - (sNorm > 0 ? this.beta * s1 : 0)) * dt;
    q2 += (qDot2 - (sNorm > 0 ? this.beta * s2 : 0)) * dt;
    q3 += (qDot3 - (sNorm > 0 ? this.beta * s3 : 0)) * dt;

    // ---- Re-normalize ----
    norm = 1 / Math.sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3);
    this.q = [q0 * norm, q1 * norm, q2 * norm, q3 * norm];
  }
}
