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
const TILT = Math.PI / 6;
const BUMPER_WIDTH = 4;
const BUMPER_DEPTH = 2;
const PRESS_DEPTH = 0.4;
const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface BumperProps {
  label: string;
  pressed: boolean;
}

const BumperShape = ({ pressed }: { pressed: boolean }) => {
  const hw = BUMPER_WIDTH / 2;
  const hd = BUMPER_DEPTH / 2;
  return (
    <Shape
      path={[
        { x: -hw, y: 0, z: -hd },
        { x: hw, y: 0, z: -hd },
        { x: hw, y: 0, z: hd },
        { x: -hw, y: 0, z: hd },
      ]}
      stroke={0.3}
      color={pressed ? ACTIVE : INACTIVE}
      fill={pressed}
      closed={true}
      translate={{ y: pressed ? PRESS_DEPTH : 0 }}
    />
  );
};

const Bumper = ({ label, pressed }: BumperProps) => (
  <Container>
    <RenderedElement
      width={(BUMPER_WIDTH + 2) * ZOOM}
      height={(BUMPER_DEPTH + 3) * ZOOM}
    >
      <Illustration element="svg" zoom={ZOOM}>
        <Shape rotate={{ x: TILT }} stroke={0}>
          <BumperShape pressed={pressed} />
        </Shape>
      </Illustration>
    </RenderedElement>
    <VisLabel>{label}</VisLabel>
  </Container>
);

export const LeftBumper = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.left.bumper.state);

  React.useEffect(() => {
    controller.left.bumper.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Bumper label="L1" pressed={pressed} />;
};

export const RightBumper = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.right.bumper.state);

  React.useEffect(() => {
    controller.right.bumper.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Bumper label="R1" pressed={pressed} />;
};
