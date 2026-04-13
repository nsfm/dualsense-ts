import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const InputPage: React.FC = () => (
  <ApiPage
    name="Input<T>"
    description="Abstract base class for all inputs. Provides a consistent event API, async iteration, and composability."
    source="src/input.ts"
  >
    <Prose>
      <p>
        Every readable value on the controller extends <code>Input</code>.
        This means buttons, axes, the touchpad, battery, and even the
        controller itself all share the same event interface. You never need
        to learn a different API for different input types.
      </p>
    </Prose>

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "T", description: "The current value of this input (boolean, number, or compound type)" },
        { name: "active", type: "boolean", description: "True if the input is currently in an active state" },
        { name: "id", type: "InputId", description: "Identifier enum for this input" },
        { name: "threshold", type: "number", description: "Minimum change amount to trigger events (default: 0)" },
        { name: "deadzone", type: "number", description: "Minimum absolute value to register as active (default: 0)" },
      ]}
    />

    <SectionHeading>Event Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "on", signature: 'on(event: "change" | "press" | "release" | "input", callback): this', description: "Subscribe to events. Returns this for chaining." },
        { name: "once", signature: 'once(event: "change" | "press" | "release", callback): this', description: "Subscribe to a single occurrence, then auto-remove." },
        { name: "off", signature: "off(event, callback): this", description: "Remove a listener." },
        { name: "removeAllListeners", signature: "removeAllListeners(event?): this", description: "Remove all listeners, optionally filtered by event type." },
      ]}
    />

    <SectionHeading>Event Types</SectionHeading>
    <PropertiesTable
      properties={[
        { name: '"change"', type: "InputChangeType", description: "Fires when the input value changes (any direction)" },
        { name: '"press"', type: "InputChangeType", description: "Fires when the input becomes active (button down, axis moves)" },
        { name: '"release"', type: "InputChangeType", description: "Fires when the input becomes inactive (button up, axis returns)" },
        { name: '"input"', type: "InputEventType", description: "Fires on every HID report, even if the value hasn't changed" },
      ]}
    />

    <SectionHeading>Four Ways to Read</SectionHeading>

    <Prose>
      <p><strong>1. Synchronous read</strong> — poll the current value:</p>
    </Prose>
    <CodeBlock
      code={`if (controller.cross.active) {
  console.log("Cross is held down");
}
const pressure = controller.left.trigger.state; // 0.0–1.0`}
    />

    <Prose>
      <p><strong>2. Event callbacks</strong> — subscribe to changes:</p>
    </Prose>
    <CodeBlock
      code={`controller.cross.on("press", () => console.log("pressed"));
controller.cross.on("release", () => console.log("released"));
controller.cross.on("change", (btn) => console.log(btn.active));`}
    />

    <Prose>
      <p><strong>3. Promises</strong> — wait for a single event:</p>
    </Prose>
    <CodeBlock
      code={`await controller.cross.promise("press");
console.log("Cross was pressed");

// With timeout
const result = await Promise.race([
  controller.cross.promise("press"),
  new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000)),
]);`}
    />

    <Prose>
      <p><strong>4. Async iteration</strong> — stream values:</p>
    </Prose>
    <CodeBlock
      code={`for await (const state of controller.left.analog) {
  console.log(\`x=\${state.x.state} y=\${state.y.state}\`);
}

// Or with next()
const { value } = await controller.cross.next("press");
console.log(value.active);`}
    />

    <SectionHeading>Callback Signature</SectionHeading>
    <CodeBlock
      code={`type InputCallback<Instance> = (
  input: Instance,       // The input that owns the listener
  changed: Instance | Input<unknown>  // The specific child that changed
) => unknown | Promise<unknown>;

// Example: the second argument tells you which child triggered a parent event
controller.dpad.on("change", (dpad, changed) => {
  console.log("Dpad changed because:", changed);
});`}
    />
  </ApiPage>
);

export default InputPage;
