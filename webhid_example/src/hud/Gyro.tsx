import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const BarLabel = styled.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`;

const RING_DIAMETER = 6;
const RING_THICKNESS = 0.2;
const RING_ZOOM = 14;

const BAR_WIDTH = 4;
const BAR_HEIGHT = 40;
const BAR_COLOR = "#48aff0";
const BAR_ACTIVE = "#f29e02";

interface BarProps {
  value: number;
  label: string;
}

const Bar = ({ value, label }: BarProps) => {
  const clamped = Math.min(1, Math.abs(value));
  const h = clamped * (BAR_HEIGHT / 2);
  const isNeg = value < 0;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <svg width={BAR_WIDTH} height={BAR_HEIGHT}>
        {/* Background track */}
        <rect
          x={0}
          y={0}
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          fill="rgba(72, 175, 240, 0.08)"
          rx={1}
        />
        {/* Center line */}
        <line
          x1={0}
          y1={BAR_HEIGHT / 2}
          x2={BAR_WIDTH}
          y2={BAR_HEIGHT / 2}
          stroke="rgba(72, 175, 240, 0.15)"
          strokeWidth={0.5}
        />
        {/* Value bar */}
        {h > 0 && (
          <rect
            x={0}
            y={isNeg ? BAR_HEIGHT / 2 : BAR_HEIGHT / 2 - h}
            width={BAR_WIDTH}
            height={h}
            fill={clamped > 0.7 ? BAR_ACTIVE : BAR_COLOR}
            opacity={0.4 + clamped * 0.6}
            rx={1}
          />
        )}
      </svg>
      <BarLabel>{label}</BarLabel>
    </div>
  );
};

const BarColumn = styled.div`
  display: flex;
  gap: 2px;
`;

export const Gyro = () => {
  const controller = React.useContext(ControllerContext);
  const [gyro, setGyro] = React.useState({
    x: controller.gyroscope.x.force,
    y: controller.gyroscope.y.force,
    z: controller.gyroscope.z.force,
  });
  const [accel, setAccel] = React.useState({
    x: controller.accelerometer.x.force,
    y: controller.accelerometer.y.force,
    z: controller.accelerometer.z.force,
  });

  React.useEffect(() => {
    controller.gyroscope.on("change", (g) => {
      setGyro({ x: g.x.force, y: g.y.force, z: g.z.force });
    });
    controller.accelerometer.on("change", (a) => {
      setAccel({ x: a.x.force, y: a.y.force, z: a.z.force });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <BarGroup>
        <BarColumn>
          <Bar value={gyro.x} label="x" />
          <Bar value={gyro.y} label="y" />
          <Bar value={gyro.z} label="z" />
        </BarColumn>
        <BarLabel>Gyro</BarLabel>
      </BarGroup>

      <RenderedElement
        width={(RING_DIAMETER + 2) * RING_ZOOM}
        height={(RING_DIAMETER + 2) * RING_ZOOM}
      >
        <Illustration element="svg" zoom={RING_ZOOM}>
          <Shape
            rotate={{
              y: gyro.x * Math.PI * 2,
              x: gyro.y * Math.PI * 2,
              z: gyro.z * Math.PI * 2,
            }}
            stroke={0}
          >
            <Ellipse
              stroke={RING_THICKNESS}
              diameter={RING_DIAMETER / 3}
              translate={{
                x: accel.x * 3,
                y: accel.y * 3,
                z: accel.z * 3,
              }}
              color="#f29e02"
            />
            <Ellipse
              stroke={RING_THICKNESS}
              diameter={RING_DIAMETER}
              color="#48aff0"
            />
          </Shape>
        </Illustration>
      </RenderedElement>

      <BarGroup>
        <BarColumn>
          <Bar value={accel.x} label="x" />
          <Bar value={accel.y} label="y" />
          <Bar value={accel.z} label="z" />
        </BarColumn>
        <BarLabel>Accel</BarLabel>
      </BarGroup>
    </Container>
  );
};
