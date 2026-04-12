import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";

const OutputsOverview: React.FC = () => (
  <FeaturePage
    title="Outputs"
    subtitle="Control the DualSense's lights, haptics, adaptive triggers, and audio."
  >
    <Prose>
      <p>
        The DualSense controller has a rich set of output capabilities that go
        far beyond simple rumble. You can control RGB lighting, adaptive trigger
        resistance, individual player LEDs, and audio routing.
      </p>
    </Prose>

    <SectionHeading>Haptic Feedback</SectionHeading>
    <Prose>
      <p>
        Two independent rumble motors (left and right) with intensity control
        from 0 to 1.{" "}
        <Link to="/outputs/rumble">Learn more about rumble.</Link>
      </p>
    </Prose>
    <CodeBlock
      code={`// Both motors
controller.rumble(0.5);

// Independent control
controller.left.rumble(1.0);  // Full intensity
controller.right.rumble(0.3); // Light rumble

// Stop
controller.rumble(0);`}
    />

    <SectionHeading>Adaptive Triggers</SectionHeading>
    <Prose>
      <p>
        7 feedback effect types with configurable parameters per trigger.
        Simulate weapons, springs, rubber bands, and more.{" "}
        <Link to="/outputs/trigger-effects">Explore trigger effects.</Link>
      </p>
    </Prose>

    <SectionHeading>Lighting</SectionHeading>
    <Prose>
      <p>
        Three separate lighting systems on the controller:
      </p>
      <ul>
        <li>
          <Link to="/outputs/lightbar">Lightbar</Link> — Full RGB LED strip
        </li>
        <li>
          <Link to="/outputs/player-leds">Player LEDs</Link> — 5 white LEDs
          with individual control
        </li>
        <li>
          <Link to="/outputs/mute-led">Mute LED</Link> — Orange LED with
          on/pulse/off/auto modes
        </li>
      </ul>
    </Prose>

    <SectionHeading>Audio</SectionHeading>
    <Prose>
      <p>
        Control the controller's built-in speaker, connected headphones, and
        microphone. Set volumes, routing, and play test tones.{" "}
        <Link to="/outputs/audio">See audio controls.</Link>
      </p>
    </Prose>
  </FeaturePage>
);

export default OutputsOverview;
