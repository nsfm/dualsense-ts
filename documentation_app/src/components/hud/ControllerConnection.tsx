import { useEffect, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { Tag } from "../ui";

import { ControllerContext, ManagerContext, requestPermission } from "../../controller";

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`;

const PulsingButton = styled.button`
  animation: ${pulse} 2s ease-in-out infinite;
  background: transparent;
  border: 1px solid rgba(242, 158, 2, 0.5);
  border-radius: 3px;
  color: #f29e02;
  font-size: 13px;
  font-weight: 500;
  padding: 5px 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(242, 158, 2, 0.1);
  }
`;

export const ControllerConnection = () => {
  const controller = useContext(ControllerContext);
  const manager = useContext(ManagerContext);
  const [connected, setConnected] = useState(controller.connection.state);
  const [pending, setPending] = useState(manager?.pending ?? false);

  useEffect(() => {
    setConnected(controller.connection.state);
    const handler = ({ state }: { state: boolean }) => setConnected(state);
    controller.connection.on("change", handler);
  }, [controller]);

  useEffect(() => {
    if (!manager) return;
    const tick = () => setPending(manager.pending);
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [manager]);

  if (!connected) {
    if (pending) {
      return (
        <StatusContainer>
          <Tag $minimal $intent="warning">
            Connecting...
          </Tag>
        </StatusContainer>
      );
    }
    return (
      <StatusContainer>
        <PulsingButton onClick={requestPermission}>
          Connect Controller
        </PulsingButton>
      </StatusContainer>
    );
  }

  const method =
    controller.hid.provider.wireless === undefined
      ? "unknown"
      : controller.hid.provider.wireless
      ? "bluetooth"
      : "usb";

  const btIcon = (
    <svg width="10" height="14" viewBox="0 0 10 14" style={{ display: "block" }}>
      <path
        d="M5 0.5 L5 13.5 M5 0.5 L8.5 4 L5 7 L8.5 10 L5 13.5 M1.5 4 L5 7 M1.5 10 L5 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const usbIcon = (
    <svg width="12" height="14" viewBox="0 0 12 14" style={{ display: "block" }}>
      <path
        d="M6 1 L6 11 M6 1 L4 3.5 M6 1 L8 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="1.5" y="9" width="3" height="2.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M6 5 L9 5.5 L9 7 M6 8 L3 8.5 L3 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="6" cy="11" r="1.5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );

  const methodIcon = method === "bluetooth" ? btIcon : method === "usb" ? usbIcon : null;

  return (
    <StatusContainer>
      <Tag $minimal $intent="success">
        Connected
      </Tag>
      <Tag $minimal>
        {methodIcon} {method.charAt(0).toUpperCase() + method.slice(1)}
      </Tag>
      {controller.hid.provider.limited && (
        <Tag $minimal $intent="warning">
          Limited
        </Tag>
      )}
    </StatusContainer>
  );
};
