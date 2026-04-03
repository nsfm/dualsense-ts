import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse } from "react-zdog";

import { RenderedElement } from "./RenderedElement";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const VisLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`;

const ZOOM = 20;
const TILT = Math.PI / 6;
/** Trigger body width */
const WIDTH = 4;
/** Trigger body depth (front to back) */
const DEPTH = 6;
/** How far the trigger rotates at full press */
const MAX_ROTATION = Math.PI / 5;

interface TriggerVisualizationProps {
  label: string;
  pressure: number;
  pressed: boolean;
}

export const TriggerVisualization = ({
  label,
  pressure,
  pressed,
}: TriggerVisualizationProps) => {
  const rotation = pressure * MAX_ROTATION;
  const housingColor = pressed ? "#f29e02" : "#48aff0";
  const fillColor = pressed
    ? "#ff8c00"
    : pressure > 0
      ? `rgba(242, 158, 2, ${0.2 + pressure * 0.8})`
      : "rgba(72, 175, 240, 0.3)";

  return (
    <Container>
      <RenderedElement width={WIDTH * ZOOM * 2} height={(DEPTH + 2) * ZOOM}>
        <Illustration element="svg" zoom={ZOOM}>
          <Shape rotate={{ x: TILT }} stroke={0}>
            {/* Trigger housing — static base */}
            <Shape
              path={[
                { x: -WIDTH / 2, y: 0, z: 0 },
                { x: WIDTH / 2, y: 0, z: 0 },
                { x: WIDTH / 2, y: 0, z: -DEPTH },
                { x: -WIDTH / 2, y: 0, z: -DEPTH },
              ]}
              stroke={0.3}
              color={housingColor}
              fill={false}
              closed={true}
            />
            {/* Trigger lever — rotates forward on press */}
            <Shape
              rotate={{ x: -rotation }}
              translate={{ z: -DEPTH / 2 }}
              stroke={0}
            >
              <Shape
                path={[
                  { x: -WIDTH / 2 + 0.3, y: 0, z: -DEPTH / 2 + 0.3 },
                  { x: WIDTH / 2 - 0.3, y: 0, z: -DEPTH / 2 + 0.3 },
                  { x: WIDTH / 2 - 0.3, y: 0, z: DEPTH / 2 - 0.3 },
                  { x: -WIDTH / 2 + 0.3, y: 0, z: DEPTH / 2 - 0.3 },
                ]}
                stroke={0.4}
                color={fillColor}
                fill={true}
                closed={true}
              />
            </Shape>
            {/* Pressure indicator — small dot that rises with pressure */}
            <Ellipse
              diameter={0.8}
              stroke={0.2}
              color={pressed ? "#f29e02" : "#48aff0"}
              translate={{ y: -pressure * 2.5, z: -DEPTH - 0.5 }}
            />
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>{label}</VisLabel>
    </Container>
  );
};
