import{j as e,g as o,a as d,C as v,d as r,L as l}from"./index-BSVR9c3C.js";import{F as y,P as c,D as k,H as m,S as x}from"./FeaturePage-BoRGL-6D.js";import{a as p}from"./CodeBlock-Dg4PHzNE.js";const $=o.div`
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
`,C=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,D=o.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,O=o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.06);
`,E=({muted:t})=>e.jsxs("svg",{width:"20",height:"28",viewBox:"0 0 10 14",fill:"currentColor",children:[e.jsx("rect",{x:"3",y:"0.5",width:"4",height:"8",rx:"2"}),e.jsx("path",{d:"M1 6.5 Q1 10.5 5 10.5 Q9 10.5 9 6.5",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"5",y1:"10.5",x2:"5",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"3",y1:"13",x2:"7",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),t&&e.jsx("line",{x1:"1",y1:"1",x2:"9",y2:"12",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]}),P=o.span`
  font-size: 14px;
  font-weight: 600;
  color: ${t=>t.$muted?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.15s;
`,R=o.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${t=>t.$mode==="off"?"rgba(191, 204, 214, 0.15)":"#f29e02"};
  box-shadow: ${t=>t.$mode==="off"?"none":"0 0 8px rgba(242, 158, 2, 0.5)"};
  transition: all 0.15s;
  ${t=>t.$mode==="pulse"?"animation: ledPulse 2s ease-in-out infinite;":""}

  @keyframes ledPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
`,S=o.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,u=o.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${t=>t.$active?"rgba(242, 158, 2, 0.6)":"rgba(242, 158, 2, 0.3)"};
  background: ${t=>t.$active?"rgba(242, 158, 2, 0.2)":"rgba(242, 158, 2, 0.08)"};
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    color: #f29e02;
  }
`,B=o(u)`
  border-color: rgba(72, 175, 240, 0.4);
  background: rgba(72, 175, 240, 0.1);
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
  }
`,a=o.span`
  color: rgba(191, 204, 214, 0.3);
`,g=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,j=o.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,b=o.code`
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
  transition: color 0.06s;
