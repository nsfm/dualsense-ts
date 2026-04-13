import React, { useContext, useState, useCallback } from "react";
import styled from "styled-components";
import { PlayerID, Brightness } from "dualsense-ts";
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

/* ── LED toggle row ──────────────────────────────────────────── */

const LedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 16px 12px;
  background: rgba(0, 0, 0, 0.06);
`;

const LedButton = styled.button<{ $on: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid
    ${(p) => (p.$on ? "#48aff0" : "rgba(72, 175, 240, 0.25)")};
  background: ${(p) =>
    p.$on ? "rgba(72, 175, 240, 0.2)" : "rgba(0, 0, 0, 0.15)"};
  color: ${(p) => (p.$on ? "#48aff0" : "rgba(191, 204, 214, 0.3)")};
  box-shadow: ${(p) =>
    p.$on ? "0 0 10px rgba(72, 175, 240, 0.4)" : "none"};

  &:hover {
    border-color: #48aff0;
    background: ${(p) =>
      p.$on ? "rgba(72, 175, 240, 0.3)" : "rgba(72, 175, 240, 0.1)"};
    color: ${(p) => (p.$on ? "#48aff0" : "rgba(191, 204, 214, 0.6)")};
  }
`;

/* ── Preset + brightness buttons ─────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 7px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(72, 175, 240, 0.6)" : "rgba(72, 175, 240, 0.3)"};
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.08)"};
  color: ${(p) =>
    p.$active ? "#48aff0" : "rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`;

const StopButton = styled(ActionButton)`
  border-color: rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`;

/* ── Readout rows ───────────────────────────────────────────── */

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const ReadoutRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const ReadoutLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`;

const ReadoutVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.4)")};
  transition: color 0.06s;
`;

/* ── Section label ───────────────────────────────────────────── */

const SectionLabel = styled.div`
  padding: 6px 16px 2px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`;

/* ── Brightness names ─────────────────────────────────────── */

function brightnessName(b: Brightness): string {
  switch (b) {
    case Brightness.High: return "High";
    case Brightness.Medium: return "Medium";
    case Brightness.Low: return "Low";
    default: return `${b}`;
  }
}

/* ── Connected component ─────────────────────────────────── */

const PRESETS: { label: string; value: number }[] = [
  { label: "P1", value: PlayerID.Player1 },
  { label: "P2", value: PlayerID.Player2 },
  { label: "P3", value: PlayerID.Player3 },
  { label: "P4", value: PlayerID.Player4 },
  { label: "All", value: PlayerID.All },
];

const PlayerLedsDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);
  const [brightness, setBrightness] = useState(controller.playerLeds.brightness);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const toggleLed = useCallback(
    (index: number) => {
      controller.playerLeds.setLed(index, !controller.playerLeds.getLed(index));
      forceUpdate();
    },
    [controller, forceUpdate],
  );

  const setPreset = useCallback(
    (pattern: number) => {
      controller.playerLeds.set(pattern);
      forceUpdate();
    },
    [controller, forceUpdate],
  );

  const handleBrightness = useCallback(
    (value: Brightness) => {
      setBrightness(value);
      controller.playerLeds.setBrightness(value);
    },
    [controller],
  );

  const bitmask = controller.playerLeds.bitmask;
  const binaryStr = "0b" + bitmask.toString(2).padStart(5, "0");

  return (
    <>
      <LedRow>
        {[0, 1, 2, 3, 4].map((i) => (
          <LedButton key={i} $on={controller.playerLeds.getLed(i)} onClick={() => toggleLed(i)}>
            {i + 1}
          </LedButton>
        ))}
      </LedRow>
      <SectionLabel>presets</SectionLabel>
      <ButtonRow>
        <StopButton onClick={() => setPreset(0)}>Off</StopButton>
        {PRESETS.map((p) => (
          <ActionButton
            key={p.label}
            $active={bitmask === p.value}
            onClick={() => setPreset(p.value)}
          >
            {p.label}
          </ActionButton>
        ))}
      </ButtonRow>
      <SectionLabel>brightness</SectionLabel>
      <ButtonRow>
        {([Brightness.Low, Brightness.Medium, Brightness.High] as Brightness[]).map((b) => (
          <ActionButton
            key={b}
            $active={brightness === b}
            onClick={() => handleBrightness(b)}
          >
            {brightnessName(b)}
          </ActionButton>
        ))}
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>playerLeds<Dim>.</Dim>bitmask</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={bitmask > 0}>{binaryStr}</ReadoutVal>
      </ReadoutRow>
      <ReadoutRow $even>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>playerLeds<Dim>.</Dim>brightness</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight>Brightness.{brightnessName(brightness)}</ReadoutVal>
      </ReadoutRow>
    </>
  );
};

/* ── Exported component ───────────────────────────────────── */

export const PlayerLedsDiagnostic: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell>player LEDs</HeaderCell>
    </HeaderRow>
    <PlayerLedsDiagnosticConnected />
  </Table>
);
