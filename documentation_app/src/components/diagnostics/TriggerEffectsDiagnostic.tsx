import React, { useContext, useState, useCallback } from "react";
import styled from "styled-components";
import { TriggerEffect } from "dualsense-ts";
import type { TriggerFeedbackConfig } from "dualsense-ts";
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

/* ── Slider ─────────────────────────────────────────────────── */

const SliderRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const SliderLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 96px;
  flex-shrink: 0;
`;

const SliderValue = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 52px;
  text-align: right;
  flex-shrink: 0;
`;

const TrackWrap = styled.div`
  position: relative;
  flex: 1;
  height: 24px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const TrackFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(90deg, rgba(242, 158, 2, 0.25), rgba(242, 158, 2, 0.55));
  pointer-events: none;
  transition: width 0.04s;
`;

const TrackThumb = styled.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 16px;
  margin-left: -1.5px;
  border-radius: 1.5px;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-50%);
  pointer-events: none;
  transition: left 0.04s;
`;

const HiddenRange = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`;

/* ── Buttons ─────────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ApplyButton = styled.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid rgba(242, 158, 2, 0.3);
  background: rgba(242, 158, 2, 0.08);
  color: rgba(191, 204, 214, 0.5);

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    border-color: rgba(242, 158, 2, 0.6);
    color: #f29e02;
  }
`;

/* ── ParamSlider ─────────────────────────────────────────────── */

interface ParamSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
  even?: boolean;
}

const ParamSlider: React.FC<ParamSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  format,
  even,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <SliderRow $even={even}>
      <SliderLabel>{label}</SliderLabel>
      <TrackWrap>
        <TrackFill style={{ width: `${pct}%` }} />
        <TrackThumb style={{ left: `${pct}%` }} />
        <HiddenRange
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </TrackWrap>
      <SliderValue>{format ? format(value) : value.toFixed(2)}</SliderValue>
    </SliderRow>
  );
};

/* ── Helpers ─────────────────────────────────────────────────── */

function applyConfig(
  controller: { left: { trigger: { feedback: { set: (c: TriggerFeedbackConfig) => void } } }; right: { trigger: { feedback: { set: (c: TriggerFeedbackConfig) => void } } } },
  target: "left" | "both" | "right",
  config: TriggerFeedbackConfig,
) {
  if (target === "left" || target === "both") controller.left.trigger.feedback.set(config);
  if (target === "right" || target === "both") controller.right.trigger.feedback.set(config);
}

/* ── Apply button row (shared by all demos) ──────────────────── */

const ApplyButtons: React.FC<{ onApply: (target: "left" | "both" | "right") => void }> = ({ onApply }) => (
  <ButtonRow>
    <ApplyButton onClick={() => onApply("left")}>Apply to L2</ApplyButton>
    <ApplyButton onClick={() => onApply("both")}>Apply to Both</ApplyButton>
    <ApplyButton onClick={() => onApply("right")}>Apply to R2</ApplyButton>
  </ButtonRow>
);

/* ── Reset ────────────────────────────────────────────────────── */

const ResetButton = styled(ApplyButton)`
  border-color: rgba(72, 175, 240, 0.4);
  background: rgba(72, 175, 240, 0.1);
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
    border-color: rgba(72, 175, 240, 0.6);
  }
`;

export const ResetDemo: React.FC = () => {
  const controller = useContext(ControllerContext);

  const reset = useCallback(
    (target: "left" | "both" | "right") => {
      if (target === "left" || target === "both") controller.left.trigger.feedback.reset();
      if (target === "right" || target === "both") controller.right.trigger.feedback.reset();
    },
    [controller],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>reset triggers</HeaderCell>
      </HeaderRow>
      <ButtonRow>
        <ResetButton onClick={() => reset("left")}>Reset L2</ResetButton>
        <ResetButton onClick={() => reset("both")}>Reset Both</ResetButton>
        <ResetButton onClick={() => reset("right")}>Reset R2</ResetButton>
      </ButtonRow>
    </Table>
  );
};

/* ── Effect Demos ────────────────────────────────────────────── */

/* Feedback */

export const FeedbackDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [position, setPosition] = useState(0.3);
  const [strength, setStrength] = useState(0.8);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Feedback,
        position,
        strength,
      });
    },
    [controller, position, strength],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>feedback parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="position" value={position} onChange={setPosition} />
      <ParamSlider label="strength" value={strength} onChange={setStrength} even />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};

