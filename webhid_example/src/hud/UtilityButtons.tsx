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

/** PlayStation button — larger circle */
export const PsButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.ps.state);
  React.useEffect(() => {
    controller.ps.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = pressed ? ACTIVE : INACTIVE;
  return (
    <ButtonShell label="PS" pressed={pressed} size={LARGE}>
      <Ellipse diameter={LARGE} stroke={0.25} color={color} fill={pressed} />
    </ButtonShell>
  );
};

/** Mute button — small circle, fills orange when muted */
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
  return (
    <ButtonShell
      label={muted ? "Muted" : "Mute"}
      pressed={pressed}
      size={SMALL}
    >
      <Ellipse diameter={SMALL} stroke={0.15} color={color} fill={muted} />
      {/* Small dot in center */}
      <Ellipse diameter={0.4} stroke={0.15} color={color} fill={true} />
    </ButtonShell>
  );
};
