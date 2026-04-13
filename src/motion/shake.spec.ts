import { ShakeDetector } from "./shake";

describe("ShakeDetector", () => {
  it("starts inactive with zero intensity", () => {
    const s = new ShakeDetector();
    expect(s.active).toBe(false);
    expect(s.intensity).toBe(0);
    expect(s.frequency).toBe(0);
    expect(s.fundamental).toBe(0);
  });

  it("stays inactive when stationary (constant gravity)", () => {
    const s = new ShakeDetector({ windowSize: 64, sustain: 1 });
    const dt = 0.004; // 250 Hz
    // Simulate 128 samples of perfectly still controller
    // Gravity along Y at 0.25 (1g in our ±4g scale)
    for (let i = 0; i < 128; i++) {
      s.update(0, 0.25, 0, dt);
    }
    expect(s.active).toBe(false);
    expect(s.intensity).toBeLessThan(0.05);
  });

  it("detects a vigorous shake after sustain period", () => {
    const s = new ShakeDetector({ windowSize: 64, threshold: 0.1, sustain: 5 });
    const dt = 0.004;
    // Simulate a sinusoidal shake at 6 Hz on the X axis
    const freq = 6;
    const amplitude = 0.5; // strong shake
    for (let i = 0; i < 200; i++) {
      const t = i * dt;
      const ax = Math.sin(2 * Math.PI * freq * t) * amplitude;
      s.update(ax, 0.25, 0, dt);
    }
    expect(s.active).toBe(true);
    expect(s.intensity).toBeGreaterThan(0.1);
  });

  it("does not activate on a brief transient jolt", () => {
    const s = new ShakeDetector({ windowSize: 64, threshold: 0.1, sustain: 15 });
    const dt = 0.004;
    // Fill with calm data
    for (let i = 0; i < 128; i++) {
      s.update(0, 0.25, 0, dt);
    }
    // Brief 5-frame jolt
    for (let i = 0; i < 5; i++) {
      s.update(0.8, 0.25, 0, dt);
    }
    // Should NOT be active (sustain not reached)
    expect(s.active).toBe(false);
  });

  it("identifies the dominant shake frequency (reversal rate = 2× fundamental)", () => {
    const s = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const dt = 0.004;
    const targetFundamental = 7; // Hz oscillation
    // Pump in enough samples to fill the window
    for (let i = 0; i < 256; i++) {
      const t = i * dt;
      const ax = Math.sin(2 * Math.PI * targetFundamental * t) * 0.4;
      s.update(ax, 0.25, 0, dt);
    }
    // fundamental should be close to target (within ±1 Hz)
    expect(s.fundamental).toBeGreaterThanOrEqual(targetFundamental - 1);
    expect(s.fundamental).toBeLessThanOrEqual(targetFundamental + 1);
    // frequency (reversal rate) should be 2× fundamental
    expect(s.frequency).toBeCloseTo(s.fundamental * 2, 4);
  });

  it("detects sub-1 Hz rocking", () => {
    const s = new ShakeDetector({ windowSize: 256, threshold: 0.05, sustain: 1 });
    const dt = 0.004;
    // Slow rocking at 0.5 Hz with large amplitude
    for (let i = 0; i < 512; i++) {
      const t = i * dt;
      const ax = Math.sin(2 * Math.PI * 0.5 * t) * 0.3;
      s.update(ax, 0.25, 0, dt);
    }
    // fundamental ≤ 1 Hz, frequency (reversal) ≤ 2 Hz
    expect(s.fundamental).toBeLessThanOrEqual(1);
    expect(s.fundamental).toBeGreaterThan(0);
    expect(s.frequency).toBeCloseTo(s.fundamental * 2, 4);
    expect(s.intensity).toBeGreaterThan(0);
  });

  it("distinguishes gentle rocking from aggressive shaking", () => {
    const gentle = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const aggressive = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const dt = 0.004;

    for (let i = 0; i < 256; i++) {
      const t = i * dt;
      // Gentle: 2 Hz, low amplitude
      gentle.update(Math.sin(2 * Math.PI * 2 * t) * 0.08, 0.25, 0, dt);
      // Aggressive: 7 Hz, high amplitude
      aggressive.update(Math.sin(2 * Math.PI * 7 * t) * 0.5, 0.25, 0, dt);
    }

    expect(aggressive.intensity).toBeGreaterThan(gentle.intensity);
    expect(aggressive.frequency).toBeGreaterThan(gentle.frequency);
  });

  it("resets to zero state", () => {
    const s = new ShakeDetector({ windowSize: 64, sustain: 1 });
    const dt = 0.004;
    // Build up some shake
    for (let i = 0; i < 128; i++) {
      s.update(Math.sin(i * 0.5) * 0.5, 0.25, 0, dt);
    }
    expect(s.intensity).toBeGreaterThan(0);

    s.reset();
    expect(s.active).toBe(false);
    expect(s.intensity).toBe(0);
    expect(s.frequency).toBe(0);
    expect(s.fundamental).toBe(0);
  });

  it("produces no results until half the window is filled", () => {
    const s = new ShakeDetector({ windowSize: 64, sustain: 1 });
    // Feed 31 samples (less than half of 64)
    for (let i = 0; i < 31; i++) {
      s.update(Math.sin(i) * 0.5, 0.25, 0, 0.004);
    }
    expect(s.intensity).toBe(0);
    expect(s.active).toBe(false);
  });

  it("respects custom threshold", () => {
    const low = new ShakeDetector({ windowSize: 64, threshold: 0.05, sustain: 1 });
    const high = new ShakeDetector({ windowSize: 64, threshold: 0.9, sustain: 1 });
    const dt = 0.004;

    for (let i = 0; i < 128; i++) {
      const t = i * dt;
      const ax = Math.sin(2 * Math.PI * 5 * t) * 0.4;
      low.update(ax, 0.25, 0, dt);
      high.update(ax, 0.25, 0, dt);
    }

    expect(low.active).toBe(true);
    expect(high.active).toBe(false);
    // Both should have the same intensity — threshold only affects .active
    expect(low.intensity).toBeCloseTo(high.intensity, 4);
  });

  it("handles multi-axis shaking", () => {
    const s = new ShakeDetector({ windowSize: 64, threshold: 0.1, sustain: 1 });
    const dt = 0.004;
    for (let i = 0; i < 128; i++) {
      const t = i * dt;
      const freq = 5;
      s.update(
        Math.sin(2 * Math.PI * freq * t) * 0.3,
        0.25 + Math.sin(2 * Math.PI * freq * t + 1) * 0.3,
        Math.sin(2 * Math.PI * freq * t + 2) * 0.3,
        dt,
      );
    }
    expect(s.active).toBe(true);
    expect(s.intensity).toBeGreaterThan(0.1);
  });

  it("deactivates after shaking stops (sustain drains)", () => {
    const sustain = 10;
    const s = new ShakeDetector({ windowSize: 64, threshold: 0.1, sustain });
    const dt = 0.004;

    // Shake to activate
    for (let i = 0; i < 200; i++) {
      s.update(Math.sin(i * 0.5) * 0.5, 0.25, 0, dt);
    }
    expect(s.active).toBe(true);

    // Stop shaking — feed calm data until deactivated
    let framesUntilInactive = 0;
    for (let i = 0; i < 300; i++) {
      s.update(0, 0.25, 0, dt);
      framesUntilInactive++;
      if (!s.active) break;
    }
    expect(s.active).toBe(false);
    // Should deactivate within a reasonable number of frames
    // (buffer needs to flush shake data + sustain drain)
    expect(framesUntilInactive).toBeLessThan(200);
  });

  it("reports fundamental at 0.25 Hz resolution", () => {
    const s = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const dt = 0.004;
    // Shake at 3.5 Hz fundamental
    for (let i = 0; i < 256; i++) {
      const t = i * dt;
      s.update(Math.sin(2 * Math.PI * 3.5 * t) * 0.4, 0.25, 0, dt);
    }
    expect(s.fundamental).toBeCloseTo(3.5, 0);
    // Reversal rate = 2× fundamental
    expect(s.frequency).toBeCloseTo(s.fundamental * 2, 4);
  });

  it("detects 0.25 Hz increments in fundamental", () => {
    const s = new ShakeDetector({ windowSize: 256, sustain: 1, freqStep: 0.25 });
    const dt = 0.004;
    // Shake at 4.75 Hz fundamental
    for (let i = 0; i < 512; i++) {
      const t = i * dt;
      s.update(Math.sin(2 * Math.PI * 4.75 * t) * 0.4, 0.25, 0, dt);
    }
    expect(s.fundamental).toBeCloseTo(4.75, 0);
    expect(s.frequency).toBeCloseTo(s.fundamental * 2, 4);
  });

  it("exposes the estimated input sample rate", () => {
    const s = new ShakeDetector({ windowSize: 64, sustain: 1 });
    // Feed samples at 250 Hz (dt = 0.004)
    for (let i = 0; i < 128; i++) {
      s.update(Math.sin(i * 0.5) * 0.3, 0.25, 0, 0.004);
    }
    expect(s.inputRate).toBeCloseTo(250, -1);
  });

  it("accepts custom frequency range and step", () => {
    const s = new ShakeDetector({
      windowSize: 128,
      sustain: 1,
      freqMin: 2,
      freqMax: 10,
      freqStep: 0.5,
    });
    const dt = 0.004;
    // Shake at 6 Hz fundamental
    for (let i = 0; i < 256; i++) {
      const t = i * dt;
      s.update(Math.sin(2 * Math.PI * 6 * t) * 0.4, 0.25, 0, dt);
    }
    // fundamental near 6, frequency (reversal) near 12
    expect(s.fundamental).toBeGreaterThanOrEqual(5);
    expect(s.fundamental).toBeLessThanOrEqual(7);
    expect(s.frequency).toBeCloseTo(s.fundamental * 2, 4);
  });

  it("exposes spectrum bins for visualization", () => {
    const s = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const dt = 0.004;
    for (let i = 0; i < 256; i++) {
      const t = i * dt;
      s.update(Math.sin(2 * Math.PI * 5 * t) * 0.4, 0.25, 0, dt);
    }
    const bins = s.spectrum;
    expect(bins.length).toBeGreaterThan(0);
    // Each bin should have freq and power
    expect(bins[0]).toHaveProperty("freq");
    expect(bins[0]).toHaveProperty("power");
    // The peak bin should be near 5 Hz
    const peak = bins.reduce((a, b) => (b.power > a.power ? b : a));
    expect(peak.freq).toBeGreaterThanOrEqual(4);
    expect(peak.freq).toBeLessThanOrEqual(6);
  });

  it("spectrum is empty when not shaking", () => {
    const s = new ShakeDetector({ windowSize: 64, sustain: 1 });
    for (let i = 0; i < 128; i++) {
      s.update(0, 0.25, 0, 0.004);
    }
    expect(s.spectrum.length).toBe(0);
  });

  it("windowSize setter resizes buffers and resets", () => {
    const s = new ShakeDetector({ windowSize: 128, sustain: 1 });
    const dt = 0.004;
    // Build up some state
    for (let i = 0; i < 200; i++) {
      s.update(Math.sin(i * 0.5) * 0.5, 0.25, 0, dt);
    }
    expect(s.intensity).toBeGreaterThan(0);

    // Resize
    s.windowSize = 64;
    expect(s.windowSize).toBe(64);
    expect(s.intensity).toBe(0);
    expect(s.frequency).toBe(0);
    expect(s.fundamental).toBe(0);
    expect(s.active).toBe(false);
  });
});
