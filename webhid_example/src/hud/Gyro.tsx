import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

interface GyroState {
  opacity: number;
  diameter: number;
  thickness: number;
  zoom: number;
}

const StyledGyro = styled(RenderedElement)`
  grid-column: 5;
  grid-row: 5;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0.7;
`;

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

  const [state] = React.useState<GyroState>({
    opacity: 0.7,
    diameter: 5,
    thickness: 0.25,
    zoom: 15,
  });

  return (
    <StyledGyro
      className="Gyro"
      width={state.diameter * state.zoom * 1.25}
      height={(state.diameter + 1) * state.zoom}
    >
      <Illustration element="svg" zoom={state.zoom}>
        <Shape
          rotate={{
            y: x.state * Math.PI * 2,
            x: y.state * Math.PI * 2,
            z: z.state * Math.PI * 2,
          }}
          stroke={0}
        >
          <Ellipse
            stroke={state.thickness}
            diameter={state.diameter / 3}
            translate={{
              x: accel.x.force * 5,
              y: accel.y.force * 5,
              z: accel.z.force * 5,
            }}
            color="orange"
          />
          <Ellipse
            stroke={state.thickness}
            diameter={state.diameter}
            color="blue"
          />
        </Shape>
      </Illustration>
    </StyledGyro>
  );
};
