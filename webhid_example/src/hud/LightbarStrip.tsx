import React from "react";
import styled from "styled-components";

import { ControllerContext } from "../Controller";

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const Container = styled.div`
  position: relative;
  cursor: pointer;
`;

const Strip = styled.div<{ $color: string }>`
  width: 100%;
  height: 14px;
  border-radius: 7px;
  background: ${(p) => p.$color};
  border: 1px solid #48aff0;
  box-shadow: 0 0 8px ${(p) => p.$color}66, 0 0 20px ${(p) => p.$color}33;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 12px ${(p) => p.$color}99, 0 0 30px ${(p) => p.$color}55;
  }
`;

const StripText = styled.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.6);
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`;

export const LightbarStrip = () => {
  const controller = React.useContext(ControllerContext);
  const initial = controller.lightbar.color;
  const [hex, setHex] = React.useState(
    rgbToHex(initial.r, initial.g, initial.b),
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleColor = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setHex(value);
      controller.lightbar.set(hexToRgb(value));
    },
    [controller],
  );

  const handleClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <Container onClick={handleClick} title="Click to change lightbar color">
      <Strip $color={hex}>
        <StripText>click to adjust lights</StripText>
      </Strip>
      <HiddenInput
        ref={inputRef}
        type="color"
        value={hex}
        onChange={handleColor}
      />
    </Container>
  );
};
