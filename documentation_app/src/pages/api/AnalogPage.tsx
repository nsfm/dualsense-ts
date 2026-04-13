import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const AnalogPage: React.FC = () => (
  <ApiPage
    name="Analog"
    extends="Input<Analog>"
    description="A two-axis thumbstick with X/Y position, computed magnitude and direction, deadzone, and a click button."
    source="src/elements/analog.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "x", type: "Axis", description: "Horizontal axis: -1 (left) to 1 (right)", readonly: true },
        { name: "y", type: "Axis", description: "Vertical axis: -1 (up) to 1 (down)", readonly: true },
        { name: "button", type: "Momentary", description: "Stick click (L3/R3)", readonly: true },
      ]}
    />

    <SectionHeading>Computed Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "boolean", description: "True if stick is moved or button is pressed" },
        { name: "magnitude", type: "Magnitude", description: "Distance from center, 0 (centered) to 1 (full tilt)" },
        { name: "force", type: "Force", description: "Hypotenuse of x/y forces" },
        { name: "direction", type: "Radians", description: "Angle from center in radians (same as radians, angle)" },
        { name: "degrees", type: "Degrees", description: "Angle from center in degrees 0–360" },
        { name: "deadzone", type: "Magnitude", description: "Stick deadzone — applies to both axes (default: 0)" },
      ]}
    />

    <SectionHeading>Vector</SectionHeading>
    <CodeBlock
      code={`const { direction, magnitude } = controller.left.analog.vector;
console.log(\`Angle: \${direction} rad, Strength: \${magnitude}\`);`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`controller.left.analog.on("change", (stick) => {
  if (stick.magnitude > 0.5) {
    moveCharacter(stick.direction, stick.magnitude);
  }
});

// Stick click
controller.left.analog.button.on("press", () => {
  sprint();
});`}
    />
  </ApiPage>
);

export default AnalogPage;
