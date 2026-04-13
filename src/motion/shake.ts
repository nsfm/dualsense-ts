/**
 * Shake detector with frequency-band energy analysis.
 *
 * Maintains circular buffers of per-axis acceleration samples. Shake
 * intensity is computed via RMS of the acceleration magnitude deviation
 * from its mean (high-pass to remove gravity). The dominant shake
 * frequency is identified using the Goertzel algorithm — a single-bin
 * DFT that's far cheaper than a full FFT — applied to the first-
 * difference of individual axis signals:
 *
 *   - Per-axis preserves the fundamental frequency (magnitude would
 *     full-wave-rectify the signal, doubling the apparent frequency).
 *   - First-difference acts as a high-pass filter, removing DC (gravity)
 *     and low-frequency drift from arm movement. Its gain is proportional
 *     to frequency, so the Goertzel output naturally favors oscillatory
 *     shake signals over slow drift — no ad-hoc weighting needed.
 *
 * A 1/freq compensation is applied so the net effective weighting is
 * proportional to freq (diff-filter gain² ∝ freq², divided by freq),
 * giving moderate preference to actual shake frequencies without
 * completely suppressing sub-1 Hz rocking.
 *
 * `.frequency` reports the **reversal rate** (2× fundamental) — how many
 * direction changes per second. This matches the intuitive "how fast am
 * I shaking it?" mental model. `.fundamental` reports the true oscillation
 * frequency (one full back-and-forth cycle).
 *
 * The active flag uses a sustain counter to require several consecutive
 * frames above threshold before triggering, preventing transient jolts
 * from registering as shakes.
 */

/** A single frequency bin with its associated power level. */
export interface FrequencyBin {
  /** Frequency in Hz. */
  freq: number;
  /** Weighted power (arbitrary units, relative within the array). */
  power: number;
}

/** Configuration for the shake detector. */
export interface ShakeDetectorParams {
  /** Intensity (0–1) above which `.active` becomes true. Default 0.15. */
  threshold?: number;
  /** Number of samples in the analysis window. Default 256 (~1s at 250 Hz, ~3s at 84 Hz in browser). */
  windowSize?: number;
  /**
   * Number of consecutive above-threshold frames required before `.active`
   * becomes true. Also the number of below-threshold frames required to
   * deactivate. Default 15 (~60 ms at 250 Hz).
   */
  sustain?: number;
  /** Frequency bin resolution in Hz. Default 0.25. Smaller = finer but more bins to compute. */
  freqStep?: number;
  /** Minimum detectable frequency in Hz. Default 0.25. */
  freqMin?: number;
  /** Maximum detectable frequency in Hz. Default 15. */
  freqMax?: number;
}

export class ShakeDetector {
  /** Whether the controller is currently being shaken (sustained). */
  active = false;

  /** Shake intensity from 0 (still) to 1 (violent shake). */
  intensity = 0;

  /**
   * Dominant shake frequency in Hz as a **reversal rate** — how many
   * direction changes per second (2× the fundamental oscillation
   * frequency). 0 when not shaking.
   */
  frequency = 0;

  /**
   * Fundamental oscillation frequency in Hz — one complete back-and-forth
   * cycle. Equal to `frequency / 2`. 0 when not shaking.
   */
  fundamental = 0;

  /** Intensity threshold for `active`. */
  threshold: number;

  /** Estimated sample rate in Hz (derived from dt). Useful for diagnostics. */
  get inputRate(): number {
    return this._sampleRate;
  }

  /** Number of samples in the analysis window. Can be changed at runtime (resets state). */
  get windowSize(): number {
    return this.bufX.length;
  }
  set windowSize(n: number) {
    if (n === this.bufX.length) return;
    this.bufX = new Float64Array(n);
    this.bufY = new Float64Array(n);
    this.bufZ = new Float64Array(n);
    this.head = 0;
    this.filled = 0;
    this.smoothedFreq = 0;
    this.sustainCounter = 0;
    this.active = false;
    this.intensity = 0;
    this.frequency = 0;
    this.fundamental = 0;
    this._bins = [];
  }

