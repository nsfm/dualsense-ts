import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const UnisensePage: React.FC = () => (
  <ApiPage
    name="Unisense"
    extends="Input<Unisense>"
    description="Groups one side of the controller: analog stick, trigger, bumper, and rumble motor. Accessed as controller.left and controller.right."
    source="src/elements/unisense.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "trigger", type: "Trigger", description: "L2/R2 pressure-sensitive trigger with adaptive feedback", readonly: true },
        { name: "bumper", type: "Momentary", description: "L1/R1 bumper button", readonly: true },
        { name: "analog", type: "Analog", description: "Thumbstick with X/Y axes and click", readonly: true },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "rumble", signature: "rumble(intensity?: Intensity | boolean): Intensity", description: "Get or set rumble motor intensity. 0–1 numeric, or boolean (true = 1, false = 0)." },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Set rumble on left motor (heavy)
controller.left.rumble(0.8);

// Right motor (light)
controller.right.rumble(0.3);

// Listen to any left-side input
controller.left.on("change", (side) => {
  console.log("Left side changed");
  console.log("Trigger:", side.trigger.state);
  console.log("Bumper:", side.bumper.active);
  console.log("Stick:", side.analog.magnitude);
});`}
    />
  </ApiPage>
);

export default UnisensePage;
