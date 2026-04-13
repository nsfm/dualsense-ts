import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import type { Dualsense, Trigger } from "dualsense-ts";
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

/* ── Data hook ────────────────────────────────────────────── */

function fmt(n: number): string {
  return n.toFixed(3);
}

function useTriggerData(trigger: Trigger) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    trigger.on("change", onChange);
    trigger.button.on("change", onChange);
    return () => {
      trigger.removeListener("change", onChange);
      trigger.button.removeListener("change", onChange);
    };
  }, [trigger]);

  return trigger;
}

/* ── Row data ─────────────────────────────────────────────── */

interface TriggerRowData {
  label: string;
  tooltip: string;
  state: string;
  active: boolean;
  highlight: boolean;
}

const TriggerRow: React.FC<{
  data: TriggerRowData;
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

/* ── Per-trigger diagnostic ───────────────────────────────── */

const TriggerDiagnosticConnected: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Trigger;
}> = ({ prefix, selector }) => {
  const controller = useContext(ControllerContext);
  const trigger = selector(controller);
  useTriggerData(trigger);

  return (
    <>
      <TriggerRow
        data={{
          label: `${prefix}.state`,
          tooltip: "Normalized analog pressure. 0 (released) to 1 (fully pressed).",
          state: fmt(trigger.state),
          active: trigger.state > 0,
          highlight: trigger.state > 0,
        }}
        even={false}
      />
      <TriggerRow
        data={{
          label: `${prefix}.pressure`,
          tooltip: "Alias for .state — returns the same normalized 0–1 pressure value.",
          state: fmt(trigger.pressure),
          active: trigger.pressure > 0,
          highlight: trigger.pressure > 0,
        }}
        even={true}
      />
      <TriggerRow
        data={{
          label: `${prefix}.active`,
          tooltip: "True when pressure is greater than 0.",
          state: trigger.active ? "true" : "false",
          active: trigger.active,
          highlight: trigger.active,
        }}
        even={false}
      />
      <TriggerRow
        data={{
          label: `${prefix}.button`,
          tooltip: "Independent digital button that actuates at the top of the trigger pull. Not derived from analog pressure.",
          state: trigger.button.active ? "true" : "false",
          active: trigger.button.active,
          highlight: trigger.button.active,
        }}
        even={true}
      />
    </>
  );
};

/* ── Config rows with sliders ─────────────────────────────── */

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #48aff0;
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #48aff0;
    cursor: pointer;
    border: none;
  }
`;

const SliderRow = styled.div<{ $even?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const SliderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const SliderLabel = styled.code`
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

const SliderVal = styled.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: rgba(191, 204, 214, 0.5);
`;

const ConfigSlider: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  even: boolean;
}> = ({ label, value, onChange, min, max, step, even }) => {
  const parts = label.split(".");
  return (
    <SliderRow $even={even}>
      <SliderTopRow>
        <SliderLabel>
          <Dim>controller.</Dim>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Dim>.</Dim>}
              {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
            </React.Fragment>
          ))}
        </SliderLabel>
        <SliderVal>{value.toFixed(3)}</SliderVal>
      </SliderTopRow>
      <Slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </SliderRow>
  );
};

const TriggerConfigConnected: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Trigger;
}> = ({ prefix, selector }) => {
  const controller = useContext(ControllerContext);
  const trigger = selector(controller);
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  const defaults = useRef({
    threshold: trigger.threshold,
    deadzone: trigger.deadzone,
  });

  useEffect(() => {
    const saved = defaults.current;
    return () => {
      trigger.threshold = saved.threshold;
      trigger.deadzone = saved.deadzone;
    };
  }, [trigger]);

  const setThreshold = useCallback((v: number) => {
    trigger.threshold = v;
    rerender();
  }, [trigger, rerender]);

  const setDeadzone = useCallback((v: number) => {
    trigger.deadzone = v;
    rerender();
  }, [trigger, rerender]);

  return (
    <>
      <ConfigSlider label={`${prefix}.threshold`} value={trigger.threshold} onChange={setThreshold} min={0} max={0.1} step={0.001} even={false} />
      <ConfigSlider label={`${prefix}.deadzone`} value={trigger.deadzone} onChange={setDeadzone} min={0} max={0.2} step={0.001} even={true} />
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

const ConfigHeader: React.FC = () => (
  <HeaderRow>
    <HeaderCell style={{ flexShrink: 0 }}>config</HeaderCell>
    <HeaderCell style={{ flex: 1 }} />
    <HeaderCell style={{ flexShrink: 0, width: "5ch", textAlign: "right" }}>value</HeaderCell>
  </HeaderRow>
);

export const TriggerDiagnostic: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Trigger;
}> = ({ prefix, selector }) => (
  <Table>
    <DiagnosticHeader />
    <TriggerDiagnosticConnected prefix={prefix} selector={selector} />
  </Table>
);

export const TriggerConfig: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Trigger;
}> = ({ prefix, selector }) => (
  <Table>
    <ConfigHeader />
    <TriggerConfigConnected prefix={prefix} selector={selector} />
  </Table>
);
