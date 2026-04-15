import{j as e,g as n,a as c,C as w,R as Te,f as Re,E as Se,L}from"./index-l8CS40p9.js";import{F as Fe,P as f,S as b,D as F,a as v,H as k}from"./FeaturePage-DbpfBqym.js";import{G as Me}from"./PlayerLedControls-D1bktx-y.js";import"./BatteryVisualization-CxudYak9.js";import{a as j}from"./CodeBlock-DSZTVETd.js";const X=n.div`
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
`,Ae=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,pe=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,D=n.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,ue=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,H=n.span`
  color: rgba(191, 204, 214, 0.3);
`,Pe=n.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,Ce=n.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,fe=n.div`
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
`,be=n.span`
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
`;function $(t){const s=t.toFixed(3);return t>=0?` ${s}`:s}const me=({data:t,even:s})=>{const r=t.label.split(".");return e.jsxs(Ae,{$even:s,children:[e.jsxs(fe,{$tip:t.tooltip,children:[e.jsx(be,{children:"i"}),e.jsxs(ue,{children:[e.jsx(H,{children:"controller."}),r.map((a,i)=>e.jsxs(Te.Fragment,{children:[i>0&&e.jsx(H,{children:"."}),i===r.length-1?a:e.jsx(H,{children:a})]},i))]})]}),e.jsx(Pe,{$highlight:t.highlight,children:t.state}),e.jsx(Ce,{$active:t.active,children:t.active?"true":"false"})]})};function ye(t,s,r){return[{label:`${t}.x.state`,tooltip:r.x,state:$(s.x.state),active:s.x.active,highlight:s.x.state!==0},{label:`${t}.x.force`,tooltip:`${r.force} X axis. Returns 0 inside the axis deadzone.`,state:$(s.x.force),active:s.x.active,highlight:s.x.force!==0},{label:`${t}.y.state`,tooltip:r.y,state:$(s.y.state),active:s.y.active,highlight:s.y.state!==0},{label:`${t}.y.force`,tooltip:`${r.force} Y axis. Returns 0 inside the axis deadzone.`,state:$(s.y.force),active:s.y.active,highlight:s.y.force!==0},{label:`${t}.z.state`,tooltip:r.z,state:$(s.z.state),active:s.z.active,highlight:s.z.state!==0},{label:`${t}.z.force`,tooltip:`${r.force} Z axis. Returns 0 inside the axis deadzone.`,state:$(s.z.force),active:s.z.active,highlight:s.z.force!==0}]}const De=()=>{const s=c.useContext(w).gyroscope,[,r]=c.useState(0);c.useEffect(()=>{const i=()=>r(o=>o+1);return s.on("change",i),()=>{s.removeListener("change",i)}},[s]);const a=ye("gyroscope",s,{x:"Raw angular velocity around the X axis (pitch). -1 to 1.",y:"Raw angular velocity around the Y axis (yaw). -1 to 1.",z:"Raw angular velocity around the Z axis (roll). -1 to 1.",force:"Deadzone-applied angular velocity on the"});return e.jsx(e.Fragment,{children:a.map((i,o)=>e.jsx(me,{data:i,even:o%2===1},i.label))})},qe=()=>{const s=c.useContext(w).accelerometer,[,r]=c.useState(0);c.useEffect(()=>{const i=()=>r(o=>o+1);return s.on("change",i),()=>{s.removeListener("change",i)}},[s]);const a=ye("accelerometer",s,{x:"Linear acceleration on the X axis (lateral). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",y:"Linear acceleration on the Y axis (vertical). Includes gravity (~0.25 at rest). ~0.25 = 1g, 1.0 = 4g.",z:"Linear acceleration on the Z axis (forward/back). ~0.25 = 1g, 1.0 = 4g. Not yet normalized to standard units.",force:"Deadzone-applied linear acceleration on the"});return e.jsx(e.Fragment,{children:a.map((i,o)=>e.jsx(me,{data:i,even:o%2===1},i.label))})},je=()=>e.jsxs(pe,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(D,{style:{flex:1},children:"property"}),e.jsx(D,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(D,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),We=()=>e.jsxs(X,{children:[e.jsx(je,{}),e.jsx(De,{})]}),He=()=>e.jsxs(X,{children:[e.jsx(je,{}),e.jsx(qe,{})]}),Le=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,Ie=n.code`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,Be=()=>{const t=c.useContext(w),[,s]=c.useState(0);c.useEffect(()=>{const i=()=>s(o=>o+1);return t.gyroscope.on("change",i),()=>{t.gyroscope.removeListener("change",i)}},[t]);const r=t.sensorTimestamp??0,a=r>0;return e.jsxs(Le,{children:[e.jsxs(fe,{$tip:"Monotonic hardware clock in microseconds. Wraps at 2³² (~71.6 min). Use for precise motion integration.",children:[e.jsx(be,{children:"i"}),e.jsxs(ue,{children:[e.jsx(H,{children:"controller."}),"sensorTimestamp"]})]}),e.jsxs(Ie,{$highlight:a,children:[r.toLocaleString()," ",e.jsx("span",{style:{fontSize:11,color:"rgba(191,204,214,0.3)"},children:"µs"})]})]})},Ee=()=>e.jsxs(X,{children:[e.jsxs(pe,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(D,{style:{flex:1},children:"property"}),e.jsx(D,{style:{flexShrink:0,textAlign:"right"},children:"value"})]}),e.jsx(Be,{})]}),G=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`,Xe=n.div`
  flex: 1 1 320px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`,Ye=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,I=n.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,Ve=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,Ge=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  width: 9ch;
  flex-shrink: 0;
`,ve=n.code`
  font-size: 12px;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
`,Ue=n(ve)`
  flex-shrink: 0;
  width: 7ch;
`,Oe=n(ve)`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`,_e=n.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`;function Ne(t){const s=t.toFixed(1);return t>=0?`+${s}`:s}function Ze(t){return t.toFixed(20).replace(/0+$/,"0")}const we=1/32767,Qe=n.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
`,U=({title:t,rows:s})=>e.jsxs(Xe,{children:[e.jsx(Qe,{children:t}),e.jsxs(Ye,{children:[e.jsx(I,{style:{width:"9ch",flexShrink:0},children:"axis"}),e.jsx(I,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"bias"}),e.jsx(I,{style:{flex:1,textAlign:"right"},children:"scale"})]}),s.map((r,a)=>e.jsxs(Ve,{$even:a%2===1,children:[e.jsx(Ge,{children:r.label}),e.jsx(Ue,{$highlight:r.bias!==0,children:Ne(r.bias)}),e.jsx(Oe,{$highlight:r.scale!==we,children:Ze(r.scale)})]},r.label))]}),Je=()=>{const t=c.useContext(w),[,s]=c.useState(0);c.useEffect(()=>{const i=()=>s(d=>d+1);t.connection.on("change",i);const o=setTimeout(i,1e3);return()=>{t.connection.removeListener("change",i),clearTimeout(o)}},[t]);const r=t.calibration;return r.gyroPitch.scale===we&&r.gyroPitch.bias===0&&r.accelX.bias===0&&!t.connection.state?e.jsx(G,{children:e.jsx(_e,{children:"Connect a controller to view its factory calibration"})}):e.jsxs(G,{children:[e.jsx(U,{title:"Gyroscope",rows:[{label:"Pitch (X)",bias:r.gyroPitch.bias,scale:r.gyroPitch.scale},{label:"Yaw (Y)",bias:r.gyroYaw.bias,scale:r.gyroYaw.scale},{label:"Roll (Z)",bias:r.gyroRoll.bias,scale:r.gyroRoll.scale}]}),e.jsx(U,{title:"Accelerometer",rows:[{label:"X",bias:r.accelX.bias,scale:r.accelX.scale},{label:"Y",bias:r.accelY.bias,scale:r.accelY.scale},{label:"Z",bias:r.accelZ.bias,scale:r.accelZ.scale}]})]})},O=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
`,B=n.div`
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`,E=n.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
`,Ke=n.button`
  background: rgba(72, 175, 240, 0.15);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 4px;
  color: rgba(72, 175, 240, 0.7);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 8px;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: rgba(72, 175, 240, 0.25);
    color: rgba(72, 175, 240, 0.9);
  }
`,_=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,z=n.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,N=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,Z=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  width: 5ch;
  flex-shrink: 0;
`,Q=n.code`
  font-size: 12px;
  text-align: right;
  flex: 1;
  min-width: 0;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,J=n.code`
  font-size: 12px;
  text-align: right;
  flex-shrink: 0;
  width: 7ch;
  color: ${t=>t.$highlight?"rgba(72, 175, 240, 0.7)":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.06s;
`,et=n.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`;n.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;const tt=n.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.4);
  flex-shrink: 0;
  width: 2ch;
`,rt=n.code`
  font-size: 12px;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,it=n.svg`
  display: block;
`,nt=({pitch:t,roll:s,size:r=120})=>{const a=r/2,i=r/2,o=r/2-4,d=Math.max(-o,Math.min(o,t/(Math.PI/2)*o)),u=s*180/Math.PI;return e.jsxs(it,{width:r,height:r,viewBox:`0 0 ${r} ${r}`,children:[e.jsx("defs",{children:e.jsx("clipPath",{id:"horizon-clip",children:e.jsx("circle",{cx:a,cy:i,r:o})})}),e.jsx("circle",{cx:a,cy:i,r:o,fill:"rgba(0, 0, 0, 0.3)",stroke:"rgba(255,255,255,0.08)",strokeWidth:1}),e.jsxs("g",{clipPath:"url(#horizon-clip)",transform:`rotate(${u}, ${a}, ${i})`,children:[e.jsx("rect",{x:0,y:0,width:r,height:i+d,fill:"rgba(72, 175, 240, 0.12)"}),e.jsx("rect",{x:0,y:i+d,width:r,height:r,fill:"rgba(139, 90, 43, 0.15)"}),e.jsx("line",{x1:0,y1:i+d,x2:r,y2:i+d,stroke:"rgba(255, 255, 255, 0.3)",strokeWidth:1.5}),[-30,-15,15,30].map(g=>{const p=g/90*o;return e.jsx("line",{x1:a-o*.3,y1:i+d+p,x2:a+o*.3,y2:i+d+p,stroke:"rgba(255, 255, 255, 0.1)",strokeWidth:.5},g)})]}),e.jsx("line",{x1:a-20,y1:i,x2:a-6,y2:i,stroke:"#f29e02",strokeWidth:2,strokeLinecap:"round"}),e.jsx("line",{x1:a+6,y1:i,x2:a+20,y2:i,stroke:"#f29e02",strokeWidth:2,strokeLinecap:"round"}),e.jsx("circle",{cx:a,cy:i,r:2,fill:"#f29e02"}),e.jsx("circle",{cx:a,cy:i,r:o,fill:"none",stroke:"rgba(255,255,255,0.12)",strokeWidth:1.5})]})};function K(t){const s=t.toFixed(3);return t>=0?`+${s}`:s}function ee(t){const s=t*180/Math.PI,r=Math.abs(s).toFixed(1);return s>=0?`+${r}°`:`-${r}°`}function ot(t){return t.toFixed(4)}const st=()=>{const t=c.useContext(w),[,s]=c.useState(0),r=c.useRef(0);c.useEffect(()=>{const x=()=>{s(h=>h+1),r.current=requestAnimationFrame(x)};return r.current=requestAnimationFrame(x),()=>cancelAnimationFrame(r.current)},[t]);const a=c.useCallback(()=>{t.orientation.reset()},[t]),i=t.orientation;if(!t.connection.state)return e.jsx(O,{children:e.jsx(et,{children:"Connect a controller to view live orientation"})});const[d,u,g,p]=i.quaternion,R=Math.abs(i.pitch)>.01||Math.abs(i.yaw)>.01||Math.abs(i.roll)>.01;return e.jsxs(O,{children:[e.jsxs(B,{children:[e.jsxs(E,{children:[e.jsx("span",{children:"Euler Angles"}),e.jsx(Ke,{onClick:a,children:"Reset"})]}),e.jsxs(_,{children:[e.jsx(z,{style:{width:"5ch",flexShrink:0},children:"axis"}),e.jsx(z,{style:{flex:1,textAlign:"right"},children:"radians"}),e.jsx(z,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"degrees"})]}),[["Pitch",i.pitch],["Yaw",i.yaw],["Roll",i.roll]].map(([x,h],m)=>e.jsxs(N,{$even:m%2===1,children:[e.jsx(Z,{children:x}),e.jsx(Q,{$highlight:Math.abs(h)>.01,children:K(h)}),e.jsx(J,{$highlight:Math.abs(h)>.01,children:ee(h)})]},x))]}),e.jsxs(B,{children:[e.jsx(E,{children:e.jsx("span",{children:"Accelerometer Tilt"})}),e.jsxs(_,{children:[e.jsx(z,{style:{width:"5ch",flexShrink:0},children:"axis"}),e.jsx(z,{style:{flex:1,textAlign:"right"},children:"radians"}),e.jsx(z,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"degrees"})]}),[["Pitch",i.tiltPitch],["Roll",i.tiltRoll]].map(([x,h],m)=>e.jsxs(N,{$even:m%2===1,children:[e.jsx(Z,{children:x}),e.jsx(Q,{$highlight:Math.abs(h)>.05,children:K(h)}),e.jsx(J,{$highlight:Math.abs(h)>.05,children:ee(h)})]},x))]}),e.jsxs(B,{style:{flex:"1 1 200px"},children:[e.jsx(E,{children:e.jsx("span",{children:"Quaternion"})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"rgba(0, 0, 0, 0.06)"},children:[e.jsx(nt,{pitch:i.pitch,roll:i.roll,size:100}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:[["w",d],["x",u],["y",g],["z",p]].map(([x,h])=>e.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[e.jsx(tt,{children:x}),e.jsx(rt,{$highlight:R&&x!=="w",children:ot(h)})]},x))})]})]})]})},te=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  align-items: stretch;
`,at=n.div`
  flex: 1 1 240px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`,ct=n.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
`,re=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,ie=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex-shrink: 0;
`,ne=n.span`
  color: rgba(191, 204, 214, 0.3);
