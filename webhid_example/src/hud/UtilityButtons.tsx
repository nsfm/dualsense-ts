import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const VisLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`;

const ZOOM = 14;
const TILT = Math.PI / 6;
const PRESS_DEPTH = 0.4;
const SMALL = 1.8;
const LARGE = 2.8;
const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface ButtonShellProps {
  label: string;
  pressed: boolean;
  size: number;
  children: React.ReactNode;
}

const ButtonShell = ({ label, pressed, size, children }: ButtonShellProps) => (
  <Container>
    <RenderedElement width={(size + 2) * ZOOM} height={(size + 2) * ZOOM}>
      <Illustration element="svg" zoom={ZOOM}>
        <Shape rotate={{ x: TILT }} stroke={0}>
          <Shape translate={{ y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
            {children}
          </Shape>
        </Shape>
      </Illustration>
    </RenderedElement>
    <VisLabel>{label}</VisLabel>
  </Container>
);

/** Create button — center vertical line with shorter tilted lines on each side */
export const CreateButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.create.state);
  React.useEffect(() => {
    controller.create.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = pressed ? ACTIVE : INACTIVE;
  const h = SMALL * 0.35;
  const hShort = h * 0.65;
  const spread = SMALL * 0.22;
  const tilt = 0.08;
  return (
    <ButtonShell label="Create" pressed={pressed} size={SMALL}>
      <Ellipse diameter={SMALL} stroke={0.15} color={color} />
      {/* Left line — tilted away, top-aligned with center */}
      <Shape
        path={[
          { x: -spread + tilt, y: 0, z: -h },
          { x: -spread - tilt, y: 0, z: hShort },
        ]}
        stroke={0.15}
        color={color}
      />
      {/* Center line */}
      <Shape
        path={[
          { x: 0, y: 0, z: -h },
          { x: 0, y: 0, z: h },
        ]}
        stroke={0.15}
        color={color}
      />
      {/* Right line — tilted away, top-aligned with center */}
      <Shape
        path={[
          { x: spread - tilt, y: 0, z: -h },
          { x: spread + tilt, y: 0, z: hShort },
        ]}
        stroke={0.15}
        color={color}
      />
    </ButtonShell>
  );
};

/** Options button — three horizontal lines (hamburger) */
export const OptionsButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.options.state);
  React.useEffect(() => {
    controller.options.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = pressed ? ACTIVE : INACTIVE;
  const w = SMALL * 0.3;
  const wShort = w * 0.7;
  const gap = SMALL * 0.24;
  return (
    <ButtonShell label="Options" pressed={pressed} size={SMALL}>
      <Ellipse diameter={SMALL} stroke={0.15} color={color} />
      <Shape
        path={[
          { x: -wShort, y: 0, z: -gap },
          { x: wShort, y: 0, z: -gap },
        ]}
        stroke={0.15}
        color={color}
      />
      <Shape
        path={[
          { x: -w, y: 0, z: 0 },
          { x: w, y: 0, z: 0 },
        ]}
        stroke={0.15}
        color={color}
      />
      <Shape
        path={[
          { x: -wShort, y: 0, z: gap },
          { x: wShort, y: 0, z: gap },
        ]}
        stroke={0.15}
        color={color}
      />
    </ButtonShell>
  );
};

/** PlayStation button — larger circle with stylized PS glyph */
export const PsButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.ps.state);
  React.useEffect(() => {
    controller.ps.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = pressed ? ACTIVE : INACTIVE;
  const g = LARGE * 0.28;
  return (
    <ButtonShell label="PS" pressed={pressed} size={LARGE}>
      <Ellipse diameter={LARGE} stroke={0.25} color={color} fill={pressed} />
      {/* Vertical stroke */}
      <Shape
        path={[
          { x: 0, y: 0, z: -g * 1.2 },
          { x: 0, y: 0, z: g * 1.0 },
        ]}
        stroke={0.2}
        color={pressed ? INACTIVE : color}
      />
      {/* Upper horizontal bar */}
      <Shape
        path={[
          { x: -g * 0.6, y: 0, z: -g * 0.5 },
          { x: g * 0.6, y: 0, z: -g * 0.5 },
        ]}
        stroke={0.15}
        color={pressed ? INACTIVE : color}
      />
      {/* Lower base */}
      <Shape
        path={[
          { x: -g * 0.8, y: 0, z: g * 0.5 },
          { x: g * 0.8, y: 0, z: g * 0.5 },
        ]}
        stroke={0.15}
        color={pressed ? INACTIVE : color}
      />
    </ButtonShell>
  );
};

/** Mute button — narrow pill shape matching the physical controller */
const PILL_WIDTH = 2.4;
const PILL_HEIGHT = 1.0;

export const MuteButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.mute.state);
  const [muted, setMuted] = React.useState(controller.mute.status.state);
  React.useEffect(() => {
    controller.mute.on("change", ({ state }) => setPressed(state));
    controller.mute.status.on("change", ({ state }) => setMuted(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = muted ? ACTIVE : pressed ? ACTIVE : INACTIVE;
  const hw = PILL_WIDTH / 2;
  const hh = PILL_HEIGHT / 2;
  const r = hh;
  return (
    <Container>
      <RenderedElement
        width={(PILL_WIDTH + 2) * ZOOM}
        height={(PILL_HEIGHT + 2) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          <Shape rotate={{ x: TILT }} stroke={0}>
            <Shape translate={{ y: pressed ? PRESS_DEPTH : 0 }} stroke={0}>
              {/* Pill outline — rectangle with rounded ends via stroke */}
              <Shape
                path={[
                  { x: -hw + r, y: 0, z: -hh },
                  { x: hw - r, y: 0, z: -hh },
                  {
                    arc: [
                      { x: hw, y: 0, z: -hh },
                      { x: hw, y: 0, z: 0 },
                    ],
                  },
                  {
                    arc: [
                      { x: hw, y: 0, z: hh },
                      { x: hw - r, y: 0, z: hh },
                    ],
                  },
                  { x: -hw + r, y: 0, z: hh },
                  {
                    arc: [
                      { x: -hw, y: 0, z: hh },
                      { x: -hw, y: 0, z: 0 },
                    ],
                  },
                  {
                    arc: [
                      { x: -hw, y: 0, z: -hh },
                      { x: -hw + r, y: 0, z: -hh },
                    ],
                  },
                ]}
                stroke={0.15}
                color={color}
                fill={muted}
                closed={true}
              />
            </Shape>
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>{muted ? "Muted" : "Mute"}</VisLabel>
    </Container>
  );
};
