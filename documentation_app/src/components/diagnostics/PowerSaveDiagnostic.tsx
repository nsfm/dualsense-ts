import React, { useContext, useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
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

/* ── Toggle row ─────────────────────────────────────────────── */

const ToggleRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const ToggleLabel = styled.div`
  flex: 1;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
`;

const ToggleSublabel = styled.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.35);
  margin-left: 8px;
`;

const StatusBadge = styled.code<{ $enabled: boolean }>`
  font-size: 11px;
  flex-shrink: 0;
  width: 7ch;
  text-align: center;
  padding: 2px 6px;
  border-radius: 3px;
  background: ${(p) =>
    p.$enabled ? "rgba(72, 175, 240, 0.12)" : "rgba(255, 107, 107, 0.12)"};
  color: ${(p) =>
    p.$enabled ? "#48aff0" : "#ff6b6b"};
  transition: all 0.15s;
`;

/* ── Switch ──────────────────────────────────────────────────── */

const SwitchTrack = styled.button<{ $on: boolean }>`
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid
    ${(p) => (p.$on ? "rgba(72, 175, 240, 0.5)" : "rgba(255, 255, 255, 0.15)")};
  background: ${(p) => (p.$on ? "rgba(72, 175, 240, 0.25)" : "rgba(0, 0, 0, 0.2)")};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
  padding: 0;

  &:hover {
    border-color: ${(p) =>
      p.$on ? "rgba(72, 175, 240, 0.7)" : "rgba(255, 255, 255, 0.3)"};
  }
`;

const SwitchThumb = styled.div<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(p) => (p.$on ? "17px" : "2px")};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(p) => (p.$on ? "#48aff0" : "rgba(191, 204, 214, 0.4)")};
  transition: left 0.15s, background 0.15s;
`;

const Switch: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <SwitchTrack $on={on} onClick={onChange} type="button">
    <SwitchThumb $on={on} />
  </SwitchTrack>
);

/* ── Probe row: live sensor value ───────────────────────────── */

const ProbeRow = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.04);
  opacity: ${(p) => (p.$disabled ? 0.35 : 1)};
  transition: opacity 0.2s;
`;

const ProbeLabel = styled.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.4);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProbeVal = styled.code<{ $active?: boolean }>`
  font-size: 11px;
  flex-shrink: 0;
  width: 9ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.35)")};
  transition: color 0.06s;
`;

const FrozenTag = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 107, 107, 0.6);
  flex-shrink: 0;
`;

/* ── Buttons ─────────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled.button<{ $variant: "reset" | "warn" }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) => (p.$variant === "reset" ? "rgba(72, 175, 240, 0.4)" : "rgba(255, 107, 107, 0.4)")};
  background: ${(p) =>
    p.$variant === "reset" ? "rgba(72, 175, 240, 0.1)" : "rgba(255, 107, 107, 0.1)"};
  color: ${(p) => (p.$variant === "reset" ? "#48aff0" : "#ff6b6b")};

  &:hover {
    background: ${(p) =>
      p.$variant === "reset" ? "rgba(72, 175, 240, 0.2)" : "rgba(255, 107, 107, 0.2)"};
  }
`;

const TestButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) => (p.$active ? "rgba(242, 158, 2, 0.6)" : "rgba(242, 158, 2, 0.3)")};
  background: ${(p) =>
    p.$active ? "rgba(242, 158, 2, 0.2)" : "rgba(242, 158, 2, 0.08)"};
  color: ${(p) =>
    p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    color: #f29e02;
  }
`;

/* ── Readout ─────────────────────────────────────────────────── */

const ReadoutRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.12);
`;

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const ReadoutLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
`;

const ReadoutVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.4)")};
`;

/* ── Helpers ─────────────────────────────────────────────────── */

function fmt(n: number): string {
  const s = n.toFixed(3);
  return n >= 0 ? ` ${s}` : s;
}

/* ── Connected component ─────────────────────────────────── */

const PowerSaveDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);

  const [touch, setTouch] = useState(controller.powerSave.touch);
  const [motion, setMotion] = useState(controller.powerSave.motion);
  const [haptics, setHaptics] = useState(controller.powerSave.haptics);
  const [audio, setAudio] = useState(controller.powerSave.audio);
  const [muteHaptics, setMuteHaptics] = useState(controller.powerSave.hapticsMuted);

  // Test state
  const [toneActive, setToneActive] = useState(false);
  const [rumbleActive, setRumbleActive] = useState(false);
  const rumbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live probe values
  const [gyroX, setGyroX] = useState(0);
  const [accelY, setAccelY] = useState(0);
  const [touchX, setTouchX] = useState(0);
  const [touchContact, setTouchContact] = useState(false);
  const [, setTick] = useState(0);

  // Subscribe to relevant inputs for live probes
  useEffect(() => {
    const onGyro = () => {
      setGyroX(controller.gyroscope.x.state);
      setAccelY(controller.accelerometer.y.state);
    };
    const onTouch = () => {
      setTouchX(controller.touchpad.left.x.state);
      setTouchContact(controller.touchpad.left.contact.state);
    };
    controller.gyroscope.on("change", onGyro);
    controller.touchpad.on("change", onTouch);
    // Periodic tick to catch frozen values
    const interval = setInterval(() => setTick((t) => t + 1), 500);
    return () => {
      controller.gyroscope.removeListener("change", onGyro);
      controller.touchpad.removeListener("change", onTouch);
      clearInterval(interval);
    };
  }, [controller]);

  // Reset power save + stop tests on unmount
  useEffect(() => {
    return () => {
      controller.powerSave.reset();
      controller.rumble(0);
      void controller.stopTestTone();
      if (rumbleTimer.current) clearTimeout(rumbleTimer.current);
    };
  }, [controller]);

  const toggle = useCallback(
    (subsystem: "touch" | "motion" | "haptics" | "audio" | "muteHaptics") => {
      switch (subsystem) {
        case "touch":
          controller.powerSave.touch = !controller.powerSave.touch;
          setTouch(controller.powerSave.touch);
          break;
        case "motion":
          controller.powerSave.motion = !controller.powerSave.motion;
          setMotion(controller.powerSave.motion);
          break;
        case "haptics":
          controller.powerSave.haptics = !controller.powerSave.haptics;
          setHaptics(controller.powerSave.haptics);
          break;
        case "audio":
          controller.powerSave.audio = !controller.powerSave.audio;
          setAudio(controller.powerSave.audio);
          break;
        case "muteHaptics":
          controller.powerSave.hapticsMuted = !controller.powerSave.hapticsMuted;
          setMuteHaptics(controller.powerSave.hapticsMuted);
          break;
      }
    },
    [controller],
  );

  const resetAll = useCallback(() => {
    controller.powerSave.reset();
    setTouch(true);
    setMotion(true);
    setHaptics(true);
    setAudio(true);
    setMuteHaptics(false);
  }, [controller]);

  const disableAll = useCallback(() => {
    controller.powerSave.set({
      touch: false,
      motion: false,
      haptics: false,
      audio: false,
      muteHaptics: true,
    });
    setTouch(false);
    setMotion(false);
    setHaptics(false);
    setAudio(false);
    setMuteHaptics(true);
  }, [controller]);

  const toggleTone = useCallback(async () => {
    if (toneActive) {
      await controller.stopTestTone();
      setToneActive(false);
    } else {
      await controller.startTestTone("speaker");
      setToneActive(true);
    }
  }, [controller, toneActive]);

  const pulseRumble = useCallback(() => {
    if (rumbleActive) return;
    setRumbleActive(true);
    controller.rumble(0.7);
    rumbleTimer.current = setTimeout(() => {
      controller.rumble(0);
      setRumbleActive(false);
      rumbleTimer.current = null;
    }, 500);
  }, [controller, rumbleActive]);

  const flags = controller.powerSave.flags;

  return (
    <>
      <ToggleRow>
        <Switch on={motion} onChange={() => toggle("motion")} />
        <ToggleLabel>
          Motion
          <ToggleSublabel>gyroscope + accelerometer</ToggleSublabel>
        </ToggleLabel>
        <StatusBadge $enabled={motion}>{motion ? "on" : "off"}</StatusBadge>
      </ToggleRow>
      <ProbeRow $disabled={!motion}>
        <ProbeLabel>gyroscope.x.state</ProbeLabel>
        <ProbeVal $active={motion && gyroX !== 0}>{fmt(gyroX)}</ProbeVal>
        {!motion && <FrozenTag>frozen</FrozenTag>}
      </ProbeRow>
      <ProbeRow $disabled={!motion}>
        <ProbeLabel>accelerometer.y.state</ProbeLabel>
        <ProbeVal $active={motion && accelY !== 0}>{fmt(accelY)}</ProbeVal>
        {!motion && <FrozenTag>frozen</FrozenTag>}
      </ProbeRow>

      <ToggleRow $even>
        <Switch on={touch} onChange={() => toggle("touch")} />
        <ToggleLabel>
          Touch
          <ToggleSublabel>touchpad processing</ToggleSublabel>
        </ToggleLabel>
        <StatusBadge $enabled={touch}>{touch ? "on" : "off"}</StatusBadge>
      </ToggleRow>
      <ProbeRow $disabled={!touch}>
        <ProbeLabel>touchpad.left.x.state</ProbeLabel>
        <ProbeVal $active={touch && touchContact}>{fmt(touchX)}</ProbeVal>
        {!touch && <FrozenTag>frozen</FrozenTag>}
      </ProbeRow>

      <ToggleRow>
        <Switch on={haptics} onChange={() => toggle("haptics")} />
        <ToggleLabel>
          Haptics
          <ToggleSublabel>rumble + adaptive triggers</ToggleSublabel>
        </ToggleLabel>
        <StatusBadge $enabled={haptics}>{haptics ? "on" : "off"}</StatusBadge>
      </ToggleRow>

      <ToggleRow $even>
        <Switch on={!muteHaptics} onChange={() => toggle("muteHaptics")} />
        <ToggleLabel>
          Haptic Output
          <ToggleSublabel>soft mute (processor stays on)</ToggleSublabel>
        </ToggleLabel>
        <StatusBadge $enabled={!muteHaptics}>{muteHaptics ? "muted" : "on"}</StatusBadge>
      </ToggleRow>
      <ButtonRow>
        <TestButton $active={rumbleActive} onClick={pulseRumble}>
          {rumbleActive ? "Rumbling..." : "Test Rumble"}
        </TestButton>
      </ButtonRow>

      <ToggleRow>
        <Switch on={audio} onChange={() => toggle("audio")} />
        <ToggleLabel>
          Audio
          <ToggleSublabel>speaker, headphone, mic DSP</ToggleSublabel>
        </ToggleLabel>
        <StatusBadge $enabled={audio}>{audio ? "on" : "off"}</StatusBadge>
      </ToggleRow>
      <ButtonRow>
        <TestButton $active={toneActive} onClick={toggleTone}>
          {toneActive ? "Stop Test Tone" : "Play Test Tone"}
        </TestButton>
      </ButtonRow>

      <ButtonRow>
        <ActionButton $variant="reset" onClick={resetAll}>
          Enable All
        </ActionButton>
        <ActionButton $variant="warn" onClick={disableAll}>
          Disable All
        </ActionButton>
      </ButtonRow>

      <ReadoutRow>
        <ReadoutLabel>
          <Dim>controller.</Dim>powerSave<Dim>.</Dim>flags
        </ReadoutLabel>
        <ReadoutVal $highlight={flags !== 0}>
          0x{flags.toString(16).padStart(2, "0").toUpperCase()}
          {flags !== 0 && ` (0b${flags.toString(2).padStart(8, "0")})`}
        </ReadoutVal>
      </ReadoutRow>
    </>
  );
};

/* ── Exported component ──────────────────────────────────── */

export const PowerSaveDiagnostic: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell style={{ flex: 1 }}>subsystem control</HeaderCell>
      <HeaderCell style={{ flexShrink: 0, textAlign: "right" }}>status</HeaderCell>
    </HeaderRow>
    <PowerSaveDiagnosticConnected />
  </Table>
);
