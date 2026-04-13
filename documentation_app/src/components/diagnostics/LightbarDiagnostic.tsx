import React, { useContext, useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { ControllerContext } from "../../controller";

/* ── Helpers ────────────────────────────────────────────────── */

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

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

/* ── Color preview strip ────────────────────────────────────── */

const PreviewRow = styled.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const StripWrap = styled.div`
  position: relative;
  flex: 1;
  cursor: pointer;
`;

const Strip = styled.div<{ $color: string }>`
  height: 24px;
  border-radius: 12px;
  background: ${(p) => p.$color};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px ${(p) => p.$color}66, 0 0 24px ${(p) => p.$color}33;
  transition: box-shadow 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 14px ${(p) => p.$color}99, 0 0 32px ${(p) => p.$color}55;
    transform: scaleY(1.1);
  }
`;

const StripHint = styled.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
`;

const HiddenColor = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

/* ── RGB sliders ────────────────────────────────────────────── */

const ChannelRow = styled.div<{ $even?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const ChannelTop = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ChannelLabel = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  flex: 1;
`;

const ChannelVal = styled.code<{ $color: string }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 4ch;
  text-align: right;
  color: ${(p) => p.$color};
`;

const ChannelSlider = styled.input<{ $color: string }>`
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
    background: ${(p) => p.$color};
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${(p) => p.$color};
    cursor: pointer;
    border: none;
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

/* ── Connected component ─────────────────────────────────── */

const LightbarDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const initial = controller.lightbar.color;
  const [r, setR] = useState(initial.r);
  const [g, setG] = useState(initial.g);
  const [b, setB] = useState(initial.b);
  const hex = rgbToHex(r, g, b);

  const applyColor = useCallback(
    (nr: number, ng: number, nb: number) => {
      setR(nr);
      setG(ng);
      setB(nb);
      controller.lightbar.set({ r: nr, g: ng, b: nb });
    },
    [controller],
  );

  const handleHex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { r: nr, g: ng, b: nb } = hexToRgb(e.target.value);
      applyColor(nr, ng, nb);
    },
    [applyColor],
  );

  return (
    <>
      <PreviewRow>
        <StripWrap>
          <Strip $color={hex}><StripHint>click to pick</StripHint></Strip>
          <HiddenColor type="color" value={hex} onChange={handleHex} />
        </StripWrap>
      </PreviewRow>
      <ChannelRow>
        <ChannelTop>
          <ChannelLabel>Red</ChannelLabel>
          <ChannelVal $color="#ff6b6b">{r}</ChannelVal>
        </ChannelTop>
        <ChannelSlider
          $color="#ff6b6b"
          type="range"
          min={0}
          max={255}
          step={1}
          value={r}
          onChange={(e) => applyColor(parseInt(e.target.value), g, b)}
        />
      </ChannelRow>
      <ChannelRow $even>
        <ChannelTop>
          <ChannelLabel>Green</ChannelLabel>
          <ChannelVal $color="#3dcc91">{g}</ChannelVal>
        </ChannelTop>
        <ChannelSlider
          $color="#3dcc91"
          type="range"
          min={0}
          max={255}
          step={1}
          value={g}
          onChange={(e) => applyColor(r, parseInt(e.target.value), b)}
        />
      </ChannelRow>
      <ChannelRow>
        <ChannelTop>
          <ChannelLabel>Blue</ChannelLabel>
          <ChannelVal $color="#48aff0">{b}</ChannelVal>
        </ChannelTop>
        <ChannelSlider
          $color="#48aff0"
          type="range"
          min={0}
          max={255}
          step={1}
          value={b}
          onChange={(e) => applyColor(r, g, parseInt(e.target.value))}
        />
      </ChannelRow>
      <ReadoutRow $even>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>lightbar<Dim>.</Dim>color</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight>{`{ r: ${r}, g: ${g}, b: ${b} }`}</ReadoutVal>
      </ReadoutRow>
    </>
  );
};

/* ── Fade effects ────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const FadeButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) => (p.$active ? "rgba(72, 175, 240, 0.6)" : "rgba(72, 175, 240, 0.4)")};
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.25)" : "rgba(72, 175, 240, 0.1)"};
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
  }
`;

const FadeEffectsConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [faded, setFaded] = useState(false);
  const fadedRef = useRef(false);

  // Always send fadeOut on unmount if fade is active
  useEffect(() => {
    return () => {
      if (fadedRef.current) {
        controller.lightbar.fadeOut();
      }
    };
  }, [controller]);

  const handleFadeBlue = useCallback(() => {
    controller.lightbar.fadeBlue();
    setFaded(true);
    fadedRef.current = true;
  }, [controller]);

  const handleFadeOut = useCallback(() => {
    controller.lightbar.fadeOut();
    setFaded(false);
    fadedRef.current = false;
  }, [controller]);

  return (
    <ButtonRow>
      <FadeButton $active={faded} onClick={handleFadeBlue}>Fade Blue</FadeButton>
      <FadeButton onClick={handleFadeOut}>Fade Out</FadeButton>
    </ButtonRow>
  );
};

/* ── Exported components ─────────────────────────────────── */

export const LightbarColorPicker: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell style={{ flex: 1 }}>lightbar color</HeaderCell>
      <HeaderCell style={{ flexShrink: 0, textAlign: "right" }}>value</HeaderCell>
    </HeaderRow>
    <LightbarDiagnosticConnected />
  </Table>
);

export const LightbarFadeEffects: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell style={{ flex: 1 }}>fade effects</HeaderCell>
    </HeaderRow>
    <FadeEffectsConnected />
  </Table>
);
