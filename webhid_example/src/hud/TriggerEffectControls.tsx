import React from "react";
import styled from "styled-components";
import { Card, HTMLSelect, Slider, RadioGroup, Radio, Button, Tag } from "@blueprintjs/core";
import { Dualsense, TriggerEffect, TriggerFeedbackConfig } from "dualsense-ts";

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  & .bp5-slider {
    min-width: 80px;
    flex: 1;
  }
`;

const Label = styled.span`
  min-width: 80px;
  font-size: 12px;
`;

type TriggerTarget = "left" | "right" | "both";

const EFFECT_OPTIONS = [
  { label: "Off", value: TriggerEffect.Off },
  { label: "Feedback", value: TriggerEffect.Feedback },
  { label: "Weapon", value: TriggerEffect.Weapon },
  { label: "Bow", value: TriggerEffect.Bow },
  { label: "Galloping", value: TriggerEffect.Galloping },
  { label: "Vibration", value: TriggerEffect.Vibration },
  { label: "Machine", value: TriggerEffect.Machine },
];

const DEFAULTS: Record<TriggerEffect, TriggerFeedbackConfig> = {
  [TriggerEffect.Off]: { effect: TriggerEffect.Off },
  [TriggerEffect.Feedback]: {
    effect: TriggerEffect.Feedback,
    position: 0.3,
    strength: 0.8,
  },
  [TriggerEffect.Weapon]: {
    effect: TriggerEffect.Weapon,
    start: 0.15,
    end: 0.7,
    strength: 0.8,
  },
  [TriggerEffect.Bow]: {
    effect: TriggerEffect.Bow,
    start: 0.1,
    end: 0.6,
    strength: 0.8,
    snapForce: 0.9,
  },
  [TriggerEffect.Galloping]: {
    effect: TriggerEffect.Galloping,
    start: 0.1,
    end: 0.6,
    firstFoot: 0.3,
    secondFoot: 0.7,
    frequency: 20,
  },
  [TriggerEffect.Vibration]: {
    effect: TriggerEffect.Vibration,
    position: 0.1,
    amplitude: 0.7,
    frequency: 40,
  },
  [TriggerEffect.Machine]: {
    effect: TriggerEffect.Machine,
    start: 0.1,
    end: 0.9,
    amplitudeA: 0.5,
    amplitudeB: 1.0,
    frequency: 30,
    period: 5,
  },
};

function NormalizedSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <SliderRow>
      <Label>{label}</Label>
      <Slider
        min={0}
        max={1}
        stepSize={0.05}
        labelStepSize={1}
        value={value}
        onChange={onChange}
      />
    </SliderRow>
  );
}

function FrequencySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <SliderRow>
      <Label>{label}</Label>
      <Slider
        min={1}
        max={255}
        stepSize={1}
        labelStepSize={254}
        value={value}
        onChange={onChange}
      />
    </SliderRow>
  );
}

function PeriodSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <SliderRow>
      <Label>{label}</Label>
      <Slider
        min={0}
        max={20}
        stepSize={1}
        labelStepSize={10}
        value={value}
        onChange={onChange}
      />
    </SliderRow>
  );
}

function EffectSliders({
  config,
  onChange,
}: {
  config: TriggerFeedbackConfig;
  onChange: (config: TriggerFeedbackConfig) => void;
}) {
  switch (config.effect) {
    case TriggerEffect.Off:
      return null;

    case TriggerEffect.Feedback:
      return (
        <>
          <NormalizedSlider
            label="Position"
            value={config.position}
            onChange={(v) => onChange({ ...config, position: v })}
          />
          <NormalizedSlider
            label="Strength"
            value={config.strength}
            onChange={(v) => onChange({ ...config, strength: v })}
          />
        </>
      );

    case TriggerEffect.Weapon:
      return (
        <>
          <NormalizedSlider
            label="Start"
            value={config.start}
            onChange={(v) => onChange({ ...config, start: v })}
          />
          <NormalizedSlider
            label="End"
            value={config.end}
            onChange={(v) => onChange({ ...config, end: v })}
          />
          <NormalizedSlider
            label="Strength"
            value={config.strength}
            onChange={(v) => onChange({ ...config, strength: v })}
          />
        </>
      );

    case TriggerEffect.Bow:
      return (
        <>
          <NormalizedSlider
            label="Start"
            value={config.start}
            onChange={(v) => onChange({ ...config, start: v })}
          />
          <NormalizedSlider
            label="End"
            value={config.end}
            onChange={(v) => onChange({ ...config, end: v })}
          />
          <NormalizedSlider
            label="Strength"
            value={config.strength}
            onChange={(v) => onChange({ ...config, strength: v })}
          />
          <NormalizedSlider
            label="Snap Force"
            value={config.snapForce}
            onChange={(v) => onChange({ ...config, snapForce: v })}
          />
        </>
      );

    case TriggerEffect.Galloping:
      return (
        <>
          <NormalizedSlider
            label="Start"
            value={config.start}
            onChange={(v) => onChange({ ...config, start: v })}
          />
          <NormalizedSlider
            label="End"
            value={config.end}
            onChange={(v) => onChange({ ...config, end: v })}
          />
          <NormalizedSlider
            label="First Foot"
            value={config.firstFoot}
            onChange={(v) => onChange({ ...config, firstFoot: v })}
          />
          <NormalizedSlider
            label="Second Foot"
            value={config.secondFoot}
            onChange={(v) => onChange({ ...config, secondFoot: v })}
          />
          <FrequencySlider
            label="Frequency"
            value={config.frequency}
            onChange={(v) => onChange({ ...config, frequency: v })}
          />
        </>
      );

    case TriggerEffect.Vibration:
      return (
        <>
          <NormalizedSlider
            label="Position"
            value={config.position}
            onChange={(v) => onChange({ ...config, position: v })}
          />
          <NormalizedSlider
            label="Amplitude"
            value={config.amplitude}
            onChange={(v) => onChange({ ...config, amplitude: v })}
          />
          <FrequencySlider
            label="Frequency"
            value={config.frequency}
            onChange={(v) => onChange({ ...config, frequency: v })}
          />
        </>
      );

    case TriggerEffect.Machine:
      return (
        <>
          <NormalizedSlider
            label="Start"
            value={config.start}
            onChange={(v) => onChange({ ...config, start: v })}
          />
          <NormalizedSlider
            label="End"
            value={config.end}
            onChange={(v) => onChange({ ...config, end: v })}
          />
          <NormalizedSlider
            label="Amplitude A"
            value={config.amplitudeA}
            onChange={(v) => onChange({ ...config, amplitudeA: v })}
          />
          <NormalizedSlider
            label="Amplitude B"
            value={config.amplitudeB}
            onChange={(v) => onChange({ ...config, amplitudeB: v })}
          />
          <FrequencySlider
            label="Frequency"
            value={config.frequency}
            onChange={(v) => onChange({ ...config, frequency: v })}
          />
          <PeriodSlider
            label="Period"
            value={config.period}
            onChange={(v) => onChange({ ...config, period: v })}
          />
        </>
      );
  }
}

export const TriggerEffectControls = ({
  controller,
}: {
  controller: Dualsense;
}) => {
  const [effect, setEffect] = React.useState<TriggerEffect>(TriggerEffect.Off);
  const [config, setConfig] = React.useState<TriggerFeedbackConfig>(
    DEFAULTS[TriggerEffect.Off]
  );
  const [target, setTarget] = React.useState<TriggerTarget>("right");

  const apply = React.useCallback(
    (cfg: TriggerFeedbackConfig) => {
      if (target === "left" || target === "both") {
        controller.left.trigger.feedback.set(cfg);
      }
      if (target === "right" || target === "both") {
        controller.right.trigger.feedback.set(cfg);
      }
    },
    [controller, target]
  );

  const handleEffectChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newEffect = e.target.value as TriggerEffect;
      setEffect(newEffect);
      const newConfig = { ...DEFAULTS[newEffect] };
      setConfig(newConfig);
      apply(newConfig);
    },
    [apply]
  );

  const handleConfigChange = React.useCallback(
    (newConfig: TriggerFeedbackConfig) => {
      setConfig(newConfig);
      apply(newConfig);
    },
    [apply]
  );

  const handleTargetChange = React.useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setTarget(e.currentTarget.value as TriggerTarget);
    },
    []
  );

  const isActive = effect !== TriggerEffect.Off;

  return (
    <>
      <Card compact={true}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HTMLSelect
            value={effect}
            onChange={handleEffectChange}
            fill={true}
            options={EFFECT_OPTIONS}
          />
          {isActive && (
            <Tag intent="warning" minimal={true}>
              Active
            </Tag>
          )}
        </div>
      </Card>
      <Card compact={true}>
        <RadioGroup
          inline={true}
          label="Trigger"
          selectedValue={target}
          onChange={handleTargetChange}
        >
          <Radio label="Left" value="left" />
          <Radio label="Right" value="right" />
          <Radio label="Both" value="both" />
        </RadioGroup>
      </Card>
      {isActive && (
        <Card compact={true}>
          <EffectSliders config={config} onChange={handleConfigChange} />
        </Card>
      )}
      {isActive && (
        <Card compact={true}>
          <Button
            small={true}
            intent="warning"
            outlined={true}
            text="Reset Triggers"
            onClick={() => {
              controller.resetTriggerFeedback();
              setEffect(TriggerEffect.Off);
              setConfig(DEFAULTS[TriggerEffect.Off]);
            }}
          />
        </Card>
      )}
    </>
  );
};
