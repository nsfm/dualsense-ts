import React, { useContext, useState } from "react";
import { Card, Button, ButtonGroup } from "@blueprintjs/core";
import styled from "styled-components";

import { ControllerContext } from "../Controller";

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  background: transparent;
  &::-webkit-color-swatch-wrapper {
    padding: 2px;
  }
`;

const ColorLabel = styled.span`
  font-size: 12px;
  opacity: 0.7;
  font-family: monospace;
`;

const Label = styled.span`
  min-width: 50px;
  font-size: 12px;
  opacity: 0.7;
`;

export const LightbarControls = () => {
  const controller = useContext(ControllerContext);
  const initial = controller.lightbar.color;
  const [hex, setHex] = useState(rgbToHex(initial.r, initial.g, initial.b));

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHex(value);
    controller.lightbar.set(hexToRgb(value));
  };

  const { r, g, b } = hexToRgb(hex);

  return (
    <Card compact={true}>
      <Row>
        <ColorInput type="color" value={hex} onChange={handleColor} />
        <ColorLabel>
          rgb({r}, {g}, {b})
        </ColorLabel>
      </Row>
      <Row>
        <Label>Pulse</Label>
        <ButtonGroup>
          <Button small={true} onClick={() => controller.lightbar.fadeBlue()}>
            Fade Blue
          </Button>
          <Button small={true} onClick={() => controller.lightbar.fadeOut()}>
            Fade Out
          </Button>
        </ButtonGroup>
      </Row>
    </Card>
  );
};
