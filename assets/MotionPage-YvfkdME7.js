import{j as e,g as i,a as s,C as u,R as H,L as y}from"./index-GGWi0Ont.js";import{F as M,P as l,S as d,D as v,a as g,H as m}from"./FeaturePage-DywfdRev.js";import{G as P}from"./PlayerLedControls-DMvf0mZJ.js";import"./BatteryVisualization-5o0no79F.js";import{a as x}from"./CodeBlock-Dvv7tnEL.js";const j=i.div`
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
`,E=i.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,k=i.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,p=i.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,T=i.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,f=i.span`
  color: rgba(191, 204, 214, 0.3);
`,G=i.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,Y=i.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,$=i.div`
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
    content: ${t=>JSON.stringify(t.$tip)};
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
`,S=i.span`
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
`;function h(t){const r=t.toFixed(3);return t>=0?` ${r}`:r}const C=({data:t,even:r})=>{const o=t.label.split(".");return e.jsxs(E,{$even:r,children:[e.jsxs($,{$tip:t.tooltip,children:[e.jsx(S,{children:"i"}),e.jsxs(T,{children:[e.jsx(f,{children:"controller."}),o.map((n,a)=>e.jsxs(H.Fragment,{children:[a>0&&e.jsx(f,{children:"."}),a===o.length-1?n:e.jsx(f,{children:n})]},a))]})]}),e.jsx(G,{$highlight:t.highlight,children:t.state}),e.jsx(Y,{$active:t.active,children:t.active?"true":"false"})]})};function F(t,r,o){return[{label:`${t}.x.state`,tooltip:o.x,state:h(r.x.state),active:r.x.active,highlight:r.x.state!==0},{label:`${t}.x.force`,tooltip:`${o.force} X axis. Returns 0 inside the axis deadzone.`,state:h(r.x.force),active:r.x.active,highlight:r.x.force!==0},{label:`${t}.y.state`,tooltip:o.y,state:h(r.y.state),active:r.y.active,highlight:r.y.state!==0},{label:`${t}.y.force`,tooltip:`${o.force} Y axis. Returns 0 inside the axis deadzone.`,state:h(r.y.force),active:r.y.active,highlight:r.y.force!==0},{label:`${t}.z.state`,tooltip:o.z,state:h(r.z.state),active:r.z.active,highlight:r.z.state!==0},{label:`${t}.z.force`,tooltip:`${o.force} Z axis. Returns 0 inside the axis deadzone.`,state:h(r.z.force),active:r.z.active,highlight:r.z.force!==0}]}const I=()=>{const r=s.useContext(u).gyroscope,[,o]=s.useState(0);s.useEffect(()=>{const a=()=>o(c=>c+1);return r.on("change",a),()=>{r.removeListener("change",a)}},[r]);const n=F("gyroscope",r,{x:"Raw angular velocity around the X axis (pitch). -1 to 1.",y:"Raw angular velocity around the Y axis (yaw). -1 to 1.",z:"Raw angular velocity around the Z axis (roll). -1 to 1.",force:"Deadzone-applied angular velocity on the"});return e.jsx(e.Fragment,{children:n.map((a,c)=>e.jsx(C,{data:a,even:c%2===1},a.label))})},U=()=>{const r=s.useContext(u).accelerometer,[,o]=s.useState(0);s.useEffect(()=>{const a=()=>o(c=>c+1);return r.on("change",a),()=>{r.removeListener("change",a)}},[r]);const n=F("accelerometer",r,{x:"Linear acceleration on the X axis (lateral). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",y:"Linear acceleration on the Y axis (vertical). Includes gravity (~0.25 at rest). ~0.25 = 1g, 1.0 = 4g.",z:"Linear acceleration on the Z axis (forward/back). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",force:"Deadzone-applied linear acceleration on the"});return e.jsx(e.Fragment,{children:n.map((a,c)=>e.jsx(C,{data:a,even:c%2===1},a.label))})},R=()=>e.jsxs(k,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(p,{style:{flex:1},children:"property"}),e.jsx(p,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(p,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),X=()=>e.jsxs(j,{children:[e.jsx(R,{}),e.jsx(I,{})]}),B=()=>e.jsxs(j,{children:[e.jsx(R,{}),e.jsx(U,{})]}),V=i.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,W=i.code`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,Z=()=>{const t=s.useContext(u),[,r]=s.useState(0);s.useEffect(()=>{const a=()=>r(c=>c+1);return t.gyroscope.on("change",a),()=>{t.gyroscope.removeListener("change",a)}},[t]);const o=t.sensorTimestamp??0,n=o>0;return e.jsxs(V,{children:[e.jsxs($,{$tip:"Monotonic hardware clock in microseconds. Wraps at 2³² (~71.6 min). Use for precise motion integration.",children:[e.jsx(S,{children:"i"}),e.jsxs(T,{children:[e.jsx(f,{children:"controller."}),"sensorTimestamp"]})]}),e.jsxs(W,{$highlight:n,children:[o.toLocaleString()," ",e.jsx("span",{style:{fontSize:11,color:"rgba(191,204,214,0.3)"},children:"µs"})]})]})},N=()=>e.jsxs(j,{children:[e.jsxs(k,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(p,{style:{flex:1},children:"property"}),e.jsx(p,{style:{flexShrink:0,textAlign:"right"},children:"value"})]}),e.jsx(Z,{})]}),w=i.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`,_=i.div`
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`,q=i.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,b=i.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,J=i.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,O=i.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  width: 9ch;
  flex-shrink: 0;
`,A=i.code`
  font-size: 12px;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
`,K=i(A)`
  flex-shrink: 0;
  width: 7ch;
`,Q=i(A)`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`,ee=i.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`;function te(t){const r=t.toFixed(1);return t>=0?`+${r}`:r}function re(t){return t.toFixed(20).replace(/0+$/,"0")}const D=1/32767,oe=i.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
`,z=({title:t,rows:r})=>e.jsxs(_,{children:[e.jsx(oe,{children:t}),e.jsxs(q,{children:[e.jsx(b,{style:{width:"9ch",flexShrink:0},children:"axis"}),e.jsx(b,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"bias"}),e.jsx(b,{style:{flex:1,textAlign:"right"},children:"scale"})]}),r.map((o,n)=>e.jsxs(J,{$even:n%2===1,children:[e.jsx(O,{children:o.label}),e.jsx(K,{$highlight:o.bias!==0,children:te(o.bias)}),e.jsx(Q,{$highlight:o.scale!==D,children:re(o.scale)})]},o.label))]}),ie=()=>{const t=s.useContext(u),[,r]=s.useState(0);s.useEffect(()=>{const a=()=>r(L=>L+1);t.connection.on("change",a);const c=setTimeout(a,1e3);return()=>{t.connection.removeListener("change",a),clearTimeout(c)}},[t]);const o=t.calibration;return o.gyroPitch.scale===D&&o.gyroPitch.bias===0&&o.accelX.bias===0&&!t.connection.state?e.jsx(w,{children:e.jsx(ee,{children:"Connect a controller to view its factory calibration"})}):e.jsxs(w,{children:[e.jsx(z,{title:"Gyroscope",rows:[{label:"Pitch (X)",bias:o.gyroPitch.bias,scale:o.gyroPitch.scale},{label:"Yaw (Y)",bias:o.gyroYaw.bias,scale:o.gyroYaw.scale},{label:"Roll (Z)",bias:o.gyroRoll.bias,scale:o.gyroRoll.scale}]}),e.jsx(z,{title:"Accelerometer",rows:[{label:"X",bias:o.accelX.bias,scale:o.accelX.scale},{label:"Y",bias:o.accelY.bias,scale:o.accelY.scale},{label:"Z",bias:o.accelZ.bias,scale:o.accelZ.scale}]})]})},de=()=>e.jsxs(M,{title:"Motion Sensors",subtitle:"6-axis IMU: 3-axis gyroscope and 3-axis accelerometer.",children:[e.jsxs(l,{children:[e.jsxs("p",{children:["The DualSense includes a 6-axis inertial measurement unit (IMU) with a"," ",e.jsx(y,{to:"/api/gyroscope",children:e.jsx("code",{children:"Gyroscope"})})," measuring angular velocity and an"," ",e.jsx(y,{to:"/api/accelerometer",children:e.jsx("code",{children:"Accelerometer"})})," ","measuring linear acceleration. Both expose three"," ",e.jsx(y,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})," sub-inputs (",e.jsx("code",{children:".x"}),", ",e.jsx("code",{children:".y"}),", ",e.jsx("code",{children:".z"}),") with the same"," ",e.jsx("code",{children:".state"})," / ",e.jsx("code",{children:".force"})," / ",e.jsx("code",{children:".active"})," ","semantics as analog stick axes."]}),e.jsx("p",{children:"Motion data updates at HID report rate. For game loops and animation frames, read the values synchronously rather than subscribing to events."})]}),e.jsx(d,{children:"Live State"}),e.jsx(v,{children:"Rotate and move your controller"}),e.jsx(g,{children:e.jsx(P,{})}),e.jsx(g,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(X,{})}),e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(B,{})})]})}),e.jsx(g,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(N,{})}),e.jsx(d,{children:"Gyroscope"}),e.jsx(l,{children:e.jsx("p",{children:"The gyroscope measures angular velocity — how fast the controller is rotating around each axis. Values are normalized to -1 to 1. At rest, all axes should read near zero."})}),e.jsx(x,{code:`// Synchronous read in a game loop
const pitch = controller.gyroscope.x.force;
const yaw   = controller.gyroscope.y.force;
const roll  = controller.gyroscope.z.force;

// Use for camera rotation, steering, etc.
camera.rotate(pitch * sensitivity, yaw * sensitivity);`}),e.jsx(d,{children:"Accelerometer"}),e.jsx(l,{children:e.jsx("p",{children:"The accelerometer measures linear acceleration including gravity. The raw scale is not yet normalized to standard units — a value of ~0.25 corresponds to 1g, and the scale maxes out at 4g (1.0)."})}),e.jsx(m,{children:"The accelerometer always includes gravitational acceleration. At rest on a flat surface, you'll see approximately 0.25 on the vertical axis (1g). To isolate motion from gravity, you'll need a complementary or sensor fusion filter."}),e.jsx(x,{code:`// Detect a shake gesture
const threshold = 0.8;
const shaking =
  Math.abs(controller.accelerometer.x.force) > threshold ||
  Math.abs(controller.accelerometer.y.force) > threshold ||
  Math.abs(controller.accelerometer.z.force) > threshold;`}),e.jsx(d,{children:"Sensor Timestamp"}),e.jsx(l,{children:e.jsxs("p",{children:["Each input report includes a monotonic sensor timestamp from the controller's hardware clock, exposed as"," ",e.jsx("code",{children:"controller.sensorTimestamp"}),". The value counts in microseconds and wraps at 2",e.jsx("sup",{children:"32"})," (~71.6 minutes). Use it to compute precise time deltas between motion samples — essential for gyroscope integration and any frame-rate-independent motion processing."]})}),e.jsx(x,{code:`let prevTimestamp = 0;

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
});`}),e.jsx(m,{children:"The sensor timestamp comes from the controller's own clock, not the host. This means it is unaffected by system load, USB polling jitter, or Bluetooth scheduling — it reflects exactly when the IMU sampled."}),e.jsx(d,{children:"Factory Calibration"}),e.jsxs(l,{children:[e.jsxs("p",{children:["Each DualSense controller stores per-unit factory calibration data for the gyroscope and accelerometer in"," ",e.jsx("strong",{children:"Feature Report 0x05"}),". This data is read automatically when the controller connects — no user action is required."]}),e.jsx("p",{children:"The calibration corrects three things:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Gyroscope bias"})," — every gyro has a small non-zero resting value that causes drift in integration-based orientation tracking. The factory calibration records each axis's bias so it can be subtracted from every sample."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Accelerometer zero-point offset"}),` — manufacturing tolerance means the "at rest" reading isn't perfectly centered. The calibration data provides plus/minus reference points for each axis, from which the true center is derived and subtracted.`]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Per-axis sensitivity normalization"})," — the three axes of each sensor may have slightly different sensitivities (typically 1–4%). The calibration data includes reference-rate measurements for each axis, used to scale them so the same physical input produces the same numeric value on all axes."]})]})]}),e.jsx(v,{children:"Your controller's factory calibration"}),e.jsx(g,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(ie,{})}),e.jsx(x,{code:`// Calibration is applied automatically — just read the values
const pitch = controller.gyroscope.x.force; // bias-corrected

