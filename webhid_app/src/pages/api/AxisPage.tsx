import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const AxisPage: React.FC = () => (
  <ApiPage
    name="Axis"
    extends="Input<Force>"
    description="A single-axis value ranging from -1 to 1 with deadzone support. Used for analog stick axes, gyroscope, and accelerometer channels."
    source="src/elements/axis.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "Force", description: "Raw axis value from -1 to 1" },
        { name: "force", type: "Force", description: "Value with deadzone applied — returns 0 if below deadzone" },
        { name: "magnitude", type: "Magnitude", description: "Absolute value normalized to 0–1, deadzone-adjusted" },
        { name: "active", type: "boolean", description: "True if magnitude is above the deadzone" },
        { name: "deadzone", type: "Magnitude", description: "Values below this threshold read as 0 (default: 0)" },
      ]}
    />

    <SectionHeading>Force vs Magnitude</SectionHeading>
    <Prose>
      <p>
        <code>force</code> preserves direction (-1 to 1) while <code>magnitude</code>{" "}
        gives you the unsigned intensity (0 to 1). Both respect the deadzone
        setting.
      </p>
    </Prose>
    <CodeBlock
      code={`const axis = controller.left.analog.x;

axis.state;      // -0.12 (raw, ignores deadzone)
axis.force;      //  0.00 (below deadzone, so zero)
axis.magnitude;  //  0.00 (absolute, below deadzone)
axis.active;     //  false`}
    />

    <SectionHeading>Deadzone</SectionHeading>
    <CodeBlock
      code={`// Set deadzone on an individual axis
controller.left.analog.x.deadzone = 0.1;

// Or set it on the parent Analog (applies to both axes)
controller.left.analog.deadzone = 0.15;`}
    />

    <SectionHeading>Used By</SectionHeading>
    <Prose>
      <ul>
        <li>Analog sticks: <code>left.analog.x</code>, <code>left.analog.y</code>, <code>right.analog.x</code>, <code>right.analog.y</code></li>
        <li>Gyroscope: <code>gyroscope.x</code>, <code>gyroscope.y</code>, <code>gyroscope.z</code></li>
        <li>Accelerometer: <code>accelerometer.x</code>, <code>accelerometer.y</code>, <code>accelerometer.z</code></li>
        <li>Touch points: <code>touchpad.left.x</code>, <code>touchpad.left.y</code></li>
      </ul>
    </Prose>
  </ApiPage>
);

export default AxisPage;
