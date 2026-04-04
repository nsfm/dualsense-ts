import React from "react";
import styled from "styled-components";
import { Illustration, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

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

const ZOOM = 16;
const TILT = Math.PI / 5;
const ARM_LENGTH = 2.4;
const ARM_WIDTH = 1.8;
/** Left/right arms are taller to fit their arrow glyphs */
const ARM_WIDTH_WIDE = 2.2;
const ARROW_SIZE = 0.5;
const PRESS_DEPTH = 0.5;
const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface DpadArmProps {
  x: number;
  z: number;
  pressed: boolean;
  /** Rotation around Y to orient the arm and arrow */
  rotateY?: number;
  /** Use wider arm (for left/right) */
  wide?: boolean;
}

/**
 * A single D-pad arm: pentagon shape — square on the outside, triangular point
 * toward the center. Arrow glyph points outward.
 * The arm extends along +Z (outward); rotateY orients it.
 */
const POINT_DEPTH = 0.7;

const DpadArm = ({
  x,
  z,
  pressed,
  rotateY = 0,
  wide = false,
}: DpadArmProps) => {
  const hw = (wide ? ARM_WIDTH_WIDE : ARM_WIDTH) / 2;
  const hl = ARM_LENGTH / 2;
  const color = pressed ? ACTIVE : INACTIVE;
  return (
    <Shape
      translate={{ x, z, y: pressed ? PRESS_DEPTH : 0 }}
      rotate={{ y: rotateY }}
      stroke={0}
    >
      {/* Arm body — pentagon: square outside, triangle point inside */}
      <Shape
        path={[
          { x: 0, y: 0, z: -hl - POINT_DEPTH },
          { x: -hw, y: 0, z: -hl },
          { x: -hw, y: 0, z: hl },
          { x: hw, y: 0, z: hl },
          { x: hw, y: 0, z: -hl },
        ]}
        stroke={0.2}
        color={color}
        fill={pressed}
        closed={true}
      />
      {/* Arrow — points along +Z (outward from center) */}
      <Shape
        path={[
          { x: -ARROW_SIZE, y: 0, z: hl * 0.2 },
          { x: 0, y: 0, z: hl * 0.7 },
          { x: ARROW_SIZE, y: 0, z: hl * 0.2 },
        ]}
        stroke={0.2}
        color={color}
        closed={false}
      />
    </Shape>
  );
};

export const DpadVisualization = () => {
  const controller = React.useContext(ControllerContext);
  const [up, setUp] = React.useState(controller.dpad.up.state);
  const [down, setDown] = React.useState(controller.dpad.down.state);
  const [left, setLeft] = React.useState(controller.dpad.left.state);
  const [right, setRight] = React.useState(controller.dpad.right.state);

  React.useEffect(() => {
    controller.dpad.up.on("change", ({ state }) => setUp(state));
    controller.dpad.down.on("change", ({ state }) => setDown(state));
    controller.dpad.left.on("change", ({ state }) => setLeft(state));
    controller.dpad.right.on("change", ({ state }) => setRight(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const offset = 2.8;

  return (
    <Container>
      <RenderedElement
        width={(offset * 2 + ARM_WIDTH_WIDE + 2) * ZOOM}
        height={(offset * 2 + ARM_WIDTH + 3) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          <Shape rotate={{ x: TILT }} stroke={0}>
            {/* Up — points along +Z (visually upward with tilt) */}
            <DpadArm x={0} z={offset} pressed={up} />
            {/* Down — rotated 180° */}
            <DpadArm x={0} z={-offset} pressed={down} rotateY={Math.PI} />
            {/* Left — rotated 90° */}
            <DpadArm
              x={-offset}
              z={0}
              pressed={left}
              rotateY={Math.PI / 2}
              wide
            />
            {/* Right — rotated -90° */}
            <DpadArm
              x={offset}
              z={0}
              pressed={right}
              rotateY={-Math.PI / 2}
              wide
            />
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>D-pad</VisLabel>
    </Container>
  );
};
