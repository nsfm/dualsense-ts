import React from "react";
import styled from "styled-components";

import { ControllerContext } from "../Controller";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.7;
`;

const Label = styled.span`
  font-size: 11px;
  opacity: 0.6;
`;

const FadeBtn = styled.button`
  background: rgba(72, 175, 240, 0.1);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 3px;
  color: #48aff0;
  font-size: 10px;
  padding: 2px 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.25);
  }

  &:active {
    background: rgba(72, 175, 240, 0.4);
  }
`;

export const LightbarFadeButtons = () => {
  const controller = React.useContext(ControllerContext);
  const [connected, setConnected] = React.useState(controller.connection.state);

  React.useEffect(() => {
    controller.connection.on("change", ({ state }) => setConnected(state));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connected) return null;

  return (
    <Container>
      <Label>Lightbar:</Label>
      <FadeBtn onClick={() => controller.lightbar.fadeBlue()}>Fade Blue</FadeBtn>
      <FadeBtn onClick={() => controller.lightbar.fadeOut()}>Fade Out</FadeBtn>
    </Container>
  );
};
