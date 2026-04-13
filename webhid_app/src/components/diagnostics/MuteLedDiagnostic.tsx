import React, { useContext, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { MuteLedMode } from "dualsense-ts";
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

/* ── Mute status visual ──────────────────────────────────────── */

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const MicIcon: React.FC<{ muted: boolean }> = ({ muted }) => (
  <svg width="20" height="28" viewBox="0 0 10 14" fill="currentColor">
    <rect x="3" y="0.5" width="4" height="8" rx="2" />
    <path
      d="M1 6.5 Q1 10.5 5 10.5 Q9 10.5 9 6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line x1="5" y1="10.5" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="3" y1="13" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {muted && (
      <line x1="1" y1="1" x2="9" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    )}
  </svg>
);

const StatusLabel = styled.span<{ $muted: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$muted ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.15s;
`;

const LedDot = styled.div<{ $mode: "on" | "pulse" | "off" }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => (p.$mode === "off" ? "rgba(191, 204, 214, 0.15)" : "#f29e02")};
  box-shadow: ${(p) => (p.$mode === "off" ? "none" : "0 0 8px rgba(242, 158, 2, 0.5)")};
  transition: all 0.15s;
  ${(p) =>
    p.$mode === "pulse"
      ? `animation: ledPulse 2s ease-in-out infinite;`
      : ""}

  @keyframes ledPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
`;

/* ── Buttons ─────────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(242, 158, 2, 0.6)" : "rgba(242, 158, 2, 0.3)"};
  background: ${(p) =>
    p.$active ? "rgba(242, 158, 2, 0.2)" : "rgba(242, 158, 2, 0.08)"};
  color: ${(p) =>
    p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    color: #f29e02;
  }
`;

const ResetButton = styled(ActionButton)`
  border-color: rgba(72, 175, 240, 0.4);
  background: rgba(72, 175, 240, 0.1);
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
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

/* ── Helpers ─────────────────────────────────────────────────── */

function ledModeName(mode: MuteLedMode | undefined): string {
  if (mode === undefined) return "undefined";
  switch (mode) {
    case MuteLedMode.Off: return "MuteLedMode.Off";
    case MuteLedMode.On: return "MuteLedMode.On";
    case MuteLedMode.Pulse: return "MuteLedMode.Pulse";
    default: return `${mode}`;
  }
}

function ledDotMode(mode: MuteLedMode | undefined, muted: boolean): "on" | "pulse" | "off" {
  if (mode === undefined) return muted ? "on" : "off";
  switch (mode) {
    case MuteLedMode.On: return "on";
    case MuteLedMode.Pulse: return "pulse";
    default: return "off";
  }
}

/* ── Connected component ─────────────────────────────────── */

const MuteLedDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [muted, setMuted] = useState(controller.mute.status.state);
  const [ledMode, setLedMode] = useState<MuteLedMode | undefined>(controller.mute.ledMode);

  useEffect(() => {
    const onChange = () => setMuted(controller.mute.status.state);
    controller.mute.status.on("change", onChange);
    return () => {
      controller.mute.status.removeListener("change", onChange);
    };
  }, [controller]);

  // Reset LED on unmount
  useEffect(() => {
    return () => {
      controller.mute.resetLed();
    };
  }, [controller]);

  const setMode = useCallback(
    (mode: MuteLedMode) => {
      controller.mute.setLed(mode);
      setLedMode(mode);
    },
    [controller],
  );

  const resetLed = useCallback(() => {
    controller.mute.resetLed();
    setLedMode(undefined);
  }, [controller]);

  const dotMode = ledDotMode(ledMode, muted);

  return (
    <>
      <StatusRow>
        <LedDot $mode={dotMode} />
        <span style={{ color: muted ? "#f29e02" : "rgba(191, 204, 214, 0.5)", display: "flex" }}>
          <MicIcon muted={muted} />
        </span>
        <StatusLabel $muted={muted}>
          {muted ? "Muted" : "Mic On"}
        </StatusLabel>
      </StatusRow>
      <ButtonRow>
        <ActionButton $active={ledMode === MuteLedMode.On} onClick={() => setMode(MuteLedMode.On)}>
          On
        </ActionButton>
        <ActionButton $active={ledMode === MuteLedMode.Pulse} onClick={() => setMode(MuteLedMode.Pulse)}>
          Pulse
        </ActionButton>
        <ActionButton $active={ledMode === MuteLedMode.Off} onClick={() => setMode(MuteLedMode.Off)}>
          Off
        </ActionButton>
        <ResetButton $active={ledMode === undefined} onClick={resetLed}>
          Reset
        </ResetButton>
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>mute<Dim>.</Dim>status<Dim>.</Dim>state</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={muted}>{muted ? "true" : "false"}</ReadoutVal>
      </ReadoutRow>
      <ReadoutRow $even>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>mute<Dim>.</Dim>ledMode</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={ledMode !== undefined}>{ledModeName(ledMode)}</ReadoutVal>
      </ReadoutRow>
    </>
  );
};

/* ── Exported component ───────────────────────────────────── */

export const MuteLedDiagnostic: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell>mute LED</HeaderCell>
    </HeaderRow>
    <MuteLedDiagnosticConnected />
  </Table>
);
