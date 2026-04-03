import { useContext, useEffect, useState } from "react";
import { Tag } from "@blueprintjs/core";

import { ControllerContext } from "../Controller";

export const MuteLedControls = () => {
  const controller = useContext(ControllerContext);
  const [ledOn, setLedOn] = useState(controller.mute.status.state);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    controller.mute.status.on("change", ({ state }) => setLedOn(state));
    controller.connection.on("change", ({ state }) => setConnected(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connected) return null;

  return (
    <Tag
      minimal={true}
      intent={ledOn ? "warning" : "none"}
      icon={ledOn ? "volume-off" : "volume-up"}
    >
      {ledOn ? "Muted" : "Unmuted"}
    </Tag>
  );
};
