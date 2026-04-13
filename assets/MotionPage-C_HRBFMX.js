import{j as e,g as n,a as s,C as u,R as S,L as m}from"./index-CqgUOPB5.js";import{F,P as d,S as h,D as R,a as f,H as y}from"./FeaturePage-CYJYceNC.js";import{G as C}from"./PlayerLedControls-C1-bIBlF.js";import"./BatteryVisualization-DHkORJDA.js";import{a as p}from"./CodeBlock-D0xyfFu-.js";const j=n.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child {
    border-radius: 8px 8px 0 0;
  }

  & > :last-child {
    border-radius: 0 0 8px 8px;
  }
`,A=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${o=>o.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,v=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,x=n.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,b=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,g=n.span`
  color: rgba(191, 204, 214, 0.3);
`,D=n.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${o=>o.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,M=n.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${o=>o.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,w=n.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: help;
  position: relative;

  & > code {
    transition: color 0.1s;
  }

  &:hover > code {
    color: rgba(191, 204, 214, 1);
  }

  &:hover > span:first-child {
    color: rgba(191, 204, 214, 0.6);
    border-color: rgba(191, 204, 214, 0.3);
  }

  &::after {
    content: ${o=>JSON.stringify(o.$tip)};
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 6px;
    padding: 6px 10px;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: rgba(191, 204, 214, 0.85);
    line-height: 1.4;
    white-space: normal;
    max-width: 320px;
    width: max-content;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s 0.08s;
  }

  &:hover::after {
    opacity: 1;
  }
`,z=n.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid rgba(191, 204, 214, 0.15);
  font-size: 10px;
  font-style: italic;
  font-family: Georgia, serif;
  color: rgba(191, 204, 214, 0.3);
  flex-shrink: 0;
