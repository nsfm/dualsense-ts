import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../../controller";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VisLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`;

const LabelColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ZOOM = 14;
const TILT = Math.PI / 5;

/** Trigger dimensions */
const T_WIDTH = 3.5;
const T_DEPTH = 5;
const T_MAX_ROTATION = Math.PI / 5;

/** Bumper dimensions */
const B_WIDTH = 3.5;
const B_DEPTH = 1;
const B_PRESS = 0.4;

/** Gap between trigger and bumper */
const SPACING = 2;

const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface ShoulderVisualizationProps {
  triggerLabel: string;
  bumperLabel: string;
  triggerPressure: number;
  triggerPressed: boolean;
  bumperPressed: boolean;
  /** Which side labels go on: "left" = labels on right, "right" = labels on left */
  labelSide: "left" | "right";
}

export const ShoulderVisualization = ({
  triggerLabel,
  bumperLabel,
  triggerPressure,
  triggerPressed,
  bumperPressed,
  labelSide,
}: ShoulderVisualizationProps) => {
  const rotation = triggerPressure * T_MAX_ROTATION;
  const triggerHousing = triggerPressed ? ACTIVE : INACTIVE;
  const triggerFill = triggerPressed
    ? "#ff8c00"
    : triggerPressure > 0
    ? `rgba(242, 158, 2, ${0.2 + triggerPressure * 0.8})`
    : "rgba(72, 175, 240, 0.3)";
  const bumperColor = bumperPressed ? ACTIVE : INACTIVE;

  const totalDepth = T_DEPTH + SPACING + B_DEPTH;
  const canvasW = (Math.max(T_WIDTH, B_WIDTH) + 2) * ZOOM;
  const canvasH = (totalDepth + 3) * ZOOM;

  /**
   * Tilt is negative so the far edge (negative Z) appears at the TOP
   * and the near edge (z=0) appears at the bottom.
   * Trigger housing: z=0 (bottom) to z=-T_DEPTH (top).
   * Dot sits past the top edge and drops with pressure.
   * Bumper sits below the trigger (more positive Z direction).
   */
  const vis = (
    <RenderedElement width={canvasW} height={canvasH}>
      <Illustration element="svg" zoom={ZOOM}>
        <Shape rotate={{ x: -TILT }} stroke={0}>
          {/* --- Trigger — rotating lever --- */}
          {/* Housing outline */}
          <Shape
            path={[
              { x: -T_WIDTH / 2, y: 0, z: 0 },
              { x: T_WIDTH / 2, y: 0, z: 0 },
              { x: T_WIDTH / 2, y: 0, z: -T_DEPTH },
              { x: -T_WIDTH / 2, y: 0, z: -T_DEPTH },
            ]}
            stroke={0.3}
            color={triggerHousing}
            fill={false}
            closed={true}
          />
          {/* Lever — pivots from bottom edge (z=0) */}
          <Shape rotate={{ x: rotation }} stroke={0}>
            <Shape
              path={[
                { x: -T_WIDTH / 2 + 0.3, y: 0, z: -T_DEPTH + 0.3 },
                { x: T_WIDTH / 2 - 0.3, y: 0, z: -T_DEPTH + 0.3 },
                { x: T_WIDTH / 2 - 0.3, y: 0, z: -0.3 },
                { x: -T_WIDTH / 2 + 0.3, y: 0, z: -0.3 },
              ]}
              stroke={0.4}
              color={triggerFill}
              fill={true}
              closed={true}
            />
          </Shape>
          {/* Pressure indicator dot — starts at top, drops with pressure */}
          <Ellipse
            diameter={0.6}
            stroke={0.2}
            color={triggerPressed ? ACTIVE : INACTIVE}
            translate={{ y: triggerPressure * 2, z: -T_DEPTH - 0.3 }}
          />

          {/* --- Bumper (below trigger) --- */}
          <Shape translate={{ z: SPACING }} stroke={0}>
            <Shape
              path={[
                { x: -B_WIDTH / 2, y: 0, z: 0 },
                { x: B_WIDTH / 2, y: 0, z: 0 },
                { x: B_WIDTH / 2, y: 0, z: B_DEPTH },
                { x: -B_WIDTH / 2, y: 0, z: B_DEPTH },
              ]}
              stroke={0.3}
              color={bumperColor}
              fill={bumperPressed}
              closed={true}
              translate={{ y: bumperPressed ? B_PRESS : 0 }}
            />
          </Shape>
        </Shape>
      </Illustration>
    </RenderedElement>
  );

  /**
   * Label gap is computed from the visual distance between trigger and bumper
   * centers so labels stay aligned with their respective elements.
   */
  const labelGap =
    (T_DEPTH / 2 + SPACING + B_DEPTH / 2) * ZOOM * Math.cos(TILT);

  const labels = (
    <LabelColumn style={{ gap: `${labelGap}px` }}>
      <VisLabel style={{ marginTop: 6 }}>{triggerLabel}</VisLabel>
      <VisLabel style={{ marginTop: -6 }}>{bumperLabel}</VisLabel>
    </LabelColumn>
  );

  return (
    <Container>
      {labelSide === "right" ? (
        <>
          {vis}
          {labels}
        </>
      ) : (
        <>
          {labels}
          {vis}
        </>
      )}
    </Container>
  );
};

export const LeftShoulder = () => {
  const controller = React.useContext(ControllerContext);
  const [pressure, setPressure] = React.useState(
    controller.left.trigger.pressure,
  );
  const [triggerPressed, setTriggerPressed] = React.useState(
    controller.left.trigger.button.state,
  );
  const [bumperPressed, setBumperPressed] = React.useState(
    controller.left.bumper.state,
  );

  React.useEffect(() => {
    controller.left.trigger.on("change", ({ pressure }) =>
      setPressure(pressure),
    );
    controller.left.trigger.button.on("change", ({ state }) =>
      setTriggerPressed(state),
    );
    controller.left.bumper.on("change", ({ state }) => setBumperPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShoulderVisualization
      triggerLabel="L2"
      bumperLabel="L1"
      triggerPressure={pressure}
      triggerPressed={triggerPressed}
      bumperPressed={bumperPressed}
      labelSide="right"
    />
  );
};

export const RightShoulder = () => {
  const controller = React.useContext(ControllerContext);
  const [pressure, setPressure] = React.useState(
    controller.right.trigger.pressure,
  );
  const [triggerPressed, setTriggerPressed] = React.useState(
    controller.right.trigger.button.state,
  );
  const [bumperPressed, setBumperPressed] = React.useState(
    controller.right.bumper.state,
  );

  React.useEffect(() => {
    controller.right.trigger.on("change", ({ pressure }) =>
      setPressure(pressure),
    );
    controller.right.trigger.button.on("change", ({ state }) =>
      setTriggerPressed(state),
    );
    controller.right.bumper.on("change", ({ state }) =>
      setBumperPressed(state),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ShoulderVisualization
      triggerLabel="R2"
      bumperLabel="R1"
      triggerPressure={pressure}
      triggerPressed={triggerPressed}
      bumperPressed={bumperPressed}
      labelSide="left"
    />
  );
};
