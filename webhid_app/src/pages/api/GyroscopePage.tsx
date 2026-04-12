import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const GyroscopePage: React.FC = () => (
  <ApiPage
    name="Gyroscope"
    extends="Input<Gyroscope>"
    description="3-axis angular velocity sensor measuring rotation rate on the X (pitch), Y (roll), and Z (yaw) axes."
    source="src/elements/gyroscope.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "x", type: "Axis", description: "Pitch — rotation around the X axis", readonly: true },
        { name: "y", type: "Axis", description: "Roll — rotation around the Y axis", readonly: true },
        { name: "z", type: "Axis", description: "Yaw — rotation around the Z axis", readonly: true },
      ]}
    />

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "false", description: "Always false — motion sensors report continuously, not discretely" },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`controller.gyroscope.on("change", (gyro) => {
  updateOrientation(gyro.x.force, gyro.y.force, gyro.z.force);
});

// Individual axis
controller.gyroscope.z.on("change", (axis) => {
  console.log(\`Yaw rate: \${axis.force}\`);
});`}
    />
  </ApiPage>
);

export default GyroscopePage;
