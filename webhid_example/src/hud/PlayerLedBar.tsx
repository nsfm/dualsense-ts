import React from "react";
import styled from "styled-components";
import { Brightness } from "dualsense-ts";

import { ControllerContext } from "../Controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const LedRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const LedHitArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.08);
  }
`;

const LedDot = styled.div<{ $on: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${(p) => (p.$on ? "#48aff0" : "rgba(72, 175, 240, 0.3)")};
  background: ${(p) => (p.$on ? "#48aff0" : "transparent")};
  box-shadow: ${(p) => (p.$on ? "0 0 8px #48aff0" : "none")};
  transition: all 0.15s;

  ${LedHitArea}:hover & {
    border-color: #48aff0;
    background: ${(p) => (p.$on ? "#48aff0" : "rgba(72, 175, 240, 0.15)")};
  }
`;

const BrightnessTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 3px 6px;
`;

const BrightnessHitArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
  }

  &:hover > div {
    border-color: #48aff0;
  }
`;

const SunGlyph = ({ rays, active }: { rays: number; active: boolean }) => {
  const size = 16;
  const cx = size / 2;
  const coreR = 2.5;
  const innerR = 4;
  const outerR = 6.5;
  const color = active ? "#48aff0" : "rgba(72, 175, 240, 0.4)";

  const rayLines = Array.from({ length: rays }, (_, i) => {
    const angle = (i * 2 * Math.PI) / rays - Math.PI / 2;
    return (
      <line
        key={i}
        x1={cx + Math.cos(angle) * innerR}
        y1={cx + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * outerR}
        y2={cx + Math.sin(angle) * outerR}
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={cx} cy={cx} r={coreR} fill={active ? color : "none"} stroke={color} strokeWidth="1" />
      {rayLines}
    </svg>
  );
};

const VisLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`;

const HintLabel = styled.span`
  font-size: 7px;
  opacity: 0.2;
`;

const BRIGHTNESS_LEVELS: { value: Brightness; label: string; rays: number }[] = [
  { value: Brightness.Low, label: "Low", rays: 4 },
  { value: Brightness.Medium, label: "Medium", rays: 6 },
  { value: Brightness.High, label: "High", rays: 8 },
];

export const PlayerLedBar = () => {
  const controller = React.useContext(ControllerContext);
  const [, setTick] = React.useState(0);
  const [brightness, setBrightness] = React.useState(
    controller.playerLeds.brightness,
  );
  const forceUpdate = () => setTick((t) => t + 1);

  const toggleLed = (index: number) => {
    controller.playerLeds.setLed(index, !controller.playerLeds.getLed(index));
    forceUpdate();
  };

  const handleBrightness = (value: Brightness) => {
    setBrightness(value);
    controller.playerLeds.setBrightness(value);
  };

  return (
    <Container>
      <LedRow>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = controller.playerLeds.getLed(i);
          return (
            <LedHitArea
              key={i}
              onClick={() => toggleLed(i)}
              title={`LED ${i + 1}: ${on ? "ON" : "OFF"} — click to toggle`}
            >
              <LedDot $on={on} />
            </LedHitArea>
          );
        })}
      </LedRow>
      <BrightnessTrack title="LED brightness">
        {BRIGHTNESS_LEVELS.map(({ value, label, rays }) => (
          <BrightnessHitArea
            key={value}
            onClick={() => handleBrightness(value)}
            title={label}
          >
            <SunGlyph rays={rays} active={brightness === value} />
          </BrightnessHitArea>
        ))}
      </BrightnessTrack>
      <VisLabel>Player LEDs</VisLabel>
      <HintLabel>click me</HintLabel>
    </Container>
  );
};
