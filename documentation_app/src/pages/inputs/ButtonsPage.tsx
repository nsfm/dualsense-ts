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
import {
  FaceButtonsDiagnostic,
  DpadDiagnostic,
  UtilityButtonsDiagnostic,
  ShoulderButtonsDiagnostic,
} from "../../components/diagnostics/ButtonsDiagnostic";
import {
  FaceButtons,
  DpadVisualization,
  CreateButton,
  OptionsButton,
  PsButton,
  MuteButton,
  LeftShoulder,
  RightShoulder,
} from "../../components/hud";

const ButtonsPage: React.FC = () => (
  <FeaturePage
    title="Buttons"
    subtitle="Face buttons, D-Pad, and utility buttons."
  >
    <Prose>
      <p>
        The DualSense exposes 18 discrete button inputs. Each is a{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link>{" "}
        input with boolean state — pressed (<code>true</code>) or released (
        <code>false</code>). Every button is an{" "}
        <Link to="/api/input"><code>Input&lt;boolean&gt;</code></Link>{" "}
        with the same event API: <code>.on("press")</code>,{" "}
        <code>.on("release")</code>, <code>.on("change")</code>.
      </p>
      <p>
        The tables below show both <code>.state</code> and{" "}
        <code>.active</code> for each button. For boolean inputs these are
        identical — <code>.active</code> simply returns <code>.state</code>.
        For analog inputs like sticks and triggers, <code>.state</code> is the
        raw numeric value while <code>.active</code> is a derived boolean
        (e.g. whether the stick has moved past its deadzone).
      </p>
    </Prose>

    <SectionHeading>Face Buttons</SectionHeading>
    <DemoLabel>Live State — press buttons on your controller</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 24, width: "100%", alignItems: "center" }}>
        <DemoArea style={{ flex: "0 0 auto", margin: 0, minHeight: 0 }}>
          <FaceButtons />
        </DemoArea>
        <div style={{ flex: 1 }}>
          <FaceButtonsDiagnostic />
        </div>
      </div>
    </DemoArea>
    <CodeBlock
      code={`// Face buttons
controller.triangle.on("press", () => console.log("Triangle"));
controller.circle.on("press", () => console.log("Circle"));
controller.cross.on("press", () => console.log("Cross"));
controller.square.on("press", () => console.log("Square"));

// Synchronous read
if (controller.cross.active) {
  console.log("Cross is held down");
}`}
    />

    <SectionHeading>D-Pad</SectionHeading>
    <Prose>
      <p>
        The D-Pad is a compound input with four directional sub-inputs.
        You can listen to the parent <code>dpad</code> for any change, or
        subscribe to individual directions.
      </p>
    </Prose>
    <HardwareNote>
      The D-Pad reports a single direction value, so opposing axes are
      mutually exclusive — you'll never see <code>up</code> and{" "}
      <code>down</code> (or <code>left</code> and <code>right</code>)
      active at the same time. Adjacent pairs like up + left are fine.
    </HardwareNote>
    <DemoLabel>Live State</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 24, width: "100%", alignItems: "center" }}>
        <DemoArea style={{ flex: "0 0 auto", margin: 0, minHeight: 0 }}>
          <DpadVisualization />
        </DemoArea>
        <div style={{ flex: 1 }}>
          <DpadDiagnostic />
        </div>
      </div>
    </DemoArea>
    <CodeBlock
      code={`// Listen to all dpad changes
controller.dpad.on("change", (dpad) => {
  console.log(dpad.up.active, dpad.down.active,
              dpad.left.active, dpad.right.active);
});

// Or individual directions
controller.dpad.up.on("press", () => console.log("Up!"));`}
    />

    <SectionHeading>Utility Buttons</SectionHeading>
    <HardwareNote>
      Pressing the mute button always toggles the{" "}
      <Link to="/outputs/mute-led">mute LED</Link> at the hardware level,
      regardless of any software configuration.
    </HardwareNote>
    <DemoLabel>Live State</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 24, width: "100%", alignItems: "center" }}>
        <DemoArea style={{ flex: "0 0 auto", margin: 0, minHeight: 0, flexDirection: "column", gap: 8 }}>
          <PsButton />
          <div style={{ display: "flex", gap: 16 }}>
            <CreateButton />
            <OptionsButton />
          </div>
          <MuteButton />
        </DemoArea>
        <div style={{ flex: 1 }}>
          <UtilityButtonsDiagnostic />
        </div>
      </div>
    </DemoArea>
    <CodeBlock
      code={`// PlayStation button
controller.ps.on("press", () => console.log("PS button"));

// Create and Options
controller.create.on("press", () => console.log("Create"));
controller.options.on("press", () => console.log("Options"));

// Mute button (also controls the mute LED)
controller.mute.on("press", () => console.log("Mute toggled"));`}
    />

    <SectionHeading>Bumpers, Triggers & Stick Clicks</SectionHeading>
    <Prose>
      <p>
        The bumpers (L1/R1), trigger buttons (L2/R2),
        and stick clicks (L3/R3) are all <code>Momentary</code> inputs
        accessible as children of <code>.left</code> and <code>.right</code>.
      </p>
    </Prose>
    <HardwareNote>
      The trigger buttons are independent hardware inputs that actuate at
      the top of the trigger pull — they are not derived from the analog
      pressure value.
    </HardwareNote>
    <DemoLabel>Live State</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", gap: 24, width: "100%", alignItems: "center" }}>
        <DemoArea style={{ flex: "0 0 auto", margin: 0, minHeight: 0, gap: 16 }}>
          <LeftShoulder />
          <RightShoulder />
        </DemoArea>
        <div style={{ flex: 1 }}>
          <ShoulderButtonsDiagnostic />
        </div>
      </div>
    </DemoArea>
    <CodeBlock
      code={`controller.left.bumper.on("press", () => console.log("L1"));
controller.right.bumper.on("press", () => console.log("R1"));

// Trigger button (digital click at top of trigger pull)
controller.left.trigger.button.on("press", () => console.log("L2 click"));

// Stick clicks
controller.left.analog.button.on("press", () => console.log("L3"));
controller.right.analog.button.on("press", () => console.log("R3"));`}
    />

    <SectionHeading>Events</SectionHeading>
    <Prose>
      <p>
        All button inputs share the same event API inherited from{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link>.
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
            <td>State transitions in either direction</td>
          </tr>
          <tr>
            <td><code>"press"</code></td>
            <td>State becomes <code>true</code></td>
          </tr>
          <tr>
            <td><code>"release"</code></td>
            <td>State becomes <code>false</code></td>
          </tr>
          <tr>
            <td><code>"input"</code></td>
            <td>Every HID report, regardless of whether the value changed</td>
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
      code={`controller.cross.on("press", () => console.log("Pressed"));
controller.cross.on("release", () => console.log("Released"));

// Fire once then stop listening
controller.triangle.once("press", () => console.log("First press"));

// Await the next press
await controller.square.promise("press");`}
    />
  </FeaturePage>
);

export default ButtonsPage;
