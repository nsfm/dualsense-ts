import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import type { DualsenseAccess, Input } from "dualsense-ts";
import { AccessProfileLedMode, AccessPlayerIndicator } from "dualsense-ts";
import { useAccessController } from "../../hooks/useAccessController";

/* ── Styled helpers ──────────────────────────────────────────── */

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(191, 204, 214, 0.85);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`;

const Card = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 6px;
  background: ${(p) =>
    p.$active ? "rgba(242, 158, 2, 0.12)" : "rgba(0, 0, 0, 0.12)"};
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(242, 158, 2, 0.3)" : "rgba(255, 255, 255, 0.06)"};
  transition: all 0.06s;
`;

const CardLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
`;

const CardValue = styled.span<{ $active?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$active ? "#f29e02" : "rgba(191, 204, 214, 0.3)")};
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`;

const ConnectButton = styled.button`
  animation: ${pulse} 2s ease-in-out infinite;
  background: transparent;
  border: 1px solid rgba(242, 158, 2, 0.5);
  border-radius: 6px;
  color: #f29e02;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba(242, 158, 2, 0.1);
  }
`;

const InfoBar = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 24px;
`;

const Tag = styled.span<{ $color?: string }>`
  color: ${(p) => p.$color ?? "rgba(191, 204, 214, 0.85)"};
  font-weight: 500;
`;

/* ── Stick visualization ─────────────────────────────────────── */

const StickArea = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.12);
`;

const StickDot = styled.div<{ $x: number; $y: number; $color?: string }>`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(p) => p.$color ?? "#f29e02"};
  left: ${(p) => 50 + p.$x * 45}%;
  top: ${(p) => 50 - p.$y * 45}%;
  transform: translate(-50%, -50%);
  transition: all 0.03s;
`;

/* ── LED control ─────────────────────────────────────────────── */

const ColorInput = styled.input`
  width: 40px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
`;

const Select = styled.select`
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(191, 204, 214, 0.85);
  font-size: 13px;
  padding: 4px 8px;

  option {
    background: #1a1a2e;
    color: rgba(191, 204, 214, 0.85);
  }
`;

const Toggle = styled.button<{ $on: boolean }>`
  background: ${(p) => (p.$on ? "rgba(76, 175, 80, 0.2)" : "rgba(0, 0, 0, 0.2)")};
  border: 1px solid ${(p) => (p.$on ? "rgba(76, 175, 80, 0.5)" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 4px;
  color: ${(p) => (p.$on ? "#4caf50" : "rgba(191, 204, 214, 0.5)")};
  font-size: 13px;
  padding: 4px 12px;
  cursor: pointer;
`;

/* ── Analog value card ───────────────────────────────────────── */

const AnalogCard: React.FC<{
  label: string;
  input: Input<number> | undefined;
}> = ({ label, input }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!input) return;
    setValue(input.state as number);
    const handler = () => setValue(input.state as number);
    input.on("change", handler);
    return () => {
      input.removeListener("change", handler);
    };
  }, [input]);
  const active = Math.abs(value) > 0.05;
  return (
    <Card $active={active}>
      <CardValue $active={active}>{value.toFixed(2)}</CardValue>
      <CardLabel>{label}</CardLabel>
    </Card>
  );
};

/* ── Button state hook ───────────────────────────────────────── */

function useButtonState(input: Input<boolean> | undefined) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!input) return;
    setActive(input.state as boolean);
    const handler = () => setActive(input.state as boolean);
    input.on("change", handler);
    return () => {
      input.removeListener("change", handler);
    };
  }, [input]);
  return active;
}

/* ── Button card ─────────────────────────────────────────────── */

const ButtonCard: React.FC<{
  label: string;
  input: Input<boolean> | undefined;
}> = ({ label, input }) => {
  const active = useButtonState(input);
  return (
    <Card $active={active}>
      <CardValue $active={active}>{active ? "ON" : "\u2014"}</CardValue>
      <CardLabel>{label}</CardLabel>
    </Card>
  );
};

/* ── Stick readout ───────────────────────────────────────────── */

