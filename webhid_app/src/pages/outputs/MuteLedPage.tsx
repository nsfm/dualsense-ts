import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { MuteLedControls } from "../../components/hud";

const MuteLedPage: React.FC = () => (
  <FeaturePage
    title="Mute LED"
    subtitle="Orange LED below the touchpad with multiple display modes."
  >
    <Prose>
      <p>
        The mute LED is the small orange light near the mute button. It can be
        overridden from its default behavior into four modes: on, pulsing, off,
        or auto (default firmware behavior).
      </p>
    </Prose>

    <DemoLabel>Live Demo — switch between mute LED modes</DemoLabel>
    <DemoArea>
      <MuteLedControls />
    </DemoArea>

    <SectionHeading>Setting the LED Mode</SectionHeading>
    <CodeBlock
      code={`// Override the mute LED
controller.mute.setLed("on");     // Solid orange
controller.mute.setLed("pulse");  // Pulsing orange
controller.mute.setLed("off");    // Force off

// Reset to default firmware behavior
controller.mute.resetLed();`}
    />

    <SectionHeading>Reading Mute Status</SectionHeading>
    <Prose>
      <p>
        The mute button itself is a standard <strong>Momentary</strong> input.
        You can read the current mute status and LED mode:
      </p>
    </Prose>
    <CodeBlock
      code={`// Mute button events
controller.mute.on("press", () => {
  console.log("Mute toggled");
});

// Current LED mode
console.log(controller.mute.ledMode);

// Current mute status
console.log(controller.mute.status);`}
    />
  </FeaturePage>
);

export default MuteLedPage;
