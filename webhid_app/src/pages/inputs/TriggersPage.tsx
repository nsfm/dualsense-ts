import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";
import { LeftShoulder, RightShoulder } from "../../components/hud";
import {
  TriggerDiagnostic,
  TriggerConfig,
} from "../../components/diagnostics/TriggerDiagnostic";

const TriggersPage: React.FC = () => (
  <FeaturePage
    title="Triggers"
    subtitle="Pressure-sensitive L2 and R2 triggers with full 0–1 range."
  >
    <Prose>
      <p>
        Each trigger is a{" "}
        <Link to="/api/trigger"><code>Trigger</code></Link> input that reads
        analog pressure from 0 (released) to 1 (fully pressed). The{" "}
        <code>.state</code> value is a continuous number, while{" "}
        <code>.active</code> is <code>true</code> whenever pressure is above 0.
        Triggers also have an independent digital{" "}
        <Link to="/inputs/buttons"><code>.button</code></Link> and a{" "}
        <code>.feedback</code> property for{" "}
        <Link to="/outputs/trigger-effects">adaptive trigger effects</Link>.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Press L2 and R2 on your controller</DemoLabel>
    <DemoArea style={{ gap: 48 }}>
      <LeftShoulder />
      <RightShoulder />
    </DemoArea>

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TriggerDiagnostic
            prefix="left.trigger"
            selector={(c) => c.left.trigger}
          />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TriggerDiagnostic
            prefix="right.trigger"
            selector={(c) => c.right.trigger}
          />
        </div>
      </div>
    </DemoArea>

    <SectionHeading>Configuration</SectionHeading>
    <Prose>
      <p>
        Triggers have configurable <code>.threshold</code> and{" "}
        <code>.deadzone</code> values. The threshold controls the minimum
        change in pressure required to emit a <code>"change"</code> event —
        useful for filtering out tiny fluctuations. The deadzone suppresses
        pressure values below a minimum, so <code>.active</code> won't
        become <code>true</code> until the trigger passes that floor.
      </p>
    </Prose>
    <DemoLabel>Adjust threshold and deadzone — watch the state table respond</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TriggerConfig
            prefix="left.trigger"
            selector={(c) => c.left.trigger}
          />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TriggerConfig
            prefix="right.trigger"
            selector={(c) => c.right.trigger}
          />
        </div>
      </div>
    </DemoArea>
    <CodeBlock
      code={`// Minimum change to trigger a "change" event
controller.left.trigger.threshold = 0.01;

// Ignore small accidental presses
controller.left.trigger.deadzone = 0.05;`}
    />

    <SectionHeading>Reading Pressure</SectionHeading>
    <Prose>
      <p>
        The trigger's <code>.state</code> and <code>.pressure</code> both
        return the same normalized 0–1 value. <code>.pressure</code> is an
        alias for readability. For most use cases — game loops, animation
        frames — reading the value synchronously is simpler than subscribing
        to events.
      </p>
    </Prose>
    <HardwareNote>
      Triggers report at HID frequency (~250 Hz). For continuous reads like
      driving acceleration or zoom control, prefer reading <code>.state</code>{" "}
      in your game loop over subscribing to <code>"change"</code> events.
    </HardwareNote>
    <CodeBlock
      code={`// Synchronous read in a game loop
const accel = controller.right.trigger.state;  // 0.0 to 1.0
const brake = controller.left.trigger.state;

// Alias — same value, more readable
controller.left.trigger.pressure;  // 0.0 to 1.0

// Boolean check
if (controller.right.trigger.active) {
  // any amount of pressure applied
}

// Event-driven
controller.left.trigger.on("change", (trigger) => {
  console.log(\`L2 pressure: \${trigger.state.toFixed(2)}\`);
});`}
    />

    <SectionHeading>Trigger Button</SectionHeading>
    <Prose>
      <p>
        Each trigger has an independent digital{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> button
        at <code>.button</code>. This is a separate hardware input — it is
        not derived from the analog pressure value.
      </p>
    </Prose>
    <HardwareNote>
      The trigger button actuates at the top of the pull, not the bottom.
    </HardwareNote>
    <CodeBlock
      code={`controller.left.trigger.button.on("press", () => {
  console.log("L2 button clicked");
});

// Works with .once() and .promise() too
await controller.right.trigger.button.promise("press");
console.log("R2 clicked once");`}
    />

    <SectionHeading>Adaptive Trigger Feedback</SectionHeading>
    <Prose>
      <p>
        The DualSense's adaptive triggers provide programmable physical
        resistance. Each trigger has a <code>.feedback</code> property
        for configuring effects. See the{" "}
        <Link to="/outputs/trigger-effects">Trigger Effects</Link> page
        for the full API and interactive controls.
      </p>
    </Prose>
    <CodeBlock
      code={`import { TriggerEffect } from "dualsense-ts";

// Zone-based continuous resistance
controller.left.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.2,   // where resistance begins (0-1)
  strength: 0.8,   // resistance force (0-1)
});

// Weapon-style snap release
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.3,
  end: 0.7,
  strength: 1.0,
});

// Reset to normal
controller.left.trigger.feedback.reset();`}
    />

    <SectionHeading>Events</SectionHeading>
    <Prose>
      <p>
        Trigger events fire at HID report rate (~250 Hz), so they're best
        suited for triggering discrete actions rather than continuous reads.
        The <code>.button</code> sub-input also supports{" "}
        <code>"press"</code> and <code>"release"</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Fires when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>"change"</code></td>
            <td>Pressure value changes (subject to threshold)</td>
          </tr>
          <tr>
            <td><code>"input"</code></td>
            <td>Every HID report, regardless of change</td>
          </tr>
        </tbody>
      </table>
      <p>
        All events support <code>.on()</code> for persistent listeners,{" "}
        <code>.once()</code> for single-fire callbacks, and{" "}
        <code>.promise()</code> for await-based flows.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.left.trigger.on("change", (trigger) => {
  console.log(\`L2: \${trigger.state.toFixed(2)}\`);
});

// Await a full press via the digital button
await controller.right.trigger.button.promise("press");`}
    />
  </FeaturePage>
);

export default TriggersPage;