// Inspect the resolved calibration factors
const cal = controller.calibration;
console.log(cal.gyroPitch);
// { bias: 2, scale: 0.000030518... }

// Each axis has a precomputed bias and scale:
//   calibrated = clamp((raw - bias) × scale, -1, 1)
// The bias removes the resting-state offset.
// The scale normalises sensitivity across axes.`}),e.jsx(m,{children:"Calibration varies between individual controllers. For example, one unit may have a gyro roll bias of −10 while another reads 0. Without calibration, that −10 bias causes the roll axis to read a small non-zero value at rest, which compounds into visible drift when integrated over time. The per-axis sensitivity correction is subtler (1–4%) but matters for applications that compare rotation rates across axes."}),e.jsx(d,{children:"Combined Motion Tracking"}),e.jsx(l,{children:e.jsx("p",{children:"For full orientation tracking, combine both sensors. The gyroscope gives you rotation rate (integrate for angle) while the accelerometer provides a gravity reference to correct drift."})}),e.jsxs(m,{children:["Raw gyroscope integration drifts over time. For stable orientation, use a complementary filter or a library like"," ",e.jsx("code",{children:"ahrs"})," / ",e.jsx("code",{children:"madgwick"})," that fuses both sensor streams."]}),e.jsx(x,{code:`// Combined motion in a game loop
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
}`})]});export{de as default};
