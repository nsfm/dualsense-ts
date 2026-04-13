import{j as e,g as s,a as t,C as re,L as I}from"./index-GGWi0Ont.js";import{F as ae,P as n,H as X,S as i,D as ne,a as ie}from"./FeaturePage-DywfdRev.js";import{a as l}from"./CodeBlock-Dvv7tnEL.js";const ce=s.div`
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
`,le=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,O=s.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,d=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${o=>o.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,u=s.div`
  flex: 1;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
`,h=s.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.35);
  margin-left: 8px;
`,p=s.code`
  font-size: 11px;
  flex-shrink: 0;
  width: 7ch;
  text-align: center;
  padding: 2px 6px;
  border-radius: 3px;
  background: ${o=>o.$enabled?"rgba(72, 175, 240, 0.12)":"rgba(255, 107, 107, 0.12)"};
  color: ${o=>o.$enabled?"#48aff0":"#ff6b6b"};
  transition: all 0.15s;
`,de=s.button`
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid
    ${o=>o.$on?"rgba(72, 175, 240, 0.5)":"rgba(255, 255, 255, 0.15)"};
  background: ${o=>o.$on?"rgba(72, 175, 240, 0.25)":"rgba(0, 0, 0, 0.2)"};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
  padding: 0;

  &:hover {
    border-color: ${o=>o.$on?"rgba(72, 175, 240, 0.7)":"rgba(255, 255, 255, 0.3)"};
  }
`,ue=s.div`
  position: absolute;
  top: 2px;
  left: ${o=>o.$on?"17px":"2px"};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${o=>o.$on?"#48aff0":"rgba(191, 204, 214, 0.4)"};
  transition: left 0.15s, background 0.15s;
`,x=({on:o,onChange:r})=>e.jsx(de,{$on:o,onClick:r,type:"button",children:e.jsx(ue,{$on:o})}),A=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.04);
  opacity: ${o=>o.$disabled?.35:1};
  transition: opacity 0.2s;
`,z=s.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.4);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,H=s.code`
  font-size: 11px;
  flex-shrink: 0;
  width: 9ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: ${o=>o.$active?"#f29e02":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.06s;
`,D=s.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 107, 107, 0.6);
  flex-shrink: 0;
`,P=s.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,U=s.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${o=>o.$variant==="reset"?"rgba(72, 175, 240, 0.4)":"rgba(255, 107, 107, 0.4)"};
  background: ${o=>o.$variant==="reset"?"rgba(72, 175, 240, 0.1)":"rgba(255, 107, 107, 0.1)"};
  color: ${o=>o.$variant==="reset"?"#48aff0":"#ff6b6b"};

  &:hover {
    background: ${o=>o.$variant==="reset"?"rgba(72, 175, 240, 0.2)":"rgba(255, 107, 107, 0.2)"};
  }
`,G=s.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${o=>o.$active?"rgba(242, 158, 2, 0.6)":"rgba(242, 158, 2, 0.3)"};
  background: ${o=>o.$active?"rgba(242, 158, 2, 0.2)":"rgba(242, 158, 2, 0.08)"};
  color: ${o=>o.$active?"#f29e02":"rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    color: #f29e02;
  }
