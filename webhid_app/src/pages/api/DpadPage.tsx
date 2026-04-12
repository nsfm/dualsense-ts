import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const DpadPage: React.FC = () => (
  <ApiPage
    name="Dpad"
    extends="Input<Dpad>"
    description="The directional pad with four Momentary sub-inputs. Fires change events when any direction changes."
    source="src/elements/dpad.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "up", type: "Momentary", description: "D-pad up", readonly: true },
        { name: "down", type: "Momentary", description: "D-pad down", readonly: true },
        { name: "left", type: "Momentary", description: "D-pad left", readonly: true },
        { name: "right", type: "Momentary", description: "D-pad right", readonly: true },
      ]}
    />

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "boolean", description: "True if any direction is pressed" },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Listen to all directions
controller.dpad.on("change", (dpad) => {
  const dirs = [
    dpad.up.active && "up",
    dpad.down.active && "down",
    dpad.left.active && "left",
    dpad.right.active && "right",
  ].filter(Boolean);
  console.log("D-pad:", dirs.join("+") || "neutral");
});

// Or individual directions
controller.dpad.up.on("press", () => navigate("up"));`}
    />
  </ApiPage>
);

export default DpadPage;