`,oe=n.code`
  font-size: 12px;
  text-align: right;
  flex: 1;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,se=n.code`
  font-size: 12px;
  text-align: right;
  flex-shrink: 0;
  width: 7ch;
  color: ${t=>t.$highlight?"rgba(72, 175, 240, 0.7)":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.06s;
`,lt=n.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`,dt=n.svg`
  display: block;
`,ht=({pitch:t,roll:s,size:r=120})=>{const a=r/2,i=r/2,o=r/2-4,d=o*.7,u=a+Math.max(-d,Math.min(d,-(s/(Math.PI/4))*d)),g=i+Math.max(-d,Math.min(d,t/(Math.PI/4)*d)),p=Math.sqrt((u-a)**2+(g-i)**2)/d,R=p<.15?"rgba(72, 175, 240, 0.8)":`rgba(242, 158, 2, ${.4+p*.5})`;return e.jsxs(dt,{width:r,height:r,viewBox:`0 0 ${r} ${r}`,children:[e.jsx("circle",{cx:a,cy:i,r:o,fill:"rgba(0, 0, 0, 0.3)",stroke:"rgba(255,255,255,0.08)",strokeWidth:1}),e.jsx("line",{x1:a,y1:i-o*.5,x2:a,y2:i+o*.5,stroke:"rgba(255,255,255,0.06)",strokeWidth:.5}),e.jsx("line",{x1:a-o*.5,y1:i,x2:a+o*.5,y2:i,stroke:"rgba(255,255,255,0.06)",strokeWidth:.5}),e.jsx("circle",{cx:a,cy:i,r:o*.15,fill:"none",stroke:"rgba(255,255,255,0.08)",strokeWidth:.5}),e.jsx("circle",{cx:a,cy:i,r:o*.4,fill:"none",stroke:"rgba(255,255,255,0.05)",strokeWidth:.5}),e.jsx("circle",{cx:u,cy:g,r:8,fill:R}),e.jsx("circle",{cx:u,cy:g,r:8,fill:"none",stroke:"rgba(255,255,255,0.2)",strokeWidth:.5}),e.jsx("circle",{cx:a,cy:i,r:o,fill:"none",stroke:"rgba(255,255,255,0.12)",strokeWidth:1.5})]})};function ae(t){const s=t.toFixed(3);return t>=0?`+${s}`:s}function ce(t){const s=t*180/Math.PI,r=Math.abs(s).toFixed(1);return s>=0?`+${r}°`:`-${r}°`}const xt=()=>{const t=c.useContext(w),[,s]=c.useState(0),r=c.useRef(0);if(c.useEffect(()=>{const u=()=>{s(g=>g+1),r.current=requestAnimationFrame(u)};return r.current=requestAnimationFrame(u),()=>cancelAnimationFrame(r.current)},[t]),!t.connection.state)return e.jsx(te,{children:e.jsx(lt,{children:"Connect a controller to view live tilt"})});const i=t.orientation,o=Math.abs(i.tiltPitch)>.05,d=Math.abs(i.tiltRoll)>.05;return e.jsxs(te,{children:[e.jsxs(at,{children:[e.jsx(ct,{children:"Tilt Angles"}),e.jsxs(re,{children:[e.jsxs(ie,{children:[e.jsx(ne,{children:"orientation."}),"tiltPitch"]}),e.jsx(oe,{$highlight:o,children:ae(i.tiltPitch)}),e.jsx(se,{$highlight:o,children:ce(i.tiltPitch)})]}),e.jsxs(re,{$even:!0,children:[e.jsxs(ie,{children:[e.jsx(ne,{children:"orientation."}),"tiltRoll"]}),e.jsx(oe,{$highlight:d,children:ae(i.tiltRoll)}),e.jsx(se,{$highlight:d,children:ce(i.tiltRoll)})]})]}),e.jsxs("div",{style:{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",gap:8},children:[e.jsx(ht,{pitch:i.tiltPitch,roll:i.tiltRoll,size:120}),e.jsx("div",{style:{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(191, 204, 214, 0.3)"},children:"Bubble level"})]})]})},le=n.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  align-items: stretch;
`,gt=n.div`
  flex: 1 1 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child { border-radius: 8px 8px 0 0; }
  & > :last-child  { border-radius: 0 0 8px 8px; }
`,de=n.div`
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.22);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(72, 175, 240, 0.6);
`,M=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,A=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex-shrink: 0;
`,T=n.span`
  color: rgba(191, 204, 214, 0.3);
