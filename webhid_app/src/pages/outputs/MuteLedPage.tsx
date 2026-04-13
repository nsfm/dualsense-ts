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
import { MuteLedDiagnostic } from "../../components/diagnostics/MuteLedDiagnostic";

const MuteLedPage: React.FC = () => (
  <FeaturePage
    title="Mute LED"
    subtitle="Orange LED below the touchpad with software-controllable modes."
  >
    <Prose>
      <p>
        The mute LED is the small orange indicator next to the mute button.
        By default it's managed by the controller firmware — lit when muted,
        off when unmuted. You can override this with{" "}
        <Link to="/api/mute"><code>mute.setLed()</code></Link> to force it
        on, pulsing, or off regardless of the actual mute state.
      </p>
    </Prose>

    <DemoLabel>Override the LED mode or press the mute button on your controller</DemoLabel>
    <MuteLedDiagnostic />

    <HardwareNote>
      Software overrides are temporary — pressing the physical mute button
      returns the LED to firmware control. Your override will need to be
      re-sent if you want to maintain it. The <code>ledMode</code> value
      may desync from the actual controller state after user input.
    </HardwareNote>

    <SectionHeading>Overriding the LED</SectionHeading>
    <Prose>
      <p>
        Use the{" "}
        <Link to="/api/enums"><code>MuteLedMode</code></Link> enum to set the
        LED to a specific mode. Call <code>resetLed()</code> to return control
        to the firmware.
      </p>
    </Prose>
    <CodeBlock
      code={`import { MuteLedMode } from "dualsense-ts";

controller.mute.setLed(MuteLedMode.On);    // solid orange
controller.mute.setLed(MuteLedMode.Pulse); // slow pulse
controller.mute.setLed(MuteLedMode.Off);   // force off

// Return control to firmware
controller.mute.resetLed();`}
    />

    <SectionHeading>Mute Status</SectionHeading>
    <Prose>
      <p>
        The actual microphone mute state is tracked by{" "}
        <code>mute.status</code>, a{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> input. This
        reflects whether the mic is muted at the hardware level — it updates
        when the user presses the physical button, independent of any LED
        overrides you've sent.
      </p>
    </Prose>
    <HardwareNote>
      If you've overridden the LED, the light no longer reflects the actual
      mute state. Always read <code>mute.status.state</code> for the true
      microphone on/off state, not the LED.
    </HardwareNote>
    <CodeBlock
      code={`// True when the microphone is muted
controller.mute.status.state; // boolean

// React to mute changes
controller.mute.status.on("change", ({ state }) => {
  console.log(state ? "Muted" : "Unmuted");
});`}
    />

    <SectionHeading>Mute Button</SectionHeading>
    <Prose>
      <p>
        The mute button itself is a standard{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> input. You
        can listen for physical presses independently of the mute state:
      </p>
    </Prose>
    <CodeBlock
      code={`controller.mute.on("press", () => {
  console.log("Mute button pressed");
});

controller.mute.on("release", () => {
  console.log("Mute button released");
});`}
    />
  </FeaturePage>
);

export default MuteLedPage;
