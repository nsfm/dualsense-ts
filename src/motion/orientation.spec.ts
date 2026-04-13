import { Orientation } from "./orientation";

describe("Orientation", () => {
  it("starts at zero orientation", () => {
    const o = new Orientation();
    expect(o.pitch).toBe(0);
    expect(o.yaw).toBe(0);
    expect(o.roll).toBe(0);
    expect(o.quaternion).toEqual([1, 0, 0, 0]);
  });

  it("stays near zero when stationary with gravity-down", () => {
    const o = new Orientation({ beta: 0.1 });
    // Controller at rest: no gyro, gravity along Y (0.25 = 1g)
    for (let i = 0; i < 200; i++) {
      o.update(0, 0, 0, 0, 0.25, 0, 0.004);
    }
    expect(Math.abs(o.pitch)).toBeLessThan(0.2);
    expect(Math.abs(o.roll)).toBeLessThan(0.2);
  });

  it("tracks a sustained pitch rotation via gyro", () => {
    const o = new Orientation({ beta: 0.01 }); // low beta: trust gyro
    // Gyro X = 0.1 in calibrated units → 0.1 * 2000°/s = 200°/s ≈ 3.49 rad/s
    // For 0.2s, expect ~0.698 radians of pitch
    for (let i = 0; i < 50; i++) {
      o.update(0.1, 0, 0, 0, 0.25, 0, 0.004);
    }
    // Should show clear positive pitch
    expect(o.pitch).toBeGreaterThan(0.3);
  });

  it("tracks a yaw rotation via gyro", () => {
    const o = new Orientation({ beta: 0.01 });
    for (let i = 0; i < 50; i++) {
      o.update(0, 0.1, 0, 0, 0.25, 0, 0.004);
    }
    expect(Math.abs(o.yaw)).toBeGreaterThan(0.3);
  });

  it("tracks a roll rotation via gyro", () => {
    const o = new Orientation({ beta: 0.01 });
    for (let i = 0; i < 50; i++) {
      o.update(0, 0, 0.1, 0, 0.25, 0, 0.004);
    }
    expect(Math.abs(o.roll)).toBeGreaterThan(0.3);
  });

  it("converges tilt from accelerometer when tilted forward", () => {
    const o = new Orientation({ beta: 0.5 });
    // Gravity vector indicates forward tilt: gravity shifts from Y toward Z
    // accel = (0, 0.18, 0.18) in calibrated units
    for (let i = 0; i < 500; i++) {
      o.update(0, 0, 0, 0, 0.18, 0.18, 0.004);
    }
    // tiltPitch should indicate a significant forward tilt
    expect(Math.abs(o.tiltPitch)).toBeGreaterThan(0.3);
  });

  it("converges tilt from accelerometer when rolled sideways", () => {
    const o = new Orientation({ beta: 0.5 });
    // Gravity vector indicates side tilt: gravity shifts from Y toward X
    // accel = (0.18, 0.18, 0)
    for (let i = 0; i < 500; i++) {
      o.update(0, 0, 0, 0.18, 0.18, 0, 0.004);
    }
    // tiltRoll should indicate a significant sideways tilt
    expect(Math.abs(o.tiltRoll)).toBeGreaterThan(0.3);
  });

  it("computes tilt without gyro influence", () => {
    const o = new Orientation();
    // Single sample: gravity tilted
    o.update(0, 0, 0, 0.15, 0.15, 0.15, 0.004);
    // tiltPitch and tiltRoll should be non-zero
    expect(o.tiltPitch).not.toBe(0);
    expect(o.tiltRoll).not.toBe(0);
  });

  it("resets to identity", () => {
    const o = new Orientation();
    // Disturb
    for (let i = 0; i < 50; i++) {
      o.update(0.2, 0.1, 0.05, 0.1, 0.2, 0, 0.004);
    }
    expect(o.pitch).not.toBe(0);

    o.reset();
    expect(o.pitch).toBe(0);
    expect(o.yaw).toBe(0);
    expect(o.roll).toBe(0);
    expect(o.quaternion).toEqual([1, 0, 0, 0]);
    expect(o.tiltPitch).toBe(0);
    expect(o.tiltRoll).toBe(0);
  });

  it("beta getter/setter controls filter gain", () => {
    const o = new Orientation({ beta: 0.3 });
    expect(o.beta).toBe(0.3);
    o.beta = 0.05;
    expect(o.beta).toBe(0.05);
  });

  it("quaternion stays normalized over many updates", () => {
    const o = new Orientation();
    for (let i = 0; i < 1000; i++) {
      const t = i * 0.01;
      o.update(
        Math.sin(t) * 0.1,
        Math.cos(t * 0.7) * 0.05,
        Math.sin(t * 1.3) * 0.08,
        Math.sin(t * 0.3) * 0.1,
        0.24 + Math.cos(t * 0.5) * 0.02,
        Math.sin(t * 0.8) * 0.05,
        0.004,
      );
    }
    const [w, x, y, z] = o.quaternion;
    const norm = Math.sqrt(w * w + x * x + y * y + z * z);
    expect(norm).toBeCloseTo(1, 6);
  });

  it("Euler angles stay within valid range", () => {
    const o = new Orientation();
    for (let i = 0; i < 500; i++) {
      o.update(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.5,
        0.2 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.3,
        0.004,
      );
      expect(o.pitch).toBeGreaterThanOrEqual(-Math.PI);
      expect(o.pitch).toBeLessThanOrEqual(Math.PI);
      expect(o.yaw).toBeGreaterThanOrEqual(-Math.PI);
      expect(o.yaw).toBeLessThanOrEqual(Math.PI);
      expect(o.roll).toBeGreaterThanOrEqual(-Math.PI);
      expect(o.roll).toBeLessThanOrEqual(Math.PI);
    }
  });
});
