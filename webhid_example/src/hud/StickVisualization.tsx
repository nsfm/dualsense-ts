import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VisLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`;

const DIAMETER = 8;
const THICKNESS = 0.3;
const ZOOM = 20;
/** Isometric tilt angle (radians) — gives a 3/4 view */
const TILT = Math.PI / 6;
/** How far the orange ring travels at full deflection */
const TRAVEL = 2.5;
/** Z offset between base ring and stick ring */
const FLOAT_HEIGHT = 1.5;
/** How far the base depresses on button press */
const PRESS_DEPTH = 0.6;

interface StickVisualizationProps {
  label: string;
  x: number;
  y: number;
  pressed: boolean;
}

export const StickVisualization = ({
  label,
  x,
  y,
  pressed,
}: StickVisualizationProps) => {
  const baseZ = pressed ? -PRESS_DEPTH : 0;

  return (
    <Container>
      <RenderedElement
        width={DIAMETER * ZOOM * 1.5}
        height={(DIAMETER + 3) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          {/* Fixed isometric camera angle */}
          <Shape rotate={{ x: TILT }} stroke={0}>
            {/* Base ring — depresses on button press */}
            <Ellipse
              stroke={THICKNESS}
              diameter={DIAMETER}
              color="#48aff0"
              translate={{ z: baseZ }}
            />
            {/* Stick ring — floats above, moves in X/Y plane */}
            <Ellipse
              stroke={THICKNESS}
              diameter={DIAMETER * 0.7}
              color="#f29e02"
              translate={{
                x: x * TRAVEL,
                y: -y * TRAVEL,
                z: FLOAT_HEIGHT + baseZ,
              }}
            />
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>{label}</VisLabel>
    </Container>
  );
};
