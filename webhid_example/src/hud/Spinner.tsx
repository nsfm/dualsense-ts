import { useEffect, useState } from "react";
import { Illustration, Polygon, Ellipse } from "react-zdog";
import { Icon } from "@blueprintjs/core";

import { RenderedElement } from "./hud/RenderedElement";

export const Spinner = () => {
  const [rotation, setRotation] = useState(0);
  const [radius] = useState(20);
  const [thickness] = useState(3);
  const [zoom] = useState(1);

  useEffect(() => {
    setInterval(() => {
      setRotation((Date.now() / 1000) % (Math.PI * 2000));
    }, 1000 / 30);
  }, []);

  const icon = (
    <RenderedElement
      width={(radius * 4 + thickness) * zoom}
      height={(radius * 4 + thickness) * zoom}
    >
      <Illustration element="canvas" rotate={{ z: rotation }} zoom={zoom}>
        <Polygon
          sides={5}
          rotate={{ x: Math.cos(rotation) }}
          stroke={thickness}
          radius={radius}
          color="orange"
          translate={{ x: -radius }}
        />
        <Ellipse
          rotate={{ y: Math.sin(rotation) }}
          stroke={thickness}
          diameter={radius * 2}
          color="orange"
          translate={{ x: radius }}
        />
        <Polygon
          sides={3}
          rotate={{ x: rotation, y: rotation }}
          stroke={thickness}
          radius={radius}
          color="orange"
          translate={{ x: 0, y: radius }}
        />
      </Illustration>
    </RenderedElement>
  );

  return <Icon icon={icon} />;
};
