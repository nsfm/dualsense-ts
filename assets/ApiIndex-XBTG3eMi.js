import{j as e,g as a,R as v,L as g}from"./index-Bm_ty-o0.js";const w=[{label:"triangle, circle, cross, square",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"ps, create, options",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"mute",type:"Mute",href:"/api/mute",kind:"input",note:"extends Momentary",children:[{label:"status",type:"Momentary",href:"/api/momentary",kind:"state"}]},{label:"dpad",type:"Dpad",href:"/api/dpad",kind:"input",children:[{label:"up, down, left, right",type:"Momentary",href:"/api/momentary",kind:"input"}]},{label:"left, right",type:"Unisense",href:"/api/unisense",kind:"input",children:[{label:"trigger",type:"Trigger",href:"/api/trigger",kind:"input",children:[{label:"button",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"feedback",type:"TriggerFeedback",href:"/api/trigger-feedback",kind:"output"}]},{label:"bumper",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"analog",type:"Analog",href:"/api/analog",kind:"input",children:[{label:"x, y",type:"Axis",href:"/api/axis",kind:"input"},{label:"button",type:"Momentary",href:"/api/momentary",kind:"input",note:"L3 / R3"}]}]},{label:"touchpad",type:"Touchpad",href:"/api/touchpad",kind:"input",children:[{label:"button",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"left, right",type:"Touch",href:"/api/touchpad",kind:"input",note:"extends Analog",children:[{label:"contact",type:"Momentary",href:"/api/momentary",kind:"input"},{label:"tracker",type:"Increment",kind:"state"}]}]},{label:"gyroscope",type:"Gyroscope",href:"/api/gyroscope",kind:"sensor",children:[{label:"x, y, z",type:"Axis",href:"/api/axis",kind:"input"}]},{label:"accelerometer",type:"Accelerometer",href:"/api/accelerometer",kind:"sensor",children:[{label:"x, y, z",type:"Axis",href:"/api/axis",kind:"input"}]},{label:"battery",type:"Battery",href:"/api/battery",kind:"state",children:[{label:"level",type:"BatteryLevel",kind:"state"},{label:"status",type:"BatteryStatus",kind:"state"}]},{label:"lightbar",type:"Lightbar",href:"/api/lightbar",kind:"output"},{label:"playerLeds",type:"PlayerLeds",href:"/api/player-leds",kind:"output"},{label:"audio",type:"Audio",href:"/api/audio",kind:"output"},{label:"microphone, headphone, connection",type:"Momentary",href:"/api/momentary",kind:"state"},{label:"hid",type:"DualsenseHID",kind:"hid"}],T=a.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 20px 8px 20px 16px;
  margin: 16px 0;
  overflow-x: auto;
`,$=a(g)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f5f5f5;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    text-decoration: none;
  }
`,f=a.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 20px;
`,L=a.li`
  position: relative;
  padding: 0 0 0 20px;

  /* Vertical line from parent */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  /* Horizontal branch line */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 16px;
    width: 16px;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  /* Last child: cut the vertical line at the branch point */
  &:last-child::before {
    bottom: calc(100% - 16px);
  }
`,M=a.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: ${t=>t.$clickable?"pointer":"default"};
  transition: background 0.12s;
  min-height: 28px;

  &:hover {
    background: ${t=>t.$clickable?"rgba(72, 175, 240, 0.08)":"transparent"};
  }
`,D=a.span`
  font-family: monospace;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.9);
`,s={input:"#48aff0",output:"#f29e02",sensor:"#3dcc91",state:"#c792ea",hid:"rgba(191, 204, 214, 0.4)"},u=a.span`
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  color: ${t=>s[t.$kind??""]??"rgba(191, 204, 214, 0.6)"};
  background: ${t=>(s[t.$kind??""]??"rgba(191, 204, 214, 0.6)")+"15"};
  border: 1px solid ${t=>(s[t.$kind??""]??"rgba(191, 204, 214, 0.6)")+"30"};
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
`,A=a.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.35);
  font-style: italic;
