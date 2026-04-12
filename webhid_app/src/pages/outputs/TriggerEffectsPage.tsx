import React, { useContext } from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { TriggerEffectControls } from "../../components/hud";
import { ControllerContext } from "../../controller";

const TriggerEffectsPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  return (
  <FeaturePage
    title="Adaptive Trigger Effects"
    subtitle="7 feedback effect types with configurable parameters per trigger."
  >
    <Prose>
      <p>
        The DualSense's adaptive triggers can provide physical resistance
        feedback using built-in motors. Each trigger can be independently
        configured with one of 7 effect modes, each with different parameters
        controlling the feel and strength.
      </p>
    </Prose>

    <DemoLabel>Live Demo — choose an effect and adjust parameters</DemoLabel>
    <DemoArea>
      {controller && <TriggerEffectControls controller={controller} />}
    </DemoArea>

    <SectionHeading>Effect Types</SectionHeading>

    <Prose>
      <p><strong>Off</strong> — No resistance (default).</p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({ mode: "off" });
// Or use the shorthand:
controller.left.trigger.feedback.reset();`}
    />

    <Prose>
      <p>
        <strong>Rigid</strong> — Constant resistance throughout the entire
        trigger range.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({
  mode: "rigid",
  force: 200,      // 0–255 resistance strength
});`}
    />

    <Prose>
      <p>
        <strong>Pulse</strong> — Vibrating resistance that pulses as you press.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({
  mode: "pulse",
  strength: 200,
  frequency: 30,
  startPosition: 50,
});`}
    />

    <Prose>
      <p>
        <strong>Rigid A / Rigid B</strong> — Resistance zones at specific
        positions along the trigger range.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({
  mode: "rigid_a",
  startPosition: 80,
  force: 180,
});

controller.left.trigger.feedback.set({
  mode: "rigid_b",
  startPosition: 40,
  force: 200,
});`}
    />

    <Prose>
      <p>
        <strong>Rigid AB</strong> — Two resistance zones at different positions.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({
  mode: "rigid_ab",
  startPosition: 30,
  endPosition: 140,
  forceA: 150,
  forceB: 200,
});`}
    />

    <Prose>
      <p>
        <strong>Pulse A / Pulse B / Pulse AB</strong> — Vibrating resistance at
        specific zones.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.feedback.set({
  mode: "pulse_ab",
  startPosition: 30,
  endPosition: 140,
  strengthA: 100,
  strengthB: 200,
  frequency: 25,
});`}
    />

    <SectionHeading>Resetting Triggers</SectionHeading>
    <CodeBlock
      code={`// Reset a single trigger
controller.left.trigger.feedback.reset();

// Reset both triggers
controller.resetTriggerFeedback();`}
    />

    <SectionHeading>Current Effect State</SectionHeading>
    <CodeBlock
      code={`// Read the current effect configuration
const effect = controller.left.trigger.feedback.effect;
console.log(effect);`}
    />
  </FeaturePage>
  );
};

export default TriggerEffectsPage;