/* Weapon */

export const WeaponDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [start, setStart] = useState(0.2);
  const [end, setEnd] = useState(0.6);
  const [strength, setStrength] = useState(0.9);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Weapon,
        start,
        end,
        strength,
      });
    },
    [controller, start, end, strength],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>weapon parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="start" value={start} onChange={setStart} />
      <ParamSlider label="end" value={end} onChange={setEnd} even />
      <ParamSlider label="strength" value={strength} onChange={setStrength} />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};

/* Bow */

export const BowDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [start, setStart] = useState(0.2);
  const [end, setEnd] = useState(0.6);
  const [strength, setStrength] = useState(0.8);
  const [snapForce, setSnapForce] = useState(0.6);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Bow,
        start,
        end,
        strength,
        snapForce,
      });
    },
    [controller, start, end, strength, snapForce],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>bow parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="start" value={start} onChange={setStart} />
      <ParamSlider label="end" value={end} onChange={setEnd} even />
      <ParamSlider label="strength" value={strength} onChange={setStrength} />
      <ParamSlider label="snapForce" value={snapForce} onChange={setSnapForce} even />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};

/* Galloping */

export const GallopingDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [start, setStart] = useState(0.1);
  const [end, setEnd] = useState(0.9);
  const [firstFoot, setFirstFoot] = useState(0.3);
  const [secondFoot, setSecondFoot] = useState(0.6);
  const [frequency, setFrequency] = useState(20);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Galloping,
        start,
        end,
        firstFoot,
        secondFoot,
        frequency,
      });
    },
    [controller, start, end, firstFoot, secondFoot, frequency],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>galloping parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="start" value={start} onChange={setStart} />
      <ParamSlider label="end" value={end} onChange={setEnd} even />
      <ParamSlider label="firstFoot" value={firstFoot} onChange={setFirstFoot} />
      <ParamSlider label="secondFoot" value={secondFoot} onChange={setSecondFoot} even />
      <ParamSlider
        label="frequency"
        value={frequency}
        onChange={setFrequency}
        min={1}
        max={255}
        step={1}
        format={(v) => `${Math.round(v)} Hz`}
      />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};

/* Vibration */

export const VibrationDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [position, setPosition] = useState(0.1);
  const [amplitude, setAmplitude] = useState(0.7);
  const [frequency, setFrequency] = useState(40);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Vibration,
        position,
        amplitude,
        frequency,
      });
    },
    [controller, position, amplitude, frequency],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>vibration parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="position" value={position} onChange={setPosition} />
      <ParamSlider label="amplitude" value={amplitude} onChange={setAmplitude} even />
      <ParamSlider
        label="frequency"
        value={frequency}
        onChange={setFrequency}
        min={1}
        max={255}
        step={1}
        format={(v) => `${Math.round(v)} Hz`}
      />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};

/* Machine */

export const MachineDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [start, setStart] = useState(0.1);
  const [end, setEnd] = useState(0.9);
  const [amplitudeA, setAmplitudeA] = useState(0.5);
  const [amplitudeB, setAmplitudeB] = useState(0.8);
  const [frequency, setFrequency] = useState(30);
  const [period, setPeriod] = useState(5);

  const apply = useCallback(
    (target: "left" | "both" | "right") => {
      applyConfig(controller, target, {
        effect: TriggerEffect.Machine,
        start,
        end,
        amplitudeA,
        amplitudeB,
        frequency,
        period,
      });
    },
    [controller, start, end, amplitudeA, amplitudeB, frequency, period],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>machine parameters</HeaderCell>
      </HeaderRow>
      <ParamSlider label="start" value={start} onChange={setStart} />
      <ParamSlider label="end" value={end} onChange={setEnd} even />
      <ParamSlider label="amplitudeA" value={amplitudeA} onChange={setAmplitudeA} />
      <ParamSlider label="amplitudeB" value={amplitudeB} onChange={setAmplitudeB} even />
      <ParamSlider
        label="frequency"
        value={frequency}
        onChange={setFrequency}
        min={1}
        max={255}
        step={1}
        format={(v) => `${Math.round(v)} Hz`}
      />
      <ParamSlider
        label="period"
        value={period}
        onChange={setPeriod}
        min={1}
        max={255}
        step={1}
        format={(v) => `${Math.round(v)}`}
        even
      />
      <ApplyButtons onApply={apply} />
    </Table>
  );
};