`,P=n.code`
  font-size: 12px;
  text-align: right;
  flex: 1;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,pt=n.div`
  padding: 20px 16px;
  text-align: center;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.3);
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  width: 100%;
`,ut=n.div`
  flex: 1 1 200px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
`,ft=n.div`
  width: 100%;
  max-width: 200px;
  height: 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
`,bt=n.div`
  height: 100%;
  width: ${t=>t.$pct}%;
  background: ${t=>t.$active?"linear-gradient(90deg, #f29e02, #f25c02)":"rgba(191, 204, 214, 0.15)"};
  border-radius: 6px;
  transition: width 0.05s, background 0.15s;
`,mt=n.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.15s;
`,yt=Se`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px) rotate(-1deg); }
  40% { transform: translateX(2px) rotate(1deg); }
  60% { transform: translateX(-1px) rotate(-0.5deg); }
  80% { transform: translateX(1px) rotate(0.5deg); }
`,jt=n.div`
  font-size: 24px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.15)"};
  transition: color 0.15s;
  ${t=>t.$active&&Re`animation: ${yt} ${1/Math.max(1,t.$freq)}s ease-in-out infinite;`}
`,vt=n.span`
  font-size: 13px;
  font-weight: 400;
  margin-left: 4px;
  color: rgba(191, 204, 214, 0.35);
