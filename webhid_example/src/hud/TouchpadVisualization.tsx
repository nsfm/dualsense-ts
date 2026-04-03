import React from "react";
import styled from "styled-components";
import { Illustration, Shape, Ellipse } from "react-zdog";

import { RenderedElement } from "./RenderedElement";
import { ControllerContext } from "../Controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const VisLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`;

const ZOOM = 14;
const PAD_WIDTH = 16;
const PAD_HEIGHT = 7;
const TRAVEL_X = PAD_WIDTH / 2 - 0.5;
const TRAVEL_Y = PAD_HEIGHT / 2 - 0.5;

export const TouchpadVisualization = () => {
  const controller = React.useContext(ControllerContext);
  const [pressed, setPressed] = React.useState(controller.touchpad.button.state);
  const [t0, setT0] = React.useState({
    active: controller.touchpad.left.contact.state,
    x: controller.touchpad.left.x.state,
    y: controller.touchpad.left.y.state,
  });
  const [t1, setT1] = React.useState({
    active: controller.touchpad.right.contact.state,
    x: controller.touchpad.right.x.state,
    y: controller.touchpad.right.y.state,
  });

  React.useEffect(() => {
    controller.touchpad.button.on("change", ({ state }) => setPressed(state));
    controller.touchpad.left.on("change", (touch) => {
      setT0({
        active: touch.contact.state,
        x: touch.x.state,
        y: touch.y.state,
      });
    });
    controller.touchpad.right.on("change", (touch) => {
      setT1({
        active: touch.contact.state,
        x: touch.x.state,
        y: touch.y.state,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <RenderedElement
        width={(PAD_WIDTH + 2) * ZOOM}
        height={(PAD_HEIGHT + 2) * ZOOM}
      >
        <Illustration element="svg" zoom={ZOOM}>
          {/* Touchpad surface */}
          <Shape
            path={[
              { x: -PAD_WIDTH / 2, y: -PAD_HEIGHT / 2 },
              { x: PAD_WIDTH / 2, y: -PAD_HEIGHT / 2 },
              { x: PAD_WIDTH / 2, y: PAD_HEIGHT / 2 },
              { x: -PAD_WIDTH / 2, y: PAD_HEIGHT / 2 },
            ]}
            stroke={0.2}
            color={pressed ? "#48aff0" : "#335577"}
            fill={true}
            closed={true}
          />
          {/* Outline */}
          <Shape
            path={[
              { x: -PAD_WIDTH / 2, y: -PAD_HEIGHT / 2 },
              { x: PAD_WIDTH / 2, y: -PAD_HEIGHT / 2 },
              { x: PAD_WIDTH / 2, y: PAD_HEIGHT / 2 },
              { x: -PAD_WIDTH / 2, y: PAD_HEIGHT / 2 },
            ]}
            stroke={0.15}
            color="#48aff0"
            fill={false}
            closed={true}
          />
          {/* Center divider */}
          <Shape
            path={[
              { x: 0, y: -PAD_HEIGHT / 2 + 0.5 },
              { x: 0, y: PAD_HEIGHT / 2 - 0.5 },
            ]}
            stroke={0.08}
            color="rgba(72, 175, 240, 0.3)"
          />
          {/* Touch point 0 */}
          {t0.active && (
            <Ellipse
              diameter={1.2}
              stroke={0.3}
              color="#f29e02"
              translate={{
                x: t0.x * TRAVEL_X,
                y: -t0.y * TRAVEL_Y,
              }}
            />
          )}
          {/* Touch point 1 */}
          {t1.active && (
            <Ellipse
              diameter={1.2}
              stroke={0.3}
              color="#ff6b35"
              translate={{
                x: t1.x * TRAVEL_X,
                y: -t1.y * TRAVEL_Y,
              }}
            />
          )}
        </Illustration>
      </RenderedElement>
      <VisLabel>Touchpad</VisLabel>
    </Container>
  );
};
