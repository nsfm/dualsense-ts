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
import { Reticle, RightStick } from "../../components/hud";
import {
  AnalogStickDiagnostic,
  AnalogStickConfig,
} from "../../components/diagnostics/AnalogDiagnostic";

const AnalogPage: React.FC = () => (
  <FeaturePage
    title="Analog Sticks"
    subtitle="Two thumbsticks with X/Y axes, magnitude, direction, and click."
  >
    <Prose>
      <p>
        Each analog stick is an{" "}
        <Link to="/api/analog"><code>Analog</code></Link> input containing two{" "}
        <Link to="/api/axis"><code>Axis</code></Link> sub-inputs
        (<code>.x</code> and <code>.y</code>), plus computed{" "}
        <code>.magnitude</code> and <code>.direction</code> values. The sticks
        also have a click button (<Link to="/inputs/buttons">L3/R3</Link>)
        accessible as <code>.button</code>.
      </p>
      <p>
        Unlike buttons where <code>.state</code> and <code>.active</code> are
        identical, here they diverge: <code>.x.state</code> is the raw axis
        position (-1 to 1), while <code>.x.active</code> is{" "}
        <code>true</code> only when the axis exceeds its{" "}
        <code>.deadzone</code>. The top-level <code>.active</code> is{" "}
        <code>true</code> when the stick has moved past its deadzone or the
        button is pressed.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Move your analog sticks</DemoLabel>
    <DemoArea style={{ gap: 48 }}>
      <Reticle />
      <RightStick />
    </DemoArea>

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        <div style={{ flex: 1 }}>
          <AnalogStickDiagnostic
            prefix="left.analog"
            selector={(c) => c.left.analog}
          />
        </div>
        <div style={{ flex: 1 }}>
          <AnalogStickDiagnostic
            prefix="right.analog"
            selector={(c) => c.right.analog}
          />
        </div>
      </div>
    </DemoArea>

    <SectionHeading>Configuration</SectionHeading>
    <Prose>
      <p>
        Each stick and its axes have configurable <code>.deadzone</code> and{" "}
        <code>.threshold</code> values. The deadzone suppresses small inputs
        near the center position. The threshold controls the minimum change
        required to emit a <code>"change"</code> event.
      </p>
    </Prose>
    <HardwareNote>
      <code>.x.state</code> and <code>.y.state</code> are raw axis values
      with no deadzone applied. Physical sticks rarely return to exactly
      0,0 at rest and will fluctuate slightly. Prefer{" "}
      <code>.magnitude</code> and <code>.direction</code> for movement, or
      check <code>.active</code> before reading — these respect the
      deadzone setting.
    </HardwareNote>
    <DemoLabel>Adjust deadzone — watch the state table above respond</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        <div style={{ flex: 1 }}>
          <AnalogStickConfig
            prefix="left.analog"
            selector={(c) => c.left.analog}
          />
        </div>
        <div style={{ flex: 1 }}>
          <AnalogStickConfig
            prefix="right.analog"
            selector={(c) => c.right.analog}
          />
        </div>
      </div>
    </DemoArea>
    <Prose>
      <p>
        Deadzones operate at two levels. Per-axis deadzones
        (<code>.x.deadzone</code>, <code>.y.deadzone</code>) zero
        out <code>.x.force</code> and <code>.y.force</code> independently.
        The top-level <code>.deadzone</code> then applies to the combined
        magnitude — <code>.magnitude</code> and <code>.active</code> won't
        register until the stick moves past both thresholds. The two levels
        stack rather than override each other.
      </p>
    </Prose>
    <CodeBlock
      code={`// Ignore small stick movements near center
controller.left.analog.deadzone = 0.1;

// Per-axis deadzone
controller.left.analog.x.deadzone = 0.08;
controller.left.analog.y.deadzone = 0.08;

// Minimum change to trigger a "change" event
controller.left.analog.x.threshold = 0.01;`}
    />

    <SectionHeading>Synchronous API</SectionHeading>
    <Prose>
      <p>
        The recommended approach for most use cases. Read stick values
        directly in your game loop or <code>requestAnimationFrame</code>{" "}
        callback.
      </p>
    </Prose>
    <HardwareNote>
      Analog sticks report at a high frequency. For most use cases —
      game loops, animation frames, UI updates — reading the values
      synchronously is simpler and more efficient than subscribing to
      events.
    </HardwareNote>
    <CodeBlock
      code={`// In a game loop or animation frame
const { x, y } = controller.left.analog;
player.velocity.x = x.state;  // -1 (left) to 1 (right)
player.velocity.y = y.state;  // -1 (up) to 1 (down)

// Polar coordinates
const speed = controller.left.analog.magnitude;  // 0 to 1
const angle = controller.left.analog.direction;  // radians

// Degrees if you prefer
const deg = controller.left.analog.degrees;`}
    />

    <SectionHeading>Events</SectionHeading>
    <Prose>
      <p>
        Event subscriptions are available but fire at HID report rate
        (~250Hz), so they're best suited for triggering discrete actions
        rather than continuous reads.
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
            <td>Any axis value changes (subject to threshold)</td>
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
      code={`// Event-driven (high frequency — use sparingly)
controller.left.analog.on("change", (stick) => {
  console.log(\`x=\${stick.x.state} y=\${stick.y.state}\`);
});

// Await the next change
const stick = await controller.left.analog.promise("change");
console.log(stick.magnitude);`}
    />
  </FeaturePage>
);

export default AnalogPage;
