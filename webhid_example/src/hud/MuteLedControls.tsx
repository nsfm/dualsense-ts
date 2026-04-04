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

  const micIcon = (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="currentColor"
      style={{ display: "block" }}
    >
      <rect x="3" y="0.5" width="4" height="8" rx="2" />
      <path
        d="M1 6.5 Q1 10.5 5 10.5 Q9 10.5 9 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="5"
        y1="10.5"
        x2="5"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="13"
        x2="7"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {ledOn && (
        <line
          x1="1"
          y1="1"
          x2="9"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );

  return (
    <Tag minimal={true} intent={ledOn ? "warning" : "none"} icon={micIcon}>
      {ledOn ? "Muted" : "Mic On"}
    </Tag>
  );
};