`,wt=[{label:"Fast (64)",value:64},{label:"Balanced (128)",value:128},{label:"Balanced+ (256)",value:256},{label:"Precise (512)",value:512},{label:"Very precise (1024)",value:1024}],he=n.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,xe=n.label`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex-shrink: 0;
`,kt=n.select`
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(191, 204, 214, 0.85);
  font-size: 12px;
  font-family: inherit;
  padding: 4px 8px;
  cursor: pointer;

  option {
    background: #1a1a2e;
    color: rgba(191, 204, 214, 0.85);
  }

  &:focus {
    outline: none;
    border-color: rgba(72, 175, 240, 0.4);
  }
`,ge=n.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.3);
  white-space: nowrap;
`,$t=n.input`
  flex: 1;
  height: 4px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(72, 175, 240, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(72, 175, 240, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
  }
`,zt=n.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
`,Tt=n.svg`
  display: block;
  width: 100%;
  height: 120px;
`,C=8,Rt=10,St=()=>{const t=c.useContext(w),[,s]=c.useState(0),r=c.useRef(0),a=c.useRef(1);if(c.useEffect(()=>{const l=()=>{s(y=>y+1),r.current=requestAnimationFrame(l)};return r.current=requestAnimationFrame(l),()=>cancelAnimationFrame(r.current)},[t]),!t.connection.state)return e.jsx(le,{children:e.jsx(pt,{children:"Connect a controller to try shake detection"})});const o=t.shake,d=o.windowSize/Math.max(1,o.inputRate),g=o.spectrum.filter(l=>l.freq<=C);let p=0;for(const l of g)l.power>p&&(p=l.power);p>a.current?a.current=p:a.current*=.995,a.current<1&&(a.current=1);const R=a.current,x=600,h=120,m=30,Y=8,S=8,ke=20,q=x-m-Y,W=h-S-ke;return e.jsxs(le,{children:[e.jsxs(gt,{children:[e.jsx(de,{children:"State"}),e.jsxs(M,{children:[e.jsxs(A,{children:[e.jsx(T,{children:"shake."}),"active"]}),e.jsx(P,{$highlight:o.active,children:o.active?"true":"false"})]}),e.jsxs(M,{$even:!0,children:[e.jsxs(A,{children:[e.jsx(T,{children:"shake."}),"intensity"]}),e.jsx(P,{$highlight:o.intensity>.05,children:o.intensity.toFixed(3)})]}),e.jsxs(M,{children:[e.jsxs(A,{children:[e.jsx(T,{children:"shake."}),"frequency"]}),e.jsx(P,{$highlight:o.frequency>0,children:o.frequency>0?`${o.frequency.toFixed(2)} Hz`:"—"})]}),e.jsxs(M,{$even:!0,children:[e.jsxs(A,{children:[e.jsx(T,{children:"shake."}),"fundamental"]}),e.jsx(P,{$highlight:o.fundamental>0,children:o.fundamental>0?`${o.fundamental.toFixed(2)} Hz`:"—"})]}),e.jsxs(M,{children:[e.jsxs(A,{children:[e.jsx(T,{children:"shake."}),"inputRate"]}),e.jsxs(P,{children:[o.inputRate.toFixed(0)," ",e.jsx(T,{children:"Hz"})]})]}),e.jsxs(he,{children:[e.jsx(xe,{children:"Window"}),e.jsx(kt,{value:o.windowSize,onChange:l=>{o.windowSize=Number(l.target.value)},children:wt.map(l=>e.jsx("option",{value:l.value,children:l.label},l.value))}),e.jsxs(ge,{children:[d.toFixed(1),"s"]})]}),e.jsxs(he,{children:[e.jsx(xe,{children:"Threshold"}),e.jsx($t,{type:"range",min:0,max:.5,step:.01,value:o.threshold,onChange:l=>{o.threshold=Number(l.target.value)}}),e.jsx(ge,{children:o.threshold.toFixed(2)})]})]}),e.jsxs(ut,{children:[e.jsxs(jt,{$active:o.active,$freq:o.frequency,children:[o.active?o.frequency.toFixed(1):"0.0",e.jsx(vt,{children:"Hz"})]}),e.jsx(ft,{children:e.jsx(bt,{$pct:Math.min(100,o.frequency/Rt*100),$active:o.active})}),e.jsx(mt,{$active:o.active,children:o.active?"Shaking":"Still"})]}),e.jsxs(zt,{children:[e.jsx(de,{children:"Spectrum (fundamental bins)"}),e.jsxs(Tt,{viewBox:`0 0 ${x} ${h}`,preserveAspectRatio:"none",children:[[0,2,4,6,8].map(l=>{const y=m+l/C*q;return e.jsxs("g",{children:[e.jsx("line",{x1:y,y1:S,x2:y,y2:S+W,stroke:"rgba(255,255,255,0.06)",strokeWidth:1}),e.jsx("text",{x:y,y:h-4,fill:"rgba(191,204,214,0.3)",fontSize:9,textAnchor:"middle",fontFamily:"monospace",children:l})]},l)}),e.jsx("text",{x:x-Y,y:h-4,fill:"rgba(191,204,214,0.2)",fontSize:8,textAnchor:"end",fontFamily:"monospace",children:"Hz"}),g.map(l=>{const y=Math.max(1,q/(C/.25)-.5),$e=m+l.freq/C*q-y/2,V=Math.min(W,l.power/R*W),ze=o.fundamental>0&&Math.abs(l.freq-o.fundamental)<.13;return e.jsx("rect",{x:$e,y:S+W-V,width:y,height:V,fill:ze?"#f29e02":"rgba(72, 175, 240, 0.4)",rx:.5},l.freq)}),o.fundamental>0&&e.jsx("text",{x:m+o.fundamental/C*q,y:S-1,fill:"#f29e02",fontSize:8,textAnchor:"middle",fontFamily:"monospace",children:o.fundamental.toFixed(2)})]})]})]})},Dt=()=>e.jsxs(Fe,{title:"Motion Sensors",subtitle:"6-axis IMU: 3-axis gyroscope and 3-axis accelerometer.",children:[e.jsxs(f,{children:[e.jsxs("p",{children:["The DualSense includes a 6-axis inertial measurement unit (IMU) with a"," ",e.jsx(L,{to:"/api/gyroscope",children:e.jsx("code",{children:"Gyroscope"})})," ","measuring angular velocity and an"," ",e.jsx(L,{to:"/api/accelerometer",children:e.jsx("code",{children:"Accelerometer"})})," ","measuring linear acceleration. Both expose three"," ",e.jsx(L,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})," ","sub-inputs (",e.jsx("code",{children:".x"}),", ",e.jsx("code",{children:".y"}),", ",e.jsx("code",{children:".z"}),") with the same ",e.jsx("code",{children:".state"})," / ",e.jsx("code",{children:".force"})," / ",e.jsx("code",{children:".active"})," ","semantics as analog stick axes."]}),e.jsx("p",{children:"Motion data updates at HID report rate. For game loops and animation frames, read the values synchronously rather than subscribing to events."})]}),e.jsx(b,{children:"Live State"}),e.jsx(F,{children:"Rotate and move your controller"}),e.jsx(v,{children:e.jsx(Me,{})}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(We,{})}),e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(He,{})})]})}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(Ee,{})}),e.jsx(b,{children:"Gyroscope"}),e.jsx(f,{children:e.jsx("p",{children:"The gyroscope measures angular velocity — how fast the controller is rotating around each axis. Values are normalized to -1 to 1. At rest, all axes should read near zero."})}),e.jsx(j,{code:`// Synchronous read in a game loop
const pitch = controller.gyroscope.x.force;
const yaw   = controller.gyroscope.y.force;
const roll  = controller.gyroscope.z.force;

