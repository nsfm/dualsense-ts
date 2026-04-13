import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import type { Dualsense, Touchpad } from "dualsense-ts";
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

/* ── Data types ───────────────────────────────────────────── */

interface RowData {
  label: string;
  tooltip: string;
  state: string;
  active: boolean;
  highlight: boolean;
}

function fmt(n: number): string {
  const s = n.toFixed(3);
  return n >= 0 ? ` ${s}` : s;
}

/* ── Row component ────────────────────────────────────────── */

const DiagnosticRow: React.FC<{
  data: RowData;
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

/* ─�� Connected diagnostics ────────────────────────────────── */

function useTouchpadData() {
  const controller = useContext(ControllerContext);
  const tp = controller.touchpad;
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    tp.on("change", onChange);
    return () => {
      tp.removeListener("change", onChange);
    };
  }, [tp]);

  return tp;
}

const TouchButtonConnected: React.FC = () => {
  const tp = useTouchpadData();
  const row: RowData = { label: "touchpad.button", tooltip: "Clickable button — pressing down on the touchpad surface.", state: tp.button.active ? "true" : "false", active: tp.button.active, highlight: tp.button.active };
  return <DiagnosticRow data={row} even={false} />;
};

const TouchPointConnected: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const tp = useTouchpadData();
  const touch = tp[side];
  const n = side === "left" ? "1" : "2";

  const rows: RowData[] = [
    { label: `touchpad.${side}.contact`, tooltip: `True when ${side === "left" ? "a finger" : "a second finger"} is touching the touchpad.`, state: touch.contact.active ? "true" : "false", active: touch.contact.active, highlight: touch.contact.active },
    { label: `touchpad.${side}.x.state`, tooltip: `Horizontal position of touch ${n}. -1 (left edge) to 1 (right edge).`, state: fmt(touch.x.state), active: touch.contact.active, highlight: touch.contact.active },
    { label: `touchpad.${side}.y.state`, tooltip: `Vertical position of touch ${n}. -1 (top edge) to 1 (bottom edge).`, state: fmt(touch.y.state), active: touch.contact.active, highlight: touch.contact.active },
    { label: `touchpad.${side}.tracker`, tooltip: `Finger identity tracker${side === "right" ? " for the second touch point" : ""}. Increments when a new finger touches down, allowing you to distinguish between different touch gestures.`, state: String(touch.tracker.state), active: touch.contact.active, highlight: touch.contact.active },
  ];

  return (
    <>
      {rows.map((r, i) => (
        <DiagnosticRow key={r.label} data={r} even={i % 2 === 1} />
      ))}
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

export const TouchpadButtonDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <TouchButtonConnected />
  </Table>
);

export const TouchPointDiagnostic: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <Table>
    <DiagnosticHeader />
    <TouchPointConnected side={side} />
  </Table>
);
