import React from "react";

import { ControllerContext } from "../Controller";
import { TriggerVisualization } from "./TriggerVisualization";

export const LeftTrigger = () => {
  const controller = React.useContext(ControllerContext);
  const [pressure, setPressure] = React.useState(controller.left.trigger.pressure);
  const [pressed, setPressed] = React.useState(controller.left.trigger.button.state);

  React.useEffect(() => {
    controller.left.trigger.on("change", ({ pressure }) => setPressure(pressure));
    controller.left.trigger.button.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <TriggerVisualization label="L2" pressure={pressure} pressed={pressed} />;
};