`,I=a.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  color: rgba(191, 204, 214, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  user-select: none;
  flex-shrink: 0;
  transition: color 0.12s, border-color 0.12s, transform 0.15s;
  transform: rotate(${t=>t.$expanded?"90deg":"0deg"});

  &:hover {
    color: rgba(191, 204, 214, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
  }
`,C=a.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 0 8px;
`,c=a.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: rgba(191, 204, 214, 0.5);
`,p=a.span`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${t=>t.$color};
`,m=({node:t})=>{const[o,j]=v.useState(!t.collapsed),x=t.children&&t.children.length>0,y=e.jsxs(M,{$clickable:x,onClick:x?()=>j(d=>!d):void 0,children:[x&&e.jsx(I,{$expanded:o,children:"▶"}),e.jsxs(D,{children:[".",t.label]}),t.href?e.jsx(g,{to:t.href,onClick:d=>d.stopPropagation(),children:e.jsx(u,{$kind:t.kind,children:t.type})}):e.jsx(u,{$kind:t.kind,children:t.type}),t.note&&e.jsx(A,{children:t.note})]});return e.jsxs(L,{children:[y,x&&o&&e.jsx(f,{children:t.children.map((d,k)=>e.jsx(m,{node:d},k))})]})},z=()=>e.jsxs(T,{children:[e.jsx($,{to:"/api/dualsense",children:e.jsx(u,{$kind:"input",style:{fontSize:13,padding:"2px 8px"},children:"Dualsense"})}),e.jsx(f,{children:w.map((t,o)=>e.jsx(m,{node:t},o))}),e.jsxs(C,{children:[e.jsxs(c,{children:[e.jsx(p,{$color:s.input})," Input"]}),e.jsxs(c,{children:[e.jsx(p,{$color:s.output})," Output"]}),e.jsxs(c,{children:[e.jsx(p,{$color:s.sensor})," Sensor"]}),e.jsxs(c,{children:[e.jsx(p,{$color:s.state})," State"]}),e.jsxs(c,{children:[e.jsx(p,{$color:s.hid})," HID"]})]})]}),E=a.div`
  margin-bottom: 32px;
`,S=a.h1`
  margin-bottom: 8px;
`,R=a.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`,b=a.div`
  color: rgba(191, 204, 214, 0.85);
  line-height: 1.7;
  margin-bottom: 32px;
`,l=a.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`,h=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 16px;
`,n=a(g)`
  display: block;
  padding: 16px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: rgba(72, 175, 240, 0.3);
    background: rgba(72, 175, 240, 0.04);
    text-decoration: none;
  }
`,i=a.div`
  color: #48aff0;
  font-size: 15px;
  font-weight: 600;
  font-family: monospace;
  margin-bottom: 4px;
`,r=a.div`
  color: rgba(191, 204, 214, 0.6);
  font-size: 13px;
  line-height: 1.5;
