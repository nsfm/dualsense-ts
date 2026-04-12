import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { TouchpadVisualization } from "../../components/hud";

const TouchpadPage: React.FC = () => (
  <FeaturePage
    title="Touchpad"
    subtitle="Multi-touch surface with two independent contact points and a click button."
  >
    <Prose>
      <p>
        The DualSense touchpad supports two simultaneous touch points. Each
        reports X/Y coordinates and contact state. The touchpad also functions
        as a clickable button.
      </p>
    </Prose>

    <DemoLabel>Live Demo — touch the touchpad</DemoLabel>
    <DemoArea>
      <TouchpadVisualization />
    </DemoArea>

    <SectionHeading>Touch Points</SectionHeading>
    <CodeBlock
      code={`// Two touch points: left and right
controller.touchpad.left.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch 1: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});

controller.touchpad.right.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch 2: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});`}
    />

    <SectionHeading>Touch Contact Detection</SectionHeading>
    <Prose>
      <p>
        Each touch point has a <code>.contact</code> property that tracks
        whether a finger is on the surface, and a <code>.tracker</code> for
        tracking finger identity across frames.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.touchpad.left.contact.on("press", () => {
  console.log("Finger touched");
});

controller.touchpad.left.contact.on("release", () => {
  console.log("Finger lifted");
});`}
    />

    <SectionHeading>Touchpad Button</SectionHeading>
    <Prose>
      <p>
        The entire touchpad surface is also a clickable button.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.touchpad.button.on("press", () => {
  console.log("Touchpad clicked");
});`}
    />

    <SectionHeading>Listening to All Touchpad Events</SectionHeading>
    <CodeBlock
      code={`// The parent touchpad input fires on any child change
controller.touchpad.on("change", (tp) => {
  const t1 = tp.left;
  const t2 = tp.right;
  console.log(\`Touch 1: \${t1.contact.active ? "active" : "off"}\`);
  console.log(\`Touch 2: \${t2.contact.active ? "active" : "off"}\`);
});`}
    />
  </FeaturePage>
);

export default TouchpadPage;
