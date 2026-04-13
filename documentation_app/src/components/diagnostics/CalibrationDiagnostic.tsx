import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ControllerContext } from "../../controller";

/* ── Layout ─────────────────────────────────────────────────── */

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`;

const Panel = styled.div`
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`;

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

const Row = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const AxisLabel = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  width: 9ch;
  flex-shrink: 0;
`;

const Val = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
`;

const BiasVal = styled(Val)`
  flex-shrink: 0;
  width: 7ch;
`;

const ScaleVal = styled(Val)`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Waiting = styled.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`;

/* ── Formatting ──────────────────────────────────────────────── */

function fmtBias(n: number): string {
  const s = n.toFixed(1);
  return n >= 0 ? `+${s}` : s;
}

function fmtScale(n: number): string {
  // Full numeric value, no scientific notation
  return n.toFixed(20).replace(/0+$/, "0");
}

const DEFAULT_SCALE = 1 / 32767;

/* ── Component ───────────────────────────────────────────────── */

interface CalRow {
  label: string;
  bias: number;
  scale: number;
}

const TitleRow = styled.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
`;

const CalTable: React.FC<{ title: string; rows: CalRow[] }> = ({ title, rows }) => (
  <Panel>
    <TitleRow>{title}</TitleRow>
    <HeaderRow>
      <HeaderCell style={{ width: "9ch", flexShrink: 0 }}>axis</HeaderCell>
      <HeaderCell style={{ flexShrink: 0, width: "7ch", textAlign: "right" }}>bias</HeaderCell>
      <HeaderCell style={{ flex: 1, textAlign: "right" }}>scale</HeaderCell>
    </HeaderRow>
    {rows.map((r, i) => (
      <Row key={r.label} $even={i % 2 === 1}>
        <AxisLabel>{r.label}</AxisLabel>
        <BiasVal $highlight={r.bias !== 0}>{fmtBias(r.bias)}</BiasVal>
        <ScaleVal $highlight={r.scale !== DEFAULT_SCALE}>{fmtScale(r.scale)}</ScaleVal>
      </Row>
    ))}
  </Panel>
);

export const CalibrationDiagnostic: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    controller.connection.on("change", onChange);
    const timer = setTimeout(onChange, 1000);
    return () => {
      controller.connection.removeListener("change", onChange);
      clearTimeout(timer);
    };
  }, [controller]);

  const cal = controller.calibration;
  const isDefault = cal.gyroPitch.scale === DEFAULT_SCALE
    && cal.gyroPitch.bias === 0
    && cal.accelX.bias === 0;

  if (isDefault && !controller.connection.state) {
    return (
      <Wrapper>
        <Waiting>Connect a controller to view its factory calibration</Waiting>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <CalTable
        title="Gyroscope"
        rows={[
          { label: "Pitch (X)", bias: cal.gyroPitch.bias, scale: cal.gyroPitch.scale },
          { label: "Yaw (Y)", bias: cal.gyroYaw.bias, scale: cal.gyroYaw.scale },
          { label: "Roll (Z)", bias: cal.gyroRoll.bias, scale: cal.gyroRoll.scale },
        ]}
      />
      <CalTable
        title="Accelerometer"
        rows={[
          { label: "X", bias: cal.accelX.bias, scale: cal.accelX.scale },
          { label: "Y", bias: cal.accelY.bias, scale: cal.accelY.scale },
          { label: "Z", bias: cal.accelZ.bias, scale: cal.accelZ.scale },
        ]}
      />
    </Wrapper>
  );
};
