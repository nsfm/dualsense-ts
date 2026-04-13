import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ChargeStatus } from "dualsense-ts";
import { ControllerContext } from "../../controller";

/* ── Layout ─────────────────────────────────────────────────── */

const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child {
    border-radius: 8px 8px 0 0;
  }

  & > :last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const Row = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

/* ── Header ────────────────────────────────────────────────── */

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`;

const HeaderCell = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`;

/* ── Text cells ─────────────────────────────────────────────── */

const Label = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`;

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const Val = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 12ch;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.06s;
`;

/* ── Property label with info tooltip ─────────────────────── */

const PropertyGroup = styled.div<{ $tip: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: help;
  position: relative;

  & > code {
    transition: color 0.1s;
  }

  &:hover > code {
    color: rgba(191, 204, 214, 1);
  }

  &:hover > span:first-child {
    color: rgba(191, 204, 214, 0.6);
    border-color: rgba(191, 204, 214, 0.3);
  }

  &::after {
    content: ${(p) => JSON.stringify(p.$tip)};
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 6px;
    padding: 6px 10px;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: rgba(191, 204, 214, 0.85);
    line-height: 1.4;
    white-space: normal;
    max-width: 320px;
    width: max-content;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s 0.08s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid rgba(191, 204, 214, 0.15);
  font-size: 10px;
  font-style: italic;
  font-family: Georgia, serif;
  color: rgba(191, 204, 214, 0.3);
  flex-shrink: 0;
`;

/* ── Row data ─────────────────────────────────────────────── */

interface RowData {
  label: string;
  tooltip: string;
  state: string;
  highlight: boolean;
}

const DiagnosticRow: React.FC<{
  data: RowData;
  even: boolean;
}> = ({ data, even }) => {
  const parts = data.label.split(".");
  return (
    <Row $even={even}>
      <PropertyGroup $tip={data.tooltip}>
        <InfoIcon>i</InfoIcon>
        <Label>
          <Dim>controller.</Dim>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Dim>.</Dim>}
              {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
            </React.Fragment>
          ))}
        </Label>
      </PropertyGroup>
      <Val $highlight={data.highlight}>
        {data.state}
      </Val>
    </Row>
  );
};

/* ── Connected diagnostic ─────────────────────────────────── */

function chargeStatusName(status: ChargeStatus): string {
  switch (status) {
    case ChargeStatus.Discharging:
      return "Discharging";
    case ChargeStatus.Charging:
      return "Charging";
    case ChargeStatus.Full:
      return "Full";
    case ChargeStatus.AbnormalVoltage:
      return "AbnormalVoltage";
    case ChargeStatus.AbnormalTemperature:
      return "AbnormalTemp";
    case ChargeStatus.ChargingError:
      return "ChargingError";
    default:
      return `Unknown(${status})`;
  }
}

const BatteryDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const battery = controller.battery;
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    battery.on("change", onChange);
    return () => {
      battery.removeListener("change", onChange);
    };
  }, [battery]);

  const level = battery.level.state;
  const status = battery.status.state;
  const isCharging =
    status === ChargeStatus.Charging || status === ChargeStatus.Full;

  const rows: RowData[] = [
    {
      label: "battery.level.state",
      tooltip: "Battery charge level as a 0–1 value. Reported in 10% increments by the firmware (0.0, 0.1, 0.2, ... 1.0).",
      state: level.toFixed(1),
      highlight: level > 0,
    },
    {
      label: "battery.status.state",
      tooltip: "Current charging status from the ChargeStatus enum: Discharging, Charging, Full, AbnormalVoltage, AbnormalTemperature, or ChargingError.",
      state: chargeStatusName(status),
      highlight: isCharging,
    },
  ];

  return (
    <>
      {rows.map((r, i) => (
        <DiagnosticRow key={r.label} data={r} even={i % 2 === 1} />
      ))}
    </>
  );
};

/* ── Exported component ───────────────────────────────────── */

const DiagnosticHeader: React.FC = () => (
  <HeaderRow>
    <div style={{ width: 15, flexShrink: 0 }} />
    <HeaderCell style={{ flex: 1 }}>property</HeaderCell>
    <HeaderCell style={{ flexShrink: 0, width: "12ch", textAlign: "right" }}>value</HeaderCell>
  </HeaderRow>
);

export const BatteryDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <BatteryDiagnosticConnected />
  </Table>
);
