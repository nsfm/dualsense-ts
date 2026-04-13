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
import { TouchpadVisualization } from "../../components/hud";
import { TouchpadButtonDiagnostic, TouchPointDiagnostic } from "../../components/diagnostics/TouchpadDiagnostic";

const TouchpadPage: React.FC = () => (
  <FeaturePage
    title="Touchpad"
    subtitle="Multi-touch surface with two independent contact points and a click button."
  >
    <Prose>
      <p>
        The DualSense touchpad is a{" "}
        <Link to="/api/touchpad"><code>Touchpad</code></Link> input with two
        independent{" "}
        <Link to="/api/touch"><code>Touch</code></Link> contact points
        (<code>.left</code> and <code>.right</code>) and a clickable{" "}
        <Link to="/api/momentary"><code>.button</code></Link>. Each touch
        point extends{" "}
        <Link to="/api/analog"><code>Analog</code></Link>, giving it{" "}
        <code>.x</code> and <code>.y</code>{" "}
        <Link to="/api/axis"><code>Axis</code></Link> values plus a{" "}
        <code>.contact</code> boolean and a <code>.tracker</code> for finger
        identity. Since each touch point inherits from Analog, you also
        have access to <code>.magnitude</code> and <code>.direction</code>{" "}
        for polar coordinate tracking — useful for radial gestures.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Touch the touchpad — use two fingers for multi-touch</DemoLabel>
    <DemoArea>
      <TouchpadVisualization />
    </DemoArea>

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <TouchpadButtonDiagnostic />
    </DemoArea>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TouchPointDiagnostic side="left" />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <TouchPointDiagnostic side="right" />
        </div>
      </div>
    </DemoArea>

    <SectionHeading>Touch Points</SectionHeading>
    <Prose>
      <p>
        Each touch point reports <code>.x</code> (-1 to 1, left to right)
        and <code>.y</code> (-1 to 1, top to bottom) coordinates, plus a{" "}
        <code>.contact</code> boolean indicating whether a finger is on the
        surface. The <code>.tracker</code> is an incrementing ID that changes
        when a new finger touches down, letting you distinguish separate
        touch gestures.
      </p>
    </Prose>
    <HardwareNote>
      The "left" and "right" labels refer to the first and second touch
      points in the HID report, not physical sides of the touchpad. A
      single finger always registers as <code>.left</code> regardless of
      where it touches.
    </HardwareNote>
    <HardwareNote>
      Some platforms register the DualSense touchpad as a mouse input
      device. This can cause unwanted cursor movement and needs to be
      disabled at the system level (e.g. Steam Input, DS4Windows, or your
      OS gamepad settings).
    </HardwareNote>
    <HardwareNote>
      The <code>.tracker</code> value is provided by the controller
      firmware, not computed by the library. It overflows at 128 back to 0.
    </HardwareNote>
    <CodeBlock
      code={`// First touch point (single-finger)
controller.touchpad.left.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});

// Second touch point (multi-touch)
controller.touchpad.right.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch 2: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});`}
    />

    <SectionHeading>Contact Detection</SectionHeading>
    <Prose>
      <p>
        The <code>.contact</code> property on each touch point is a{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> input that
        supports <code>"press"</code> and <code>"release"</code> events for
        detecting when fingers touch down or lift off.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.touchpad.left.contact.on("press", () => {
  console.log("Finger touched");
});

controller.touchpad.left.contact.on("release", () => {
  console.log("Finger lifted");
});

// Await the next touch
await controller.touchpad.left.contact.promise("press");`}
    />

    <SectionHeading>Touchpad Button</SectionHeading>
    <Prose>
      <p>
        The entire touchpad surface is a clickable{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> button,
        independent of the touch contact state.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.touchpad.button.on("press", () => {
  console.log("Touchpad clicked");
});`}
    />

    <SectionHeading>Listening to All Changes</SectionHeading>
    <Prose>
      <p>
        The parent <code>touchpad</code> input fires <code>"change"</code>{" "}
        on any child change — touch positions, contacts, or button.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.touchpad.on("change", (tp) => {
  const t1 = tp.left;
  const t2 = tp.right;

  if (t1.contact.active) {
    console.log(\`Touch 1: \${t1.x.state}, \${t1.y.state}\`);
  }
  if (t2.contact.active) {
    console.log(\`Touch 2: \${t2.x.state}, \${t2.y.state}\`);
  }
});`}
    />

    <SectionHeading>Events</SectionHeading>
    <Prose>
      <p>
        Touch inputs fire events at HID report rate. The <code>.contact</code>{" "}
        and <code>.button</code> sub-inputs also support{" "}
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
            <td>Any touch position, contact, or button state changes</td>
          </tr>
          <tr>
            <td><code>"press"</code> / <code>"release"</code></td>
            <td>Contact begins / ends, or button click</td>
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
      code={`// Detect swipe gesture with contact tracking
controller.touchpad.left.contact.on("press", () => {
  const startX = controller.touchpad.left.x.state;
  controller.touchpad.left.contact.once("release", () => {
    const delta = controller.touchpad.left.x.state - startX;
    if (Math.abs(delta) > 0.3) {
      console.log(delta > 0 ? "Swipe right" : "Swipe left");
    }
  });
});`}
    />
  </FeaturePage>
);

export default TouchpadPage;
