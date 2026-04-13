import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
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

/* ── Intensity meter ─────────────────────────────────────────── */

const MeterOuter = styled.div`
  flex: 1 1 200px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
`;

const MeterTrack = styled.div`
  width: 100%;
  max-width: 200px;
  height: 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
`;

const MeterFill = styled.div<{ $pct: number; $active: boolean }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) =>
    p.$active
      ? "linear-gradient(90deg, #f29e02, #f25c02)"
      : "rgba(191, 204, 214, 0.15)"};
  border-radius: 6px;
  transition: width 0.05s, background 0.15s;
`;

const MeterLabel = styled.div<{ $active: boolean }>`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.35)")};
  transition: color 0.15s;
`;

const jiggle = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px) rotate(-1deg); }
  40% { transform: translateX(2px) rotate(1deg); }
  60% { transform: translateX(-1px) rotate(-0.5deg); }
  80% { transform: translateX(1px) rotate(0.5deg); }
`;

const FrequencyBadge = styled.div<{ $active: boolean; $freq: number }>`
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.15)")};
  transition: color 0.15s;
  ${(p) => p.$active && css`animation: ${jiggle} ${1 / Math.max(1, p.$freq)}s ease-in-out infinite;`}
`;

const FrequencyUnit = styled.span`
  font-size: 13px;
  font-weight: 400;
  margin-left: 4px;
  color: rgba(191, 204, 214, 0.35);
`;

/* ── Window-size control ─────────────────────────────────────── */

const WINDOW_PRESETS = [
  { label: "Fast (64)", value: 64 },
  { label: "Balanced (128)", value: 128 },
  { label: "Balanced+ (256)", value: 256 },
  { label: "Precise (512)", value: 512 },
  { label: "Very precise (1024)", value: 1024 },
] as const;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ControlLabel = styled.label`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex-shrink: 0;
`;

const StyledSelect = styled.select`
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(191, 204, 214, 0.85);
  font-size: 12px;
  font-family: inherit;
  padding: 4px 8px;
  cursor: pointer;

  option {
    background: #1a1a2e;
    color: rgba(191, 204, 214, 0.85);
  }

  &:focus {
    outline: none;
    border-color: rgba(72, 175, 240, 0.4);
  }
`;

const WindowInfo = styled.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.3);
  white-space: nowrap;
