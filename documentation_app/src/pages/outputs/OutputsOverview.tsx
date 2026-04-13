import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";

const OutputsOverview: React.FC = () => (
  <FeaturePage
    title="Outputs"
    subtitle="Control the DualSense's haptics, adaptive triggers, lights, and audio."
  >
    <Prose>
      <p>
        Unlike inputs which are read-only, outputs let you send commands to
        the controller — rumble the motors, light up LEDs, create trigger
        resistance, and configure audio. All output state is managed by{" "}
        <code>dualsense-ts</code> and sent to the controller automatically
        via the HID polling loop.
      </p>
    </Prose>

    <HardwareNote>
      Output state is automatically restored if the controller disconnects
      and reconnects. You don't need to re-send commands after a
      reconnection.
    </HardwareNote>

    <SectionHeading>Rumble</SectionHeading>
    <Prose>
      <p>
        Two independent haptic motors with normalized intensity control
        (0–1). The left motor is stronger and lower-frequency; the right is
        lighter and higher-frequency.{" "}
        <Link to="/outputs/rumble">Full rumble controls.</Link>
      </p>
    </Prose>
    <CodeBlock
      code={`controller.rumble(0.5);         // both motors
controller.left.rumble(1.0);    // left only
controller.right.rumble(0.3);   // right only
controller.rumble(0);           // stop`}
    />

    <SectionHeading>Adaptive Triggers</SectionHeading>
    <Prose>
      <p>
        7 firmware-driven resistance modes with per-trigger configuration.
        Each effect accepts a typed config object with parameters like
        position, strength, and frequency.{" "}
        <Link to="/outputs/trigger-effects">
          Explore all trigger effects.
        </Link>
      </p>
    </Prose>
    <CodeBlock
      code={`import { TriggerEffect } from "dualsense-ts";

controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

controller.resetTriggerFeedback(); // reset both`}
    />
    <Prose>
      <p>Available effects:</p>
      <table>
        <thead>
          <tr>
            <th>Effect</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Off</code></td>
            <td>No resistance (default)</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#feedback"><code>Feedback</code></Link></td>
            <td>Zone-based continuous resistance</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#weapon"><code>Weapon</code></Link></td>
            <td>Resistance with snap release</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#bow"><code>Bow</code></Link></td>
            <td>Snap release with snap-back force</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#galloping"><code>Galloping</code></Link></td>
            <td>Rhythmic two-stroke oscillation</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#vibration"><code>Vibration</code></Link></td>
            <td>Zone-based oscillation with frequency</td>
          </tr>
          <tr>
            <td><Link to="/outputs/trigger-effects#machine"><code>Machine</code></Link></td>
            <td>Dual-amplitude vibration with period</td>
          </tr>
        </tbody>
      </table>
    </Prose>

    <SectionHeading>Lighting</SectionHeading>
    <Prose>
      <p>
        Three separate lighting systems, each independently controllable:
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
            <td><Link to="/outputs/lightbar"><code>lightbar</code></Link></td>
            <td>Full RGB LED strip along both sides of the touchpad</td>
          </tr>
          <tr>
            <td><Link to="/outputs/player-leds"><code>playerLeds</code></Link></td>
            <td>5 white LEDs with individual toggle and adjustable brightness</td>
          </tr>
          <tr>
            <td><Link to="/outputs/mute-led"><code>mute</code></Link></td>
            <td>Orange LED with on / pulse / off / firmware-auto modes</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`import { PlayerID, Brightness, MuteLedMode } from "dualsense-ts";

// RGB lightbar
controller.lightbar.set({ r: 0, g: 128, b: 255 });

// Player LEDs
controller.playerLeds.set(PlayerID.Player1);
controller.playerLeds.setBrightness(Brightness.High);

// Mute LED override
controller.mute.setLed(MuteLedMode.Pulse);
controller.mute.resetLed(); // return to firmware control`}
    />

    <SectionHeading>Audio</SectionHeading>
    <Prose>
      <p>
        Volume, routing, and mute controls for the built-in speaker,
        headphone jack, and microphone array. Also includes DSP test tones
        and a helper for locating audio devices.{" "}
        <Link to="/outputs/audio">Full audio controls.</Link>
      </p>
    </Prose>
    <CodeBlock
      code={`import { AudioOutput, MicSelect } from "dualsense-ts";

controller.audio.setSpeakerVolume(0.8);
controller.audio.setOutput(AudioOutput.Speaker);
controller.audio.setMicSelect(MicSelect.Internal);

// Per-output muting
controller.audio.muteSpeaker(true);
controller.audio.muteHeadphone(false);`}
    />

    <SectionHeading>Output API Pattern</SectionHeading>
    <Prose>
      <p>
        Outputs follow a consistent pattern: call a setter method to change
        state, read it back via a getter. The library batches your changes
        and sends them in the next HID output report — you never need to
        manage timing or report construction yourself.
      </p>
    </Prose>
    <CodeBlock
      code={`// Set → read back
controller.lightbar.set({ r: 255, g: 0, b: 0 });
controller.lightbar.color; // { r: 255, g: 0, b: 0 }

controller.left.rumble(0.7);
controller.left.rumble(); // 0.7 (no args = read)

controller.right.trigger.feedback.effect; // TriggerEffect.Off
controller.audio.speakerVolume;           // 0.8`}
    />
  </FeaturePage>
);

export default OutputsOverview;
