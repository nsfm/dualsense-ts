import React from "react";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../components/FeaturePage";

const GettingStarted: React.FC = () => (
  <FeaturePage
    title="Getting Started"
    subtitle="Install, connect, and start reading inputs in minutes."
  >
    <SectionHeading>Installation</SectionHeading>
    <Prose>
      <p>Install from npm:</p>
    </Prose>
    <CodeBlock
      code={`npm install dualsense-ts`}
      language="bash"
    />
    <Prose>
      <p>
        <strong>dualsense-ts</strong> has zero production dependencies. It works
        in the browser via WebHID and in Node.js via <code>node-hid</code>.
      </p>
    </Prose>

    <SectionHeading>Browser Requirements</SectionHeading>
    <Prose>
      <p>
        The WebHID API is required for browser usage. Compatible browsers:
      </p>
      <ul>
        <li>Chrome 89+</li>
        <li>Edge 89+</li>
        <li>Opera 75+</li>
      </ul>
      <p>
        Firefox and Safari do not currently support WebHID.
      </p>
    </Prose>

    <SectionHeading>Node.js Setup</SectionHeading>
    <Prose>
      <p>
        For Node.js, install the <code>node-hid</code> peer dependency:
      </p>
    </Prose>
    <CodeBlock
      code={`npm install node-hid`}
      language="bash"
    />

    <SectionHeading>Connecting to a Controller</SectionHeading>
    <Prose>
      <p>
        In Node.js, creating a <code>Dualsense</code> instance automatically
        discovers and connects to the first available controller:
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();`}
    />
    <Prose>
      <p>
        In the browser, WebHID requires a user gesture to grant permission.
        Use <code>DualsenseManager</code> to handle the permission flow:
      </p>
    </Prose>
    <CodeBlock
      code={`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// Call from a click handler
const requestPermission = manager.getRequest();
button.addEventListener("click", requestPermission);

// React to connection changes
manager.on("change", ({ active }) => {
  console.log(\`\${active} controller(s) connected\`);
});`}
    />

    <SectionHeading>Monitoring Connection</SectionHeading>
    <Prose>
      <p>
        The controller's <code>connection</code> property is an input that
        tracks connected state. You can use any of the standard input patterns:
      </p>
    </Prose>
    <CodeBlock
      code={`// Event-based
controller.connection.on("change", (conn) => {
  console.log(conn.state ? "Connected" : "Disconnected");
});

// Synchronous check
if (controller.connection.state) {
  console.log("Controller is connected");
}

// Check if wired or wireless
console.log(controller.wireless ? "Bluetooth" : "USB");`}
    />

    <SectionHeading>Reading Inputs</SectionHeading>
    <Prose>
      <p>
        Every input on the controller supports four access patterns.
        Choose whichever fits your use case:
      </p>
    </Prose>
    <CodeBlock
      code={`// 1. Synchronous read
const pressed = controller.cross.state;
const pressure = controller.left.trigger.pressure;

// 2. Event callbacks
controller.cross.on("press", () => console.log("Cross pressed"));
controller.cross.on("release", () => console.log("Cross released"));
controller.cross.on("change", (btn) => console.log(btn.state));

// 3. Promises
await controller.cross.promise("press");
console.log("Cross was pressed!");

// 4. Async iterators
for await (const { state } of controller.cross) {
  console.log(\`Cross is \${state ? "pressed" : "released"}\`);
}`}
    />
  </FeaturePage>
);

export default GettingStarted;