// Use for camera rotation, steering, etc.
camera.rotate(pitch * sensitivity, yaw * sensitivity);`}),e.jsx(b,{children:"Accelerometer"}),e.jsx(f,{children:e.jsx("p",{children:"The accelerometer measures linear acceleration including gravity. The raw scale is not yet normalized to standard units — a value of ~0.25 corresponds to 1g, and the scale maxes out at 4g (1.0)."})}),e.jsx(k,{children:"The accelerometer always includes gravitational acceleration. At rest on a flat surface, you'll see approximately 0.25 on the vertical axis (1g). To isolate motion from gravity, you'll need a complementary or sensor fusion filter."}),e.jsx(j,{code:`// Detect a shake gesture
const threshold = 0.8;
const shaking =
  Math.abs(controller.accelerometer.x.force) > threshold ||
  Math.abs(controller.accelerometer.y.force) > threshold ||
  Math.abs(controller.accelerometer.z.force) > threshold;`}),e.jsx(b,{children:"Sensor Timestamp"}),e.jsx(f,{children:e.jsxs("p",{children:["Each input report includes a monotonic sensor timestamp from the controller's hardware clock, exposed as"," ",e.jsx("code",{children:"controller.sensorTimestamp"}),". The value counts in microseconds and wraps at 2",e.jsx("sup",{children:"32"})," (~71.6 minutes). Use it to compute precise time deltas between motion samples — essential for gyroscope integration and any frame-rate-independent motion processing."]})}),e.jsx(j,{code:`let prevTimestamp = 0;

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
});`}),e.jsx(k,{children:"The sensor timestamp comes from the controller's own clock, not the host. This means it is unaffected by system load, USB polling jitter, or Bluetooth scheduling — it reflects exactly when the IMU sampled."}),e.jsx(b,{children:"Orientation Tracking"}),e.jsxs(f,{children:[e.jsxs("p",{children:["The library includes a built-in ",e.jsx("strong",{children:"Madgwick AHRS"})," (Attitude and Heading Reference System) filter that fuses gyroscope and accelerometer data into a stable orientation estimate. This runs automatically on every HID report using the controller's hardware timestamp for precise integration — no setup required."]}),e.jsxs("p",{children:["The filter outputs Euler angles (pitch, yaw, roll in radians) and the underlying unit quaternion. It uses gradient descent to correct gyroscope drift against the accelerometer's gravity reference, controlled by a configurable ",e.jsx("code",{children:"beta"})," gain parameter."]})]}),e.jsx(F,{children:"Rotate your controller to see orientation change"}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(st,{})}),e.jsx(j,{code:`// Read fused orientation in a game loop
const { pitch, yaw, roll } = controller.orientation;
camera.setRotation(pitch, yaw, roll);

