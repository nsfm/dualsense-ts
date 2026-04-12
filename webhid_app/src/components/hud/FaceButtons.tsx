import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse, Polygon } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../../controller";

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
/** Spacing between button centers in the diamond layout */
const SPREAD = 2.8;
const BUTTON_SIZE = 1.4;
const PRESS_DEPTH = 0.5;
const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface ButtonGlyphProps {
  x: number;
  z: number;
  pressed: boolean;
}

/** Triangle glyph — small equilateral triangle */
const TriangleGlyph = ({ x, z, pressed }: ButtonGlyphProps) => (
  <Shape translate={{ x, z, y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
    <Ellipse
      diameter={BUTTON_SIZE * 2}
      stroke={0.2}
      color={pressed ? ACTIVE : INACTIVE}
    />
    <Polygon
      radius={BUTTON_SIZE * 0.55}
      sides={3}
      stroke={0.25}
      color={pressed ? ACTIVE : INACTIVE}
      fill={pressed}
    />
  </Shape>
);

/** Circle glyph */
const CircleGlyph = ({ x, z, pressed }: ButtonGlyphProps) => (
  <Shape translate={{ x, z, y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
    <Ellipse
      diameter={BUTTON_SIZE * 2}
      stroke={0.2}
      color={pressed ? ACTIVE : INACTIVE}
    />
    <Ellipse
      diameter={BUTTON_SIZE * 0.9}
      stroke={0.25}
      color={pressed ? ACTIVE : INACTIVE}
      fill={pressed}
    />
  </Shape>
);

/** Cross glyph — two short perpendicular lines */
const CrossGlyph = ({ x, z, pressed }: ButtonGlyphProps) => {
  const s = BUTTON_SIZE * 0.4;
  return (
    <Shape translate={{ x, z, y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
      <Ellipse
        diameter={BUTTON_SIZE * 2}
        stroke={0.2}
        color={pressed ? ACTIVE : INACTIVE}
      />
      <Shape
        path={[
          { x: -s, y: 0, z: -s },
          { x: s, y: 0, z: s },
        ]}
        stroke={0.25}
        color={pressed ? ACTIVE : INACTIVE}
      />
      <Shape
        path={[
          { x: s, y: 0, z: -s },
          { x: -s, y: 0, z: s },
        ]}
        stroke={0.25}
        color={pressed ? ACTIVE : INACTIVE}
      />
    </Shape>
  );
};

/** Square glyph — Z stretched to compensate for isometric foreshortening */
const SquareGlyph = ({ x, z, pressed }: ButtonGlyphProps) => {
  const sx = BUTTON_SIZE * 0.38;
  const sz = BUTTON_SIZE * 0.44;
  return (
    <Shape translate={{ x, z, y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
      <Ellipse
        diameter={BUTTON_SIZE * 2}
        stroke={0.2}
        color={pressed ? ACTIVE : INACTIVE}
      />
      <Shape
        path={[
          { x: -sx, y: 0, z: -sz },
          { x: sx, y: 0, z: -sz },
          { x: sx, y: 0, z: sz },
          { x: -sx, y: 0, z: sz },
        ]}
        stroke={0.25}
        color={pressed ? ACTIVE : INACTIVE}
        fill={pressed}
        closed={true}
      />
    </Shape>
  );
};

export const FaceButtons = () => {
  const controller = React.useContext(ControllerContext);
  const [tri, setTri] = React.useState(controller.triangle.state);
  const [cir, setCir] = React.useState(controller.circle.state);
  const [cro, setCro] = React.useState(controller.cross.state);
  const [squ, setSqu] = React.useState(controller.square.state);

  React.useEffect(() => {
    controller.triangle.on("change", ({ state }) => setTri(state));
    controller.circle.on("change", ({ state }) => setCir(state));
    controller.cross.on("change", ({ state }) => setCro(state));
    controller.square.on("change", ({ state }) => setSqu(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <RenderedElement
        width={(SPREAD * 2 + BUTTON_SIZE * 2 + 2) * ZOOM}
        height={(SPREAD * 2 + BUTTON_SIZE * 2 + 3) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          <Shape rotate={{ x: TILT }} stroke={0}>
            <TriangleGlyph x={0} z={SPREAD} pressed={tri} />
            <CircleGlyph x={SPREAD} z={0} pressed={cir} />
            <CrossGlyph x={0} z={-SPREAD} pressed={cro} />
            <SquareGlyph x={-SPREAD} z={0} pressed={squ} />
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>Buttons</VisLabel>
    </Container>
  );
};
