import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoLabel,
  Prose,
  CodeBlock,
  HardwareNote,
} from "../components/FeaturePage";
import { MultiplayerDemo } from "../components/diagnostics/MultiplayerDiagnostic";

const MultiplayerPage: React.FC = () => (
  <FeaturePage
    title="Multiplayer"
    subtitle="Manage multiple controllers with automatic discovery, identity-based reconnection, and player LED assignment."
  >
    <Prose>
      <p>
        The <strong>DualsenseManager</strong> class handles multi-controller
        scenarios. It discovers controllers automatically, assigns player LED
        patterns, tracks hardware identity for seamless reconnection, and
        exposes the full set of managed controllers through a stable slot
        system.
      </p>
    </Prose>

    <DemoLabel>
      Connect or disconnect controllers to see live slot updates
    </DemoLabel>
    <MultiplayerDemo />

    <SectionHeading>Setting Up the Manager</SectionHeading>
    <Prose>
      <p>
        Create a manager instance to start discovering controllers. In the
        browser, WebHID requires a{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/User_activation" target="_blank" rel="noopener noreferrer">
          user gesture
        </a>{" "}
        to open the device picker — the manager provides a{" "}
        <code>getRequest()</code> helper for this. In Node.js, controllers are
        discovered automatically via USB enumeration.
      </p>
    </Prose>
    <CodeBlock
      code={`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// Browser — attach to a button click
const requestPermission = manager.getRequest();
connectButton.addEventListener("click", requestPermission);

// Node.js — controllers are discovered automatically
// Optional: configure polling interval (default 2000ms)
const manager = new DualsenseManager({ discoveryInterval: 1000 });`}
    />

    <SectionHeading>Reacting to Changes</SectionHeading>
    <Prose>
      <p>
        The manager is an <Link to="/api/input"><code>Input</code></Link> —
        it emits <code>change</code> events whenever controllers connect,
        disconnect, or any controller input changes. The state payload
        includes the active count and a map of all managed controllers keyed
        by slot index.
      </p>
    </Prose>
    <CodeBlock
      code={`manager.on("change", ({ active, players }) => {
  console.log(\`\${active} controller(s) connected\`);
  for (const [index, controller] of players) {
    console.log(\`Slot \${index}: \${controller.connection.state}\`);
  }
});

// Async iteration
for await (const { active } of manager) {
  console.log(\`Active controllers: \${active}\`);
}`}
    />

    <SectionHeading>Accessing Controllers</SectionHeading>
    <Prose>
      <p>
        Managed controllers are accessible by slot index or as an array.
        Disconnected controllers remain in their slots so that output state
        (rumble, lightbar, trigger effects) can be restored automatically when
        they reconnect.
      </p>
    </Prose>
    <CodeBlock
      code={`// By index
const p1 = manager.get(0);
const p2 = manager.get(1);

// As an array
manager.controllers.forEach((controller, i) => {
  console.log(\`Player \${i + 1}: \${controller.connection.state}\`);
});

// Iterable
for (const controller of manager) {
  console.log(controller.factoryInfo.colorName);
}

// Counts
manager.count;  // total managed (including disconnected)
manager.active; // true if any controller is connected`}
    />

    <SectionHeading>Identity &amp; Reconnection</SectionHeading>
    <Prose>
      <p>
        When a controller connects, the manager reads its firmware and factory
        info to derive a stable hardware identity. If a disconnected slot
        matches the same identity, the device is transparently{" "}
        <em>transplanted</em> into the existing slot — the consumer's{" "}
        <code>Dualsense</code> reference never changes, and all output state is
        restored automatically.
      </p>
      <p>
        Identity is resolved from the most specific source available: factory
        serial number (via a test command protocol), or the{" "}
        <code>deviceInfo</code> blob from Feature Report 0x20. This is far
        more reliable than the serial number reported by the OS HID layer,
        which can be missing or wrong.
      </p>
    </Prose>
    <HardwareNote>
      Newly connected controllers appear in a <em>provisional</em> state while
      identity is being resolved. The <code>pending</code> property is{" "}
      <code>true</code> during this window. Provisional controllers are hidden
      from <code>controllers</code>, <code>count</code>, and{" "}
      <code>state.players</code> to prevent consumers from seeing a slot that
      may be merged moments later.
    </HardwareNote>
    <CodeBlock
      code={`// Check if any controllers are still being identified
if (manager.pending) {
  console.log("Resolving controller identity...");
}

// Identity-based reconnection is automatic
// Disconnect player 1, reconnect it — same slot, same state
controller.lightbar.set({ r: 255, g: 0, b: 0 });
// ... disconnect ... reconnect ...
// Lightbar is still red — no re-send needed`}
    />

    <SectionHeading>Player LED Assignment</SectionHeading>
    <Prose>
      <p>
        By default, the manager assigns player LED patterns matching the PS5
        console convention: Player 1 gets one center LED, Player 2 gets two
        inner LEDs, and so on. The first four patterns match{" "}
        <code>PlayerID.Player1</code> through <code>PlayerID.Player4</code>.
        Players 5–31 use the remaining 5-bit patterns, ordered for visual
        distinctiveness.
      </p>
      <p>
        Automatic assignment can be disabled, and individual patterns can be
        overridden at any time.
      </p>
    </Prose>
    <CodeBlock
      code={`// Disable auto-assignment
const manager = new DualsenseManager({ autoAssignPlayerLeds: false });
// ...or toggle at runtime
manager.autoAssignPlayerLeds = false;

// Override a specific slot's pattern (5-bit bitmask, 0x00–0x1f)
manager.setPlayerPattern(0, 0x1f); // All 5 LEDs on for Player 1
manager.getPlayerPattern(0);       // 0x1f`}
    />

    <SectionHeading>Slot Management</SectionHeading>
    <Prose>
      <p>
        Release slots to free them for reuse. Releasing a slot disconnects the
        controller (if still connected), removes identity mappings, and
        re-indexes the remaining slots — including updating their player LED
        assignments.
      </p>
    </Prose>
    <CodeBlock
      code={`// Release a specific slot
manager.release(0);

// Release only disconnected controllers
manager.releaseDisconnected();

// Shut down entirely — stops discovery and disconnects all
manager.dispose();`}
    />

    <SectionHeading>WebHID vs Node.js</SectionHeading>
    <Prose>
      <p>
        The manager adapts its discovery mechanism to the runtime environment.
      </p>
      <ul>
        <li>
          <strong>Browser (WebHID):</strong> Controllers are added through the
          device picker (user gesture required). Already-permitted devices are
          re-discovered on page load via periodic enumeration. The{" "}
          <code>connect</code> event on <code>navigator.hid</code> catches
          newly-permitted devices.
        </li>
        <li>
          <strong>Node.js (node-hid):</strong> Controllers are discovered
          automatically via USB vendor/product ID polling. No user interaction
          needed. The polling interval is configurable via{" "}
          <code>discoveryInterval</code> (default: 2000ms).
        </li>
      </ul>
    </Prose>
    <CodeBlock
      code={`// Browser — user must click to grant access
const request = manager.getRequest();
document.getElementById("connect")!.onclick = request;

// Node.js — auto-discovery with custom interval
const manager = new DualsenseManager({ discoveryInterval: 500 });`}
    />
  </FeaturePage>
);

export default MultiplayerPage;