  /**
   * Current frequency spectrum — weighted power at each probed bin.
   * Updated every frame when intensity is above half the threshold.
   * Useful for visualization/diagnostics.
   */
  get spectrum(): readonly FrequencyBin[] {
    return this._bins;
  }

  // ---- internals ----
  private bufX: Float64Array;
  private bufY: Float64Array;
  private bufZ: Float64Array;
  private head = 0;
  private filled = 0;
  private _sampleRate = 250; // estimated, updated from dt

  /** Sustain counter for debounce — counts up when above threshold, down when below. */
  private sustainCounter = 0;
  private readonly sustainRequired: number;

  /** EMA-smoothed frequency for stable readout. */
  private smoothedFreq = 0;

  /** Frequency bins to probe, built from constructor params. */
  private readonly freqBins: number[];

  /** Bin step size, used for snapping the EMA output. */
  private readonly freqStep: number;

  /** Latest computed bin powers. */
  private _bins: FrequencyBin[] = [];

  /**
   * Scale factor: maps RMS of our [-1, 1] calibrated accel deviation
   * to a 0–1 intensity. A vigorous shake produces magnitude-RMS of
   * ~0.3–0.5 in our units; this maps that to ~0.6–1.0 intensity.
   */
  private static readonly INTENSITY_SCALE = 2;

  constructor(params?: ShakeDetectorParams) {
    this.threshold = params?.threshold ?? 0.15;
    this.sustainRequired = params?.sustain ?? 15;
    const windowSize = params?.windowSize ?? 256;
    this.bufX = new Float64Array(windowSize);
    this.bufY = new Float64Array(windowSize);
    this.bufZ = new Float64Array(windowSize);

    this.freqStep = params?.freqStep ?? 0.25;
    const freqMin = params?.freqMin ?? 0.25;
    const freqMax = params?.freqMax ?? 15;
    this.freqBins = [];
    for (let f = freqMin; f <= freqMax + 1e-9; f += this.freqStep) {
      this.freqBins.push(Math.round(f * 1000) / 1000); // avoid float drift
    }
  }

  /** Reset all state (call on disconnect). */
  reset(): void {
    this.bufX.fill(0);
    this.bufY.fill(0);
    this.bufZ.fill(0);
    this.head = 0;
    this.filled = 0;
    this.intensity = 0;
    this.frequency = 0;
    this.fundamental = 0;
    this.active = false;
    this._sampleRate = 250;
    this.sustainCounter = 0;
    this.smoothedFreq = 0;
    this._bins = [];
  }

  /**
   * Feed one accelerometer sample.
   *
   * @param ax  Calibrated accel X ([-1, 1])
   * @param ay  Calibrated accel Y ([-1, 1])
   * @param az  Calibrated accel Z ([-1, 1])
   * @param dt  Time delta in seconds since last sample
   */
  update(ax: number, ay: number, az: number, dt: number): void {
    // Update sample rate estimate (exponential moving average)
    if (dt > 0 && dt < 0.1) {
      const instantRate = 1 / dt;
      this._sampleRate += 0.1 * (instantRate - this._sampleRate);
    }

    // Store per-axis acceleration in circular buffers
    const len = this.bufX.length;
    this.bufX[this.head] = ax;
    this.bufY[this.head] = ay;
    this.bufZ[this.head] = az;
    this.head = (this.head + 1) % len;
    if (this.filled < len) this.filled++;

    // Need at least half a window to produce meaningful results
    if (this.filled < len / 2) return;

    // ---- Intensity: RMS of magnitude deviation from mean ----
    const n = this.filled;
    const start = n < len ? 0 : this.head;

    // Compute acceleration magnitudes and their mean
    let magSum = 0;
    for (let i = 0; i < n; i++) {
      const idx = (start + i) % len;
      const x = this.bufX[idx], y = this.bufY[idx], z = this.bufZ[idx];
      magSum += Math.sqrt(x * x + y * y + z * z);
    }
    const magMean = magSum / n;

    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      const idx = (start + i) % len;
      const x = this.bufX[idx], y = this.bufY[idx], z = this.bufZ[idx];
      const d = Math.sqrt(x * x + y * y + z * z) - magMean;
      sumSq += d * d;
    }
    const rms = Math.sqrt(sumSq / n);
    this.intensity = Math.min(1, rms * ShakeDetector.INTENSITY_SCALE);