`;

const StyledRange = styled.input`
  flex: 1;
  height: 4px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(72, 175, 240, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(72, 175, 240, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
  }
`;

/* ── Spectrum chart ──────────────────────────────────────────── */

const SpectrumOuter = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const SpectrumSvg = styled.svg`
  display: block;
  width: 100%;
  height: 120px;
`;

const SPECTRUM_MAX_FREQ = 8; // only show bins up to 8 Hz fundamental

/* ── Component ───────────────────────────────────────────────── */

const MAX_FREQ_DISPLAY = 10; // meter range: 0–10 Hz reversal rate

export const ShakeDiagnostic: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);
  const rafRef = useRef(0);
  const peakPowerRef = useRef(1); // running max for spectrum normalization

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
        <Waiting>Connect a controller to try shake detection</Waiting>
      </Wrapper>
    );
  }

  const s = controller.shake;
  const windowDuration = s.windowSize / Math.max(1, s.inputRate);
  const bins = s.spectrum;

  // Filter bins to display range and find max for normalization
  const displayBins = bins.filter((b) => b.freq <= SPECTRUM_MAX_FREQ);
  let maxPower = 0;
  for (const b of displayBins) {
    if (b.power > maxPower) maxPower = b.power;
  }
  // Use a decaying peak for stable normalization
  if (maxPower > peakPowerRef.current) {
    peakPowerRef.current = maxPower;
  } else {
    peakPowerRef.current *= 0.995; // slow decay
  }
  if (peakPowerRef.current < 1) peakPowerRef.current = 1;
  const normPower = peakPowerRef.current;

  // Spectrum SVG dimensions
  const svgW = 600;
  const svgH = 120;
  const padL = 30;
  const padR = 8;
  const padT = 8;
  const padB = 20;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  return (
    <Wrapper>
      {/* Properties table */}
      <Panel>
        <TitleRow>State</TitleRow>
        <Row>
          <PropLabel><Dim>shake.</Dim>active</PropLabel>
          <Val $highlight={s.active}>{s.active ? "true" : "false"}</Val>
        </Row>
        <Row $even>
          <PropLabel><Dim>shake.</Dim>intensity</PropLabel>
          <Val $highlight={s.intensity > 0.05}>{s.intensity.toFixed(3)}</Val>
        </Row>
        <Row>
          <PropLabel><Dim>shake.</Dim>frequency</PropLabel>
          <Val $highlight={s.frequency > 0}>{s.frequency > 0 ? `${s.frequency.toFixed(2)} Hz` : "—"}</Val>
        </Row>
        <Row $even>
          <PropLabel><Dim>shake.</Dim>fundamental</PropLabel>
          <Val $highlight={s.fundamental > 0}>{s.fundamental > 0 ? `${s.fundamental.toFixed(2)} Hz` : "—"}</Val>
        </Row>
        <Row>
          <PropLabel><Dim>shake.</Dim>inputRate</PropLabel>
          <Val>{s.inputRate.toFixed(0)} <Dim>Hz</Dim></Val>
        </Row>
        <ControlRow>
          <ControlLabel>Window</ControlLabel>
          <StyledSelect
            value={s.windowSize}
            onChange={(e) => { s.windowSize = Number(e.target.value); }}
          >
            {WINDOW_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </StyledSelect>
          <WindowInfo>{windowDuration.toFixed(1)}s</WindowInfo>
        </ControlRow>
        <ControlRow>
          <ControlLabel>Threshold</ControlLabel>
          <StyledRange
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={s.threshold}
            onChange={(e) => { s.threshold = Number(e.target.value); }}
          />
          <WindowInfo>{s.threshold.toFixed(2)}</WindowInfo>
        </ControlRow>
      </Panel>

      {/* Visual meter */}
      <MeterOuter>
        <FrequencyBadge $active={s.active} $freq={s.frequency}>
          {s.active ? s.frequency.toFixed(1) : "0.0"}
          <FrequencyUnit>Hz</FrequencyUnit>
        </FrequencyBadge>
        <MeterTrack>
          <MeterFill $pct={Math.min(100, (s.frequency / MAX_FREQ_DISPLAY) * 100)} $active={s.active} />
        </MeterTrack>
        <MeterLabel $active={s.active}>
          {s.active ? "Shaking" : "Still"}
        </MeterLabel>
      </MeterOuter>

      {/* Live spectrum */}
      <SpectrumOuter>
        <TitleRow>Spectrum (fundamental bins)</TitleRow>
        <SpectrumSvg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8].map((f) => {
            const x = padL + (f / SPECTRUM_MAX_FREQ) * plotW;
            return (
              <g key={f}>
                <line
                  x1={x} y1={padT} x2={x} y2={padT + plotH}
                  stroke="rgba(255,255,255,0.06)" strokeWidth={1}
                />
                <text
                  x={x} y={svgH - 4}
                  fill="rgba(191,204,214,0.3)" fontSize={9}
                  textAnchor="middle" fontFamily="monospace"
                >
                  {f}
                </text>
              </g>
            );
          })}
          {/* Hz label */}
          <text
            x={svgW - padR} y={svgH - 4}
            fill="rgba(191,204,214,0.2)" fontSize={8}
            textAnchor="end" fontFamily="monospace"
          >
            Hz
          </text>

          {/* Bars */}
          {displayBins.map((b) => {
            const barW = Math.max(1, plotW / (SPECTRUM_MAX_FREQ / 0.25) - 0.5);
            const x = padL + (b.freq / SPECTRUM_MAX_FREQ) * plotW - barW / 2;
            const h = Math.min(plotH, (b.power / normPower) * plotH);
            const isPeak = s.fundamental > 0 && Math.abs(b.freq - s.fundamental) < 0.13;
            return (
              <rect
                key={b.freq}
                x={x}
                y={padT + plotH - h}
                width={barW}
                height={h}
                fill={isPeak ? "#f29e02" : "rgba(72, 175, 240, 0.4)"}
                rx={0.5}
              />
            );
          })}

          {/* Peak marker */}
          {s.fundamental > 0 && (
            <text
              x={padL + (s.fundamental / SPECTRUM_MAX_FREQ) * plotW}
              y={padT - 1}
              fill="#f29e02" fontSize={8}
              textAnchor="middle" fontFamily="monospace"
            >
              {s.fundamental.toFixed(2)}
            </text>
          )}
        </SpectrumSvg>
      </SpectrumOuter>
    </Wrapper>
  );
};
