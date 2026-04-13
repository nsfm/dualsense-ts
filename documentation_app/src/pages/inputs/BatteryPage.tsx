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
import { BatteryVisualization } from "../../components/hud/BatteryVisualization";
import { BatteryDiagnostic } from "../../components/diagnostics/BatteryDiagnostic";

const BatteryPage: React.FC = () => (
  <FeaturePage
    title="Battery"
    subtitle="Charge level and charging status monitoring."
  >
    <Prose>
      <p>
        The{" "}
        <Link to="/api/battery"><code>Battery</code></Link> input groups two
        sub-inputs: <code>.level</code> (a 0–1 charge value) and{" "}
        <code>.status</code> (a{" "}
        <Link to="/api/enums"><code>ChargeStatus</code></Link> enum
        indicating charging state). The parent <code>battery</code> fires{" "}
        <code>"change"</code> when either child updates.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Connect your controller to see battery status</DemoLabel>
    <DemoArea>
      <BatteryVisualization />
    </DemoArea>

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <BatteryDiagnostic />
    </DemoArea>

    <SectionHeading>Charge Level</SectionHeading>
    <Prose>
      <p>
        The <code>.level</code> sub-input is a 0–1 value representing the
        current charge. It fires <code>"change"</code> when the level
        updates.
      </p>
    </Prose>
    <HardwareNote>
      The firmware reports battery level in 10% increments (0.0, 0.1,
      0.2, ... 1.0). You won't see granular per-percent changes — the
      value steps in blocks of 0.1.
    </HardwareNote>
    <HardwareNote>
      The raw battery level fluctuates up and down, so dualsense-ts
      buffers and normalizes the value. Additionally, the level may jump
      suddenly when the controller is plugged in or unplugged, and can
      take a few moments to stabilize.
    </HardwareNote>
    <CodeBlock
      code={`// Read current level
const pct = Math.round(controller.battery.level.state * 100);
console.log(\`Battery: \${pct}%\`);

// Watch for changes
controller.battery.level.on("change", ({ state }) => {
  console.log(\`Battery now: \${Math.round(state * 100)}%\`);
});`}
    />

    <SectionHeading>Charging Status</SectionHeading>
    <Prose>
      <p>
        The <code>.status</code> sub-input reports the current charging
        state as a <code>ChargeStatus</code> enum value. The most common
        states are <code>Discharging</code>, <code>Charging</code>, and{" "}
        <code>Full</code>. Error states indicate hardware issues.
      </p>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>Discharging</code></td>
            <td>Running on battery power</td>
          </tr>
          <tr>
            <td><code>Charging</code></td>
            <td>Connected to power and actively charging</td>
          </tr>
          <tr>
            <td><code>Full</code></td>
            <td>Connected to power, fully charged</td>
          </tr>
          <tr>
            <td><code>AbnormalVoltage</code></td>
            <td>Voltage outside safe range</td>
          </tr>
          <tr>
            <td><code>AbnormalTemperature</code></td>
            <td>Temperature outside safe range</td>
          </tr>
          <tr>
            <td><code>ChargingError</code></td>
            <td>General charging failure</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`import { ChargeStatus } from "dualsense-ts";

controller.battery.status.on("change", ({ state }) => {
  switch (state) {
    case ChargeStatus.Charging:
      showChargingIcon();
      break;
    case ChargeStatus.Full:
      showFullIcon();
      break;
    case ChargeStatus.Discharging:
      if (controller.battery.level.state < 0.2) {
        showLowBatteryWarning();
      }
      break;
  }
});`}
    />

    <SectionHeading>Listening to All Changes</SectionHeading>
    <Prose>
      <p>
        The parent <code>battery</code> input fires <code>"change"</code>{" "}
        when either the level or status updates.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.battery.on("change", (battery) => {
  console.log(\`Level: \${Math.round(battery.level.state * 100)}%\`);
  console.log(\`Status: \${battery.status.state}\`);
});

// One-shot low battery check
controller.battery.level.on("change", ({ state }) => {
  if (state < 0.1) {
    alert("Battery critically low!");
  }
});`}
    />
  </FeaturePage>
);

export default BatteryPage;