`,he=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.12);
`,V=s.span`
  color: rgba(191, 204, 214, 0.3);
`,pe=s.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
`,xe=s.code`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${o=>o.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
`;function R(o){const r=o.toFixed(3);return o>=0?` ${r}`:r}const be=()=>{const o=t.useContext(re),[r,j]=t.useState(o.powerSave.touch),[a,w]=t.useState(o.powerSave.motion),[S,y]=t.useState(o.powerSave.haptics),[$,k]=t.useState(o.powerSave.audio),[T,C]=t.useState(o.powerSave.hapticsMuted),[b,M]=t.useState(!1),[g,L]=t.useState(!1),f=t.useRef(null),[B,Y]=t.useState(0),[E,N]=t.useState(0),[q,J]=t.useState(0),[K,Q]=t.useState(!1),[,W]=t.useState(0);t.useEffect(()=>{const v=()=>{Y(o.gyroscope.x.state),N(o.accelerometer.y.state)},F=()=>{J(o.touchpad.left.x.state),Q(o.touchpad.left.contact.state)};o.gyroscope.on("change",v),o.touchpad.on("change",F);const te=setInterval(()=>W(se=>se+1),500);return()=>{o.gyroscope.removeListener("change",v),o.touchpad.removeListener("change",F),clearInterval(te)}},[o]),t.useEffect(()=>()=>{o.powerSave.reset(),o.rumble(0),o.stopTestTone(),f.current&&clearTimeout(f.current)},[o]);const c=t.useCallback(v=>{switch(v){case"touch":o.powerSave.touch=!o.powerSave.touch,j(o.powerSave.touch);break;case"motion":o.powerSave.motion=!o.powerSave.motion,w(o.powerSave.motion);break;case"haptics":o.powerSave.haptics=!o.powerSave.haptics,y(o.powerSave.haptics);break;case"audio":o.powerSave.audio=!o.powerSave.audio,k(o.powerSave.audio);break;case"muteHaptics":o.powerSave.hapticsMuted=!o.powerSave.hapticsMuted,C(o.powerSave.hapticsMuted);break}},[o]),Z=t.useCallback(()=>{o.powerSave.reset(),j(!0),w(!0),y(!0),k(!0),C(!1)},[o]),_=t.useCallback(()=>{o.powerSave.set({touch:!1,motion:!1,haptics:!1,audio:!1,muteHaptics:!0}),j(!1),w(!1),y(!1),k(!1),C(!0)},[o]),ee=t.useCallback(async()=>{b?(await o.stopTestTone(),M(!1)):(await o.startTestTone("speaker"),M(!0))},[o,b]),oe=t.useCallback(()=>{g||(L(!0),o.rumble(.7),f.current=setTimeout(()=>{o.rumble(0),L(!1),f.current=null},500))},[o,g]),m=o.powerSave.flags;return e.jsxs(e.Fragment,{children:[e.jsxs(d,{children:[e.jsx(x,{on:a,onChange:()=>c("motion")}),e.jsxs(u,{children:["Motion",e.jsx(h,{children:"gyroscope + accelerometer"})]}),e.jsx(p,{$enabled:a,children:a?"on":"off"})]}),e.jsxs(A,{$disabled:!a,children:[e.jsx(z,{children:"gyroscope.x.state"}),e.jsx(H,{$active:a&&B!==0,children:R(B)}),!a&&e.jsx(D,{children:"frozen"})]}),e.jsxs(A,{$disabled:!a,children:[e.jsx(z,{children:"accelerometer.y.state"}),e.jsx(H,{$active:a&&E!==0,children:R(E)}),!a&&e.jsx(D,{children:"frozen"})]}),e.jsxs(d,{$even:!0,children:[e.jsx(x,{on:r,onChange:()=>c("touch")}),e.jsxs(u,{children:["Touch",e.jsx(h,{children:"touchpad processing"})]}),e.jsx(p,{$enabled:r,children:r?"on":"off"})]}),e.jsxs(A,{$disabled:!r,children:[e.jsx(z,{children:"touchpad.left.x.state"}),e.jsx(H,{$active:r&&K,children:R(q)}),!r&&e.jsx(D,{children:"frozen"})]}),e.jsxs(d,{children:[e.jsx(x,{on:S,onChange:()=>c("haptics")}),e.jsxs(u,{children:["Haptics",e.jsx(h,{children:"rumble + adaptive triggers"})]}),e.jsx(p,{$enabled:S,children:S?"on":"off"})]}),e.jsxs(d,{$even:!0,children:[e.jsx(x,{on:!T,onChange:()=>c("muteHaptics")}),e.jsxs(u,{children:["Haptic Output",e.jsx(h,{children:"soft mute (processor stays on)"})]}),e.jsx(p,{$enabled:!T,children:T?"muted":"on"})]}),e.jsx(P,{children:e.jsx(G,{$active:g,onClick:oe,children:g?"Rumbling...":"Test Rumble"})}),e.jsxs(d,{children:[e.jsx(x,{on:$,onChange:()=>c("audio")}),e.jsxs(u,{children:["Audio",e.jsx(h,{children:"speaker, headphone, mic DSP"})]}),e.jsx(p,{$enabled:$,children:$?"on":"off"})]}),e.jsx(P,{children:e.jsx(G,{$active:b,onClick:ee,children:b?"Stop Test Tone":"Play Test Tone"})}),e.jsxs(P,{children:[e.jsx(U,{$variant:"reset",onClick:Z,children:"Enable All"}),e.jsx(U,{$variant:"warn",onClick:_,children:"Disable All"})]}),e.jsxs(he,{children:[e.jsxs(pe,{children:[e.jsx(V,{children:"controller."}),"powerSave",e.jsx(V,{children:"."}),"flags"]}),e.jsxs(xe,{$highlight:m!==0,children:["0x",m.toString(16).padStart(2,"0").toUpperCase(),m!==0&&` (0b${m.toString(2).padStart(8,"0")})`]})]})]})},ge=()=>e.jsxs(ce,{children:[e.jsxs(le,{children:[e.jsx(O,{style:{flex:1},children:"subsystem control"}),e.jsx(O,{style:{flexShrink:0,textAlign:"right"},children:"status"})]}),e.jsx(be,{})]}),je=()=>e.jsxs(ae,{title:"Power Save",subtitle:"Selectively disable controller subsystems to conserve battery.",children:[e.jsxs(n,{children:[e.jsxs("p",{children:["The DualSense's output report includes a set of power save flags intended to control individual subsystems on the controller hardware. The ",e.jsx("strong",{children:"mute flags"})," (haptic mute and the per-channel audio mutes on"," ",e.jsx(I,{to:"/outputs/audio",children:e.jsx("code",{children:"Audio"})}),") have confirmed observable effects. The ",e.jsx("strong",{children:"subsystem disable flags"})," ","(touch, motion, haptics, audio) are valid protocol bits but produce no confirmed observable change in our testing — they may affect internal power draw without changing host-visible behavior."]}),e.jsxs("p",{children:["Power save is controlled through"," ",e.jsx("code",{children:"controller.powerSave"}),", which exposes boolean properties for each subsystem. All subsystems are enabled by default."]})]}),e.jsxs(X,{children:["The ",e.jsx("strong",{children:"mute flags"})," (",e.jsx("code",{children:"hapticsMuted"})," and the per-channel audio mutes on ",e.jsx("code",{children:"Audio"}),") have confirmed observable effects. The ",e.jsx("strong",{children:"disable flags"})," ","(",e.jsx("code",{children:"touch"}),", ",e.jsx("code",{children:"motion"}),", ",e.jsx("code",{children:"haptics"}),","," ",e.jsx("code",{children:"audio"}),") are valid protocol bits sent to the controller, but in our testing they produce no observable change to the input data stream or output behavior. They may reduce internal power draw without changing host-visible behavior, or they may be unimplemented in current DualSense firmware. The flags are included because they are part of the documented output report structure and may be honored by future firmware revisions or hardware variants."]}),e.jsx(i,{children:"Live Control"}),e.jsx(ne,{children:"Toggle subsystems and test mute/disable flags"}),e.jsx(ie,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(ge,{})}),e.jsx(i,{children:"Subsystem Control"}),e.jsx(n,{children:e.jsxs("p",{children:["Four subsystems can be independently disabled: ",e.jsx("strong",{children:"touch"})," ","(touchpad input), ",e.jsx("strong",{children:"motion"})," (gyroscope and accelerometer), ",e.jsx("strong",{children:"haptics"})," (rumble motors and adaptive triggers), and ",e.jsx("strong",{children:"audio"})," (speaker, headphone, and microphone processing)."]})}),e.jsx(l,{code:`// Disable subsystems you don't need
controller.powerSave.motion = false;  // turn off IMU
controller.powerSave.touch = false;   // turn off touchpad

// Re-enable when needed
controller.powerSave.motion = true;

// Check current state
controller.powerSave.motion; // true`}),e.jsx(i,{children:"Bulk Control"}),e.jsx(n,{children:e.jsxs("p",{children:["Use ",e.jsx("code",{children:"set()"})," to configure multiple subsystems at once, or ",e.jsx("code",{children:"reset()"})," to re-enable everything."]})}),e.jsx(l,{code:`// Disable everything except audio
controller.powerSave.set({
  touch: false,
  motion: false,
  haptics: false,
});

// Re-enable all subsystems
controller.powerSave.reset();`}),e.jsx(i,{children:"Haptic Mute"}),e.jsx(n,{children:e.jsxs("p",{children:["In addition to fully disabling the haptic processor, you can",e.jsx("strong",{children:" mute"})," haptic output while keeping the processor running. This is a lighter-weight option — the controller still processes haptic commands but suppresses the motors."]})}),e.jsx(l,{code:`// Soft mute: processor stays active, motors silenced
controller.powerSave.hapticsMuted = true;

// Hard disable: processor powers down entirely
controller.powerSave.haptics = false;`}),e.jsx(i,{children:"Audio Mutes vs Audio Disable"}),e.jsx(n,{children:e.jsxs("p",{children:["The ",e.jsx(I,{to:"/outputs/audio",children:e.jsx("code",{children:"Audio"})})," controls include per-channel mutes (speaker, headphone, microphone) that silence individual outputs without powering down the audio processor. The ",e.jsx("code",{children:"powerSave.audio"})," flag is more aggressive — it disables the entire audio DSP, which saves more power but cuts off all audio functionality."]})}),e.jsx(l,{code:`// Soft mutes (per-channel, audio processor stays on)
controller.audio.muteSpeaker();
controller.audio.muteMicrophone();

// Hard disable (powers down the entire audio DSP)
controller.powerSave.audio = false;`}),e.jsxs(X,{children:["The controller does not report power save status back in the input report. ",e.jsx("code",{children:"controller.powerSave"})," is always the authoritative source of truth for which flags have been sent."]}),e.jsx(i,{children:"Battery Optimization Example"}),e.jsx(n,{children:e.jsx("p",{children:"A typical optimization for a game that only uses buttons and analog sticks — disable everything else to maximize battery life:"})}),e.jsx(l,{code:`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();

// Only keep buttons and analog sticks
controller.powerSave.set({
  motion: false,    // no gyro/accel needed
  touch: false,     // no touchpad needed
  audio: false,     // no speaker/mic needed
});

// Haptics stay enabled for rumble feedback
controller.powerSave.haptics; // true

// Later, when entering a motion-control section:
controller.powerSave.motion = true;`})]});export{je as default};
