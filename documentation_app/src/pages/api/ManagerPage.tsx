import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const ManagerPage: React.FC = () => (
  <ApiPage
    name="DualsenseManager"
    extends="Input<DualsenseManagerState>"
    description="Manages multiple DualSense controllers with auto-discovery, player LED assignment, and slot management."
    source="src/manager.ts"
  >
    <CodeBlock
      code={`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// Browser: trigger the WebHID device picker
const requestPermission = manager.getRequest();
button.addEventListener("click", requestPermission);

// React to connections
manager.on("change", ({ active }) => {
  console.log(\`\${active} controller(s) connected\`);
});`}
    />

    <SectionHeading>Constructor Options</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "discoveryInterval", type: "number", description: "Polling interval in ms for device discovery (default: 2000)" },
        { name: "autoAssignPlayerLeds", type: "boolean", description: "Automatically assign LED patterns per player slot (default: true)" },
      ]}
    />

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "DualsenseManagerState", description: "Current state: { active: number, players: ReadonlyMap }" },
        { name: "controllers", type: "readonly Dualsense[]", description: "All managed controller instances" },
        { name: "active", type: "boolean", description: "True if at least one controller is connected" },
        { name: "count", type: "number", description: "Total number of managed controllers" },
        { name: "pending", type: "boolean", description: "True while waiting for device firmware info" },
        { name: "autoAssignPlayerLeds", type: "boolean", description: "Whether LED patterns are auto-assigned" },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "get", signature: "get(index: number): Dualsense | undefined", description: "Get a controller by its slot index." },
        { name: "getRequest", signature: "getRequest(): () => Promise<void>", description: "Returns a function that opens the WebHID device picker. Call on user gesture." },
        { name: "release", signature: "release(index: number): void", description: "Release a specific controller slot." },
        { name: "releaseDisconnected", signature: "releaseDisconnected(): void", description: "Release all slots where the controller is disconnected." },
        { name: "setPlayerPattern", signature: "setPlayerPattern(index: number, bitmask: number): void", description: "Override the LED pattern (0x00–0x1f) for a player slot." },
        { name: "getPlayerPattern", signature: "getPlayerPattern(index: number): number", description: "Get the current LED pattern for a slot." },
        { name: "dispose", signature: "dispose(): void", description: "Stop discovery polling and disconnect all controllers." },
      ]}
    />

    <SectionHeading>Iteration</SectionHeading>
    <CodeBlock
      code={`// Iterate with for...of
for (const controller of manager) {
  console.log(controller.connection.state);
}

// Or use the controllers array
manager.controllers.forEach((c, i) => {
  console.log(\`Player \${i + 1}: \${c.connection.state}\`);
});`}
    />

    <SectionHeading>State Type</SectionHeading>
    <CodeBlock
      code={`interface DualsenseManagerState {
  active: number;
  players: ReadonlyMap<number, Dualsense>;
}`}
    />
  </ApiPage>
);

export default ManagerPage;
