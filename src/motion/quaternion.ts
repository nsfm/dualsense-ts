/**
 * Minimal quaternion math for AHRS sensor fusion.
 *
 * Quaternions are represented as [w, x, y, z] tuples where w is the
 * scalar part. All functions are pure — no mutations, no allocations
 * beyond the returned tuple.
 */

/** A unit quaternion [w, x, y, z] representing a 3D orientation. */
export type Quaternion = [number, number, number, number];

/** Euler angles in radians, extracted from a quaternion. */
export interface EulerAngles {
  /** Rotation around X axis (radians, -PI to PI) */
  pitch: number;
  /** Rotation around Y axis (radians, -PI to PI) */
  yaw: number;
  /** Rotation around Z axis (radians, -PI to PI) */
  roll: number;
}

/** Identity quaternion — no rotation. */
export const IDENTITY: Quaternion = [1, 0, 0, 0];

/** Normalize a quaternion to unit length. */
export function normalize(q: Quaternion): Quaternion {
  const [w, x, y, z] = q;
  const invNorm = 1 / Math.sqrt(w * w + x * x + y * y + z * z);
  return [w * invNorm, x * invNorm, y * invNorm, z * invNorm];
}

/**
 * Extract Euler angles (Tait-Bryan ZYX intrinsic) from a unit quaternion.
 *
 * Convention: pitch = X-axis, yaw = Y-axis, roll = Z-axis.
 * All angles in radians, range (-PI, PI].
 */
export function toEuler(q: Quaternion): EulerAngles {
  const [w, x, y, z] = q;

  // Roll (Z-axis)
  const sinr = 2 * (w * z + x * y);
  const cosr = 1 - 2 * (y * y + z * z);
  const roll = Math.atan2(sinr, cosr);

  // Pitch (X-axis)
  const sinp = 2 * (w * x - y * z);
  const pitch =
    Math.abs(sinp) >= 1
      ? Math.sign(sinp) * (Math.PI / 2) // gimbal lock
      : Math.asin(sinp);

  // Yaw (Y-axis)
  const siny = 2 * (w * y + z * x);
  const cosy = 1 - 2 * (x * x + y * y);
  const yaw = Math.atan2(siny, cosy);

  return { pitch, yaw, roll };
}
