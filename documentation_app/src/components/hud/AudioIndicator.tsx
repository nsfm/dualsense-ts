import { useContext, useEffect, useState } from "react";
import { Tag } from "../ui";

import { ControllerContext } from "../../controller";

export const AudioIndicator = () => {
  const controller = useContext(ControllerContext);
  const [mic, setMic] = useState(controller.microphone.state);
  const [headphone, setHeadphone] = useState(controller.headphone.state);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setMic(controller.microphone.state);
    setHeadphone(controller.headphone.state);
    setConnected(controller.connection.state);
    controller.microphone.on("change", ({ state }) => setMic(state));
    controller.headphone.on("change", ({ state }) => setHeadphone(state));
    controller.connection.on("change", ({ state }) => setConnected(state));
  }, [controller]);

  if (!connected) return null;
  if (!mic && !headphone) return null;

  let label: string;
  if (mic && headphone) {
    label = "Headset";
  } else if (headphone) {
    label = "Headphones";
  } else {
    label = "Mic";
  }

  const icon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      style={{ display: "block" }}
    >
      {headphone ? (
        <>
          <path d="M2 8 Q2 2 7 2 Q12 2 12 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="1" y="7.5" width="2.5" height="4" rx="1" />
          <rect x="10.5" y="7.5" width="2.5" height="4" rx="1" />
          {mic && (
            <>
              <line x1="3" y1="11" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="5.5" cy="13" r="1" />
            </>
          )}
        </>
      ) : (
        <>
          <rect x="4.5" y="1" width="5" height="7" rx="2.5" />
          <path d="M2.5 6.5 Q2.5 11 7 11 Q11.5 11 11.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7" y1="11" x2="7" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  return (
    <Tag
      $minimal
      title={
        mic && headphone
          ? "Headset with microphone connected"
          : headphone
            ? "Headphones connected (no microphone)"
            : "Microphone connected (no headphones)"
      }
    >
      {icon} {label}
    </Tag>
  );
};
