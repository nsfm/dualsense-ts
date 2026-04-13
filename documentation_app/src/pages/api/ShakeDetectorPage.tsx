import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const ShakeDetectorPage: React.FC = () => (
  <ApiPage
    name="ShakeDetector"
    description="Shake detector with frequency-band energy analysis using the Goertzel algorithm. Detects shake intensity, frequency, and active state with configurable sensitivity."
    source="src/motion/shake.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "boolean", description: "Whether the controller is currently being shaken. Uses a sustain counter to debounce transient jolts." },
        { name: "intensity", type: "number", description: "Shake intensity from 0 (still) to 1 (violent shake). Based on RMS acceleration magnitude deviation." },
        { name: "frequency", type: "number", description: "Dominant shake frequency in Hz as a reversal rate — how many direction changes per second (2x fundamental). 0 when not shaking." },
        { name: "fundamental", type: "number", description: "Fundamental oscillation frequency in Hz — one complete back-and-forth cycle. Equal to frequency / 2. 0 when not shaking." },
        { name: "threshold", type: "number", description: "Intensity threshold for active (read/write). Default 0.15." },
        { name: "windowSize", type: "number", description: "Number of samples in the analysis window (read/write). Changing this resets state. Default 256." },
        { name: "inputRate", type: "number", description: "Estimated sample rate in Hz, derived from the time delta between samples. Useful for diagnostics.", readonly: true },
        { name: "spectrum", type: "FrequencyBin[]", description: "Current frequency spectrum — weighted power at each probed bin. Updated every frame when intensity is above half the threshold. Useful for visualization.", readonly: true },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "reset()", type: "void", description: "Reset all state to zero. Called automatically on disconnect." },
      ]}
    />

    <SectionHeading>Constructor</SectionHeading>
    <Prose>
      <p>
        Accepts an optional <code>ShakeDetectorParams</code> object.
        Normally you don't construct this yourself — it's created automatically
        by the <code>Dualsense</code> class and accessible via{" "}
        <code>controller.shake</code>.
      </p>
    </Prose>
    <PropertiesTable
      properties={[
        { name: "threshold", type: "number", description: "Intensity (0–1) above which active becomes true. Default 0.15." },
        { name: "windowSize", type: "number", description: "Number of samples in the analysis window. Larger = more precise frequency but slower acquisition. Default 256 (~1s at 250 Hz, ~3s at 84 Hz in browser)." },
        { name: "sustain", type: "number", description: "Number of consecutive above-threshold frames required before active becomes true (and below-threshold to deactivate). Default 15 (~60ms at 250 Hz)." },
        { name: "freqStep", type: "number", description: "Frequency bin resolution in Hz. Smaller = finer but more bins to compute. Default 0.25." },
        { name: "freqMin", type: "number", description: "Minimum detectable frequency in Hz. Default 0.25." },
        { name: "freqMax", type: "number", description: "Maximum detectable frequency in Hz. Default 15." },
      ]}
    />

    <SectionHeading>Frequency vs. Fundamental</SectionHeading>
    <Prose>
      <p>
        <code>frequency</code> reports the <strong>reversal rate</strong> — how
        many times per second the controller changes direction. This matches the
        intuitive "how fast am I shaking?" mental model.{" "}
        <code>fundamental</code> reports the true oscillation frequency — one
        complete back-and-forth cycle is one period.
      </p>
      <p>
        For example, moving the controller left-right-left 3 times per second
        produces 6 direction reversals: <code>frequency = 6</code>,{" "}
        <code>fundamental = 3</code>.
      </p>
    </Prose>

    <SectionHeading>Spectrum</SectionHeading>
    <Prose>
      <p>
        The <code>spectrum</code> property exposes the raw frequency bin powers,
        useful for building custom visualizations or frequency analysis UI.
        Each bin is a <code>FrequencyBin</code> with <code>freq</code> (Hz) and{" "}
        <code>power</code> (arbitrary units, relative within the array).
      </p>
    </Prose>
    <CodeBlock
      code={`// Visualize the spectrum
for (const bin of controller.shake.spectrum) {
  drawBar(bin.freq, bin.power);
}`}
    />

    <SectionHeading>Window Size Tradeoff</SectionHeading>
    <Prose>
      <p>
        Larger windows give finer frequency resolution but take longer to
        acquire enough data. At 84 Hz (typical browser delivery rate):
      </p>
      <ul>
        <li><strong>64 samples</strong> — ~0.8s, fast response, coarse frequency</li>
        <li><strong>128 samples</strong> — ~1.5s, balanced</li>
        <li><strong>256 samples</strong> — ~3s, good resolution (default)</li>
        <li><strong>512 samples</strong> — ~6s, precise frequency analysis</li>
      </ul>
      <p>
        The <code>windowSize</code> can be changed at runtime, which resets the
        detector state.
      </p>
    </Prose>

    <SectionHeading>Examples</SectionHeading>
    <CodeBlock
      code={`// Simple shake detection
if (controller.shake.active) {
  triggerEffect();
}

// Use intensity for proportional response
const rumbleStrength = controller.shake.intensity;
controller.left.rumble = rumbleStrength;

// Tune sensitivity at runtime
controller.shake.threshold = 0.05; // more sensitive
controller.shake.windowSize = 128; // faster response

// Frequency-based mechanics (Death Stranding-style)
if (controller.shake.active && controller.shake.frequency > 4) {
  baby.soothe(controller.shake.intensity);
}`}
    />
  </ApiPage>
);

export default ShakeDetectorPage;
