import { normalize, toEuler, IDENTITY, type Quaternion } from "./quaternion";

describe("normalize", () => {
  it("returns identity unchanged", () => {
    const q = normalize(IDENTITY);
    expect(q[0]).toBeCloseTo(1);
    expect(q[1]).toBeCloseTo(0);
    expect(q[2]).toBeCloseTo(0);
    expect(q[3]).toBeCloseTo(0);
  });

  it("normalizes a non-unit quaternion", () => {
    const q = normalize([2, 0, 0, 0]);
    expect(q[0]).toBeCloseTo(1);
    expect(q[1]).toBeCloseTo(0);
  });

  it("normalizes a general quaternion to unit length", () => {
    const q = normalize([1, 1, 1, 1]);
    const len = Math.sqrt(q[0] ** 2 + q[1] ** 2 + q[2] ** 2 + q[3] ** 2);
    expect(len).toBeCloseTo(1, 10);
  });
});

describe("toEuler", () => {
  it("returns zeros for identity quaternion", () => {
    const e = toEuler(IDENTITY);
    expect(e.pitch).toBeCloseTo(0);
    expect(e.yaw).toBeCloseTo(0);
    expect(e.roll).toBeCloseTo(0);
  });

  it("detects a 90-degree pitch rotation", () => {
    // Quaternion for 90° around X: [cos(45°), sin(45°), 0, 0]
    const s = Math.SQRT1_2;
    const q: Quaternion = [s, s, 0, 0];
    const e = toEuler(q);
    expect(e.pitch).toBeCloseTo(Math.PI / 2, 4);
    // At ±90° pitch (gimbal lock), yaw and roll are degenerate —
    // their sum is constrained but individual values are undefined.
    // Only assert pitch here.
  });

  it("detects a 90-degree yaw rotation", () => {
    // Quaternion for 90° around Y: [cos(45°), 0, sin(45°), 0]
    const s = Math.SQRT1_2;
    const q: Quaternion = [s, 0, s, 0];
    const e = toEuler(q);
    expect(e.yaw).toBeCloseTo(Math.PI / 2, 4);
  });

  it("detects a 90-degree roll rotation", () => {
    // Quaternion for 90° around Z: [cos(45°), 0, 0, sin(45°)]
    const s = Math.SQRT1_2;
    const q: Quaternion = [s, 0, 0, s];
    const e = toEuler(q);
    expect(e.roll).toBeCloseTo(Math.PI / 2, 4);
  });

  it("handles gimbal lock at +90° pitch", () => {
    // At exact gimbal lock, pitch should clamp to ±PI/2
    const q: Quaternion = [0.5, 0.5, -0.5, 0.5];
    const e = toEuler(q);
    expect(Math.abs(e.pitch)).toBeCloseTo(Math.PI / 2, 4);
  });
});