`;function l(o){const t=o.toFixed(3);return o>=0?` ${t}`:t}const k=({data:o,even:t})=>{const i=o.label.split(".");return e.jsxs(A,{$even:t,children:[e.jsxs(w,{$tip:o.tooltip,children:[e.jsx(z,{children:"i"}),e.jsxs(b,{children:[e.jsx(g,{children:"controller."}),i.map((c,r)=>e.jsxs(S.Fragment,{children:[r>0&&e.jsx(g,{children:"."}),r===i.length-1?c:e.jsx(g,{children:c})]},r))]})]}),e.jsx(D,{$highlight:o.highlight,children:o.state}),e.jsx(M,{$active:o.active,children:o.active?"true":"false"})]})};function T(o,t,i){return[{label:`${o}.x.state`,tooltip:i.x,state:l(t.x.state),active:t.x.active,highlight:t.x.state!==0},{label:`${o}.x.force`,tooltip:`${i.force} X axis. Returns 0 inside the axis deadzone.`,state:l(t.x.force),active:t.x.active,highlight:t.x.force!==0},{label:`${o}.y.state`,tooltip:i.y,state:l(t.y.state),active:t.y.active,highlight:t.y.state!==0},{label:`${o}.y.force`,tooltip:`${i.force} Y axis. Returns 0 inside the axis deadzone.`,state:l(t.y.force),active:t.y.active,highlight:t.y.force!==0},{label:`${o}.z.state`,tooltip:i.z,state:l(t.z.state),active:t.z.active,highlight:t.z.state!==0},{label:`${o}.z.force`,tooltip:`${i.force} Z axis. Returns 0 inside the axis deadzone.`,state:l(t.z.force),active:t.z.active,highlight:t.z.force!==0}]}const L=()=>{const t=s.useContext(u).gyroscope,[,i]=s.useState(0);s.useEffect(()=>{const r=()=>i(a=>a+1);return t.on("change",r),()=>{t.removeListener("change",r)}},[t]);const c=T("gyroscope",t,{x:"Raw angular velocity around the X axis (pitch). -1 to 1.",y:"Raw angular velocity around the Y axis (yaw). -1 to 1.",z:"Raw angular velocity around the Z axis (roll). -1 to 1.",force:"Deadzone-applied angular velocity on the"});return e.jsx(e.Fragment,{children:c.map((r,a)=>e.jsx(k,{data:r,even:a%2===1},r.label))})},H=()=>{const t=s.useContext(u).accelerometer,[,i]=s.useState(0);s.useEffect(()=>{const r=()=>i(a=>a+1);return t.on("change",r),()=>{t.removeListener("change",r)}},[t]);const c=T("accelerometer",t,{x:"Linear acceleration on the X axis (lateral). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",y:"Linear acceleration on the Y axis (vertical). Includes gravity (~0.25 at rest). ~0.25 = 1g, 1.0 = 4g.",z:"Linear acceleration on the Z axis (forward/back). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",force:"Deadzone-applied linear acceleration on the"});return e.jsx(e.Fragment,{children:c.map((r,a)=>e.jsx(k,{data:r,even:a%2===1},r.label))})},$=()=>e.jsxs(v,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(x,{style:{flex:1},children:"property"}),e.jsx(x,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(x,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),G=()=>e.jsxs(j,{children:[e.jsx($,{}),e.jsx(L,{})]}),I=()=>e.jsxs(j,{children:[e.jsx($,{}),e.jsx(H,{})]}),U=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,E=n.code`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${o=>o.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,B=()=>{const o=s.useContext(u),[,t]=s.useState(0);s.useEffect(()=>{const r=()=>t(a=>a+1);return o.gyroscope.on("change",r),()=>{o.gyroscope.removeListener("change",r)}},[o]);const i=o.sensorTimestamp??0,c=i>0;return e.jsxs(U,{children:[e.jsxs(w,{$tip:"Monotonic hardware clock in microseconds. Wraps at 2³² (~71.6 min). Use for precise motion integration.",children:[e.jsx(z,{children:"i"}),e.jsxs(b,{children:[e.jsx(g,{children:"controller."}),"sensorTimestamp"]})]}),e.jsxs(E,{$highlight:c,children:[i.toLocaleString()," ",e.jsx("span",{style:{fontSize:11,color:"rgba(191,204,214,0.3)"},children:"µs"})]})]})},P=()=>e.jsxs(j,{children:[e.jsxs(v,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(x,{style:{flex:1},children:"property"}),e.jsx(x,{style:{flexShrink:0,textAlign:"right"},children:"value"})]}),e.jsx(B,{})]}),Z=()=>e.jsxs(F,{title:"Motion Sensors",subtitle:"6-axis IMU: 3-axis gyroscope and 3-axis accelerometer.",children:[e.jsxs(d,{children:[e.jsxs("p",{children:["The DualSense includes a 6-axis inertial measurement unit (IMU) with a"," ",e.jsx(m,{to:"/api/gyroscope",children:e.jsx("code",{children:"Gyroscope"})})," measuring angular velocity and an"," ",e.jsx(m,{to:"/api/accelerometer",children:e.jsx("code",{children:"Accelerometer"})})," ","measuring linear acceleration. Both expose three"," ",e.jsx(m,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})," sub-inputs (",e.jsx("code",{children:".x"}),", ",e.jsx("code",{children:".y"}),", ",e.jsx("code",{children:".z"}),") with the same"," ",e.jsx("code",{children:".state"})," / ",e.jsx("code",{children:".force"})," / ",e.jsx("code",{children:".active"})," ","semantics as analog stick axes."]}),e.jsx("p",{children:"Motion data updates at HID report rate. For game loops and animation frames, read the values synchronously rather than subscribing to events."})]}),e.jsx(h,{children:"Live State"}),e.jsx(R,{children:"Rotate and move your controller"}),e.jsx(f,{children:e.jsx(C,{})}),e.jsx(f,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(G,{})}),e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(I,{})})]})}),e.jsx(f,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(P,{})}),e.jsx(h,{children:"Gyroscope"}),e.jsx(d,{children:e.jsx("p",{children:"The gyroscope measures angular velocity — how fast the controller is rotating around each axis. Values are normalized to -1 to 1. At rest, all axes should read near zero."})}),e.jsx(p,{code:`// Synchronous read in a game loop
const pitch = controller.gyroscope.x.force;
const yaw   = controller.gyroscope.y.force;
const roll  = controller.gyroscope.z.force;

// Use for camera rotation, steering, etc.
camera.rotate(pitch * sensitivity, yaw * sensitivity);`}),e.jsx(h,{children:"Accelerometer"}),e.jsx(d,{children:e.jsx("p",{children:"The accelerometer measures linear acceleration including gravity. The raw scale is not yet normalized to standard units — a value of ~0.25 corresponds to 1g, and the scale maxes out at 4g (1.0)."})}),e.jsx(y,{children:"The accelerometer always includes gravitational acceleration. At rest on a flat surface, you'll see approximately 0.25 on the vertical axis (1g). To isolate motion from gravity, you'll need a complementary or sensor fusion filter."}),e.jsx(p,{code:`// Detect a shake gesture
const threshold = 0.8;
const shaking =
  Math.abs(controller.accelerometer.x.force) > threshold ||
  Math.abs(controller.accelerometer.y.force) > threshold ||
  Math.abs(controller.accelerometer.z.force) > threshold;`}),e.jsx(h,{children:"Sensor Timestamp"}),e.jsx(d,{children:e.jsxs("p",{children:["Each input report includes a monotonic sensor timestamp from the controller's hardware clock, exposed as"," ",e.jsx("code",{children:"controller.sensorTimestamp"}),". The value counts in microseconds and wraps at 2",e.jsx("sup",{children:"32"})," (~71.6 minutes). Use it to compute precise time deltas between motion samples — essential for gyroscope integration and any frame-rate-independent motion processing."]})}),e.jsx(p,{code:`let prevTimestamp = 0;

controller.gyroscope.on("change", () => {
  const now = controller.sensorTimestamp;

  // Handle wrap-around at 2^32
  const dt = (now >= prevTimestamp
    ? now - prevTimestamp
    : 0xFFFFFFFF - prevTimestamp + now + 1
  ) / 1_000_000; // convert µs to seconds

  prevTimestamp = now;

  // Integrate angular velocity with precise dt
  orientation.x += controller.gyroscope.x.force * dt;
  orientation.y += controller.gyroscope.y.force * dt;
  orientation.z += controller.gyroscope.z.force * dt;
});`}),e.jsx(y,{children:"The sensor timestamp comes from the controller's own clock, not the host. This means it is unaffected by system load, USB polling jitter, or Bluetooth scheduling — it reflects exactly when the IMU sampled."}),e.jsx(h,{children:"Combined Motion Tracking"}),e.jsx(d,{children:e.jsx("p",{children:"For full orientation tracking, combine both sensors. The gyroscope gives you rotation rate (integrate for angle) while the accelerometer provides a gravity reference to correct drift."})}),e.jsxs(y,{children:["Raw gyroscope integration drifts over time. For stable orientation, use a complementary filter or a library like"," ",e.jsx("code",{children:"ahrs"})," / ",e.jsx("code",{children:"madgwick"})," that fuses both sensor streams."]}),e.jsx(p,{code:`// Combined motion in a game loop
function onFrame() {
  const gyro = controller.gyroscope;
  const accel = controller.accelerometer;

  // Gyro: integrate angular velocity for rotation
  orientation.x += gyro.x.force * dt;
  orientation.y += gyro.y.force * dt;
  orientation.z += gyro.z.force * dt;

  // Accel: use gravity vector to correct drift
  const gravityAngle = Math.atan2(accel.x.force, accel.z.force);
  orientation.x = lerp(orientation.x, gravityAngle, 0.02);
}`})]});export{Z as default};
