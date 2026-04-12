import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse } from "react-zdog";
import { MuteLedMode } from "dualsense-ts";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../../controller";

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

/** PlayStation button — "Ps" glyph: tall P with a smaller s beside it */
export const PsButton = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.ps.state);
  React.useEffect(() => {
    controller.ps.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = pressed ? ACTIVE : INACTIVE;
  const glyph = pressed ? INACTIVE : color;
  const st = 0.18;
  // P sits left of center, s sits right, baseline-aligned at bottom
  const px = -0.38; // P center x
  const sx = 0.42;  // s center x
  const top = 0.95; // P top
  const bot = -0.85; // shared baseline
  const mid = 0.05; // P bowl bottom / s top
  return (
    <ButtonShell label="PS" pressed={pressed} size={LARGE}>
      <Ellipse diameter={LARGE} stroke={0.25} color={color} fill={pressed} />
      {/* P — vertical stem */}
      <Shape
        path={[
          { x: px, y: 0, z: top },
          { x: px, y: 0, z: bot },
        ]}
        stroke={st}
        color={glyph}
      />
      {/* P — bowl */}
      <Shape
        path={[
          { x: px, y: 0, z: top },
          {
            arc: [
              { x: px + 0.65, y: 0, z: top },
              { x: px + 0.65, y: 0, z: (top + mid) / 2 },
            ],
          },
          {
            arc: [
              { x: px + 0.65, y: 0, z: mid },
              { x: px, y: 0, z: mid },
            ],
          },
        ]}
        stroke={st}
        color={glyph}
        closed={false}
      />
      {/* s — angular S from line segments */}
      <Shape
        path={[
          { x: sx + 0.22, y: 0, z: mid },
          { x: sx - 0.22, y: 0, z: mid },
          { x: sx - 0.22, y: 0, z: (mid + bot) / 2 },
          { x: sx + 0.22, y: 0, z: (mid + bot) / 2 },
          { x: sx + 0.22, y: 0, z: bot },
          { x: sx - 0.22, y: 0, z: bot },
        ]}
        stroke={st}
        color={glyph}
        closed={false}
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
  const [pulsing, setPulsing] = React.useState(false);
  const pulsingRef = React.useRef(pulsing);
  pulsingRef.current = pulsing;
  React.useEffect(() => {
    controller.mute.on("change", ({ state }) => setPressed(state));
    controller.mute.status.on("change", ({ state }) => {
      setMuted(state);
      if (pulsingRef.current) {
        // Match LED to new mute state, replacing our pulse override
        controller.mute.setLed(state ? MuteLedMode.On : MuteLedMode.Off);
        setPulsing(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    if (pulsing) {
      // Match LED to current mute state, replacing our pulse override
      controller.mute.setLed(
        controller.mute.status.state ? MuteLedMode.On : MuteLedMode.Off,
      );
      setPulsing(false);
    } else {
      controller.mute.setLed(MuteLedMode.Pulse);
      setPulsing(true);
    }
  };

  const color = muted || pulsing ? ACTIVE : pressed ? ACTIVE : INACTIVE;
  const hw = PILL_WIDTH / 2;
  const hh = PILL_HEIGHT / 2;
  const r = hh;
  return (
    <Container onClick={handleClick} style={{ cursor: "pointer" }}>
      <RenderedElement
        width={(PILL_WIDTH + 2) * ZOOM}
        height={(PILL_HEIGHT + 2) * ZOOM}
        style={{ pointerEvents: "none" }}
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
                fill={muted || pulsing}
                closed={true}
              />
            </Shape>
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>{muted ? (pulsing ? "Pulsing" : "Muted") : "Mute"}</VisLabel>
    </Container>
  );
};
