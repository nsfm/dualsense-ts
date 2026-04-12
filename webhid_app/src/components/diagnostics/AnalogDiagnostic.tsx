import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import type { Dualsense, Analog } from "dualsense-ts";
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

/* ── Analog data hook ──────────────────────────────────────── */

interface AnalogRowData {
  label: string;
  tooltip: string;
  state: string;
  active: boolean;
  highlight: boolean;
}

function fmt(n: number): string {
  const s = n.toFixed(3);
  // Preserve sign alignment: positive numbers get a leading space
  return n >= 0 ? ` ${s}` : s;
}

function fmtUnsigned(n: number): string {
  return n.toFixed(3);
}

function fmtDeg(n: number): string {
  return `${n.toFixed(1)}°`;
}

function useAnalogData(analog: Analog) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    analog.on("change", onChange);
    return () => {
      analog.removeListener("change", onChange);
    };
  }, [analog]);

  return analog;
}

/* ── Property label with info ──────────────────────────────── */

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

/* ── Row components ────────────────────────────────────────── */

const AnalogRow: React.FC<{
  data: AnalogRowData;
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

/* ── Per-stick diagnostic ──────────────────────────────────── */

const StickDiagnosticConnected: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Analog;
}> = ({ prefix, selector }) => {
  const controller = useContext(ControllerContext);
  const analog = selector(controller);
  useAnalogData(analog);

  const rows: AnalogRowData[] = [
    { label: `${prefix}.x.state`, tooltip: "Raw horizontal axis position. -1 (left) to 1 (right). No deadzone applied.", state: fmt(analog.x.state), active: analog.x.active, highlight: analog.x.state !== 0 },
    { label: `${prefix}.x.force`, tooltip: "Horizontal position with deadzone applied. Returns 0 when inside the axis deadzone.", state: fmt(analog.x.force), active: analog.x.active, highlight: analog.x.force !== 0 },
    { label: `${prefix}.y.state`, tooltip: "Raw vertical axis position. -1 (up) to 1 (down). No deadzone applied.", state: fmt(analog.y.state), active: analog.y.active, highlight: analog.y.state !== 0 },
    { label: `${prefix}.y.force`, tooltip: "Vertical position with deadzone applied. Returns 0 when inside the axis deadzone.", state: fmt(analog.y.force), active: analog.y.active, highlight: analog.y.force !== 0 },
    { label: `${prefix}.magnitude`, tooltip: "Distance from center (0 to 1), deadzone-normalized. Computed from x.force and y.force, then scaled by the stick deadzone.", state: fmtUnsigned(analog.magnitude), active: analog.magnitude > 0, highlight: analog.magnitude > 0 },
    { label: `${prefix}.direction`, tooltip: "Angle of the stick in degrees. Computed from x.force and y.force via atan2.", state: fmtDeg(analog.degrees), active: analog.magnitude > 0, highlight: analog.magnitude > 0 },
    { label: `${prefix}.active`, tooltip: "True when magnitude > 0 or the stick button is pressed.", state: analog.active ? "true" : "false", active: analog.active, highlight: analog.active },
    { label: `${prefix}.button`, tooltip: "Stick click (L3/R3). Independent digital input.", state: analog.button.active ? "true" : "false", active: analog.button.active, highlight: analog.button.active },
  ];

  return (
    <>
      {rows.map((r, i) => (
        <AnalogRow key={r.label} data={r} even={i % 2 === 1} />
      ))}
    </>
  );
};

/* ── Config rows with sliders ──────────────────────────────── */

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
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const SliderLabel = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  min-width: 0;
  flex-shrink: 0;
`;

const SliderWrap = styled.div`
  flex: 1;
  min-width: 80px;
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
  even: boolean;
}> = ({ label, value, onChange, even }) => {
  const parts = label.split(".");
  return (
    <SliderRow $even={even}>
      <SliderLabel>
        <Dim>controller.</Dim>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Dim>.</Dim>}
            {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
          </React.Fragment>
        ))}
      </SliderLabel>
      <SliderWrap>
        <Slider
          type="range"
          min={0}
          max={0.2}
          step={0.001}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </SliderWrap>
      <SliderVal>{value.toFixed(3)}</SliderVal>
    </SliderRow>
  );
};

const StickConfigConnected: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Analog;
}> = ({ prefix, selector }) => {
  const controller = useContext(ControllerContext);
  const analog = selector(controller);
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  const defaults = useRef({
    deadzone: analog.deadzone,
    xDeadzone: analog.x.deadzone,
    yDeadzone: analog.y.deadzone,
  });

  useEffect(() => {
    const saved = defaults.current;
    return () => {
      analog.deadzone = saved.deadzone;
      analog.x.deadzone = saved.xDeadzone;
      analog.y.deadzone = saved.yDeadzone;
    };
  }, [analog]);

  const setDeadzone = useCallback((v: number) => {
    analog.deadzone = v;
    rerender();
  }, [analog, rerender]);

  const setXDeadzone = useCallback((v: number) => {
    analog.x.deadzone = v;
    rerender();
  }, [analog, rerender]);

  const setYDeadzone = useCallback((v: number) => {
    analog.y.deadzone = v;
    rerender();
  }, [analog, rerender]);

  return (
    <>
      <ConfigSlider label={`${prefix}.deadzone`} value={analog.deadzone} onChange={setDeadzone} even={false} />
      <ConfigSlider label={`${prefix}.x.deadzone`} value={analog.x.deadzone} onChange={setXDeadzone} even={true} />
      <ConfigSlider label={`${prefix}.y.deadzone`} value={analog.y.deadzone} onChange={setYDeadzone} even={false} />
    </>
  );
};

/* ── Exported components ───────────────────────────────────── */

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

export const AnalogStickDiagnostic: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Analog;
}> = ({ prefix, selector }) => (
  <Table>
    <DiagnosticHeader />
    <StickDiagnosticConnected prefix={prefix} selector={selector} />
  </Table>
);

export const AnalogStickConfig: React.FC<{
  prefix: string;
  selector: (c: Dualsense) => Analog;
}> = ({ prefix, selector }) => (
  <Table>
    <ConfigHeader />
    <StickConfigConnected prefix={prefix} selector={selector} />
  </Table>
);
