import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const TouchpadPage: React.FC = () => (
  <ApiPage
    name="Touchpad"
    extends="Input<Touchpad>"
    description="Multi-touch surface supporting two simultaneous contact points and a clickable button."
    source="src/elements/touchpad.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "button", type: "Momentary", description: "Touchpad click (pressing down on the surface)", readonly: true },
        { name: "left", type: "Touch", description: "Primary (first) touch point", readonly: true },
        { name: "right", type: "Touch", description: "Secondary (second) touch point", readonly: true },
      ]}
    />

    <SectionHeading>Touch Class</SectionHeading>
    <Prose>
      <p>
        Each touch point is a <code>Touch</code> extending <code>Analog</code>,
        so it has <code>x</code>, <code>y</code>, <code>magnitude</code>, and{" "}
        <code>direction</code> — plus touch-specific properties:
      </p>
    </Prose>
    <PropertiesTable
      properties={[
        { name: "x", type: "Axis", description: "Horizontal position on the touchpad surface" },
        { name: "y", type: "Axis", description: "Vertical position on the touchpad surface" },
        { name: "contact", type: "Momentary", description: "True when a finger is on the surface" },
        { name: "tracker", type: "Increment", description: "Finger identity counter — changes when a new finger touches" },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Track first touch point
controller.touchpad.left.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});

// Detect finger down/up
controller.touchpad.left.contact.on("press", () => console.log("Finger down"));
controller.touchpad.left.contact.on("release", () => console.log("Finger up"));

// Touchpad click
controller.touchpad.button.on("press", () => console.log("Clicked"));`}
    />
  </ApiPage>
);

export default TouchpadPage;
