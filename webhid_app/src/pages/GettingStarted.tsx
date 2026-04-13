import React from "react";
import { Link } from "react-router";
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
    <CodeBlock code={`npm install dualsense-ts`} language="bash" />

    <SectionHeading>Browser Setup</SectionHeading>
    <Prose>
      <p>
        In the browser, <code>dualsense-ts</code> has zero dependencies — it
        uses the built-in WebHID API directly. Compatible browsers:
      </p>
      <ul>
        <li>Chrome 89+</li>
        <li>Edge 89+</li>
        <li>Opera 75+</li>
      </ul>
      <p>
        Firefox, Safari, and mobile browsers do not currently support WebHID.
      </p>
    </Prose>

    <SectionHeading>Node.js Setup</SectionHeading>
    <Prose>
      <p>
        For Node.js, install the one peer dependency, <code>node-hid</code>:
      </p>
    </Prose>
    <CodeBlock code={`npm install node-hid`} language="bash" />

    <SectionHeading>Connecting a Controller</SectionHeading>
    <Prose>
      <p>
        In Node.js, simply creating a{" "}
        <Link to="/api/dualsense">
          <code>Dualsense</code>
        </Link>{" "}
        instance automatically discovers and connects to the first available
        controller:
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();`}
    />
    <Prose>
      <p>
        In the browser, WebHID requires a{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/Security/User_activation"
          target="_blank"
          rel="noopener noreferrer"
        >
          user gesture
        </a>{" "}
        to grant device access. The <code>Dualsense</code> class provides a
        callback you can wire to a click handler:
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();

// Wire to a click handler
button.addEventListener("click", controller.hid.provider.getRequest());`}
    />
    <Prose>
      <p>
        For <Link to="/multiplayer">multiplayer support</Link>, use{" "}
        <Link to="/api/manager">
          <code>DualsenseManager</code>
        </Link>{" "}
        to handle permission flow and manage multiple controllers.
      </p>
    </Prose>

    <SectionHeading>Monitoring Connections</SectionHeading>
    <Prose>
      <p>
        The controller's <code>connection</code> property is an{" "}
        <Link to="/api/input">
          <code>Input</code>
        </Link>{" "}
        that tracks connected state. Like every input in the library, it
        supports events, promises, and synchronous reads:
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
        Every{" "}
        <Link to="/api/input">
          <code>Input&lt;T&gt;</code>
        </Link>{" "}
        on the controller supports four access patterns — choose whichever fits
        your use case:
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
    <Prose>
      <p>
        These patterns work for every input type —{" "}
        <Link to="/inputs/buttons">buttons</Link>,{" "}
        <Link to="/inputs/analog">analog sticks</Link>,{" "}
        <Link to="/inputs/triggers">triggers</Link>,{" "}
        <Link to="/inputs/touchpad">touchpad</Link>,{" "}
        <Link to="/inputs/motion">motion sensors</Link>, and{" "}
        <Link to="/inputs/battery">battery</Link>. See the{" "}
        <Link to="/inputs">Inputs overview</Link> for a deeper look at the input
        system.
      </p>
    </Prose>
  </FeaturePage>
);

export default GettingStarted;
