import React from "react";
import { Link } from "react-router";
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
        The{" "}
        <Link to="/api/input"><code>Input&lt;T&gt;</code></Link> base class
        provides a consistent interface across all controller inputs.
        Whether you're reading a{" "}
        <Link to="/inputs/buttons">button</Link>,{" "}
        <Link to="/inputs/triggers">trigger</Link>,{" "}
        <Link to="/inputs/analog">analog stick</Link>,{" "}
        <Link to="/inputs/touchpad">touchpad</Link>,{" "}
        <Link to="/inputs/motion">motion sensor</Link>, or{" "}
        <Link to="/inputs/battery">battery level</Link>, the same four
        access patterns are available.
      </p>
    </Prose>

    <SectionHeading>Synchronous Reads</SectionHeading>
    <Prose>
      <p>
        Read the current value at any time. When the controller is disconnected,
        all inputs reset to their neutral state.
      </p>
    </Prose>
    <CodeBlock
      code={`// Boolean inputs
controller.cross.state;     // true | false
controller.cross.active;    // true when pressed

// Pressure / axis inputs
controller.left.trigger.state;      // 0 to 1
controller.left.analog.x.state;     // -1 to 1`}
    />

    <SectionHeading>Event Callbacks</SectionHeading>
    <Prose>
      <p>
        Subscribe to changes with familiar EventEmitter syntax. Every input
        emits <code>change</code>, <code>input</code>, <code>press</code>,
        and <code>release</code> events.
      </p>
    </Prose>
    <CodeBlock
      code={`// Fires when the value changes
controller.cross.on("change", (button) => {
  console.log(button.state);
});

// Shorthand for specific transitions
controller.cross.on("press", () => console.log("Pressed!"));
controller.cross.on("release", () => console.log("Released!"));

// Remove a listener
const handler = ({ state }) => console.log(state);
controller.cross.on("change", handler);
controller.cross.off("change", handler);`}
    />
    <Prose>
      <p>
        The <code>input</code> event fires on every HID report, even when
        the value hasn't changed — the controller may send over 250 reports
        per second, so use this sparingly.
      </p>
    </Prose>

    <SectionHeading>Promises</SectionHeading>
    <Prose>
      <p>
        Wait for a specific event using <code>promise()</code>. Useful for
        one-shot interactions or sequential logic.
      </p>
    </Prose>
    <CodeBlock
      code={`// Wait for the user to press cross
await controller.cross.promise("press");
console.log("Cross pressed!");

// Wait for any input at all
await controller.promise();`}
    />

    <SectionHeading>Async Iterators</SectionHeading>
    <Prose>
      <p>
        Each input is an async iterable that yields on every state change.
      </p>
    </Prose>
    <CodeBlock
      code={`for await (const cross of controller.cross) {
  console.log(cross.state ? "pressed" : "released");
}

for await (const trigger of controller.left.trigger) {
  console.log(\`Pressure: \${trigger.state}\`);
}`}
    />

    <SectionHeading>Nested Inputs</SectionHeading>
    <Prose>
      <p>
        Compound inputs like{" "}
        <Link to="/api/unisense"><code>Unisense</code></Link> (left/right
        halves), <Link to="/api/dpad"><code>Dpad</code></Link>,{" "}
        <Link to="/api/touchpad"><code>Touchpad</code></Link>, and{" "}
        <Link to="/api/battery"><code>Battery</code></Link> contain
        sub-inputs. You can subscribe at any level — changes in children
        propagate upward.
      </p>
    </Prose>
    <CodeBlock
      code={`// Listen to all left-side inputs at once
controller.left.on("change", (left) => {
  console.log(left.trigger.state, left.analog.x.state);
});

// Or target a specific sub-input
controller.left.trigger.on("change", (trigger) => {
  console.log(trigger.state);
});`}
    />

    <SectionHeading>Input Types</SectionHeading>
    <Prose>
      <p>
        Different controller features use specialized input subclasses:
      </p>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>State</th>
            <th>Used by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Link to="/api/momentary"><code>Momentary</code></Link></td>
            <td><code>boolean</code></td>
            <td>Face buttons, bumpers, d-pad, touchpad button</td>
          </tr>
          <tr>
            <td><Link to="/api/trigger"><code>Trigger</code></Link></td>
            <td><code>0–1</code></td>
            <td>L2, R2</td>
          </tr>
          <tr>
            <td><Link to="/api/axis"><code>Axis</code></Link></td>
            <td><code>-1–1</code></td>
            <td>Stick axes, gyroscope, accelerometer</td>
          </tr>
          <tr>
            <td><Link to="/api/analog"><code>Analog</code></Link></td>
            <td><code>x, y</code></td>
            <td>Analog sticks, touch points</td>
          </tr>
          <tr>
            <td><Link to="/api/battery"><code>Battery</code></Link></td>
            <td><code>level, status</code></td>
            <td>Battery monitoring</td>
          </tr>
        </tbody>
      </table>
      <p>
        See the <Link to="/api">API reference</Link> for the full class
        hierarchy.
      </p>
    </Prose>
  </FeaturePage>
);

export default InputsOverview;
