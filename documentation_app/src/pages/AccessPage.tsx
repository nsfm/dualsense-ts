import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import type { DualsenseAccess, Input } from "dualsense-ts";
import { useAccessController } from "../hooks/useAccessController";

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

const StickDot = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f29e02;
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
      <CardValue $active={active}>{active ? "ON" : "—"}</CardValue>
      <CardLabel>{label}</CardLabel>
    </Card>
  );
};

/* ── Stick readout ───────────────────────────────────────────── */

const StickReadout: React.FC<{ access: DualsenseAccess | null }> = ({
  access,
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const clicked = useButtonState(access?.stick.button);

  useEffect(() => {
    if (!access) return;
    const handler = () => {
      setX(access.stick.x.state);
      setY(access.stick.y.state);
    };
    access.stick.on("change", handler);
    return () => {
      access.stick.removeListener("change", handler);
    };
  }, [access]);

  return (
    <Row>
      <StickArea>
        <StickDot $x={x} $y={y} />
      </StickArea>
      <div>
        <div style={{ fontSize: 13, color: "rgba(191,204,214,0.6)" }}>
          X: {x.toFixed(2)} · Y: {y.toFixed(2)}
        </div>
        <div style={{ fontSize: 13, color: clicked ? "#f29e02" : "rgba(191,204,214,0.3)" }}>
          Click: {clicked ? "pressed" : "—"}
        </div>
      </div>
    </Row>
  );
};

/* ── LED controls ────────────────────────────────────────────── */

const LedControls: React.FC<{ access: DualsenseAccess | null }> = ({
  access,
}) => {
  const [color, setColor] = useState("#0000ff");
  const [profileMode, setProfileMode] = useState<number>(1 /* On */);
  const [playerPattern, setPlayerPattern] = useState(0);
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
      const mode = Number(e.target.value);
      setProfileMode(mode);
      access?.profileLeds.set(mode);
    },
    [access]
  );

  const onPlayerPattern = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const p = Number(e.target.value);
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
          <option value={0}>Off</option>
          <option value={1}>On</option>
          <option value={2}>Fade</option>
          <option value={3}>Sweep</option>
        </Select>
      </Card>
      <Card>
        <CardLabel>Player Indicator</CardLabel>
        <Select value={playerPattern} onChange={onPlayerPattern}>
          <option value={0}>Off</option>
          <option value={1}>Player 1</option>
          <option value={2}>Player 2</option>
          <option value={3}>Player 3</option>
          <option value={4}>Player 4</option>
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

const AccessPage: React.FC = () => {
  const { access, connected, requestConnect, supported } =
    useAccessController();

  const [battery, setBattery] = useState(0);
  const [profileId, setProfileId] = useState(1);

  useEffect(() => {
    if (!access) return;
    const onBattery = () =>
      setBattery(Math.round(access.battery.level.state * 100));
    const onProfile = () => setProfileId(access.profileId.state);
    access.battery.on("change", onBattery);
    access.profileId.on("change", onProfile);
    return () => {
      access.battery.removeListener("change", onBattery);
      access.profileId.removeListener("change", onProfile);
    };
  }, [access]);

  if (!supported) {
    return (
      <Page>
        <Title>DualSense Access</Title>
        <Subtitle>WebHID is not supported in this browser.</Subtitle>
      </Page>
    );
  }

  return (
    <Page>
      <Title>DualSense Access</Title>
      <Subtitle>
        Raw hardware inputs, battery, profile, and 4 LED systems.
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

          <Section>
            <SectionTitle>Buttons</SectionTitle>
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
            <SectionTitle>Analog Stick</SectionTitle>
            <StickReadout access={access} />
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

export default AccessPage;
