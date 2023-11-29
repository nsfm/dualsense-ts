import React from "react";
import styled from "styled-components";
import { DefaultDualsenseHIDState, InputId } from "dualsense-ts";
import { GLSL, Node, Shaders } from "gl-react";
import { Surface } from "gl-react-dom";
import { ControllerContext } from "../Controller";

/** GLSL fragment containing uniform declarations for controller inputs provided by `Dualsense.hid.register */
export const DualsenseHIDUniforms = Object.entries(DefaultDualsenseHIDState)
  .map(
    ([key, value]) =>
      `uniform ${typeof value === "number" ? "float" : "bool"} ${key};`
  )
  .join("\n");

/** GLSL fragment that sets up common inputs and functions */
const setupFrag = GLSL`
precision highp float;
varying vec2 uv;
uniform float time;
${DualsenseHIDUniforms}

// https://github.com/shawnlawson/The_Force/blob/gh-pages/shaders/header.frag#L46C1-L49C2
vec2 rotate(vec2 space, vec2 center, float amount){
    return vec2(cos(amount) * (space.x - center.x) + sin(amount) * (space.y - center.y),
        cos(amount) * (space.y - center.y) - sin(amount) * (space.x - center.x));
}
`;

/** GLSL fragment containing user-provided code */
const mainFrag = GLSL`
void main() {
  vec2 newUv = rotate(uv, vec2(0.5, 0.5), ${InputId.GyroZ}+${InputId.GyroY}+${InputId.GyroX}+${InputId.LeftAnalogY}+${InputId.LeftAnalogX});
  gl_FragColor = vec4(
    newUv.x*(1.0-${InputId.LeftTrigger})+${InputId.AccelX}+(${InputId.Circle} ? 1.0 : 0.0),
    newUv.y*(1.0-${InputId.LeftTrigger})+${InputId.AccelY}+(${InputId.Square} ? 1.0 : 0.0),
    uv.y*(1.0-${InputId.LeftTrigger})+${InputId.AccelZ}+(${InputId.Cross} ? 1.0 : 0.0),
    1.0
  );
}
`;

/** Adapted from `gl-react` demo */
const stripesFrag = GLSL`
void main() {
  float amnt;
  float nd;
  vec4 cbuff = vec4(0.0);
  
  // Number of stripes to render / stripe width
  float lim = ${InputId.LeftTrigger}*18.0+2.0;
  float flashes = abs(${InputId.LeftAnalogX})*30.0;

  // Render stripes 
  for (float i=0.0; i<100.0; i++) {
    if (i > lim) break;
    // Location of the stripe
    nd = sin(3.17*(${InputId.RightAnalogX}+0.1)*uv.x + (i*0.1+sin(time)*(${InputId.RightAnalogY}+0.1)) + time)*0.8-${InputId.RightTrigger} + uv.x;
    // Overall brightness of the stripe
    amnt = 1.0/abs(nd-uv.y)*0.01+(${InputId.AccelX}+${InputId.AccelY}+${InputId.AccelZ}+${InputId.GyroX}+${InputId.GyroY}+${InputId.GyroZ})/2.0;
    // Final color of the stripe
    cbuff += vec4(amnt*${InputId.LeftAnalogY}, amnt*${InputId.LeftAnalogX}, amnt*uv.y+${InputId.LeftAnalogX}, 90.0);
  }

  for (float i=0.0; i<100.0; i++) {
    if (i > flashes) break;
    nd = sin(3.14*(${InputId.Cross} ? 0.0 : 2.0)*uv.y + i*(${InputId.LeftAnalogY}+0.1) + time)*9.3*(uv.y+80.3)+0.5;
    amnt = 1.0/abs(nd-uv.y)*0.015;
    cbuff += vec4(amnt*0.2, amnt*0.2 , amnt*uv.y, 1.0);
  }
  gl_FragColor = cbuff;
}
`;

const shaders = Shaders.create({
  motion: { frag: GLSL`${setupFrag}\n${stripesFrag}` },
});
export const ShaderContext = React.createContext(shaders);

export const SurfaceContainer = styled.div`
  z-index: -10;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

export const Shader = () => {
  const controller = React.useContext(ControllerContext);
  const shader = React.useContext(ShaderContext);

  const [uniforms, setUniforms] = React.useState(DefaultDualsenseHIDState);
  React.useEffect(() => {
    controller.hid.register(setUniforms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SurfaceContainer>
      <Surface width={window.innerWidth} height={window.innerHeight}>
        <Node
          shader={shader.motion}
          uniforms={{ ...uniforms, time: ((Date.now() / 10000) % Math.PI) * 2 }}
        />
      </Surface>
    </SurfaceContainer>
  );
};

export const StyledEditor = styled.div`
  grid-column: 2;
  grid-row: 5;
  justify-content: center;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  opacity: 0;
  padding: 2em;
  background-color: #222222;
`;

export const Editor = () => {
  return (
    <StyledEditor>
      <pre>{mainFrag}</pre>
    </StyledEditor>
  );
};
