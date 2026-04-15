import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";

const AccessProfileInputs: React.FC = () => (
  <FeaturePage
    title="Profile Inputs"
    subtitle="DualSense-compatible mapped inputs driven by the controller's active profile."
  >
    <Prose>
      <p>
        The Access controller's firmware maps its{" "}
        <Link to="/access/hardware-inputs">hardware inputs</Link> to a
        virtual DualSense layout using the active profile (1&ndash;3). These
        profile-mapped inputs appear on every HID report alongside the raw
        hardware data, and they use the exact same property names as{" "}
        <Link to="/api/dualsense"><code>Dualsense</code></Link> &mdash; code
        written for a standard DualSense works on Access with no changes.
      </p>
    </Prose>

    <CodeBlock
      code={`// This code works identically on Dualsense and DualsenseAccess
controller.cross.on("press", () => jump());
controller.dpad.up.on("press", () => selectPrevious());`}
    />

    <SectionHeading>Sticks</SectionHeading>
    <Prose>
      <p>
        Two virtual analog sticks, each
        an <Link to="/api/analog"><code>Analog</code></Link> with X/Y axes
        (&minus;1 to +1) and a click button. The physical stick is always
        mapped to either the left or right virtual stick &mdash; the active
        profile determines which one.
      </p>
      <p>
        The profile also sets the stick orientation (left, right, top, or
        bottom of the Access body), which affects how the physical axis
        directions map to the virtual X/Y axes.
      </p>
    </Prose>
    <CodeBlock
      code={`// Mapped left stick
access.left.analog.on("change", (stick) => {
  console.log(stick.x.state, stick.y.state);
});

// L3 / R3 clicks
access.left.analog.button.on("press", () => console.log("L3"));
access.right.analog.button.on("press", () => console.log("R3"));`}
    />

    <SectionHeading>Triggers</SectionHeading>
    <Prose>
      <p>
        Mapped analog triggers with 0&ndash;1 pressure and a digital button.
        Each is a <Link to="/api/trigger"><code>Trigger</code></Link> input
        nested inside a <Link to="/api/unisense"><code>Unisense</code></Link> group.
      </p>
    </Prose>
    <CodeBlock
      code={`// Digital trigger button
access.left.trigger.button.on("press", () => {
  console.log("L2 clicked");
});

// Analog trigger pressure (expansion port accessories only)
access.right.trigger.on("change", (t) => {
  console.log("R2 pressure:", t.state); // 0 to 1
});`}
    />
    <HardwareNote>
      Analog trigger values can only be mapped from accessories connected
      via the expansion ports. The <code>trigger.button</code> inputs can
      be mapped from any Access hardware button. The Access controller has
      no adaptive trigger motors &mdash;{" "}
      <code>trigger.feedback</code> exists for API compatibility but
      setting effects has no physical result.
    </HardwareNote>

    <SectionHeading>Touchpad</SectionHeading>
    <HardwareNote>
      The Access controller has no physical touchpad surface. The{" "}
      <code>touchpad</code> property is
      a <Link to="/api/touchpad"><code>Touchpad</code></Link> instance for
      API compatibility, but contact positions (<code>left.x</code>,{" "}
      <code>left.y</code>, etc.) remain at their neutral values. Only the
      button is functional.
    </HardwareNote>
    <CodeBlock
      code={`access.touchpad.button.on("press", () => openMap());`}
    />

    <SectionHeading>Mute</SectionHeading>
    <Prose>
      <p>
        The mute button is not remappable &mdash; it always reports as
        the mute function regardless of profile configuration.
      </p>
    </Prose>
    <CodeBlock
      code={`access.mute.on("press", () => toggleMute());`}
    />

    <SectionHeading>Porting from Dualsense</SectionHeading>
    <Prose>
      <p>
        Code written for the standard <code>Dualsense</code> class works
        directly on <code>DualsenseAccess</code> with two caveats:
      </p>
      <ul>
        <li>
          <strong>No motion sensors</strong> &mdash; there is no gyroscope or
          accelerometer. Motion-dependent features should be gated on
          controller type.
        </li>
        <li>
          <strong>No haptic feedback</strong> &mdash; rumble, adaptive
          triggers, and audio are not available. Calling these APIs is safe
          (they're silently ignored) but has no physical effect.
        </li>
      </ul>
    </Prose>
    <CodeBlock
      code={`function setupControls(controller: Dualsense | DualsenseAccess) {
  // These work on both controllers
  controller.cross.on("press", () => jump());
  controller.left.analog.on("change", (s) => move(s.x.state, s.y.state));
  controller.lightbar.set({ r: 0, g: 255, b: 0 });

  // Guard motion-dependent features
  if ("gyroscope" in controller) {
    controller.gyroscope.on("change", (g) => aimAssist(g));
  }
}`}
    />

    <SectionHeading>All Profile-Mapped Inputs</SectionHeading>
    <Prose>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>left</code> / <code>right</code></td>
            <td><code>Unisense</code></td>
            <td>Stick + trigger + bumper</td>
          </tr>
          <tr>
            <td><code>dpad</code></td>
            <td><code>Dpad</code></td>
            <td>up, down, left, right</td>
          </tr>
          <tr>
            <td><code>cross</code>, <code>circle</code>, <code>square</code>, <code>triangle</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>touchpad</code></td>
            <td><code>Touchpad</code></td>
            <td>Button only</td>
          </tr>
          <tr>
            <td><code>options</code>, <code>create</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>mute</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code> (not remappable)</td>
          </tr>
        </tbody>
      </table>
    </Prose>
  </FeaturePage>
);

export default AccessProfileInputs;
