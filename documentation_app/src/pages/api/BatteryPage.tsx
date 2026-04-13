import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const BatteryPage: React.FC = () => (
  <ApiPage
    name="Battery"
    extends="Input<Battery>"
    description="Battery level and charge status. Fires change events when level or charge state updates."
    source="src/elements/battery.ts"
  >
    <SectionHeading>Child Inputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "level", type: "BatteryLevel (Input<Intensity>)", description: "Charge level from 0 (empty) to 1 (full)", readonly: true },
        { name: "status", type: "BatteryStatus (Input<ChargeStatus>)", description: "Charge state: Discharging, Charging, or ChargingError", readonly: true },
      ]}
    />

    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "boolean", description: "True if charging or battery is low" },
      ]}
    />

    <SectionHeading>ChargeStatus Enum</SectionHeading>
    <CodeBlock
      code={`enum ChargeStatus {
  Discharging = 0x0,
  Charging = 0x1,
  Full = 0x2,
  AbnormalVoltage = 0xa,
  AbnormalTemperature = 0xb,
  ChargingError = 0xf,
}`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`controller.battery.on("change", (bat) => {
  const pct = (bat.level.state * 100).toFixed(0);
  console.log(\`Battery: \${pct}% (\${ChargeStatus[bat.status.state]})\`);
});`}
    />
  </ApiPage>
);

export default BatteryPage;
