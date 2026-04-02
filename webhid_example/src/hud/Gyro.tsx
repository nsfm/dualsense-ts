import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

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

const DIAMETER = 8;
const THICKNESS = 0.3;
const ZOOM = 20;

export const Gyro = () => {
  const controller = React.useContext(ControllerContext);
  const [{ x, y, z }, setGyro] = React.useState({ ...controller.gyroscope });
  const [accel, setAccel] = React.useState({ ...controller.accelerometer });
  React.useEffect(() => {
    controller.gyroscope.on("change", (gyro) => {
      setGyro({ ...gyro });
      setAccel(accel);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <RenderedElement
        width={DIAMETER * ZOOM * 1.25}
        height={(DIAMETER + 1) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          <Shape
            rotate={{
              y: x.state * Math.PI * 2,
              x: y.state * Math.PI * 2,
              z: z.state * Math.PI * 2,
            }}
            stroke={0}
          >
            <Ellipse
              stroke={THICKNESS}
              diameter={DIAMETER / 3}
              translate={{
                x: accel.x.force * 5,
                y: accel.y.force * 5,
                z: accel.z.force * 5,
              }}
              color="#f29e02"
            />
            <Ellipse
              stroke={THICKNESS}
              diameter={DIAMETER}
              color="#48aff0"
            />
          </Shape>
        </Illustration>
      </RenderedElement>
      <VisLabel>Gyroscope</VisLabel>
    </Container>
  );
};