`,B=()=>e.jsxs(e.Fragment,{children:[e.jsxs(E,{children:[e.jsx(S,{children:"API Reference"}),e.jsx(R,{children:"Classes, types, and interfaces exported by dualsense-ts."})]}),e.jsx(b,{children:e.jsxs("p",{children:["The library is organized around the ",e.jsx("code",{children:"Input"})," base class. Every readable value on the controller — buttons, axes, battery, touch points — is an ",e.jsx("code",{children:"Input"})," subclass with a consistent event API. Output features (lightbar, LEDs, rumble, audio, trigger effects) are accessed as properties on the controller or its child inputs."]})}),e.jsx(l,{children:"Controller Tree"}),e.jsx(b,{children:e.jsxs("p",{children:["The full hierarchy of inputs accessible from a"," ",e.jsx("code",{children:"Dualsense"})," instance. Click a type badge to see its API docs, or use the arrows to expand compound inputs."]})}),e.jsx(z,{}),e.jsx(l,{children:"Core Classes"}),e.jsxs(h,{children:[e.jsxs(n,{to:"/api/dualsense",children:[e.jsx(i,{children:"Dualsense"}),e.jsx(r,{children:"The main controller class. Contains all inputs, outputs, and device info."})]}),e.jsxs(n,{to:"/api/manager",children:[e.jsx(i,{children:"DualsenseManager"}),e.jsx(r,{children:"Multi-controller management with auto-discovery and player LED assignment."})]}),e.jsxs(n,{to:"/api/input",children:[e.jsx(i,{children:"Input<T>"}),e.jsx(r,{children:"Abstract base class for all inputs. Provides events, promises, and async iteration."})]})]}),e.jsx(l,{children:"Input Elements"}),e.jsxs(h,{children:[e.jsxs(n,{to:"/api/momentary",children:[e.jsx(i,{children:"Momentary"}),e.jsx(r,{children:"Boolean button input. Used for face buttons, bumpers, D-pad directions, and more."})]}),e.jsxs(n,{to:"/api/axis",children:[e.jsx(i,{children:"Axis"}),e.jsx(r,{children:"Single-axis value from -1 to 1 with deadzone support. Used in sticks, gyro, and accelerometer."})]}),e.jsxs(n,{to:"/api/analog",children:[e.jsx(i,{children:"Analog"}),e.jsx(r,{children:"Two-axis stick with magnitude, direction, and click button. Left and right sticks."})]}),e.jsxs(n,{to:"/api/trigger",children:[e.jsx(i,{children:"Trigger"}),e.jsx(r,{children:"Pressure-sensitive trigger (0–1) with a full-press button and adaptive feedback."})]}),e.jsxs(n,{to:"/api/unisense",children:[e.jsx(i,{children:"Unisense"}),e.jsx(r,{children:"Groups one side of the controller: trigger, bumper, analog stick, and rumble."})]}),e.jsxs(n,{to:"/api/dpad",children:[e.jsx(i,{children:"Dpad"}),e.jsx(r,{children:"D-pad with four directional sub-inputs (up, down, left, right)."})]}),e.jsxs(n,{to:"/api/touchpad",children:[e.jsx(i,{children:"Touchpad"}),e.jsx(r,{children:"Multi-touch surface with two touch points and a click button."})]}),e.jsxs(n,{to:"/api/gyroscope",children:[e.jsx(i,{children:"Gyroscope"}),e.jsx(r,{children:"3-axis angular velocity sensor (pitch, roll, yaw)."})]}),e.jsxs(n,{to:"/api/accelerometer",children:[e.jsx(i,{children:"Accelerometer"}),e.jsx(r,{children:"3-axis linear acceleration sensor including gravity."})]}),e.jsxs(n,{to:"/api/battery",children:[e.jsx(i,{children:"Battery"}),e.jsx(r,{children:"Battery level (0–1) and charge status (charging, discharging, error)."})]})]}),e.jsx(l,{children:"Motion Helpers"}),e.jsxs(h,{children:[e.jsxs(n,{to:"/api/orientation",children:[e.jsx(i,{children:"Orientation"}),e.jsx(r,{children:"Fused 3D orientation from Madgwick AHRS sensor fusion. Euler angles, quaternion, and accelerometer-only tilt."})]}),e.jsxs(n,{to:"/api/shake-detector",children:[e.jsx(i,{children:"ShakeDetector"}),e.jsx(r,{children:"Shake detection with frequency analysis via the Goertzel algorithm. Intensity, frequency, spectrum, and configurable sensitivity."})]})]}),e.jsx(l,{children:"Output Classes"}),e.jsxs(h,{children:[e.jsxs(n,{to:"/api/lightbar",children:[e.jsx(i,{children:"Lightbar"}),e.jsx(r,{children:"RGB LED strip with color control and fade effects."})]}),e.jsxs(n,{to:"/api/player-leds",children:[e.jsx(i,{children:"PlayerLeds"}),e.jsx(r,{children:"5 white LEDs with individual toggle and brightness control."})]}),e.jsxs(n,{to:"/api/mute",children:[e.jsx(i,{children:"Mute"}),e.jsx(r,{children:"Mute button with controllable orange LED (on/pulse/off/auto)."})]}),e.jsxs(n,{to:"/api/audio",children:[e.jsx(i,{children:"Audio"}),e.jsx(r,{children:"Speaker, headphone, and microphone volume, routing, and DSP control."})]}),e.jsxs(n,{to:"/api/trigger-feedback",children:[e.jsx(i,{children:"TriggerFeedback"}),e.jsx(r,{children:"Adaptive trigger effects: feedback, weapon, bow, galloping, vibration, and machine."})]})]}),e.jsx(l,{children:"Enums & Types"}),e.jsxs(h,{children:[e.jsxs(n,{to:"/api/enums",children:[e.jsx(i,{children:"Enums"}),e.jsx(r,{children:"TriggerEffect, ChargeStatus, Brightness, AudioOutput, MuteLedMode, InputId, and more."})]}),e.jsxs(n,{to:"/api/types",children:[e.jsx(i,{children:"Types"}),e.jsx(r,{children:"Magnitude, Force, Intensity, Radians, Degrees, RGB, and event callback types."})]})]})]});export{B as default};
