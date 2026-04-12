import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import type { Dualsense, Input } from "dualsense-ts";
import { ControllerContext } from "../../controller";

/* ── Layout ─────────────────────────────────────────────────── */

const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
`;

const Row = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

/* ── Indicator ──────────────────────────────────────────────── */

const Indicator = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$active ? "#f29e02" : "rgba(255, 255, 255, 0.08)")};
  border: 1.5px solid ${(p) => (p.$active ? "#f29e02" : "rgba(255, 255, 255, 0.12)")};
  box-shadow: ${(p) => (p.$active ? "0 0 8px 2px rgba(242, 158, 2, 0.4)" : "none")};
  transition: all 0.06s;
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

const StateVal = styled.code<{ $active: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.3)")};
  transition: color 0.06s;
`;

const PressCount = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: rgba(191, 204, 214, 0.25);
  flex-shrink: 0;
  min-width: 24px;
  text-align: right;
`;

/* ── Per-button row hook ────────────────────────────────────── */

interface ButtonRowData {
  label: string;
  active: boolean;
  pressCount: number;
}

function useButtonRow(
  input: Input<boolean>,
  label: string,
): ButtonRowData {
  const [active, setActive] = useState(input.state as boolean);
  const pressCount = useRef(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onChange = () => {
      const val = input.state as boolean;
      setActive(val);
      if (val) {
        pressCount.current += 1;
        setCount(pressCount.current);
      }
    };
    input.on("change", onChange);
    return () => {
      input.removeListener("change", onChange);
    };
  }, [input]);

  return {
    label,
    active,
    pressCount: count,
  };
}

/* ── Single button row ──────────────────────────────────────── */

const ButtonRow: React.FC<{ data: ButtonRowData; even: boolean }> = ({
  data,
  even,
}) => {
  const parts = data.label.split(".");
  return (
    <Row $even={even}>
      <Indicator $active={data.active} />
      <Label>
        <Dim>controller.</Dim>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Dim>.</Dim>}
            {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
          </React.Fragment>
        ))}
      </Label>
      <StateVal $active={data.active}>
        {data.active ? "true" : "false"}
      </StateVal>
      <StateVal $active={data.active}>
        {data.active ? "true" : "false"}
      </StateVal>
      <PressCount>{data.pressCount > 0 ? data.pressCount : ""}</PressCount>
    </Row>
  );
};

/* ── Main component ─────────────────────────────────────────── */

interface ButtonDef {
  label: string;
  selector: (c: Dualsense) => Input<boolean>;
}

const FACE_BUTTONS: ButtonDef[] = [
  { label: "triangle", selector: (c) => c.triangle },
  { label: "circle", selector: (c) => c.circle },
  { label: "cross", selector: (c) => c.cross },
  { label: "square", selector: (c) => c.square },
];

const DPAD_BUTTONS: ButtonDef[] = [
  { label: "dpad.up", selector: (c) => c.dpad.up },
  { label: "dpad.down", selector: (c) => c.dpad.down },
  { label: "dpad.left", selector: (c) => c.dpad.left },
  { label: "dpad.right", selector: (c) => c.dpad.right },
];

const UTILITY_BUTTONS: ButtonDef[] = [
  { label: "ps", selector: (c) => c.ps },
  { label: "create", selector: (c) => c.create },
  { label: "options", selector: (c) => c.options },
  { label: "mute", selector: (c) => c.mute },
];

const SHOULDER_BUTTONS: ButtonDef[] = [
  { label: "left.bumper", selector: (c) => c.left.bumper },
  { label: "right.bumper", selector: (c) => c.right.bumper },
  { label: "left.trigger.button", selector: (c) => c.left.trigger.button },
  { label: "right.trigger.button", selector: (c) => c.right.trigger.button },
  { label: "left.analog.button", selector: (c) => c.left.analog.button },
  { label: "right.analog.button", selector: (c) => c.right.analog.button },
];

const ButtonGroupRows: React.FC<{ buttons: ButtonDef[] }> = ({ buttons }) => {
  const controller = useContext(ControllerContext);
  return (
    <>
      {buttons.map((b, i) => (
        <ButtonRowConnected
          key={b.label}
          input={b.selector(controller)}
          label={b.label}
          even={i % 2 === 1}
        />
      ))}
    </>
  );
};

const ButtonRowConnected: React.FC<{
  input: Input<boolean>;
  label: string;
  even: boolean;
}> = ({ input, label, even }) => {
  const data = useButtonRow(input, label);
  return <ButtonRow data={data} even={even} />;
};

const DiagnosticHeader: React.FC = () => (
  <HeaderRow>
    {/* spacer matching indicator width */}
    <div style={{ width: 10, flexShrink: 0 }} />
    <HeaderCell style={{ flex: 1 }}>input</HeaderCell>
    <HeaderCell style={{ flexShrink: 0, width: "5ch" }}>state</HeaderCell>
    <HeaderCell style={{ flexShrink: 0, width: "5ch" }}>active</HeaderCell>
    <div style={{ minWidth: 24, flexShrink: 0 }} />
  </HeaderRow>
);

export const FaceButtonsDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <ButtonGroupRows buttons={FACE_BUTTONS} />
  </Table>
);

export const DpadDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <ButtonGroupRows buttons={DPAD_BUTTONS} />
  </Table>
);

export const UtilityButtonsDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <ButtonGroupRows buttons={UTILITY_BUTTONS} />
  </Table>
);

export const ShoulderButtonsDiagnostic: React.FC = () => (
  <Table>
    <DiagnosticHeader />
    <ButtonGroupRows buttons={SHOULDER_BUTTONS} />
  </Table>
);
