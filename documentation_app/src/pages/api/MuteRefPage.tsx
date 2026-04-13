import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const MuteRefPage: React.FC = () => (
  <ApiPage
    name="Mute"
    extends="Momentary"
    description="The mute button with a software-controllable orange LED. Extends Momentary with LED control methods."
    source="src/elements/mute.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "boolean", description: "True when the mute button is pressed (inherited from Momentary)" },
        { name: "active", type: "boolean", description: "Same as state" },
        { name: "status", type: "Momentary", description: "Firmware-managed mute LED status", readonly: true },
        { name: "ledMode", type: "MuteLedMode | undefined", description: 'Current software LED override: "Off", "On", or "Pulse". Undefined when firmware-controlled.' },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "setLed", signature: "setLed(mode: MuteLedMode): void", description: 'Override the mute LED: "Off", "On", or "Pulse".' },
        { name: "resetLed", signature: "resetLed(): void", description: "Return LED control to firmware (default behavior)." },
      ]}
    />

    <SectionHeading>MuteLedMode Enum</SectionHeading>
    <CodeBlock
      code={`enum MuteLedMode {
  Off,
  On,
  Pulse,
}`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`import { MuteLedMode } from "dualsense-ts";

// Button press events
controller.mute.on("press", () => console.log("Mute toggled"));

// Override the LED
controller.mute.setLed(MuteLedMode.On);    // Solid orange
controller.mute.setLed(MuteLedMode.Pulse); // Pulsing
controller.mute.setLed(MuteLedMode.Off);   // Force off

// Return to firmware control
controller.mute.resetLed();`}
    />
  </ApiPage>
);

export default MuteRefPage;
