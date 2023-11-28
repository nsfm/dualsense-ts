import React from "react";

import { ControllerContext } from "../Controller";
import { GLSL, Node, Shaders } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  motion: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float x;
uniform float y;
uniform float z;
uniform float a;

void main() {
  gl_FragColor = vec4(uv.x+x, uv.y+y, z, a);
}`,
  },
});
export const ShaderContext = React.createContext(shaders);

export const Shader = () => {
  const controller = React.useContext(ControllerContext);
  const shader = React.useContext(ShaderContext);

  const [{ x, y, z }, setMotion] = React.useState({
    ...controller.accelerometer,
  });
  React.useEffect(() => {
    controller.accelerometer.on("change", (accel) => setMotion({ ...accel }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ x: x.force, y: y.force, z: z.force });
  return (
    <Surface width={300} height={300}>
      <Node
        shader={shader.motion}
        uniforms={{
          x: x.force + controller.left.analog.x.state,
          y: y.force + controller.left.analog.y.state,
          z: z.force + controller.right.analog.x.state,
          a: 1 - controller.left.trigger.state,
        }}
      ></Node>
    </Surface>
  );
};
