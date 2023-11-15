import React from "react";
import styled from "styled-components";
import { Illustration, Ellipse, Shape } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

interface ReticleState {
  opacity: number;
  diameter: number;
  thickness: number;
  zoom: number;
}

const StyledReticle = styled(RenderedElement)`
  grid-column: 3;
  grid-row: 3 / span 2;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0.7;
`;

export const Reticle = () => {
  const controller = React.useContext(ControllerContext);
  const [{ direction, magnitude }, setAnalog] = React.useState(
    controller.left.analog.vector
  );
  React.useEffect(() => {
    controller.left.analog.on("change", (analog) => {
      setAnalog(analog.vector);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(`Reticle: ${direction} x ${magnitude}`);

  const [state] = React.useState<ReticleState>({
    opacity: 0.7,
    diameter: 5,
    thickness: 0.25,
    zoom: 15,
  });

  return (
    <StyledReticle
      className="Reticle"
      width={state.diameter * state.zoom * 1.25}
      height={(state.diameter + 1) * state.zoom}
    >
      <Illustration element="svg" zoom={state.zoom}>
        <Shape
          rotate={{
            y: Math.sin(direction),
            x: Math.cos(direction),
          }}
          stroke={0}
        >
          <Ellipse
            stroke={state.thickness}
            diameter={state.diameter}
            color="orange"
          />
          <Ellipse
            stroke={state.thickness}
            diameter={state.diameter}
            color="blue"
            translate={{ x: magnitude, y: magnitude, z: -1 }}
          />
        </Shape>
      </Illustration>
    </StyledReticle>
  );
};