    // ---- Frequency: per-axis Goertzel on first-difference signal ----
    if (this.intensity > this.threshold * 0.5) {
      let peakPower = 0;
      let peakFreq = 0;

      this._bins = new Array<FrequencyBin>(this.freqBins.length);
      for (let b = 0; b < this.freqBins.length; b++) {
        const freq = this.freqBins[b];
        const px = this.goertzel(freq, this.bufX);
        const py = this.goertzel(freq, this.bufY);
        const pz = this.goertzel(freq, this.bufZ);
        // The first-difference filter has gain ∝ freq², so raw Goertzel
        // power is ∝ freq² × signal_power. Divide by freq to get net
        // weighting ∝ freq — moderate preference for shake frequencies
        // without killing sub-1 Hz rocking.
        const power = Math.max(px, py, pz) / freq;
        this._bins[b] = { freq, power };
        if (power > peakPower) {
          peakPower = power;
          peakFreq = freq;
        }
      }
      // EMA-smooth the frequency reading for stability.
      // α = 0.2 gives ~5-frame smoothing at 250 Hz.
      const alpha = 0.2;
      if (this.smoothedFreq === 0) {
        this.smoothedFreq = peakFreq;
      } else {
        this.smoothedFreq += alpha * (peakFreq - this.smoothedFreq);
      }
      // Snap to nearest bin step for clean readout
      const snapped =
        Math.round(this.smoothedFreq / this.freqStep) * this.freqStep;
      this.fundamental = snapped;
      this.frequency = snapped * 2; // reversal rate
    } else {
      this.smoothedFreq = 0;
      this.frequency = 0;
      this.fundamental = 0;
      this._bins = [];
    }

    // ---- Sustain: require consecutive frames to activate/deactivate ----
    if (this.intensity > this.threshold) {
      this.sustainCounter = Math.min(this.sustainCounter + 1, this.sustainRequired * 2);
    } else {
      this.sustainCounter = Math.max(this.sustainCounter - 1, 0);
    }
    this.active = this.sustainCounter >= this.sustainRequired;
  }

  /**
   * Goertzel algorithm: compute power at a single target frequency.
   *
   * Operates on the first-difference of the filled portion of a circular
   * buffer. The first-difference (x[n] - x[n-1]) acts as a high-pass
   * filter that removes DC (gravity) and low-frequency arm drift, with
   * gain proportional to frequency.
   */
  private goertzel(targetFreq: number, buf: Float64Array): number {
    const N = this.filled;
    const k = (targetFreq * N) / this._sampleRate;
    const w = (2 * Math.PI * k) / N;
    const coeff = 2 * Math.cos(w);

    let s1 = 0;
    let s2 = 0;

    const start = this.filled < buf.length ? 0 : this.head;
    let prevSample = buf[start % buf.length];

    for (let i = 0; i < N; i++) {
      const idx = (start + i) % buf.length;
      const raw = buf[idx];
      const x = raw - prevSample; // first-difference high-pass
      prevSample = raw;
      const s0 = x + coeff * s1 - s2;
      s2 = s1;
      s1 = s0;
    }

    return s1 * s1 + s2 * s2 - coeff * s1 * s2;
  }
}
