import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ControllerContext } from "../../controller";

/* ── Layout ─────────────────────────────────────────────────── */

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  align-items: stretch;
`;

const Panel = styled.div`
  flex: 1 1 240px;
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
`;

const Row = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const PropLabel = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex-shrink: 0;
`;

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const Val = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  text-align: right;
  flex: 1;
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

/* ── Bubble level visualization ──────────────────────────────── */

const LevelSvg = styled.svg`
  display: block;
`;

const BubbleLevel: React.FC<{ pitch: number; roll: number; size?: number }> = ({
  pitch,
  roll,
  size = 120,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  // Map tilt angles to bubble position (invert: tilt right = bubble goes left)
  const maxDisplace = r * 0.7;
  const bx = cx + Math.max(-maxDisplace, Math.min(maxDisplace, -(roll / (Math.PI / 4)) * maxDisplace));
  const by = cy + Math.max(-maxDisplace, Math.min(maxDisplace, (pitch / (Math.PI / 4)) * maxDisplace));

  // Distance from center for color interpolation
  const dist = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2) / maxDisplace;
  const bubbleColor = dist < 0.15
    ? "rgba(72, 175, 240, 0.8)"  // centered: blue
    : `rgba(242, 158, 2, ${0.4 + dist * 0.5})`; // tilted: amber

  return (
    <LevelSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background ring */}
      <circle cx={cx} cy={cy} r={r} fill="rgba(0, 0, 0, 0.3)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

      {/* Crosshairs */}
      <line x1={cx} y1={cy - r * 0.5} x2={cx} y2={cy + r * 0.5} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      <line x1={cx - r * 0.5} y1={cy} x2={cx + r * 0.5} y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />

      {/* Center target rings */}
      <circle cx={cx} cy={cy} r={r * 0.15} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

      {/* Bubble */}
      <circle cx={bx} cy={by} r={8} fill={bubbleColor} />
      <circle cx={bx} cy={by} r={8} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
    </LevelSvg>
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

/* ── Component ───────────────────────────────────────────────── */

export const TiltDiagnostic: React.FC = () => {
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

  const connected = controller.connection.state;

  if (!connected) {
    return (
      <Wrapper>
        <Waiting>Connect a controller to view live tilt</Waiting>
      </Wrapper>
    );
  }

  const o = controller.orientation;
  const pitchActive = Math.abs(o.tiltPitch) > 0.05;
  const rollActive = Math.abs(o.tiltRoll) > 0.05;

  return (
    <Wrapper>
      {/* Values table */}
      <Panel>
        <TitleRow>Tilt Angles</TitleRow>
        <Row>
          <PropLabel><Dim>orientation.</Dim>tiltPitch</PropLabel>
          <Val $highlight={pitchActive}>{fmtRad(o.tiltPitch)}</Val>
          <DegVal $highlight={pitchActive}>{fmtDeg(o.tiltPitch)}</DegVal>
        </Row>
        <Row $even>
          <PropLabel><Dim>orientation.</Dim>tiltRoll</PropLabel>
          <Val $highlight={rollActive}>{fmtRad(o.tiltRoll)}</Val>
          <DegVal $highlight={rollActive}>{fmtDeg(o.tiltRoll)}</DegVal>
        </Row>
      </Panel>

      {/* Bubble level visualization */}
      <div style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}>
        <BubbleLevel pitch={o.tiltPitch} roll={o.tiltRoll} size={120} />
        <div style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(191, 204, 214, 0.3)",
        }}>
          Bubble level
        </div>
      </div>
    </Wrapper>
  );
};
