import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ChargeStatus } from "dualsense-ts";
import { ControllerContext } from "../../controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StatusLabel = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${(p) => p.$color};
`;

const PercentLabel = styled.span`
  font-size: 32px;
  font-weight: 300;
  color: rgba(191, 204, 214, 0.9);
  font-variant-numeric: tabular-nums;
`;

function statusColor(level: number, status: ChargeStatus): string {
  if (status === ChargeStatus.Charging) return "#3dcc91";
  if (status === ChargeStatus.Full) return "#3dcc91";
  if (
    status === ChargeStatus.AbnormalVoltage ||
    status === ChargeStatus.AbnormalTemperature ||
    status === ChargeStatus.ChargingError
  )
    return "#ff6b6b";
  if (level < 0.2) return "#ff6b6b";
  if (level < 0.4) return "#f29e02";
  return "#48aff0";
}

function statusText(status: ChargeStatus): string {
  switch (status) {
    case ChargeStatus.Charging:
      return "Charging";
    case ChargeStatus.Full:
      return "Fully Charged";
    case ChargeStatus.Discharging:
      return "Discharging";
    case ChargeStatus.AbnormalVoltage:
      return "Abnormal Voltage";
    case ChargeStatus.AbnormalTemperature:
      return "Abnormal Temperature";
    case ChargeStatus.ChargingError:
      return "Charging Error";
    default:
      return "Unknown";
  }
}

const BATTERY_W = 120;
const BATTERY_H = 56;
const CAP_W = 8;
const CAP_H = 24;
const FILL_PAD = 4;
const FILL_H = BATTERY_H - FILL_PAD * 2;
const FILL_MAX_W = BATTERY_W - FILL_PAD * 2;
const R = 6;

export const BatteryVisualization: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [level, setLevel] = useState(controller.battery.level.state);
  const [status, setStatus] = useState(controller.battery.status.state);

  useEffect(() => {
    setLevel(controller.battery.level.state);
    setStatus(controller.battery.status.state);
    controller.battery.level.on("change", ({ state }) => setLevel(state));
    controller.battery.status.on("change", ({ state }) => setStatus(state));
  }, [controller]);

  const color = statusColor(level, status);
  const pct = Math.round(level * 100);
  const fillW = Math.max(0, level * FILL_MAX_W);
  const isCharging =
    status === ChargeStatus.Charging || status === ChargeStatus.Full;

  return (
    <Container>
      <svg
        width={BATTERY_W + CAP_W + 2}
        height={BATTERY_H + 2}
        viewBox={`-1 -1 ${BATTERY_W + CAP_W + 2} ${BATTERY_H + 2}`}
      >
        {/* Battery body outline */}
        <rect
          x={0}
          y={0}
          width={BATTERY_W}
          height={BATTERY_H}
          rx={R}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          opacity={0.6}
        />
        {/* Positive terminal cap */}
        <rect
          x={BATTERY_W}
          y={(BATTERY_H - CAP_H) / 2}
          width={CAP_W}
          height={CAP_H}
          rx={2}
          fill={color}
          opacity={0.4}
        />
        {/* Fill level */}
        {fillW > 0 && (
          <rect
            x={FILL_PAD}
            y={FILL_PAD}
            width={fillW}
            height={FILL_H}
            rx={R - 2}
            fill={color}
            opacity={0.35}
          />
        )}
        {/* Charging bolt */}
        {isCharging && (
          <path
            d={`M${BATTERY_W / 2 + 2} ${BATTERY_H * 0.15}
                L${BATTERY_W / 2 - 5} ${BATTERY_H * 0.52}
                L${BATTERY_W / 2 + 1} ${BATTERY_H * 0.52}
                L${BATTERY_W / 2 - 2} ${BATTERY_H * 0.85}
                L${BATTERY_W / 2 + 5} ${BATTERY_H * 0.48}
                L${BATTERY_W / 2 - 1} ${BATTERY_H * 0.48}
                Z`}
            fill={color}
            opacity={0.8}
          />
        )}
      </svg>
      <PercentLabel>{pct}%</PercentLabel>
      <StatusLabel $color={color}>{statusText(status)}</StatusLabel>
    </Container>
  );
};
