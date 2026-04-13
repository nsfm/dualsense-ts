import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import type { Dualsense, Gyroscope, Accelerometer } from "dualsense-ts";
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
  width: 7ch;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.06s;
`;

const ActiveVal = styled.code<{ $active: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.3)")};
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

/* ── Data types ───────────────────────────────────────────── */

interface RowData {
  label: string;
  tooltip: string;
  state: string;
  active: boolean;
  highlight: boolean;
}

function fmt(n: number): string {
  const s = n.toFixed(3);
  return n >= 0 ? ` ${s}` : s;
}

/* ── Row component ────────────────────────────────────────── */

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
      <ActiveVal $active={data.active}>
        {data.active ? "true" : "false"}
      </ActiveVal>
    </Row>
  );
};

/* ── Gyroscope diagnostic ─────────────────────────────────── */

function buildAxisRows(
  prefix: string,
  sensor: Gyroscope | Accelerometer,
  tooltips: { x: string; y: string; z: string; force: string },
): RowData[] {
  return [
    { label: `${prefix}.x.state`, tooltip: tooltips.x, state: fmt(sensor.x.state), active: sensor.x.active, highlight: sensor.x.state !== 0 },
    { label: `${prefix}.x.force`, tooltip: `${tooltips.force} X axis. Returns 0 inside the axis deadzone.`, state: fmt(sensor.x.force), active: sensor.x.active, highlight: sensor.x.force !== 0 },
    { label: `${prefix}.y.state`, tooltip: tooltips.y, state: fmt(sensor.y.state), active: sensor.y.active, highlight: sensor.y.state !== 0 },
    { label: `${prefix}.y.force`, tooltip: `${tooltips.force} Y axis. Returns 0 inside the axis deadzone.`, state: fmt(sensor.y.force), active: sensor.y.active, highlight: sensor.y.force !== 0 },
    { label: `${prefix}.z.state`, tooltip: tooltips.z, state: fmt(sensor.z.state), active: sensor.z.active, highlight: sensor.z.state !== 0 },
    { label: `${prefix}.z.force`, tooltip: `${tooltips.force} Z axis. Returns 0 inside the axis deadzone.`, state: fmt(sensor.z.force), active: sensor.z.active, highlight: sensor.z.force !== 0 },
  ];
}

const GyroscopeConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const gyro = controller.gyroscope;
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    gyro.on("change", onChange);
    return () => {
      gyro.removeListener("change", onChange);
    };
  }, [gyro]);

  const rows = buildAxisRows("gyroscope", gyro, {
    x: "Raw angular velocity around the X axis (pitch). -1 to 1.",
    y: "Raw angular velocity around the Y axis (yaw). -1 to 1.",
    z: "Raw angular velocity around the Z axis (roll). -1 to 1.",
    force: "Deadzone-applied angular velocity on the",
  });

  return (
    <>
      {rows.map((r, i) => (
        <DiagnosticRow key={r.label} data={r} even={i % 2 === 1} />
      ))}
    </>
  );
};

const AccelerometerConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const accel = controller.accelerometer;
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    accel.on("change", onChange);
    return () => {
      accel.removeListener("change", onChange);
    };
  }, [accel]);

  const rows = buildAxisRows("accelerometer", accel, {
    x: "Linear acceleration on the X axis (lateral). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",
    y: "Linear acceleration on the Y axis (vertical). Includes gravity (~0.25 at rest). ~0.25 = 1g, 1.0 = 4g.",
    z: "Linear acceleration on the Z axis (forward/back). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",
    force: "Deadzone-applied linear acceleration on the",
  });

  return (
    <>
      {rows.map((r, i) => (
        <DiagnosticRow key={r.label} data={r} even={i % 2 === 1} />
      ))}
    </>
  );
};

/* ── Exported components ──────────────────────────────────── */

const DiagnosticHeader: React.FC = () => (
  <HeaderRow>
    <div style={{ width: 15, flexShrink: 0 }} />
    <HeaderCell style={{ flex: 1 }}>property</HeaderCell>
    <HeaderCell style={{ flexShrink: 0, width: "7ch", textAlign: "right" }}>value</HeaderCell>
    <HeaderCell style={{ flexShrink: 0, width: "5ch" }}>active</HeaderCell>
  </HeaderRow>
);

export const GyroscopeDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <GyroscopeConnected />
  </Table>
);

export const AccelerometerDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <AccelerometerConnected />
  </Table>
);
