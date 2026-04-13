import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { ConnectionDemo } from "../../components/diagnostics/ControllerInfoDiagnostic";

const ConnectionPage: React.FC = () => (
  <FeaturePage
    title="Connection"
    subtitle="Detect connect/disconnect events and query transport type."
  >
    <Prose>
      <p>
        The <code>connection</code> property is a{" "}
        <Link to="/api/momentary"><code>Momentary</code></Link> input — a
        virtual button that is <code>true</code> when the controller is
        connected and <code>false</code> when it isn't. Like any input, it
        emits <code>change</code> events, supports{" "}
        <code>await</code>, and works with async iterators.
      </p>
    </Prose>

    <DemoLabel>Connect or disconnect your controller to see live updates</DemoLabel>
    <ConnectionDemo />

    <SectionHeading>Connection State</SectionHeading>
    <Prose>
      <p>
        Read the current state directly, or subscribe to changes. The change
        event fires on both connect and disconnect.
      </p>
    </Prose>
    <CodeBlock
      code={`// Read current state
controller.connection.state; // boolean

// Subscribe to changes
controller.connection.on("change", ({ state }) => {
  console.log(state ? "Connected" : "Disconnected");
});

// Wait for connection
await controller.connection.waitFor("change");

// Async iterator
for await (const { state } of controller.connection) {
  console.log(state ? "Connected" : "Disconnected");
}`}
    />

    <SectionHeading>Transport Type</SectionHeading>
    <Prose>
      <p>
        The <code>wireless</code> getter reports whether the controller is
        connected via Bluetooth (<code>true</code>) or USB (
        <code>false</code>).
      </p>
    </Prose>
    <CodeBlock
      code={`controller.wireless; // true = Bluetooth, false = USB

if (controller.wireless) {
  console.log("Connected via Bluetooth");
} else {
  console.log("Connected via USB");
}`}
    />

    <SectionHeading>Reconnection</SectionHeading>
    <Prose>
      <p>
        When a controller disconnects and reconnects, the library
        automatically matches it to its previous slot using a stable hardware
        identity (see{" "}
        <Link to="/status#identity-resolution">identity resolution</Link>).
        All output state — rumble, lightbar, trigger effects, player LEDs —
        is restored automatically. You don't need to re-send commands after a
        reconnection.
      </p>
    </Prose>
    <CodeBlock
      code={`// Output state persists across reconnections
controller.lightbar.set({ r: 255, g: 0, b: 0 });
controller.left.rumble(0.5);

// Disconnect and reconnect — lightbar and rumble resume automatically

// Track reconnections
controller.connection.on("change", ({ state }) => {
  if (state) {
    console.log("Reconnected — outputs auto-restored");
    console.log(controller.wireless ? "via Bluetooth" : "via USB");
  }
});`}
    />

    <SectionHeading>WebHID Permissions</SectionHeading>
    <Prose>
      <p>
        In the browser, WebHID requires a user gesture to grant device
        access. The library provides a <code>requestPermission()</code>
        helper that opens the browser's HID device picker. Once granted,
        permissions persist for the origin and the device will auto-connect
        on future visits.
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

// Browser — requires user gesture (e.g. button click)
const controller = new Dualsense();

// Node.js — connects automatically, no permission needed
const controller = new Dualsense();`}
    />

    <SectionHeading>Node.js Discovery</SectionHeading>
    <Prose>
      <p>
        In Node.js with <code>node-hid</code>, controllers are discovered
        automatically by USB vendor/product ID. No permission prompt is
        needed. The <Link to="/multiplayer">DualsenseManager</Link> handles
        hot-plug detection for multiple controllers.
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense, DualsenseManager } from "dualsense-ts";

// Single controller — auto-discovers first available
const controller = new Dualsense();

// Multiple controllers — auto-discovers all
const manager = new DualsenseManager();
manager.on("add", (controller) => {
  console.log("New controller:", controller.serialNumber);
});`}
    />
  </FeaturePage>
);

export default ConnectionPage;
