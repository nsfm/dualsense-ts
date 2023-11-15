import { useEffect, useState, useContext } from "react";
import { Illustration, Ellipse } from "react-zdog";
import { Button as BlueprintButton, Icon } from "@blueprintjs/core";
import styled from "styled-components";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext, requestPermission } from "../Controller";

const Button = styled(BlueprintButton)`
  opacity: 0.7;

  &:hover {
    opacity: 0.9;
  }
`;

const Position = styled.div<{ connected: boolean }>`
  opacity: 0.5;
  display: flex;
  justify-content: ${(props) => (props.connected ? "right" : "center")};
  align-items: ${(props) => (props.connected ? "top" : "center")};
  grid-column: ${(props) => (props.connected ? -2 : 3)};
  grid-row: 1;
  padding: 1vw;
`;

interface ControllerConnectionState {
  offset: { x: number; y: number };
  opacity: number;
  thickness: number;
  parallax: number;
  zoom: number;
}

export const ControllerConnection = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(controller.connection.state);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [diameter] = useState(2);
  useEffect(() => {
    setInterval(() => {
      setRotation({
        y: (controller.right.analog.direction * 4) % Math.PI,
        x: (Date.now() / 2000) % Math.PI,
      });
    }, 1000 / 30);
    controller.connection.on("change", ({ state }) => setConnected(state));
  }, []);

  const [state] = useState<ControllerConnectionState>({
    offset: { x: 0, y: 0 },
    opacity: 0.7,
    thickness: 0.25,
    parallax: 0.1,
    zoom: 15,
  });

  const icon = (
    <RenderedElement
      width={(diameter + state.thickness) * state.zoom}
      height={(diameter + state.thickness) * state.zoom}
    >
      <Illustration element="svg" zoom={state.zoom}>
        <Ellipse
          rotate={rotation}
          stroke={state.thickness}
          diameter={diameter}
          color={connected ? "orange" : "blue"}
          translate={{ x: 0, y: 0 }}
        />
      </Illustration>
    </RenderedElement>
  );

  return (
    <Position connected={connected}>
      {connected ? (
        <Icon icon={icon} />
      ) : (
        <Button
          onClick={requestPermission}
          large={true}
          outlined={true}
          intent="warning"
          text="select controller"
        />
      )}
    </Position>
  );
};