`;function T(t){if(t===void 0)return"undefined";switch(t){case r.MuteLedMode.Off:return"MuteLedMode.Off";case r.MuteLedMode.On:return"MuteLedMode.On";case r.MuteLedMode.Pulse:return"MuteLedMode.Pulse";default:return`${t}`}}function z(t,s){if(t===void 0)return s?"on":"off";switch(t){case r.MuteLedMode.On:return"on";case r.MuteLedMode.Pulse:return"pulse";default:return"off"}}const H=()=>{const t=d.useContext(v),[s,M]=d.useState(t.mute.status.state),[n,f]=d.useState(t.mute.ledMode);d.useEffect(()=>{const i=()=>M(t.mute.status.state);return t.mute.status.on("change",i),()=>{t.mute.status.removeListener("change",i)}},[t]),d.useEffect(()=>()=>{t.mute.resetLed()},[t]);const h=d.useCallback(i=>{t.mute.setLed(i),f(i)},[t]),L=d.useCallback(()=>{t.mute.resetLed(),f(void 0)},[t]),w=z(n,s);return e.jsxs(e.Fragment,{children:[e.jsxs(O,{children:[e.jsx(R,{$mode:w}),e.jsx("span",{style:{color:s?"#f29e02":"rgba(191, 204, 214, 0.5)",display:"flex"},children:e.jsx(E,{muted:s})}),e.jsx(P,{$muted:s,children:s?"Muted":"Mic On"})]}),e.jsxs(S,{children:[e.jsx(u,{$active:n===r.MuteLedMode.On,onClick:()=>h(r.MuteLedMode.On),children:"On"}),e.jsx(u,{$active:n===r.MuteLedMode.Pulse,onClick:()=>h(r.MuteLedMode.Pulse),children:"Pulse"}),e.jsx(u,{$active:n===r.MuteLedMode.Off,onClick:()=>h(r.MuteLedMode.Off),children:"Off"}),e.jsx(B,{$active:n===void 0,onClick:L,children:"Reset"})]}),e.jsxs(g,{children:[e.jsx(j,{children:e.jsxs("bdi",{children:[e.jsx(a,{children:"controller."}),"mute",e.jsx(a,{children:"."}),"status",e.jsx(a,{children:"."}),"state"]})}),e.jsx(b,{$highlight:s,children:s?"true":"false"})]}),e.jsxs(g,{$even:!0,children:[e.jsx(j,{children:e.jsxs("bdi",{children:[e.jsx(a,{children:"controller."}),"mute",e.jsx(a,{children:"."}),"ledMode"]})}),e.jsx(b,{$highlight:n!==void 0,children:T(n)})]})]})},W=()=>e.jsxs($,{children:[e.jsx(C,{children:e.jsx(D,{children:"mute LED"})}),e.jsx(H,{})]}),I=()=>e.jsxs(y,{title:"Mute LED",subtitle:"Orange LED below the touchpad with software-controllable modes.",children:[e.jsx(c,{children:e.jsxs("p",{children:["The mute LED is the small orange indicator next to the mute button. By default it's managed by the controller firmware — lit when muted, off when unmuted. You can override this with"," ",e.jsx(l,{to:"/api/mute",children:e.jsx("code",{children:"mute.setLed()"})})," to force it on, pulsing, or off regardless of the actual mute state."]})}),e.jsx(k,{children:"Override the LED mode or press the mute button on your controller"}),e.jsx(W,{}),e.jsxs(m,{children:["Software overrides are temporary — pressing the physical mute button returns the LED to firmware control. Your override will need to be re-sent if you want to maintain it. The ",e.jsx("code",{children:"ledMode"})," value may desync from the actual controller state after user input."]}),e.jsx(x,{children:"Overriding the LED"}),e.jsx(c,{children:e.jsxs("p",{children:["Use the"," ",e.jsx(l,{to:"/api/enums",children:e.jsx("code",{children:"MuteLedMode"})})," enum to set the LED to a specific mode. Call ",e.jsx("code",{children:"resetLed()"})," to return control to the firmware."]})}),e.jsx(p,{code:`import { MuteLedMode } from "dualsense-ts";

controller.mute.setLed(MuteLedMode.On);    // solid orange
controller.mute.setLed(MuteLedMode.Pulse); // slow pulse
controller.mute.setLed(MuteLedMode.Off);   // force off

// Return control to firmware
controller.mute.resetLed();`}),e.jsx(x,{children:"Mute Status"}),e.jsx(c,{children:e.jsxs("p",{children:["The actual microphone mute state is tracked by"," ",e.jsx("code",{children:"mute.status"}),", a"," ",e.jsx(l,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," input. This reflects whether the mic is muted at the hardware level — it updates when the user presses the physical button, independent of any LED overrides you've sent."]})}),e.jsxs(m,{children:["If you've overridden the LED, the light no longer reflects the actual mute state. Always read ",e.jsx("code",{children:"mute.status.state"})," for the true microphone on/off state, not the LED."]}),e.jsx(p,{code:`// True when the microphone is muted
controller.mute.status.state; // boolean

// React to mute changes
controller.mute.status.on("change", ({ state }) => {
  console.log(state ? "Muted" : "Unmuted");
});`}),e.jsx(x,{children:"Mute Button"}),e.jsx(c,{children:e.jsxs("p",{children:["The mute button itself is a standard"," ",e.jsx(l,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," input. You can listen for physical presses independently of the mute state:"]})}),e.jsx(p,{code:`controller.mute.on("press", () => {
  console.log("Mute button pressed");
});

controller.mute.on("release", () => {
  console.log("Mute button released");
});`})]});export{I as default};
