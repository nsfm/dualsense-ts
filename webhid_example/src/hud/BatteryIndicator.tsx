import { useEffect, useState, useContext } from "react";
import { Tag, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { ChargeStatus } from "dualsense-ts";

import { ControllerContext } from "../Controller";

const BatteryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;


function chargeLabel(status: ChargeStatus): string {
  switch (status) {
    case ChargeStatus.Charging:
      return "Charging";
    case ChargeStatus.Full:
      return "Full";
    case ChargeStatus.Discharging:
      return "Battery";
    case ChargeStatus.AbnormalVoltage:
      return "Voltage Error";
    case ChargeStatus.AbnormalTemperature:
      return "Temp Error";
    case ChargeStatus.ChargingError:
      return "Error";
    default:
      return "Unknown";
  }
}

function batteryIntent(level: number, status: ChargeStatus): Intent {
  if (status === ChargeStatus.Charging || status === ChargeStatus.Full) {
    return Intent.SUCCESS;
  }
  if (level < 0.2) return Intent.DANGER;
  if (level < 0.4) return Intent.WARNING;
  return Intent.PRIMARY;
}

export const BatteryIndicator = () => {
  const controller = useContext(ControllerContext);
  const [level, setLevel] = useState(controller.battery.level.state);
  const [status, setStatus] = useState(controller.battery.status.state);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setLevel(controller.battery.level.state);
    setStatus(controller.battery.status.state);
    setConnected(controller.connection.state);
    controller.battery.level.on("change", ({ state }) => setLevel(state));
    controller.battery.status.on("change", ({ state }) => setStatus(state));
    controller.connection.on("change", ({ state }) => setConnected(state));
  }, [controller]);

  if (!connected) return null;

  const pct = Math.round(level * 100);

  const isCharging =
    status === ChargeStatus.Charging || status === ChargeStatus.Full;

  const batteryIcon = (
    <svg width="18" height="10" viewBox="0 0 18 10" style={{ display: "block" }}>
      <rect x="0.5" y="0.5" width="14" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="15" y="3" width="2" height="4" rx="0.5" fill="currentColor" />
      <rect x="2" y="2" width={Math.max(0, level * 11)} height="6" rx="0.5" fill="currentColor" opacity={0.6} />
      {isCharging && (
        <path d="M8 1.5 L6 5 L8.5 5 L7 8.5 L10 4.5 L7.5 4.5 L9 1.5Z" fill="currentColor" opacity={0.9} />
      )}
    </svg>
  );

  return (
    <BatteryContainer>
      <Tag minimal={true} intent={batteryIntent(level, status)} icon={batteryIcon}>
        {chargeLabel(status)}: {pct}%
      </Tag>
    </BatteryContainer>
  );
};
