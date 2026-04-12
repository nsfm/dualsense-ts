import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../components/FeaturePage";
import { BatteryIndicator, ColorIndicator } from "../components/hud";

const StatusPage: React.FC = () => (
  <FeaturePage
    title="Status & Info"
    subtitle="Battery, firmware, factory data, serial number, and controller color."
  >
    <DemoLabel>Live Demo — controller status info</DemoLabel>
    <DemoArea style={{ gap: 32 }}>
      <BatteryIndicator />
      <ColorIndicator />
    </DemoArea>

    <SectionHeading>Battery</SectionHeading>
    <Prose>
      <p>
        Read the battery level and charge status. The battery input fires change
        events when the level or charge state changes.
      </p>
    </Prose>
    <CodeBlock
      code={`// Current battery level (0–100)
console.log(controller.battery.level);

// Charge status: "discharging", "charging", "full"
console.log(controller.battery.status);

// React to changes
controller.battery.on("change", (bat) => {
  console.log(\`Battery: \${bat.level}% (\${bat.status})\`);
});`}
    />

    <SectionHeading>Connection Info</SectionHeading>
    <CodeBlock
      code={`// Wired (USB) or wireless (Bluetooth)
console.log(controller.wireless ? "Bluetooth" : "USB");

// Connection state
controller.connection.on("change", (conn) => {
  console.log(conn.state ? "Connected" : "Disconnected");
});`}
    />

    <SectionHeading>Controller Color</SectionHeading>
    <Prose>
      <p>
        The DualSense stores its body color in firmware. Different controller
        editions have different color values.
      </p>
    </Prose>
    <CodeBlock
      code={`// Returns a DualsenseColor enum value
console.log(controller.color);`}
    />

    <SectionHeading>Serial Number</SectionHeading>
    <CodeBlock
      code={`// Factory-stamped serial number
console.log(controller.serialNumber);`}
    />

    <SectionHeading>Firmware Info</SectionHeading>
    <CodeBlock
      code={`// Firmware and hardware version details
const fw = controller.firmwareInfo;
console.log(fw);`}
    />

    <SectionHeading>Factory Info</SectionHeading>
    <Prose>
      <p>
        Read factory-programmed data including the controller color, board
        revision, and serial.
      </p>
    </Prose>
    <CodeBlock
      code={`const factory = controller.factoryInfo;
console.log(factory);`}
    />
  </FeaturePage>
);

export default StatusPage;
