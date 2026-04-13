import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { ControllerContext } from "../../controller";

/* ── Shared layout ───────────────────────────────────────────── */

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  align-items: stretch;
`;

const Cell = styled.div`
  flex: 1 1 0;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(191, 204, 214, 0.35);
`;

const ResetBtn = styled.button`
  background: rgba(72, 175, 240, 0.15);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 3px;
  color: rgba(72, 175, 240, 0.7);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  cursor: pointer;
  &:hover { background: rgba(72, 175, 240, 0.25); color: rgba(72, 175, 240, 0.9); }
`;

/* ── Horizon ─────────────────────────────────────────────────── */

const Horizon: React.FC<{ pitch: number; roll: number; size: number }> = ({ pitch, roll, size }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 3;
  const pitchPx = Math.max(-r, Math.min(r, (pitch / (Math.PI / 2)) * r));
  const rollDeg = (roll * 180) / Math.PI;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <clipPath id="mc-horizon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <g clipPath="url(#mc-horizon-clip)" transform={`rotate(${rollDeg}, ${cx}, ${cy})`}>
        <rect x={0} y={0} width={size} height={cy + pitchPx} fill="rgba(72,175,240,0.12)" />
        <rect x={0} y={cy + pitchPx} width={size} height={size} fill="rgba(139,90,43,0.15)" />
        <line x1={0} y1={cy + pitchPx} x2={size} y2={cy + pitchPx} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
      </g>
      <line x1={cx - 14} y1={cy} x2={cx - 4} y2={cy} stroke="#f29e02" strokeWidth={2} strokeLinecap="round" />
      <line x1={cx + 4} y1={cy} x2={cx + 14} y2={cy} stroke="#f29e02" strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={1.5} fill="#f29e02" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
    </svg>
  );
};

/* ── Bubble level ────────────────────────────────────────────── */

const BubbleLevel: React.FC<{ pitch: number; roll: number; size: number }> = ({ pitch, roll, size }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 3;
  const maxD = r * 0.7;
  const bx = cx + Math.max(-maxD, Math.min(maxD, -(roll / (Math.PI / 4)) * maxD));
  const by = cy + Math.max(-maxD, Math.min(maxD, (pitch / (Math.PI / 4)) * maxD));
  const dist = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2) / maxD;
  const color = dist < 0.15 ? "rgba(72,175,240,0.8)" : `rgba(242,158,2,${0.4 + dist * 0.5})`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <line x1={cx} y1={cy - r * 0.4} x2={cx} y2={cy + r * 0.4} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      <line x1={cx - r * 0.4} y1={cy} x2={cx + r * 0.4} y2={cy} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={r * 0.15} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
      <circle cx={bx} cy={by} r={6} fill={color} />
      <circle cx={bx} cy={by} r={6} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
    </svg>
  );
};

/* ── Shake meter ─────────────────────────────────────────────── */

const MeterTrack = styled.div`
  width: 100%;
  max-width: 120px;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
`;

const MeterFill = styled.div<{ $pct: number; $active: boolean }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.$active ? "linear-gradient(90deg, #f29e02, #f25c02)" : "rgba(191,204,214,0.15)"};
  border-radius: 4px;
  transition: width 0.05s, background 0.15s;
`;

const jiggle = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px) rotate(-0.5deg); }
  75% { transform: translateX(1px) rotate(0.5deg); }
`;

const FreqBadge = styled.div<{ $active: boolean; $freq: number }>`
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191,204,214,0.15)")};
  transition: color 0.15s;
  ${(p) => p.$active && css`animation: ${jiggle} ${1 / Math.max(1, p.$freq)}s ease-in-out infinite;`}
`;

const FreqUnit = styled.span`
  font-size: 10px;
  font-weight: 400;
  margin-left: 3px;
  color: rgba(191,204,214,0.35);
`;

/* ── Spectrum mini ───────────────────────────────────────────── */

const SPECTRUM_MAX = 8;

const SpectrumMini: React.FC<{ peakRef: React.MutableRefObject<number> }> = ({ peakRef }) => {
  const controller = useContext(ControllerContext);
  const s = controller.shake;
  const bins = s.spectrum.filter((b) => b.freq <= SPECTRUM_MAX);
  let maxP = 0;
  for (const b of bins) if (b.power > maxP) maxP = b.power;
  if (maxP > peakRef.current) peakRef.current = maxP;
  else peakRef.current *= 0.995;
  if (peakRef.current < 1) peakRef.current = 1;
  const norm = peakRef.current;

  const w = 200;
  const h = 60;
  const padL = 4;
  const padR = 4;
  const padT = 2;
  const padB = 12;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ maxWidth: 200 }}>
      {/* Axis labels */}
      {[0, 2, 4, 6, 8].map((f) => (
        <text
          key={f}
          x={padL + (f / SPECTRUM_MAX) * plotW}
          y={h - 1}
          fill="rgba(191,204,214,0.25)" fontSize={7}
          textAnchor="middle" fontFamily="monospace"
        >{f}</text>
      ))}
      {/* Bars */}
      {bins.map((b) => {
        const barW = Math.max(1, plotW / (SPECTRUM_MAX / 0.25) - 0.5);
        const x = padL + (b.freq / SPECTRUM_MAX) * plotW - barW / 2;
        const bh = Math.min(plotH, (b.power / norm) * plotH);
        const isPeak = s.fundamental > 0 && Math.abs(b.freq - s.fundamental) < 0.13;
        return (
          <rect
            key={b.freq} x={x} y={padT + plotH - bh}
            width={barW} height={bh}
            fill={isPeak ? "#f29e02" : "rgba(72,175,240,0.35)"} rx={0.5}
          />
        );
      })}
    </svg>
  );
};

/* ── Composite component ─────────────────────────────────────── */

export const MotionCompact: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);
  const rafRef = useRef(0);
  const peakPowerRef = useRef(1);

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
  const s = controller.shake;
  const sz = 90;

  return (
    <Row>
      <Cell>
        <Horizon pitch={o.pitch} roll={o.roll} size={sz} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Label>Orientation</Label>
          <ResetBtn onClick={handleReset}>Reset</ResetBtn>
        </div>
      </Cell>

      <Cell>
        <BubbleLevel pitch={o.tiltPitch} roll={o.tiltRoll} size={sz} />
        <Label>Tilt</Label>
      </Cell>

      <Cell>
        <FreqBadge $active={s.active} $freq={s.frequency}>
          {s.active ? s.frequency.toFixed(1) : "0.0"}
          <FreqUnit>Hz</FreqUnit>
        </FreqBadge>
        <MeterTrack>
          <MeterFill $pct={Math.min(100, (s.frequency / 10) * 100)} $active={s.active} />
        </MeterTrack>
        <Label>{s.active ? "Shaking" : "Still"}</Label>
      </Cell>

      <Cell style={{ minWidth: 180 }}>
        <SpectrumMini peakRef={peakPowerRef} />
        <Label>Spectrum (fundamental Hz)</Label>
      </Cell>
    </Row>
  );
};
