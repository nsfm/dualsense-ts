import React from "react";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";

const InputsOverview: React.FC = () => (
  <FeaturePage
    title="Inputs"
    subtitle="Every input on the DualSense controller is accessible through a unified API."
  >
    <Prose>
      <p>
        The <strong>Input</strong> base class provides a consistent interface
        across all controller inputs — buttons, triggers, sticks, touchpad, and
        motion sensors. Every input supports four access patterns:
      </p>
    </Prose>

    <SectionHeading>Synchronous Reads</SectionHeading>
    <Prose>
      <p>
        Read the current value directly. Useful in game loops or polling
        scenarios.
      </p>
    </Prose>
    <CodeBlock
      code={`// Boolean inputs
controller.cross.state;     // true | false
controller.cross.active;    // true when pressed

// Pressure / axis inputs
controller.left.trigger.state;      // 0 to 1
controller.left.trigger.pressure;   // 0 to 255
controller.left.analog.x.state;     // -1 to 1`}
    />

    <SectionHeading>Event Callbacks</SectionHeading>
    <Prose>
      <p>
        Subscribe to changes with familiar event emitter syntax. Inputs emit{" "}
        <code>change</code>, <code>press</code>, <code>release</code>, and{" "}
        <code>input</code> events.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.cross.on("change", (button) => {
  console.log(button.state);
});

controller.cross.on("press", () => {
  console.log("Pressed!");
});

controller.cross.on("release", () => {
  console.log("Released!");
});`}
    />

    <SectionHeading>Promises</SectionHeading>
    <Prose>
      <p>
        Wait for a specific event using <code>promise()</code>. Great for
        one-shot interactions or sequential logic.
      </p>
    </Prose>
    <CodeBlock
      code={`// Wait for the user to press cross
await controller.cross.promise("press");
console.log("Cross pressed!");

// Wait for release
await controller.cross.promise("release");
console.log("Cross released!");`}
    />

    <SectionHeading>Async Iterators</SectionHeading>
    <Prose>
      <p>
        Iterate over state changes with <code>for await</code>. Each iteration
        yields the input after it changes.
      </p>
    </Prose>
    <CodeBlock
      code={`for await (const cross of controller.cross) {
  console.log(cross.state ? "pressed" : "released");
}

// Works with any input
for await (const trigger of controller.left.trigger) {
  console.log(\`Pressure: \${trigger.pressure}\`);
}`}
    />

    <SectionHeading>Nested Inputs</SectionHeading>
    <Prose>
      <p>
        Compound inputs like <code>left</code>, <code>right</code>,{" "}
        <code>dpad</code>, and <code>touchpad</code> contain sub-inputs.
        You can subscribe at any level — a change in a child propagates up.
      </p>
    </Prose>
    <CodeBlock
      code={`// Listen to all left-side inputs at once
controller.left.on("change", (left) => {
  console.log(left.trigger.pressure, left.analog.x.state);
});

// Or target a specific sub-input
controller.left.trigger.on("change", (trigger) => {
  console.log(trigger.pressure);
});`}
    />
  </FeaturePage>
);

export default InputsOverview;