const StickReadout: React.FC<{
  label: string;
  stickX: Input<number> | undefined;
  stickY: Input<number> | undefined;
  button: Input<boolean> | undefined;
  color?: string;
}> = ({ label, stickX, stickY, button, color }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const clicked = useButtonState(button);

  useEffect(() => {
    if (!stickX || !stickY) return;
    const hx = () => setX(stickX.state as number);
    const hy = () => setY(stickY.state as number);
    stickX.on("change", hx);
    stickY.on("change", hy);
    return () => {
      stickX.removeListener("change", hx);
      stickY.removeListener("change", hy);
    };
  }, [stickX, stickY]);

  return (
    <div>
      <div style={{ fontSize: 12, color: "rgba(191,204,214,0.5)", marginBottom: 6 }}>{label}</div>
      <Row>
        <StickArea>
          <StickDot $x={x} $y={y} $color={color} />
        </StickArea>
        <div>
          <div style={{ fontSize: 13, color: "rgba(191,204,214,0.6)" }}>
            X: {x.toFixed(2)} &middot; Y: {y.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: clicked ? (color ?? "#f29e02") : "rgba(191,204,214,0.3)" }}>
            Click: {clicked ? "pressed" : "\u2014"}
          </div>
        </div>
      </Row>
    </div>
  );
};

/* ── LED controls ────────────────────────────────────────────── */

const LedControls: React.FC<{ access: DualsenseAccess | null }> = ({
  access,
}) => {
  const [color, setColor] = useState("#0000ff");
  const [profileMode, setProfileMode] = useState<AccessProfileLedMode>(AccessProfileLedMode.On);
  const [playerPattern, setPlayerPattern] = useState<AccessPlayerIndicator>(AccessPlayerIndicator.Off);
  const [statusOn, setStatusOn] = useState(true);

  const onColor = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      setColor(hex);
      if (!access) return;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      access.lightbar.set({ r, g, b });
    },
    [access]
  );

  const onProfileMode = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const mode = Number(e.target.value) as AccessProfileLedMode;
      setProfileMode(mode);
      access?.profileLeds.set(mode);
    },
    [access]
  );

  const onPlayerPattern = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const p = Number(e.target.value) as AccessPlayerIndicator;
      setPlayerPattern(p);
      access?.playerIndicator.set(p);
    },
    [access]
  );

  const onStatusToggle = useCallback(() => {
    const next = !statusOn;
    setStatusOn(next);
    access?.statusLed.set(next);
  }, [access, statusOn]);

  return (
    <Grid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      <Card>
        <CardLabel>Lightbar</CardLabel>
        <ColorInput type="color" value={color} onChange={onColor} />
      </Card>
      <Card>
        <CardLabel>Profile LEDs</CardLabel>
        <Select value={profileMode} onChange={onProfileMode}>
          <option value={AccessProfileLedMode.Off}>Off</option>
          <option value={AccessProfileLedMode.On}>On</option>
          <option value={AccessProfileLedMode.Fade}>Fade</option>
          <option value={AccessProfileLedMode.Sweep}>Sweep</option>
        </Select>
      </Card>
      <Card>
        <CardLabel>Player Indicator</CardLabel>
        <Select value={playerPattern} onChange={onPlayerPattern}>
          <option value={AccessPlayerIndicator.Off}>Off</option>
          <option value={AccessPlayerIndicator.Player1}>Player 1</option>
          <option value={AccessPlayerIndicator.Player2}>Player 2</option>
          <option value={AccessPlayerIndicator.Player3}>Player 3</option>
          <option value={AccessPlayerIndicator.Player4}>Player 4</option>
        </Select>
      </Card>
      <Card>
        <CardLabel>Status LED</CardLabel>
        <Toggle $on={statusOn} onClick={onStatusToggle}>
          {statusOn ? "ON" : "OFF"}
        </Toggle>
      </Card>
    </Grid>
  );
};

/* ── Main page ───────────────────────────────────────────────── */

interface IdentityInfo {
  firmware: string;
  serial: string;
  buildDate: string;
  color: string;
  board: string;
  mac: string;
}

