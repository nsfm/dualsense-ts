import React from "react";
import { DefaultDualsenseHIDState, InputId } from "dualsense-ts";
import { GLSL, Node, Shaders } from "gl-react";
import { Surface } from "gl-react-dom";
import { ControllerContext } from "../Controller";

const shaders = Shaders.create({
  motion: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float ${InputId.AccelX};
uniform float ${InputId.AccelY};
uniform float ${InputId.AccelZ};
uniform float ${InputId.GyroX};
uniform float ${InputId.GyroY};
uniform float ${InputId.GyroZ};
uniform float ${InputId.LeftAnalogX};
uniform float ${InputId.LeftAnalogY};
uniform float ${InputId.LeftTrigger};
uniform float ${InputId.RightAnalogX};
uniform float ${InputId.RightAnalogY};
uniform float ${InputId.RightTrigger};
uniform bool ${InputId.Cross};
uniform bool ${InputId.Circle};
uniform bool ${InputId.Square};
uniform bool ${InputId.Triangle};

// https://github.com/shawnlawson/The_Force/blob/gh-pages/shaders/header.frag#L46C1-L49C2
vec2 rotate(vec2 space, vec2 center, float amount){
    return vec2(cos(amount) * (space.x - center.x) + sin(amount) * (space.y - center.y),
        cos(amount) * (space.y - center.y) - sin(amount) * (space.x - center.x));
}

void main() {
  vec2 newUv = rotate(uv, vec2(0.5, 0.5), ${InputId.GyroZ}+${InputId.GyroY}+${InputId.GyroX}+${InputId.LeftAnalogY}+${InputId.LeftAnalogX});
  gl_FragColor = vec4(
    newUv.x*(1.0-${InputId.LeftTrigger})+${InputId.AccelX}+(${InputId.Circle} ? 1.0 : 0.0),
    newUv.y*(1.0-${InputId.LeftTrigger})+${InputId.AccelY}+(${InputId.Square} ? 1.0 : 0.0),
    uv.y*(1.0-${InputId.LeftTrigger})+${InputId.AccelZ}+(${InputId.Cross} ? 1.0 : 0.0),
    1.0
  );
}`,
  },
});
export const ShaderContext = React.createContext(shaders);

export const Shader = () => {
  const controller = React.useContext(ControllerContext);
  const shader = React.useContext(ShaderContext);

  const [uniforms, setUniforms] = React.useState(DefaultDualsenseHIDState);
  React.useEffect(() => {
    controller.hid.register(setUniforms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Surface width={300} height={300}>
      <Node shader={shader.motion} uniforms={uniforms}></Node>
    </Surface>
  );
};