// Or use the quaternion directly
const [w, x, y, z] = controller.orientation.quaternion;
mesh.quaternion.set(x, y, z, w);

// Reset orientation (zero the view)
controller.orientation.reset();

// Tune the filter gain at runtime
controller.orientation.beta = 0.05; // smoother, more drift
controller.orientation.beta = 0.3;  // snappier, more noise`}),e.jsxs(k,{children:["The Madgwick filter cannot determine absolute yaw (compass heading) from accelerometer data alone — the accelerometer only provides a gravity reference for pitch and roll correction. Yaw is integrated from the gyroscope and will drift slowly over time. Call"," ",e.jsx("code",{children:"controller.orientation.reset()"})," to re-zero when needed."]}),e.jsx(b,{children:"Accelerometer Tilt"}),e.jsx(f,{children:e.jsxs("p",{children:["For applications that only need pitch and roll relative to gravity — steering wheels, balance games, level tools — the orientation tracker also exposes ",e.jsx("strong",{children:"accelerometer-only tilt"})," angles. These derive directly from the gravity vector without gyroscope integration, so they never drift. The tradeoff is they're noisy during fast motion and cannot measure yaw."]})}),e.jsx(F,{children:"Tilt your controller to see the bubble move"}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(xt,{})}),e.jsx(j,{code:`// Tilt-based steering (no drift, no yaw)
const steerAngle = controller.orientation.tiltRoll;
car.setSteeringAngle(steerAngle);

