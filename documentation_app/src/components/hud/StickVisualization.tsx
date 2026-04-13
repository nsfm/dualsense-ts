import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse } from "react-zdog";

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

const DIAMETER = 7;
const THICKNESS = 0.3;
const ZOOM = 18;
/** How far the orange ring travels at full deflection */
const TRAVEL = 2.2;

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
  return (
    <Container>
      <RenderedElement
        width={(DIAMETER + 2) * ZOOM}
        height={(DIAMETER + 2) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          {/* Base ring — flat top-down view */}
          <Ellipse
            stroke={THICKNESS}
            diameter={DIAMETER}
            color={pressed ? "#f29e02" : "#48aff0"}
          />
          {/* Stick position ring — moves in X/Y plane */}
          <Ellipse
            stroke={THICKNESS}
            diameter={DIAMETER * 0.6}
            color="#f29e02"
            translate={{
              x: x * TRAVEL,
              y: -y * TRAVEL,
            }}
          />
        </Illustration>
      </RenderedElement>
      <VisLabel>{label}</VisLabel>
    </Container>
  );
};
