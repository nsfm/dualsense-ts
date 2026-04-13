import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
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
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`;

const TitleRow = styled.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResetButton = styled.button`
  background: rgba(72, 175, 240, 0.15);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 4px;
  color: rgba(72, 175, 240, 0.7);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: rgba(72, 175, 240, 0.25);
    color: rgba(72, 175, 240, 0.9);
  }
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
  width: 5ch;
  flex-shrink: 0;
`;

const Val = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  text-align: right;
  flex: 1;
  min-width: 0;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.06s;
`;

const DegVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  text-align: right;
  flex-shrink: 0;
  width: 7ch;
  color: ${(p) => (p.$highlight ? "rgba(72, 175, 240, 0.7)" : "rgba(191, 204, 214, 0.35)")};
  transition: color 0.06s;
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

/* ── Quaternion visualization ────────────────────────────────── */

const QuatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const QuatLabel = styled.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.4);
  flex-shrink: 0;
  width: 2ch;
`;

const QuatVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.06s;
`;

/* ── Horizon indicator ───────────────────────────────────────── */

const HorizonSvg = styled.svg`
  display: block;
`;

const Horizon: React.FC<{ pitch: number; roll: number; size?: number }> = ({
  pitch,
  roll,
  size = 120,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  // Pitch shifts the horizon line up/down (clamp to ±r)
  const pitchPx = Math.max(-r, Math.min(r, (pitch / (Math.PI / 2)) * r));
  // Roll rotates the whole horizon line
  const rollDeg = (roll * 180) / Math.PI;

  return (
    <HorizonSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id="horizon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(0, 0, 0, 0.3)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

      {/* Sky/ground split */}
      <g clipPath="url(#horizon-clip)" transform={`rotate(${rollDeg}, ${cx}, ${cy})`}>
        <rect x={0} y={0} width={size} height={cy + pitchPx} fill="rgba(72, 175, 240, 0.12)" />
        <rect x={0} y={cy + pitchPx} width={size} height={size} fill="rgba(139, 90, 43, 0.15)" />
        <line x1={0} y1={cy + pitchPx} x2={size} y2={cy + pitchPx} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={1.5} />
        {/* Pitch reference lines */}
        {[-30, -15, 15, 30].map((deg) => {
          const offset = (deg / 90) * r;
          return (
            <line
              key={deg}
              x1={cx - r * 0.3}
              y1={cy + pitchPx + offset}
              x2={cx + r * 0.3}
              y2={cy + pitchPx + offset}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={0.5}
            />
          );
        })}
      </g>

      {/* Fixed aircraft reference */}
      <line x1={cx - 20} y1={cy} x2={cx - 6} y2={cy} stroke="#f29e02" strokeWidth={2} strokeLinecap="round" />
      <line x1={cx + 6} y1={cy} x2={cx + 20} y2={cy} stroke="#f29e02" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={2} fill="#f29e02" />

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
    </HorizonSvg>
  );
};

/* ── Formatting ──────────────────────────────────────────────── */

function fmtRad(n: number): string {
  const s = n.toFixed(3);
  return n >= 0 ? `+${s}` : s;
}

function fmtDeg(n: number): string {
  const d = (n * 180) / Math.PI;
  const s = Math.abs(d).toFixed(1);
  return d >= 0 ? `+${s}°` : `-${s}°`;
}

function fmtQuat(n: number): string {
  return n.toFixed(4);
}

/* ── Component ───────────────────────────────────────────────── */

export const OrientationDiagnostic: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const loop = () => {
      setTick((t) => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [controller]);

  const handleReset = useCallback(() => {
    controller.orientation.reset();
  }, [controller]);

  const o = controller.orientation;
  const connected = controller.connection.state;

  if (!connected) {
    return (
      <Wrapper>
        <Waiting>Connect a controller to view live orientation</Waiting>
      </Wrapper>
    );
  }

  const [w, x, y, z] = o.quaternion;
  const anyRotation = Math.abs(o.pitch) > 0.01 || Math.abs(o.yaw) > 0.01 || Math.abs(o.roll) > 0.01;

  return (
    <Wrapper>
      {/* Euler angles panel */}
      <Panel>
        <TitleRow>
          <span>Euler Angles</span>
          <ResetButton onClick={handleReset}>Reset</ResetButton>
        </TitleRow>
        <HeaderRow>
          <HeaderCell style={{ width: "5ch", flexShrink: 0 }}>axis</HeaderCell>
          <HeaderCell style={{ flex: 1, textAlign: "right" }}>radians</HeaderCell>
          <HeaderCell style={{ flexShrink: 0, width: "7ch", textAlign: "right" }}>degrees</HeaderCell>
        </HeaderRow>
        {([
          ["Pitch", o.pitch],
          ["Yaw", o.yaw],
          ["Roll", o.roll],
        ] as [string, number][]).map(([label, val], i) => (
          <Row key={label} $even={i % 2 === 1}>
            <AxisLabel>{label}</AxisLabel>
            <Val $highlight={Math.abs(val) > 0.01}>{fmtRad(val)}</Val>
            <DegVal $highlight={Math.abs(val) > 0.01}>{fmtDeg(val)}</DegVal>
          </Row>
        ))}
      </Panel>

      {/* Tilt panel */}
      <Panel>
        <TitleRow>
          <span>Accelerometer Tilt</span>
        </TitleRow>
        <HeaderRow>
          <HeaderCell style={{ width: "5ch", flexShrink: 0 }}>axis</HeaderCell>
          <HeaderCell style={{ flex: 1, textAlign: "right" }}>radians</HeaderCell>
          <HeaderCell style={{ flexShrink: 0, width: "7ch", textAlign: "right" }}>degrees</HeaderCell>
        </HeaderRow>
        {([
          ["Pitch", o.tiltPitch],
          ["Roll", o.tiltRoll],
        ] as [string, number][]).map(([label, val], i) => (
          <Row key={label} $even={i % 2 === 1}>
            <AxisLabel>{label}</AxisLabel>
            <Val $highlight={Math.abs(val) > 0.05}>{fmtRad(val)}</Val>
            <DegVal $highlight={Math.abs(val) > 0.05}>{fmtDeg(val)}</DegVal>
          </Row>
        ))}
      </Panel>

      {/* Quaternion + horizon */}
      <Panel style={{ flex: "1 1 200px" }}>
        <TitleRow><span>Quaternion</span></TitleRow>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "rgba(0, 0, 0, 0.06)" }}>
          <Horizon pitch={o.pitch} roll={o.roll} size={100} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {([
              ["w", w],
              ["x", x],
              ["y", y],
              ["z", z],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <QuatLabel>{label}</QuatLabel>
                <QuatVal $highlight={anyRotation && label !== "w"}>{fmtQuat(val)}</QuatVal>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </Wrapper>
  );
};
