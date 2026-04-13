import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const MomentaryPage: React.FC = () => (
  <ApiPage
    name="Momentary"
    extends="Input<boolean>"
    description="A boolean button input. True when pressed, false when released. Used for face buttons, bumpers, D-pad directions, connection state, and more."
    source="src/elements/momentary.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "boolean", description: "True when pressed, false when released" },
        { name: "active", type: "boolean", description: "Same as state — true when pressed" },
      ]}
    />

    <SectionHeading>Used By</SectionHeading>
    <Prose>
      <p>
        <code>Momentary</code> is the most common input type. These controller
        properties are all <code>Momentary</code> instances:
      </p>
      <ul>
        <li>Face buttons: <code>triangle</code>, <code>circle</code>, <code>cross</code>, <code>square</code></li>
        <li>Utility: <code>ps</code>, <code>create</code>, <code>options</code></li>
        <li>D-pad directions: <code>dpad.up</code>, <code>dpad.down</code>, <code>dpad.left</code>, <code>dpad.right</code></li>
        <li>Shoulders: <code>left.bumper</code>, <code>right.bumper</code></li>
        <li>Stick clicks: <code>left.analog.button</code>, <code>right.analog.button</code></li>
        <li>Trigger full-press: <code>left.trigger.button</code>, <code>right.trigger.button</code></li>
        <li>Touch contact: <code>touchpad.left.contact</code>, <code>touchpad.right.contact</code></li>
        <li>State: <code>connection</code>, <code>microphone</code>, <code>headphone</code></li>
      </ul>
    </Prose>

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`controller.cross.on("press", () => console.log("X pressed"));
controller.cross.on("release", () => console.log("X released"));

// Synchronous check
if (controller.cross.active) {
  jump();
}`}
    />
  </ApiPage>
);

export default MomentaryPage;
