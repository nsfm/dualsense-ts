import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../components/FeaturePage";
import { ControllerConnection } from "../components/hud";

const MultiplayerPage: React.FC = () => (
  <FeaturePage
    title="Multiplayer"
    subtitle="Manage up to 31 controllers with automatic player LED assignment."
  >
    <Prose>
      <p>
        The <strong>DualsenseManager</strong> class handles multiple controller
        connections, automatic player LED assignment, reconnection persistence,
        and slot management.
      </p>
    </Prose>

    <DemoLabel>Live Demo — connect multiple controllers using the + button in the top bar</DemoLabel>
    <DemoArea>
      <ControllerConnection />
    </DemoArea>

    <SectionHeading>Setting Up the Manager</SectionHeading>
    <CodeBlock
      code={`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// In the browser, WebHID requires a user gesture
const requestPermission = manager.getRequest();
connectButton.addEventListener("click", requestPermission);`}
    />

    <SectionHeading>Reacting to Connections</SectionHeading>
    <CodeBlock
      code={`manager.on("change", ({ active }) => {
  console.log(\`\${active} controller(s) connected\`);
});

// Access connected controllers
for (const controller of manager.controllers) {
  console.log(controller.connection.state);
}`}
    />

    <SectionHeading>Player LED Assignment</SectionHeading>
    <Prose>
      <p>
        The manager automatically sets the player LEDs on each controller to
        indicate their player number. Player 1 gets one LED, player 2 gets two,
        and so on.
      </p>
    </Prose>

    <SectionHeading>Accessing Individual Controllers</SectionHeading>
    <CodeBlock
      code={`// By index
const p1 = manager.get(0);
const p2 = manager.get(1);

// The controllers array
manager.controllers.forEach((controller, i) => {
  console.log(\`Player \${i + 1}: \${controller.connection.state}\`);
});`}
    />

    <SectionHeading>Slot Management</SectionHeading>
    <CodeBlock
      code={`// Release a specific controller slot
manager.release(0);

// Release only disconnected controllers
manager.releaseDisconnected();

// Dispose of the entire manager
manager.dispose();`}
    />

    <SectionHeading>Pending State</SectionHeading>
    <Prose>
      <p>
        The manager exposes a <code>pending</code> property that indicates
        whether a permission request dialog is currently open:
      </p>
    </Prose>
    <CodeBlock
      code={`if (manager.pending) {
  console.log("Waiting for user to select a controller...");
}`}
    />
  </FeaturePage>
);

export default MultiplayerPage;
