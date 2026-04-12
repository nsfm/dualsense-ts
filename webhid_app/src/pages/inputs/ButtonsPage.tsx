import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { FaceButtons, DpadVisualization, CreateButton, OptionsButton, PsButton, MuteButton, LeftShoulder, RightShoulder } from "../../components/hud";

const ButtonsPage: React.FC = () => (
  <FeaturePage
    title="Buttons"
    subtitle="Face buttons, D-Pad, and utility buttons."
  >
    <Prose>
      <p>
        The DualSense has 13 discrete buttons. Each is a <strong>Momentary</strong>{" "}
        input with boolean state — pressed (<code>true</code>) or released (
        <code>false</code>).
      </p>
    </Prose>

    <SectionHeading>Face Buttons</SectionHeading>
    <DemoLabel>Live Demo — press buttons on your controller</DemoLabel>
    <DemoArea>
      <FaceButtons />
    </DemoArea>
    <CodeBlock
      code={`// Face buttons
controller.triangle.on("press", () => console.log("Triangle"));
controller.circle.on("press", () => console.log("Circle"));
controller.cross.on("press", () => console.log("Cross"));
controller.square.on("press", () => console.log("Square"));

// Synchronous read
if (controller.cross.active) {
  console.log("Cross is held down");
}`}
    />

    <SectionHeading>D-Pad</SectionHeading>
    <DemoLabel>Live Demo</DemoLabel>
    <DemoArea>
      <DpadVisualization />
    </DemoArea>
    <Prose>
      <p>
        The D-Pad is a compound input with four directional sub-inputs.
        You can listen to the parent or individual directions.
      </p>
    </Prose>
    <CodeBlock
      code={`// Listen to all dpad changes
controller.dpad.on("change", (dpad) => {
  console.log(dpad.up.active, dpad.down.active,
              dpad.left.active, dpad.right.active);
});

// Or individual directions
controller.dpad.up.on("press", () => console.log("Up!"));`}
    />

    <SectionHeading>Utility Buttons</SectionHeading>
    <DemoLabel>Live Demo</DemoLabel>
    <DemoArea style={{ gap: 16 }}>
      <CreateButton />
      <OptionsButton />
      <PsButton />
      <MuteButton />
    </DemoArea>
    <CodeBlock
      code={`// PlayStation button
controller.ps.on("press", () => console.log("PS button"));

// Create and Options
controller.create.on("press", () => console.log("Create"));
controller.options.on("press", () => console.log("Options"));

// Mute button (also controls the mute LED)
controller.mute.on("press", () => console.log("Mute toggled"));`}
    />

    <SectionHeading>Bumpers & Shoulders</SectionHeading>
    <DemoLabel>Live Demo</DemoLabel>
    <DemoArea style={{ gap: 48 }}>
      <LeftShoulder />
      <RightShoulder />
    </DemoArea>
    <CodeBlock
      code={`controller.left.bumper.on("press", () => console.log("L1"));
controller.right.bumper.on("press", () => console.log("R1"));`}
    />
  </FeaturePage>
);

export default ButtonsPage;
