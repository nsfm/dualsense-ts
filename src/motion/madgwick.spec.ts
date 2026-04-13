import { MadgwickFilter } from "./madgwick";

describe("MadgwickFilter", () => {
  it("starts at identity quaternion", () => {
    const f = new MadgwickFilter();
    expect(f.q).toEqual([1, 0, 0, 0]);
  });

  it("resets to identity", () => {
    const f = new MadgwickFilter();
    // Disturb it
    f.update(1, 0, 0, 0, 0, -1, 0.004);
    expect(f.q).not.toEqual([1, 0, 0, 0]);
    f.reset();
    expect(f.q).toEqual([1, 0, 0, 0]);
  });

  it("stays near identity with zero gyro and gravity-down accel", () => {
    const f = new MadgwickFilter(0.1);
    // Simulate 100 frames at rest: no rotation, gravity along -Y
    for (let i = 0; i < 100; i++) {
      f.update(0, 0, 0, 0, -1, 0, 0.004);
    }
    // Should remain very close to identity
    expect(f.q[0]).toBeCloseTo(1, 1);
    expect(Math.abs(f.q[1])).toBeLessThan(0.1);
    expect(Math.abs(f.q[2])).toBeLessThan(0.1);
    expect(Math.abs(f.q[3])).toBeLessThan(0.1);
  });

  it("converges toward a tilted orientation when accel indicates tilt", () => {
    const f = new MadgwickFilter(0.5); // high beta for fast convergence
    // Gravity vector indicates ~45° tilt: accel = (0.707, -0.707, 0)
    const ax = 0.707;
    const ay = -0.707;
    for (let i = 0; i < 500; i++) {
      f.update(0, 0, 0, ax, ay, 0, 0.004);
    }
    // The quaternion should have rotated significantly from identity
    expect(f.q[0]).toBeLessThan(0.98);
  });

  it("responds to gyro rotation", () => {
    const f = new MadgwickFilter(0.01); // low beta: trust gyro
    // Constant rotation of 1 rad/s around X for 0.5s
    const gx = 1.0;
    const dt = 0.004;
    for (let i = 0; i < 125; i++) {
      f.update(gx, 0, 0, 0, -1, 0, dt);
    }
    // After 0.5s at 1 rad/s, expect ~0.5 radians of pitch
    // q should show a clear X-axis rotation component
    expect(Math.abs(f.q[1])).toBeGreaterThan(0.1);
  });

  it("does nothing when accel is zero (free-fall guard)", () => {
    const f = new MadgwickFilter();
    const before = [...f.q];
    f.update(0, 0, 0, 0, 0, 0, 0.004);
    expect(f.q).toEqual(before);
  });

  it("preserves unit quaternion over many iterations", () => {
    const f = new MadgwickFilter(0.1);
    // Random-ish motion for 1000 frames
    for (let i = 0; i < 1000; i++) {
      const t = i * 0.01;
      f.update(
        Math.sin(t) * 5,
        Math.cos(t * 0.7) * 3,
        Math.sin(t * 1.3) * 2,
        Math.sin(t * 0.3) * 0.5,
        -0.9 + Math.cos(t * 0.5) * 0.1,
        Math.sin(t * 0.8) * 0.3,
        0.004,
      );
    }
    const [w, x, y, z] = f.q;
    const norm = Math.sqrt(w * w + x * x + y * y + z * z);
    expect(norm).toBeCloseTo(1, 6);
  });

  it("accepts configurable beta", () => {
    const f = new MadgwickFilter(0.5);
    expect(f.beta).toBe(0.5);
  });
});
