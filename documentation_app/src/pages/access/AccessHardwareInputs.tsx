import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";

const AccessHardwareInputs: React.FC = () => (
  <FeaturePage
    title="Hardware Inputs"
    subtitle="Profile-independent physical inputs: 8 buttons, analog stick, center, PS, and profile."
  >
    <Prose>
      <p>
        The Access controller's raw hardware inputs report the physical state
        of every input regardless of the active profile. When you read{" "}
        <code>access.b1</code>, you always get the state of hardware button 1
        &mdash; even if the profile has mapped it to "Cross" or "L1".
      </p>
      <p>
        All hardware inputs are{" "}
        <Link to="/api/input"><code>Input&lt;T&gt;</code></Link> instances
        with the same event API as every other input in the library.
      </p>
    </Prose>

    <SectionHeading>Buttons (B1&ndash;B8)</SectionHeading>
    <Prose>
      <p>
        Eight <Link to="/api/momentary"><code>Momentary</code></Link>{" "}
        buttons. All eight are located on the main body of the controller.
        The four expansion ports provide an additional four inputs
        &mdash; see{" "}
        <Link to="/access/expansion-slots">Expansion Slots</Link> for
        details.
      </p>
    </Prose>
    <CodeBlock
      code={`// Listen to individual buttons
access.b1.on("press", () => console.log("B1 pressed"));
access.b4.on("release", () => console.log("B4 released"));

// Check state synchronously
if (access.b1.active && access.b2.active) {
  console.log("B1 + B2 combo");
}

// Iterate over all button presses
for await (const b1 of access.b1) {
  console.log("B1:", b1.state);
}`}
    />

    <SectionHeading>Center Button</SectionHeading>
    <Prose>
      <p>
        The center button sits in the middle of the controller between the
        customizable buttons. It's a <code>Momentary</code> input accessed
        via <code>access.center</code>.
      </p>
    </Prose>
    <CodeBlock
      code={`access.center.on("press", () => console.log("Center pressed"));`}
    />

    <SectionHeading>Analog Stick</SectionHeading>
    <Prose>
      <p>
        The Access controller has a single analog stick. It's
        an <Link to="/api/analog"><code>Analog</code></Link> input with X/Y
        axes (&minus;1 to +1) and a click button.
      </p>
      <p>
        This is the raw stick position &mdash; it reflects the physical
        hardware regardless of whether the active profile maps the stick to
        the left or right virtual stick. By default, the axis orientation
        assumes the stick is on the side of the controller closest to the
        user. For the profile-mapped stick positions, see{" "}
        <Link to="/access/profile-inputs">Profile Inputs</Link>.
      </p>
    </Prose>
    <CodeBlock
      code={`// Read stick position
console.log(access.stick.x.state, access.stick.y.state);

// Subscribe to stick movement
access.stick.on("change", (stick) => {
  console.log(\`X: \${stick.x.state.toFixed(2)}, Y: \${stick.y.state.toFixed(2)}\`);
});

// Stick click
access.stick.button.on("press", () => console.log("Stick clicked"));

// Use magnitude + direction for polar input
access.stick.on("change", (stick) => {
  if (stick.active) {
    console.log(\`Magnitude: \${stick.magnitude.toFixed(2)}\`);
    console.log(\`Direction: \${stick.direction.toFixed(1)} rad\`);
  }
});`}
    />

    <SectionHeading>System Buttons</SectionHeading>
    <Prose>
      <p>
        The PS and Profile buttons are always available and not remappable.
      </p>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>access.ps</code></td>
            <td>PlayStation button</td>
          </tr>
          <tr>
            <td><code>access.profile</code></td>
            <td>Profile cycle button &mdash; switches between profiles 1&ndash;3</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`access.ps.on("press", () => console.log("PS pressed"));
access.profile.on("press", () => console.log("Profile cycle"));`}
    />

    <SectionHeading>Profile ID</SectionHeading>
    <Prose>
      <p>
        The controller tracks which of its 3 hardware profiles is currently
        active. The profile ID (1&ndash;3) is available as a numeric input.
      </p>
    </Prose>
    <CodeBlock
      code={`// Read current profile
console.log("Active profile:", access.profileId.state); // 1, 2, or 3

// React to profile changes
access.profileId.on("change", (p) => {
  console.log("Switched to profile", p.state);
});`}
    />

    <HardwareNote>
      Pressing the Profile button physically on the controller cycles through
      profiles 1 &rarr; 2 &rarr; 3 &rarr; 1. The profile determines how
      hardware buttons map to DualSense-compatible inputs on the{" "}
      <Link to="/access/profile-inputs">profile-mapped</Link> layer.
    </HardwareNote>

    <SectionHeading>Battery</SectionHeading>
    <Prose>
      <p>
        Battery level and charging status work the same as on{" "}
        <Link to="/inputs/battery">DualSense</Link>. The level is
        peak-filtered over a 1-second window to smooth out noisy readings.
      </p>
    </Prose>
    <CodeBlock
      code={`access.battery.on("change", (bat) => {
  console.log(\`Battery: \${Math.round(bat.level.state * 100)}%\`);
  console.log("Status:", bat.status.state); // Charging, Discharging, Full
});`}
    />

    <SectionHeading>All Hardware Inputs</SectionHeading>
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
            <td><code>b1</code>&ndash;<code>b8</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>center</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>stick</code></td>
            <td><code>Analog</code></td>
            <td><code>x, y, button</code></td>
          </tr>
          <tr>
            <td><code>ps</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>profile</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
          <tr>
            <td><code>profileId</code></td>
            <td><code>ProfileId</code></td>
            <td><code>1 | 2 | 3</code></td>
          </tr>
          <tr>
            <td><code>battery</code></td>
            <td><code>Battery</code></td>
            <td><code>level, status</code></td>
          </tr>
          <tr>
            <td><code>connection</code></td>
            <td><code>Momentary</code></td>
            <td><code>boolean</code></td>
          </tr>
        </tbody>
      </table>
    </Prose>
  </FeaturePage>
);

export default AccessHardwareInputs;
