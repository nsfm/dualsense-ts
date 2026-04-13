import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const AccelerometerPage: React.FC = () => (
  <ApiPage
    name="Accelerometer"
    extends="Input<Accelerometer>"
    description="3-axis linear acceleration sensor including gravity. At rest, the vertical axis reads approximately 1g."
    source="src/elements/accelerometer.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "x", type: "Axis", description: "Lateral acceleration", readonly: true },
        { name: "y", type: "Axis", description: "Vertical acceleration (includes gravity)", readonly: true },
        { name: "z", type: "Axis", description: "Longitudinal acceleration", readonly: true },
      ]}
    />

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "false", description: "Always false — motion sensors report continuously" },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`controller.accelerometer.on("change", (accel) => {
  console.log(\`x=\${accel.x.force} y=\${accel.y.force} z=\${accel.z.force}\`);
});`}
    />
  </ApiPage>
);

export default AccelerometerPage;
