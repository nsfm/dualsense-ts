import { useEffect, useState, useContext } from "react";
import { Tag, ProgressBar, Intent } from "@blueprintjs/core";
import styled from "styled-components";
import { ChargeStatus } from "dualsense-ts";

import { ControllerContext } from "../Controller";

const BatteryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BatteryBar = styled.div`
  width: 60px;
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
    controller.battery.level.on("change", ({ state }) => setLevel(state));
    controller.battery.status.on("change", ({ state }) => setStatus(state));
    controller.connection.on("change", ({ state }) => setConnected(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connected) return null;

  const pct = Math.round(level * 100);

  return (
    <BatteryContainer>
      <Tag minimal={true} intent={batteryIntent(level, status)}>
        {chargeLabel(status)}: {pct}%
      </Tag>
      <BatteryBar>
        <ProgressBar
          value={level}
          intent={batteryIntent(level, status)}
          stripes={status === ChargeStatus.Charging}
          animate={status === ChargeStatus.Charging}
        />
      </BatteryBar>
    </BatteryContainer>
  );
};
