import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { LeftRumble, RightRumble } from "../../components/hud";

const RumblePage: React.FC = () => (
  <FeaturePage
    title="Rumble"
    subtitle="Independent left and right haptic motors with intensity control."
  >
    <Prose>
      <p>
        The DualSense has two independent rumble motors — a larger one on the
        left for heavy vibrations and a smaller one on the right for fine
        feedback. Each accepts an intensity value from 0 (off) to 1 (maximum).
      </p>
    </Prose>

    <DemoLabel>Live Demo — drag the sliders to feel the rumble</DemoLabel>
    <DemoArea style={{ gap: 48 }}>
      <LeftRumble />
      <RightRumble />
    </DemoArea>

    <SectionHeading>Basic Usage</SectionHeading>
    <CodeBlock
      code={`// Set both motors at once
controller.rumble(0.5);

// Stop all rumble
controller.rumble(0);`}
    />

    <SectionHeading>Independent Motor Control</SectionHeading>
    <CodeBlock
      code={`// Left motor (heavy / low frequency)
controller.left.rumble(1.0);

// Right motor (light / high frequency)
controller.right.rumble(0.3);

// Combine for different effects
controller.left.rumble(0.8);
controller.right.rumble(0.2);`}
    />

    <SectionHeading>Patterns</SectionHeading>
    <Prose>
      <p>
        You can build rumble patterns with timers. The library doesn't include a
        built-in pattern system, but it's straightforward to build:
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