const AccessPlayground: React.FC = () => {
  const { access, connected, requestConnect, supported } =
    useAccessController();

  const [battery, setBattery] = useState(0);
  const [profileId, setProfileId] = useState(1);
  const [identity, setIdentity] = useState<IdentityInfo | null>(null);

  useEffect(() => {
    if (!access) return;
    const onBattery = () =>
      setBattery(Math.round(access.battery.level.state * 100));
    const onProfile = () => setProfileId(access.profileId.state);
    access.battery.on("change", onBattery);
    access.profileId.on("change", onProfile);

    const unsub = access.hid.onReady(() => {
      const fw = access.firmwareInfo;
      const fi = access.factoryInfo;
      const v = fw.mainFirmwareVersion;
      setIdentity({
        firmware: `${v.major}.${v.minor}.${v.patch}`,
        serial: fi.serialNumber !== "unknown" ? fi.serialNumber : "",
        buildDate: fw.buildDate || "",
        color: fi.colorName !== "unknown" ? fi.colorName : "",
        board: fi.boardRevision !== "unknown" ? fi.boardRevision : "",
        mac: access.hid.macAddress || "",
      });
    });

    return () => {
      access.battery.removeListener("change", onBattery);
      access.profileId.removeListener("change", onProfile);
      unsub();
    };
  }, [access]);

  if (!supported) {
    return (
      <Page>
        <Title>Access Playground</Title>
        <Subtitle>WebHID is not supported in this browser.</Subtitle>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Access Playground</Title>
      <Subtitle>
        Connect your DualSense Access controller to see all inputs and outputs
        live.
      </Subtitle>

      {!connected ? (
        <Section>
          <ConnectButton onClick={requestConnect}>
            Connect Access Controller
          </ConnectButton>
        </Section>
      ) : (
        <>
          <InfoBar>
            <Tag $color="#4caf50">Connected</Tag>
            <span>
              {access?.wireless ? "Bluetooth" : "USB"}
            </span>
            <span>Battery: {battery}%</span>
            <span>Profile: {profileId}</span>
          </InfoBar>

          {identity && (
            <InfoBar>
              {identity.firmware && <span>FW: {identity.firmware}</span>}
              {identity.buildDate && <span>Built: {identity.buildDate}</span>}
              {identity.serial && <span>S/N: {identity.serial}</span>}
              {identity.board && <span>Board: {identity.board}</span>}
              {identity.color && <span>Color: {identity.color}</span>}
              {identity.mac && <span>MAC: {identity.mac}</span>}
            </InfoBar>
          )}

          <Section>
            <SectionTitle>Hardware Buttons</SectionTitle>
            <Grid>
              <ButtonCard label="B1" input={access?.b1} />
              <ButtonCard label="B2" input={access?.b2} />
              <ButtonCard label="B3" input={access?.b3} />
              <ButtonCard label="B4" input={access?.b4} />
              <ButtonCard label="B5" input={access?.b5} />
              <ButtonCard label="B6" input={access?.b6} />
              <ButtonCard label="B7" input={access?.b7} />
              <ButtonCard label="B8" input={access?.b8} />
              <ButtonCard label="Center" input={access?.center} />
              <ButtonCard label="PS" input={access?.ps} />
              <ButtonCard label="Profile" input={access?.profile} />
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Sticks</SectionTitle>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
              <StickReadout
                label="Raw Stick"
                stickX={access?.stick.x}
                stickY={access?.stick.y}
                button={access?.stick.button}
              />
              <StickReadout
                label="Mapped Left Stick"
                stickX={access?.left.analog.x}
                stickY={access?.left.analog.y}
                button={access?.left.analog.button}
                color="#48aff0"
              />
              <StickReadout
                label="Mapped Right Stick"
                stickX={access?.right.analog.x}
                stickY={access?.right.analog.y}
                button={access?.right.analog.button}
                color="#4caf50"
              />
            </div>
          </Section>

          <Section>
            <SectionTitle>Profile-Mapped Buttons</SectionTitle>
            <Grid>
              <ButtonCard label="Cross" input={access?.cross} />
              <ButtonCard label="Circle" input={access?.circle} />
              <ButtonCard label="Square" input={access?.square} />
              <ButtonCard label="Triangle" input={access?.triangle} />
              <ButtonCard label="D-Up" input={access?.dpad.up} />
              <ButtonCard label="D-Down" input={access?.dpad.down} />
              <ButtonCard label="D-Left" input={access?.dpad.left} />
              <ButtonCard label="D-Right" input={access?.dpad.right} />
              <ButtonCard label="L1" input={access?.left.bumper} />
              <ButtonCard label="R1" input={access?.right.bumper} />
              <ButtonCard label="Options" input={access?.options} />
              <ButtonCard label="Create" input={access?.create} />
              <ButtonCard label="Mute" input={access?.mute} />
              <ButtonCard label="Touchpad" input={access?.touchpad.button} />
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Mapped Triggers</SectionTitle>
            <Grid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))" }}>
              <AnalogCard label="L2" input={access?.left.trigger} />
              <AnalogCard label="R2" input={access?.right.trigger} />
              <ButtonCard label="L2 Button" input={access?.left.trigger.button} />
              <ButtonCard label="R2 Button" input={access?.right.trigger.button} />
            </Grid>
          </Section>

          <Section>
            <SectionTitle>LED Controls</SectionTitle>
            <LedControls access={access} />
          </Section>
        </>
      )}
    </Page>
  );
};

export default AccessPlayground;
