import React from "react";

import { ControllerContext } from "../Controller";
import { StickVisualization } from "./StickVisualization";

export const RightStick = () => {
  const controller = React.useContext(ControllerContext);
  const [x, setX] = React.useState(controller.right.analog.x.state);
  const [y, setY] = React.useState(controller.right.analog.y.state);
  const [pressed, setPressed] = React.useState(
    controller.right.analog.button.state
  );

  React.useEffect(() => {
    controller.right.analog.x.on("change", ({ state }) => setX(state));
    controller.right.analog.y.on("change", ({ state }) => setY(state));
    controller.right.analog.button.on("change", ({ state }) =>
      setPressed(state)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StickVisualization label="Right Stick" x={x} y={y} pressed={pressed} />
  );
};
