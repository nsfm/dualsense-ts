import React from "react";
import styled from "styled-components";
import { Select, Tag, Button } from "../ui";
import { Dualsense, TriggerEffect, TriggerFeedbackConfig } from "dualsense-ts";

const Panel = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`;

const SliderSection = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`;

const SectionLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`;

const BAR_WIDTH = 180;
const BAR_HEIGHT = 28;
const INACTIVE = "#48aff0";

const HBar = ({
  label, value, onChange, min = 0, max = 1, step = 0.05, formatValue,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; formatValue?: (v: number) => string;
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragging = React.useRef(false);

  const valueFromEvent = React.useCallback((e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, stepped)));
  }, [onChange, min, max, step]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    valueFromEvent(e);
    const handleMove = (ev: MouseEvent) => { if (dragging.current) valueFromEvent(ev); };
    const handleUp = () => { dragging.current = false; window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [valueFromEvent]);

  const ratio = (value - min) / (max - min);
  const fillW = ratio * BAR_WIDTH;
  const display = formatValue ? formatValue(value) : value <= 1 ? Math.round(value * 100) + "%" : String(value);

  return (
    <svg ref={svgRef} width={BAR_WIDTH} height={BAR_HEIGHT} style={{ cursor: "ew-resize", borderRadius: 3, flex: "1 1 " + BAR_WIDTH + "px", maxWidth: 280 }} onMouseDown={handleMouseDown}>
      <rect x={0} y={0} width={BAR_WIDTH} height={BAR_HEIGHT} fill="rgba(72, 175, 240, 0.08)" rx={3} />
      <rect x={0.5} y={0.5} width={BAR_WIDTH - 1} height={BAR_HEIGHT - 1} fill="none" stroke="rgba(72, 175, 240, 0.2)" strokeWidth={1} rx={3} />
      {fillW > 0 && <rect x={1} y={1} width={Math.min(fillW, BAR_WIDTH - 2)} height={BAR_HEIGHT - 2} fill={INACTIVE} opacity={0.15 + ratio * 0.25} rx={2} />}
      {ratio > 0 && <line x1={fillW} y1={1} x2={fillW} y2={BAR_HEIGHT - 1} stroke={INACTIVE} strokeWidth={1.5} opacity={0.6} />}
      <text x={7} y={BAR_HEIGHT / 2} dominantBaseline="central" fill="currentColor" fontSize={11} fontWeight={600} opacity={0.5}>{label}</text>
      <text x={BAR_WIDTH - 7} y={BAR_HEIGHT / 2} dominantBaseline="central" textAnchor="end" fill={INACTIVE} fontSize={11} fontWeight={600} opacity={0.7}>{display}</text>
    </svg>
  );
};

const TargetBtn = styled.button<{ $active: boolean }>`
  background: ${(p) => p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.04)"};
  border: 1px solid ${(p) => p.$active ? "rgba(72, 175, 240, 0.5)" : "rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${(p) => (p.$active ? "#48aff0" : "rgba(72, 175, 240, 0.5)")};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(72, 175, 240, 0.15); color: #48aff0; }
`;

type TriggerTarget = "left" | "right" | "both";

const DEFAULTS: Record<TriggerEffect, TriggerFeedbackConfig> = {
  [TriggerEffect.Off]: { effect: TriggerEffect.Off },
  [TriggerEffect.Feedback]: { effect: TriggerEffect.Feedback, position: 0.3, strength: 0.8 },
  [TriggerEffect.Weapon]: { effect: TriggerEffect.Weapon, start: 0.15, end: 0.7, strength: 0.8 },
  [TriggerEffect.Bow]: { effect: TriggerEffect.Bow, start: 0.1, end: 0.6, strength: 0.8, snapForce: 0.9 },
  [TriggerEffect.Galloping]: { effect: TriggerEffect.Galloping, start: 0.1, end: 0.6, firstFoot: 0.3, secondFoot: 0.7, frequency: 20 },
  [TriggerEffect.Vibration]: { effect: TriggerEffect.Vibration, position: 0.1, amplitude: 0.7, frequency: 40 },
  [TriggerEffect.Machine]: { effect: TriggerEffect.Machine, start: 0.1, end: 0.9, amplitudeA: 0.5, amplitudeB: 1.0, frequency: 30, period: 5 },
};

function NormalizedSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return <HBar label={label} value={value} onChange={onChange} />;
}

function FrequencySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return <HBar label={label} value={value} onChange={onChange} min={1} max={255} step={1} formatValue={(v) => String(Math.round(v))} />;
}

function PeriodSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return <HBar label={label} value={value} onChange={onChange} min={0} max={20} step={1} formatValue={(v) => String(Math.round(v))} />;
}

function EffectSliders({ config, onChange }: { config: TriggerFeedbackConfig; onChange: (config: TriggerFeedbackConfig) => void }) {
  switch (config.effect) {
    case TriggerEffect.Off: return null;
    case TriggerEffect.Feedback: return (<><NormalizedSlider label="Position" value={config.position} onChange={(v) => onChange({ ...config, position: v })} /><NormalizedSlider label="Strength" value={config.strength} onChange={(v) => onChange({ ...config, strength: v })} /></>);
    case TriggerEffect.Weapon: return (<><NormalizedSlider label="Start" value={config.start} onChange={(v) => onChange({ ...config, start: v })} /><NormalizedSlider label="End" value={config.end} onChange={(v) => onChange({ ...config, end: v })} /><NormalizedSlider label="Strength" value={config.strength} onChange={(v) => onChange({ ...config, strength: v })} /></>);
    case TriggerEffect.Bow: return (<><NormalizedSlider label="Start" value={config.start} onChange={(v) => onChange({ ...config, start: v })} /><NormalizedSlider label="End" value={config.end} onChange={(v) => onChange({ ...config, end: v })} /><NormalizedSlider label="Strength" value={config.strength} onChange={(v) => onChange({ ...config, strength: v })} /><NormalizedSlider label="Snap Force" value={config.snapForce} onChange={(v) => onChange({ ...config, snapForce: v })} /></>);
    case TriggerEffect.Galloping: return (<><NormalizedSlider label="Start" value={config.start} onChange={(v) => onChange({ ...config, start: v })} /><NormalizedSlider label="End" value={config.end} onChange={(v) => onChange({ ...config, end: v })} /><NormalizedSlider label="First Foot" value={config.firstFoot} onChange={(v) => onChange({ ...config, firstFoot: v })} /><NormalizedSlider label="Second Foot" value={config.secondFoot} onChange={(v) => onChange({ ...config, secondFoot: v })} /><FrequencySlider label="Frequency" value={config.frequency} onChange={(v) => onChange({ ...config, frequency: v })} /></>);
    case TriggerEffect.Vibration: return (<><NormalizedSlider label="Position" value={config.position} onChange={(v) => onChange({ ...config, position: v })} /><NormalizedSlider label="Amplitude" value={config.amplitude} onChange={(v) => onChange({ ...config, amplitude: v })} /><FrequencySlider label="Frequency" value={config.frequency} onChange={(v) => onChange({ ...config, frequency: v })} /></>);
    case TriggerEffect.Machine: return (<><NormalizedSlider label="Start" value={config.start} onChange={(v) => onChange({ ...config, start: v })} /><NormalizedSlider label="End" value={config.end} onChange={(v) => onChange({ ...config, end: v })} /><NormalizedSlider label="Amplitude A" value={config.amplitudeA} onChange={(v) => onChange({ ...config, amplitudeA: v })} /><NormalizedSlider label="Amplitude B" value={config.amplitudeB} onChange={(v) => onChange({ ...config, amplitudeB: v })} /><FrequencySlider label="Frequency" value={config.frequency} onChange={(v) => onChange({ ...config, frequency: v })} /><PeriodSlider label="Period" value={config.period} onChange={(v) => onChange({ ...config, period: v })} /></>);
  }
}

export const TriggerEffectControls = ({ controller }: { controller: Dualsense }) => {
  const [effect, setEffect] = React.useState<TriggerEffect>(TriggerEffect.Off);
  const [config, setConfig] = React.useState<TriggerFeedbackConfig>(DEFAULTS[TriggerEffect.Off]);
  const [target, setTarget] = React.useState<TriggerTarget>("right");

  const apply = React.useCallback((cfg: TriggerFeedbackConfig) => {
    if (target === "left" || target === "both") controller.left.trigger.feedback.set(cfg);
    if (target === "right" || target === "both") controller.right.trigger.feedback.set(cfg);
  }, [controller, target]);

  const handleEffectChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEffect = e.target.value as TriggerEffect;
    setEffect(newEffect);
    const newConfig = { ...DEFAULTS[newEffect] };
    setConfig(newConfig);
    apply(newConfig);
  }, [apply]);

  const handleConfigChange = React.useCallback((newConfig: TriggerFeedbackConfig) => {
    setConfig(newConfig);
    apply(newConfig);
  }, [apply]);

  const isActive = effect !== TriggerEffect.Off;

  return (
    <Panel>
      <Section>
        <SectionLabel>Effect</SectionLabel>
        <Row>
          <Select value={effect} onChange={handleEffectChange} style={{ flex: "1 1 0", minWidth: 0 }}>
            <option value={TriggerEffect.Off}>Off</option>
            <option value={TriggerEffect.Feedback}>Feedback</option>
            <option value={TriggerEffect.Weapon}>Weapon</option>
            <option value={TriggerEffect.Bow}>Bow</option>
            <option value={TriggerEffect.Galloping}>Galloping</option>
            <option value={TriggerEffect.Vibration}>Vibration</option>
            <option value={TriggerEffect.Machine}>Machine</option>
          </Select>
          {isActive && <Tag $intent="warning" $minimal style={{ flexShrink: 0 }}>Active</Tag>}
        </Row>
        <Row>
          {(["left", "right", "both"] as TriggerTarget[]).map((t) => (
            <TargetBtn key={t} $active={target === t} onClick={() => setTarget(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </TargetBtn>
          ))}
        </Row>
        {isActive && (
          <Button $small onClick={() => { controller.resetTriggerFeedback(); setEffect(TriggerEffect.Off); setConfig(DEFAULTS[TriggerEffect.Off]); }} style={{ width: "100%" }}>
            Reset
          </Button>
        )}
      </Section>

      {isActive && (
        <SliderSection>
          <SectionLabel style={{ width: "100%" }}>Parameters</SectionLabel>
          <EffectSliders config={config} onChange={handleConfigChange} />
        </SliderSection>
      )}
    </Panel>
  );
};