// Balance game: how far from level?
const tiltMag = Math.sqrt(
  controller.orientation.tiltPitch ** 2 +
  controller.orientation.tiltRoll ** 2,
);
if (tiltMag > MAX_TILT) gameOver();`}),e.jsx(k,{children:"Tilt angles are instantaneous — they reflect the current gravity vector with no filtering or history. During rapid acceleration (shaking, throwing), the tilt readings will be unreliable because the accelerometer can't distinguish linear acceleration from gravity. For those scenarios, use the fused orientation instead."}),e.jsx(b,{children:"Shake Detection"}),e.jsxs(f,{children:[e.jsxs("p",{children:["The shake detector analyzes accelerometer data in a sliding window to determine whether the controller is being shaken, how hard, and at what frequency. It uses the ",e.jsx("strong",{children:"Goertzel algorithm"})," — a single-bin DFT — to efficiently probe 15 frequency bands (1–15 Hz) and identify the dominant shake frequency."]}),e.jsxs("p",{children:["This enables mechanics like Death Stranding's BB soothing: gentle rocking (1–3 Hz, low intensity) can be distinguished from aggressive shaking (5–8 Hz, high intensity) using the combination of"," ",e.jsx("code",{children:"frequency"})," and ",e.jsx("code",{children:"intensity"}),"."]})]}),e.jsx(F,{children:"Shake your controller"}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(St,{})}),e.jsx(j,{code:`// Simple shake detection
if (controller.shake.active) {
  console.log("Shaking!", controller.shake.intensity);
}

