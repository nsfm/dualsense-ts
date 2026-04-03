import React from "react";

import { ControllerContext } from "../Controller";
import { TriggerVisualization } from "./TriggerVisualization";

export const RightTrigger = () => {
  const controller = React.useContext(ControllerContext);
  const [pressure, setPressure] = React.useState(controller.right.trigger.pressure);
  const [pressed, setPressed] = React.useState(controller.right.trigger.button.state);

  React.useEffect(() => {
    controller.right.trigger.on("change", ({ pressure }) => setPressure(pressure));
    controller.right.trigger.button.on("change", ({ state }) => setPressed(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <TriggerVisualization label="R2" pressure={pressure} pressed={pressed} />;
};
