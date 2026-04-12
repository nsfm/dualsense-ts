import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { Reticle, RightStick } from "../../components/hud";

const AnalogPage: React.FC = () => (
  <FeaturePage
    title="Analog Sticks"
    subtitle="Two thumbsticks with X/Y axes, magnitude, direction, and click."
  >
    <Prose>
      <p>
        Each analog stick is an <strong>Analog</strong> input containing two{" "}
        <strong>Axis</strong> sub-inputs (<code>.x</code> and <code>.y</code>),
        a click <strong>Momentary</strong> button, and computed{" "}
        <code>magnitude</code> and <code>direction</code> values.
      </p>
    </Prose>

    <SectionHeading>Left Stick</SectionHeading>
    <DemoLabel>Live Demo — move your left stick</DemoLabel>
    <DemoArea>
      <Reticle />
    </DemoArea>

    <SectionHeading>Right Stick</SectionHeading>
    <DemoLabel>Live Demo — move your right stick</DemoLabel>
    <DemoArea>
      <RightStick />
    </DemoArea>

    <SectionHeading>Reading Position</SectionHeading>
    <CodeBlock
      code={`// X and Y axes range from -1 to 1
controller.left.analog.x.state;  // -1 (left) to 1 (right)
controller.left.analog.y.state;  // -1 (up) to 1 (down)

// Magnitude: distance from center (0 to 1)
controller.left.analog.magnitude;

// Direction: angle in radians
controller.left.analog.direction;

// Event-driven
controller.left.analog.on("change", (stick) => {
  console.log(\`x=\${stick.x.state} y=\${stick.y.state}\`);
  console.log(\`magnitude=\${stick.magnitude}\`);
  console.log(\`direction=\${stick.direction}\`);
});`}
    />

    <SectionHeading>Stick Click (L3 / R3)</SectionHeading>
    <CodeBlock
      code={`controller.left.analog.button.on("press", () => {
  console.log("L3 pressed");
});

controller.right.analog.button.on("press", () => {
  console.log("R3 pressed");
});`}
    />
  </FeaturePage>
);

export default AnalogPage;