// Distinguish gentle rocking from aggressive shaking
const { intensity, frequency } = controller.shake;

if (intensity > 0.6 && frequency >= 2) {
  // Aggressive shake — BB is crying!
  distressBaby();
} else if (intensity > 0.08 && frequency < 2) {
  // Gentle rocking — soothe the baby
  calmBaby(intensity);
}

// Adjust the activation threshold
controller.shake.threshold = 0.2; // less sensitive`}),e.jsx(b,{children:"Factory Calibration"}),e.jsxs(f,{children:[e.jsxs("p",{children:["Each DualSense controller stores per-unit factory calibration data for the gyroscope and accelerometer in ",e.jsx("strong",{children:"Feature Report 0x05"}),". This data is read automatically when the controller connects — no user action is required."]}),e.jsx("p",{children:"The calibration corrects three things:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Gyroscope bias"})," — every gyro has a small non-zero resting value that causes drift in integration-based orientation tracking. The factory calibration records each axis's bias so it can be subtracted from every sample."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Accelerometer zero-point offset"}),` — manufacturing tolerance means the "at rest" reading isn't perfectly centered. The calibration data provides plus/minus reference points for each axis, from which the true center is derived and subtracted.`]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Per-axis sensitivity normalization"})," — the three axes of each sensor may have slightly different sensitivities (typically 1–4%). The calibration data includes reference-rate measurements for each axis, used to scale them so the same physical input produces the same numeric value on all axes."]})]})]}),e.jsx(F,{children:"Your controller's factory calibration"}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(Je,{})}),e.jsx(j,{code:`// Calibration is applied automatically — just read the values
const pitch = controller.gyroscope.x.force; // bias-corrected

// Inspect the resolved calibration factors
const cal = controller.calibration;
console.log(cal.gyroPitch);
// { bias: 2, scale: 0.000030518... }

// Each axis has a precomputed bias and scale:
//   calibrated = clamp((raw - bias) × scale, -1, 1)
// The bias removes the resting-state offset.
// The scale normalises sensitivity across axes.`}),e.jsx(k,{children:"Calibration varies between individual controllers. For example, one unit may have a gyro roll bias of −10 while another reads 0. Without calibration, that −10 bias causes the roll axis to read a small non-zero value at rest, which compounds into visible drift when integrated over time. The per-axis sensitivity correction is subtler (1–4%) but matters for applications that compare rotation rates across axes."}),e.jsx(b,{children:"Combined Motion Tracking"}),e.jsx(f,{children:e.jsx("p",{children:"For full orientation tracking, the library's built-in Madgwick filter handles everything automatically. The gyroscope provides rotation rate while the accelerometer provides a gravity reference to correct drift. You can also access the raw values for custom processing."})}),e.jsxs(k,{children:["Raw gyroscope integration drifts over time. The built-in"," ",e.jsx("code",{children:"controller.orientation"})," handles this with Madgwick sensor fusion. For custom pipelines, use a complementary filter or a library like"," ",e.jsx("code",{children:"ahrs"})," / ",e.jsx("code",{children:"madgwick"})," that fuses both sensor streams."]}),e.jsx(j,{code:`// Using the built-in orientation tracker
function onFrame() {
  const { pitch, yaw, roll } = controller.orientation;
  camera.setRotation(pitch, yaw, roll);
}

// Or manual integration with raw values
function onFrameManual() {
  const gyro = controller.gyroscope;
  const accel = controller.accelerometer;

  // Gyro: integrate angular velocity for rotation
  orientation.x += gyro.x.state * dt;
  orientation.y += gyro.y.state * dt;
  orientation.z += gyro.z.state * dt;

  // Accel: use gravity vector to correct drift
  const gravityAngle = Math.atan2(accel.x.state, accel.z.state);
  orientation.x = lerp(orientation.x, gravityAngle, 0.02);
}`})]});export{Dt as default};
