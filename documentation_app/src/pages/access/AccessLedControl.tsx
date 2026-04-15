import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";

const AccessLedControl: React.FC = () => (
  <FeaturePage
    title="LED Control"
    subtitle="Four independent LED systems: lightbar, profile LEDs, player indicator, and status LED."
  >
    <Prose>
      <p>
        The Access controller has four LED systems, all independently
        controllable via the output API. Changes are batched and sent at
        30 Hz &mdash; if any system changes, all four are updated together
        in a single HID output report.
      </p>
      <p>
        State is automatically restored on reconnection, so you don't need
        to re-send LED commands after a disconnect/reconnect cycle.
      </p>
    </Prose>

    <SectionHeading>Lightbar</SectionHeading>
    <Prose>
      <p>
        An RGB LED strip, functionally identical to the{" "}
        <Link to="/outputs/lightbar">DualSense lightbar</Link>. Set it to
        any color with <code>access.lightbar.set()</code>. Defaults to blue.
      </p>
    </Prose>
    <CodeBlock
      code={`import { DualsenseAccess } from "dualsense-ts";

const access = new DualsenseAccess();

// Set color
access.lightbar.set({ r: 255, g: 0, b: 128 });

// Read current color
const { r, g, b } = access.lightbar.color;

// Fade effects (firmware-driven)
access.lightbar.fadeBlue();  // Fade to Sony blue and hold
access.lightbar.fadeOut();   // Fade to black, return to set color`}
    />

    <SectionHeading>Profile LEDs</SectionHeading>
    <Prose>
      <p>
        Three small LEDs that indicate the active profile. The firmware
        normally manages these, but you can override their animation mode.
      </p>
      <table>
        <thead>
          <tr>
            <th>Mode</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Off</code></td>
            <td><code>0</code></td>
            <td>All profile LEDs off</td>
          </tr>
          <tr>
            <td><code>On</code></td>
            <td><code>1</code></td>
            <td>Static &mdash; active profile LED lit (default)</td>
          </tr>
          <tr>
            <td><code>Fade</code></td>
            <td><code>2</code></td>
            <td>Breathing / fade animation</td>
          </tr>
          <tr>
            <td><code>Sweep</code></td>
            <td><code>3</code></td>
            <td>Sweeping animation across all 3 LEDs</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`import { AccessProfileLedMode } from "dualsense-ts";

// Set animation mode
access.profileLeds.set(AccessProfileLedMode.Fade);
access.profileLeds.set(AccessProfileLedMode.Sweep);

// Return to static
access.profileLeds.set(AccessProfileLedMode.On);

// Turn off
access.profileLeds.set(AccessProfileLedMode.Off);

// Read current mode
console.log(access.profileLeds.mode); // AccessProfileLedMode`}
    />
    <HardwareNote>
      The profile LEDs always indicate the active profile number (1, 2, or 3)
      when in <code>On</code> mode. The animation modes affect all 3 LEDs
      regardless of which profile is active.
    </HardwareNote>

    <SectionHeading>Player Indicator</SectionHeading>
    <Prose>
      <p>
        A 6-segment cross-shaped LED pattern, similar in purpose to the{" "}
        <Link to="/outputs/player-leds">DualSense player LEDs</Link> but
        with a different physical layout. Used to indicate player number in
        multiplayer games.
      </p>
      <table>
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Value</th>
            <th>Segments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Off</code></td>
            <td><code>0</code></td>
            <td>All off</td>
          </tr>
          <tr>
            <td><code>Player1</code></td>
            <td><code>1</code></td>
            <td>S (1 segment)</td>
          </tr>
          <tr>
            <td><code>Player2</code></td>
            <td><code>2</code></td>
            <td>S + N (2 segments)</td>
          </tr>
          <tr>
            <td><code>Player3</code></td>
            <td><code>3</code></td>
            <td>S + NE + NW (3 segments)</td>
          </tr>
          <tr>
            <td><code>Player4</code></td>
            <td><code>4</code></td>
            <td>N + S + E + W (cross, 4 segments)</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`import { AccessPlayerIndicator } from "dualsense-ts";

access.playerIndicator.set(AccessPlayerIndicator.Player1);
access.playerIndicator.set(AccessPlayerIndicator.Player3);
access.playerIndicator.set(AccessPlayerIndicator.Off);

// Read current pattern
console.log(access.playerIndicator.pattern);`}
    />

    <SectionHeading>Status LED</SectionHeading>
    <Prose>
      <p>
        A single white LED with simple on/off control. Defaults to on.
      </p>
    </Prose>
    <CodeBlock
      code={`// Turn off
access.statusLed.set(false);

// Turn on
access.statusLed.set(true);

// Read current state
console.log(access.statusLed.on); // boolean`}
    />

    <SectionHeading>Combined Example</SectionHeading>
    <Prose>
      <p>
        All four systems can be configured independently. Here's a complete
        example that sets up all LEDs in one go.
      </p>
    </Prose>
    <CodeBlock
      code={`import {
  DualsenseAccess,
  AccessProfileLedMode,
  AccessPlayerIndicator,
} from "dualsense-ts";

const access = new DualsenseAccess();

access.connection.on("press", () => {
  // Team color on lightbar
  access.lightbar.set({ r: 0, g: 200, b: 100 });

  // Sweep animation on profile LEDs
  access.profileLeds.set(AccessProfileLedMode.Sweep);

  // Show player number
  access.playerIndicator.set(AccessPlayerIndicator.Player2);

  // Status LED on
  access.statusLed.set(true);
});`}
    />

    <SectionHeading>Comparison with DualSense</SectionHeading>
    <Prose>
      <table>
        <thead>
          <tr>
            <th>LED System</th>
            <th>DualSense</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Lightbar</td>
            <td>RGB strip + fade effects</td>
            <td>RGB strip + fade effects (identical)</td>
          </tr>
          <tr>
            <td>Player LEDs</td>
            <td>5-segment bar, brightness, <code>playerLeds</code></td>
            <td>6-segment cross, pattern, <code>playerIndicator</code></td>
          </tr>
          <tr>
            <td>Profile LEDs</td>
            <td>&mdash;</td>
            <td>3 LEDs, 4 animation modes, <code>profileLeds</code></td>
          </tr>
          <tr>
            <td>Mute LED</td>
            <td>Orange LED (on / pulse / off)</td>
            <td>&mdash;</td>
          </tr>
          <tr>
            <td>Status LED</td>
            <td>&mdash;</td>
            <td>White LED (on / off), <code>statusLed</code></td>
          </tr>
        </tbody>
      </table>
    </Prose>

    <HardwareNote>
      Over Bluetooth, the Access controller requires all LED data to be sent
      in a combined output report. The library handles this automatically
      &mdash; when any LED system changes, all four are included in the next
      report.
    </HardwareNote>
  </FeaturePage>
);

export default AccessLedControl;
