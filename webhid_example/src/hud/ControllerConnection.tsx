import { useEffect, useState, useContext } from "react";
import { Illustration, Ellipse } from "react-zdog";
import { Button as BlueprintButton, Icon, Tag } from "@blueprintjs/core";
import styled from "styled-components";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext, requestPermission } from "../Controller";

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SpinnerIcon = styled.div`
  display: flex;
  align-items: center;
`;

export const ControllerConnection = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(controller.connection.state);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [diameter] = useState(1.5);
  const zoom = 12;
  const thickness = 0.2;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation({
        y: (Date.now() / 3000) % Math.PI,
        x: (Date.now() / 2000) % Math.PI,
      });
    }, 1000 / 30);
    controller.connection.on("change", ({ state }) => setConnected(state));
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spinner = (
    <SpinnerIcon>
      <RenderedElement
        width={(diameter + thickness) * zoom}
        height={(diameter + thickness) * zoom}
      >
        <Illustration element="svg" zoom={zoom}>
          <Ellipse
            rotate={rotation}
            stroke={thickness}
            diameter={diameter}
            color={connected ? "#f29e02" : "#48aff0"}
          />
        </Illustration>
      </RenderedElement>
    </SpinnerIcon>
  );

  if (!connected) {
    return (
      <StatusContainer>
        {spinner}
        <BlueprintButton
          onClick={requestPermission}
          outlined={true}
          intent="warning"
          text="Connect Controller"
        />
      </StatusContainer>
    );
  }

  const method =
    controller.hid.provider.wireless === undefined
      ? "unknown"
      : controller.hid.provider.wireless
      ? "bluetooth"
      : "usb";

  return (
    <StatusContainer>
      {spinner}
      <Tag minimal={true} intent="success" icon="link">
        Connected
      </Tag>
      <Tag minimal={true}>{method.toUpperCase()}</Tag>
      {controller.hid.provider.limited && (
        <Tag minimal={true} intent="warning">
          Limited
        </Tag>
      )}
    </StatusContainer>
  );
};
