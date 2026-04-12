import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { LeftShoulder, RightShoulder } from "../../components/hud";

const TriggersPage: React.FC = () => (
  <FeaturePage
    title="Triggers"
    subtitle="Pressure-sensitive L2 and R2 triggers with full 0-1 range."
  >
    <Prose>
      <p>
        Each trigger is a <strong>Trigger</strong> input that reads analog
        pressure from 0 (released) to 1 (fully pressed). Triggers also have a
        digital <code>.button</code> that actuates at the top of the pull, and
        a <code>.feedback</code> property for adaptive trigger effects.
      </p>
    </Prose>

    <DemoLabel>Live Demo — press L2 and R2</DemoLabel>
    <DemoArea style={{ gap: 48 }}>
      <LeftShoulder />
      <RightShoulder />
    </DemoArea>

    <SectionHeading>Reading Pressure</SectionHeading>
    <CodeBlock
      code={`// Normalized 0–1
controller.left.trigger.state;     // 0.0 to 1.0

// Raw 0–255
controller.left.trigger.pressure;  // 0 to 255

// Boolean active state
controller.left.trigger.active;    // true when > threshold

// Event-driven
controller.left.trigger.on("change", (trigger) => {
  console.log(\`L2 pressure: \${trigger.state.toFixed(2)}\`);
});

controller.right.trigger.on("change", (trigger) => {
  console.log(\`R2 pressure: \${trigger.state.toFixed(2)}\`);
});`}
    />

    <SectionHeading>Trigger Button</SectionHeading>
    <Prose>
      <p>
        The <code>.button</code> on each trigger is an independent hardware
        input that actuates at the top of the trigger pull — it is not
        derived from the analog pressure value.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.button.on("press", () => {
  console.log("L2 fully pressed");
});`}
    />

    <SectionHeading>Adaptive Trigger Feedback</SectionHeading>
    <Prose>
      <p>
        The DualSense's adaptive triggers provide physical resistance feedback.
        See the <a href="/dualsense-ts/outputs/trigger-effects">Trigger Effects</a>{" "}
        page for the full API.
      </p>
    </Prose>
    <CodeBlock
      code={`// Quick example: set resistance on L2
controller.left.trigger.feedback.set({
  mode: "rigid",
  force: 200,
});

// Reset to normal
controller.left.trigger.feedback.reset();`}
    />
  </FeaturePage>
);

export default TriggersPage;
