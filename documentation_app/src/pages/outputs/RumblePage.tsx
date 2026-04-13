import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoLabel,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";
import { RumbleDiagnostic } from "../../components/diagnostics/RumbleDiagnostic";

const RumblePage: React.FC = () => (
  <FeaturePage
    title="Rumble"
    subtitle="Independent left and right haptic motors with intensity control."
  >
    <Prose>
      <p>
        The DualSense has two independent rumble motors — a larger one on the
        left for low-frequency vibrations and a smaller one on the right for
        high-frequency feedback. Each accepts an intensity from 0 (off) to 1
        (maximum). Use{" "}
        <code>controller.rumble()</code> to set both at once, or control them
        independently via{" "}
        <Link to="/api/unisense"><code>controller.left</code></Link> and{" "}
        <code>controller.right</code>.
      </p>
    </Prose>

    <DemoLabel>Drag the sliders to feel the rumble</DemoLabel>
    <RumbleDiagnostic />

    <HardwareNote>
      The left motor is significantly stronger than the right. For a
      perceptually centered rumble, set the left motor to roughly 70% of
      the right motor's intensity.
    </HardwareNote>

    <SectionHeading>Basic Usage</SectionHeading>
    <Prose>
      <p>
        The convenience method <code>controller.rumble()</code> sets both
        motors to the same intensity. Pass a number (0–1) or a boolean:
      </p>
    </Prose>
    <CodeBlock
      code={`// Set both motors at once
controller.rumble(0.5);

// Boolean shorthand
controller.rumble(true);   // 100%
controller.rumble(false);  // stop`}
    />
    <HardwareNote>
      The controller firmware automatically stops rumble after ~5 seconds
      of inactivity. While <code>dualsense-ts</code> is connected, it
      periodically resends the rumble command to keep the motors running.
    </HardwareNote>

    <SectionHeading>Independent Motor Control</SectionHeading>
    <Prose>
      <p>
        For finer control, set each motor separately. You can also read
        the current intensity by calling the method with no arguments:
      </p>
    </Prose>
    <CodeBlock
      code={`// Left motor (heavy / low frequency)
controller.left.rumble(1.0);

// Right motor (light / high frequency)
controller.right.rumble(0.3);

// Read current intensity (call with no arguments)
controller.left.rumble();  // 1
controller.right.rumble(); // 0.3

// Stop all rumble
controller.rumble(0);`}
    />
    <HardwareNote>
      Rumble state is restored automatically if the controller disconnects
      and reconnects — no handling required on your end.
    </HardwareNote>

    <SectionHeading>Trigger Reactive Rumble</SectionHeading>
    <Prose>
      <p>
        Wire rumble intensity to any input. For example, map the{" "}
        <Link to="/inputs/triggers">trigger pressure</Link> directly to
        the corresponding motor. Try this now with the{" "}
        <strong>Trigger Reactive</strong> button above.
      </p>
    </Prose>
    <CodeBlock
      code={`// Rumble follows trigger pressure
controller.right.trigger.on("change", (trigger) => {
  controller.right.rumble(trigger.state);
});

controller.left.trigger.on("change", (trigger) => {
  controller.left.rumble(trigger.state);
});`}
    />

    <SectionHeading>Patterns</SectionHeading>
    <Prose>
      <p>
        The library doesn't include a built-in pattern system, but it's
        straightforward to build one with timers. Hit the{" "}
        <strong>Pulse Pattern</strong> button above to try this example:
      </p>
    </Prose>
    <CodeBlock
      code={`async function pulse(count: number, ms: number) {
  for (let i = 0; i < count; i++) {
    controller.rumble(0.6);
    await new Promise((r) => setTimeout(r, ms));
    controller.rumble(0);
    await new Promise((r) => setTimeout(r, ms));
  }
}`}
    />

  </FeaturePage>
);

export default RumblePage;
