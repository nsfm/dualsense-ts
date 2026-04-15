import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";

const AccessOverview: React.FC = () => (
  <FeaturePage
    title="DualSense Access"
    subtitle="Sony's modular accessibility controller."
  >
    <Prose>
      <p>
        The <code>DualsenseAccess</code> class provides full support for the
        DualSense Access controller over USB and Bluetooth. It exposes two
        layers of input data: the raw{" "}
        <Link to="/access/hardware-inputs">hardware inputs</Link> (8 buttons,
        analog stick, center button) and the{" "}
        <Link to="/access/profile-inputs">profile-mapped inputs</Link> that
        mirror the standard DualSense layout based on the controller's active
        profile.
      </p>
    </Prose>

    <CodeBlock
      code={`import { DualsenseAccess } from "dualsense-ts";

const access = new DualsenseAccess();

// Raw hardware inputs
access.b1.on("press", () => console.log("Button 1"));
access.stick.on("change", (s) => console.log(s.x.state, s.y.state));

// Profile-mapped inputs (same API as Dualsense)
access.cross.on("press", () => console.log("Cross"));
access.left.trigger.on("change", (t) => console.log(t.state));

// LED control
access.lightbar.set({ r: 255, g: 0, b: 128 });`}
    />

    <SectionHeading>DualSense vs. DualSense Access</SectionHeading>
    <Prose>
      <p>
        The Access controller shares the DualSense HID protocol but has a
        different physical layout and additional features. The table below
        summarizes the key differences.
      </p>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>DualSense</th>
            <th>DualSense Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Class</td>
            <td>
              <code>Dualsense</code>
            </td>
            <td>
              <code>DualsenseAccess</code>
            </td>
          </tr>
          <tr>
            <td>Face buttons</td>
            <td>Fixed (cross, circle, square, triangle)</td>
            <td>Profile-mapped from hardware buttons</td>
          </tr>
          <tr>
            <td>D-pad</td>
            <td>Physical directional pad</td>
            <td>Profile-mapped</td>
          </tr>
          <tr>
            <td>Analog sticks</td>
            <td>2 thumbsticks (left, right)</td>
            <td>1 raw stick + 2 profile-mapped sticks</td>
          </tr>
          <tr>
            <td>Triggers</td>
            <td>L2 / R2 with analog pressure</td>
            <td>Profile-mapped (expansion ports only)</td>
          </tr>
          <tr>
            <td>Bumpers</td>
            <td>L1 / R1</td>
            <td>Profile-mapped</td>
          </tr>
          <tr>
            <td>Hardware buttons</td>
            <td>&mdash;</td>
            <td>B1&ndash;B8 + Center (profile-independent)</td>
          </tr>
          <tr>
            <td>Profiles</td>
            <td>&mdash;</td>
            <td>3 hardware profiles with active ID tracking</td>
          </tr>
          <tr>
            <td>Touchpad</td>
            <td>Multi-touch surface with 2 contact points</td>
            <td>Button only (no touch surface)</td>
          </tr>
          <tr>
            <td>Motion sensors</td>
            <td>6-axis IMU (gyroscope + accelerometer)</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Rumble motors</td>
            <td>Left + right haptic motors</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Adaptive triggers</td>
            <td>7 feedback effects per trigger</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Speaker / mic</td>
            <td>Built-in speaker, mic array, headphone jack</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Lightbar</td>
            <td>RGB LED strip</td>
            <td>RGB LED strip</td>
          </tr>
          <tr>
            <td>Player LEDs</td>
            <td>5-segment bar, brightness control</td>
            <td>6-segment cross pattern</td>
          </tr>
          <tr>
            <td>Profile LEDs</td>
            <td>&mdash;</td>
            <td>3 LEDs with Off / On / Fade / Sweep modes</td>
          </tr>
          <tr>
            <td>Mute LED</td>
            <td>Orange LED (on / pulse / off)</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Status LED</td>
            <td>&mdash;</td>
            <td>White LED (on / off)</td>
          </tr>
          <tr>
            <td>Expansion slots</td>
            <td>&mdash;</td>
            <td>4 expansion button slots (coming soon)</td>
          </tr>
          <tr>
            <td>USB / Bluetooth</td>
            <td>Both</td>
            <td>Both</td>
          </tr>
        </tbody>
      </table>
    </Prose>

    <SectionHeading>Two Layers of Input</SectionHeading>
    <Prose>
      <p>
        The Access controller reports data in two parallel streams within every
        HID report:
      </p>
      <ul>
        <li>
          <strong>Raw hardware inputs</strong> &mdash; the physical state of the
          8 customizable buttons, center button, analog stick, PS button, and
          profile cycle button. These are always the same regardless of which
          profile is active.{" "}
          <Link to="/access/hardware-inputs">Read more.</Link>
        </li>
        <li>
          <strong>Profile-mapped inputs</strong> &mdash; the controller's
          firmware maps raw inputs to a virtual DualSense layout using the
          active profile configuration. This includes sticks, triggers, bumpers,
          face buttons, D-pad, and system buttons.{" "}
          <Link to="/access/profile-inputs">Read more.</Link>
        </li>
      </ul>
      <p>
        Both layers update simultaneously on every report. Your application can
        use either or both depending on its needs.
      </p>
    </Prose>
    <CodeBlock
      code={`// Raw: always B1 regardless of profile
access.b1.on("press", () => console.log("Hardware button 1"));

// Mapped: whatever B1 is assigned to in the active profile
access.cross.on("press", () => console.log("Cross (mapped)"));

// Track which profile is active
access.profileId.on("change", (p) => console.log("Profile:", p.state));`}
    />

    <SectionHeading>LED Systems</SectionHeading>
    <Prose>
      <p>
        The Access controller has four independent LED systems, all controllable
        via the output API: <Link to="/access/led-control">full details.</Link>
      </p>
      <table>
        <thead>
          <tr>
            <th>System</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>lightbar</code>
            </td>
            <td>RGB LED strip &mdash; same as DualSense</td>
          </tr>
          <tr>
            <td>
              <code>profileLeds</code>
            </td>
            <td>3 LEDs indicating active profile, with animation modes</td>
          </tr>
          <tr>
            <td>
              <code>playerIndicator</code>
            </td>
            <td>6-segment cross-shaped LED pattern</td>
          </tr>
          <tr>
            <td>
              <code>statusLed</code>
            </td>
            <td>White LED with on/off control</td>
          </tr>
        </tbody>
      </table>
    </Prose>

    <HardwareNote>
      The Access controller has no rumble motors, adaptive triggers, speaker, or
      microphone. Properties like <code>left.trigger.feedback</code> exist for
      API compatibility but are inert &mdash; setting them has no physical
      effect.
    </HardwareNote>

    <SectionHeading>Quick Start</SectionHeading>
    <Prose>
      <p>
        Usage follows the same patterns as{" "}
        <Link to="/getting-started">
          <code>Dualsense</code>
        </Link>
        . The controller auto-connects over USB or Bluetooth in Node.js, or
        waits for a WebHID permission grant in the browser.
      </p>
    </Prose>
    <CodeBlock
      code={`import { DualsenseAccess } from "dualsense-ts";

const access = new DualsenseAccess();

// Wait for connection
access.connection.on("press", () => {
  console.log("Access connected!", access.wireless ? "BT" : "USB");
  console.log("Profile:", access.profileId.state);
  console.log("Serial:", access.serialNumber);
});

// Use profile-mapped inputs like a standard Dualsense
for await (const left of access.left) {
  console.log("L-stick:", left.analog.x.state, left.analog.y.state);
  console.log("L2:", left.trigger.state);
  console.log("L1:", left.bumper.active);
}`}
    />
  </FeaturePage>
);

export default AccessOverview;
