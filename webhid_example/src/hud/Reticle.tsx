import React from "react";

import { ControllerContext } from "../Controller";
import { StickVisualization } from "./StickVisualization";

export const Reticle = () => {
  const controller = React.useContext(ControllerContext);
  const [x, setX] = React.useState(controller.left.analog.x.force);
  const [y, setY] = React.useState(controller.left.analog.y.force);
  const [pressed, setPressed] = React.useState(
    controller.left.analog.button.state
  );

  React.useEffect(() => {
    controller.left.analog.x.on("change", (axis) => setX(axis.force));
    controller.left.analog.y.on("change", (axis) => setY(axis.force));
    controller.left.analog.button.on("change", ({ state }) =>
      setPressed(state)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <StickVisualization label="Left Stick" x={x} y={y} pressed={pressed} />;
};
