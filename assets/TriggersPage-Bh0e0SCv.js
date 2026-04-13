import{j as e,g as s,a as l,C as $,R as C,L as u}from"./index-DwvD-yqT.js";import{F as E,P as h,S as g,D as y,a as v,H as w}from"./FeaturePage-o7D6sE4P.js";import{L,R as H}from"./PlayerLedControls-CQpb8_He.js";import"./BatteryVisualization-BVJoPKgw.js";import{a as f}from"./CodeBlock-CIY2ZnXU.js";const F=s.div`
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
`,D=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${r=>r.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,R=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,x=s.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,A=s.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,p=s.span`
  color: rgba(191, 204, 214, 0.3);
`,P=s.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${r=>r.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,I=s.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${r=>r.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,W=s.div`
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
    content: ${r=>JSON.stringify(r.$tip)};
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
`,B=s.span`
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
`;function k(r){return r.toFixed(3)}function N(r){const[,i]=l.useState(0);return l.useEffect(()=>{const n=()=>i(t=>t+1);return r.on("change",n),r.button.on("change",n),()=>{r.removeListener("change",n),r.button.removeListener("change",n)}},[r]),r}const b=({data:r,even:i})=>{const n=r.label.split(".");return e.jsxs(D,{$even:i,children:[e.jsxs(W,{$tip:r.tooltip,children:[e.jsx(B,{children:"i"}),e.jsxs(A,{children:[e.jsx(p,{children:"controller."}),n.map((t,a)=>e.jsxs(C.Fragment,{children:[a>0&&e.jsx(p,{children:"."}),a===n.length-1?t:e.jsx(p,{children:t})]},a))]})]}),e.jsx(P,{$highlight:r.highlight,children:r.state}),e.jsx(I,{$active:r.active,children:r.active?"true":"false"})]})},M=({prefix:r,selector:i})=>{const n=l.useContext($),t=i(n);return N(t),e.jsxs(e.Fragment,{children:[e.jsx(b,{data:{label:`${r}.state`,tooltip:"Normalized analog pressure. 0 (released) to 1 (fully pressed).",state:k(t.state),active:t.state>0,highlight:t.state>0},even:!1}),e.jsx(b,{data:{label:`${r}.pressure`,tooltip:"Alias for .state — returns the same normalized 0–1 pressure value.",state:k(t.pressure),active:t.pressure>0,highlight:t.pressure>0},even:!0}),e.jsx(b,{data:{label:`${r}.active`,tooltip:"True when pressure is greater than 0.",state:t.active?"true":"false",active:t.active,highlight:t.active},even:!1}),e.jsx(b,{data:{label:`${r}.button`,tooltip:"Independent digital button that actuates at the top of the trigger pull. Not derived from analog pressure.",state:t.button.active?"true":"false",active:t.button.active,highlight:t.button.active},even:!0})]})},V=s.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #48aff0;
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #48aff0;
    cursor: pointer;
    border: none;
  }
`,q=s.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 16px;
  background: ${r=>r.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,G=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
`,J=s.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,O=s.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: rgba(191, 204, 214, 0.5);
`,T=({label:r,value:i,onChange:n,min:t,max:a,step:c,even:m})=>{const j=r.split(".");return e.jsxs(q,{$even:m,children:[e.jsxs(G,{children:[e.jsxs(J,{children:[e.jsx(p,{children:"controller."}),j.map((d,o)=>e.jsxs(C.Fragment,{children:[o>0&&e.jsx(p,{children:"."}),o===j.length-1?d:e.jsx(p,{children:d})]},o))]}),e.jsx(O,{children:i.toFixed(3)})]}),e.jsx(V,{type:"range",min:t,max:a,step:c,value:i,onChange:d=>n(parseFloat(d.target.value))})]})},U=({prefix:r,selector:i})=>{const n=l.useContext($),t=i(n),[,a]=l.useState(0),c=l.useCallback(()=>a(o=>o+1),[]),m=l.useRef({threshold:t.threshold,deadzone:t.deadzone});l.useEffect(()=>{const o=m.current;return()=>{t.threshold=o.threshold,t.deadzone=o.deadzone}},[t]);const j=l.useCallback(o=>{t.threshold=o,c()},[t,c]),d=l.useCallback(o=>{t.deadzone=o,c()},[t,c]);return e.jsxs(e.Fragment,{children:[e.jsx(T,{label:`${r}.threshold`,value:t.threshold,onChange:j,min:0,max:.1,step:.001,even:!1}),e.jsx(T,{label:`${r}.deadzone`,value:t.deadzone,onChange:d,min:0,max:.2,step:.001,even:!0})]})},Z=()=>e.jsxs(R,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(x,{style:{flex:1},children:"property"}),e.jsx(x,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(x,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),K=()=>e.jsxs(R,{children:[e.jsx(x,{style:{flexShrink:0},children:"config"}),e.jsx(x,{style:{flex:1}}),e.jsx(x,{style:{flexShrink:0,width:"5ch",textAlign:"right"},children:"value"})]}),z=({prefix:r,selector:i})=>e.jsxs(F,{children:[e.jsx(Z,{}),e.jsx(M,{prefix:r,selector:i})]}),S=({prefix:r,selector:i})=>e.jsxs(F,{children:[e.jsx(K,{}),e.jsx(U,{prefix:r,selector:i})]}),re=()=>e.jsxs(E,{title:"Triggers",subtitle:"Pressure-sensitive L2 and R2 triggers with full 0–1 range.",children:[e.jsx(h,{children:e.jsxs("p",{children:["Each trigger is a"," ",e.jsx(u,{to:"/api/trigger",children:e.jsx("code",{children:"Trigger"})})," input that reads analog pressure from 0 (released) to 1 (fully pressed). The"," ",e.jsx("code",{children:".state"})," value is a continuous number, while"," ",e.jsx("code",{children:".active"})," is ",e.jsx("code",{children:"true"})," whenever pressure is above 0. Triggers also have an independent digital"," ",e.jsx(u,{to:"/inputs/buttons",children:e.jsx("code",{children:".button"})})," and a"," ",e.jsx("code",{children:".feedback"})," property for"," ",e.jsx(u,{to:"/outputs/trigger-effects",children:"adaptive trigger effects"}),"."]})}),e.jsx(g,{children:"Live State"}),e.jsx(y,{children:"Press L2 and R2 on your controller"}),e.jsxs(v,{style:{gap:48},children:[e.jsx(L,{}),e.jsx(H,{})]}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(z,{prefix:"left.trigger",selector:r=>r.left.trigger})}),e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(z,{prefix:"right.trigger",selector:r=>r.right.trigger})})]})}),e.jsx(g,{children:"Configuration"}),e.jsx(h,{children:e.jsxs("p",{children:["Triggers have configurable ",e.jsx("code",{children:".threshold"})," and"," ",e.jsx("code",{children:".deadzone"})," values. The threshold controls the minimum change in pressure required to emit a ",e.jsx("code",{children:'"change"'})," event — useful for filtering out tiny fluctuations. The deadzone suppresses pressure values below a minimum, so ",e.jsx("code",{children:".active"})," won't become ",e.jsx("code",{children:"true"})," until the trigger passes that floor."]})}),e.jsx(y,{children:"Adjust threshold and deadzone — watch the state table respond"}),e.jsx(v,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(S,{prefix:"left.trigger",selector:r=>r.left.trigger})}),e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(S,{prefix:"right.trigger",selector:r=>r.right.trigger})})]})}),e.jsx(f,{code:`// Minimum change to trigger a "change" event
controller.left.trigger.threshold = 0.01;

// Ignore small accidental presses
controller.left.trigger.deadzone = 0.05;`}),e.jsx(g,{children:"Reading Pressure"}),e.jsx(h,{children:e.jsxs("p",{children:["The trigger's ",e.jsx("code",{children:".state"})," and ",e.jsx("code",{children:".pressure"})," both return the same normalized 0–1 value. ",e.jsx("code",{children:".pressure"})," is an alias for readability. For most use cases — game loops, animation frames — reading the value synchronously is simpler than subscribing to events."]})}),e.jsxs(w,{children:["Triggers report at HID frequency (~250 Hz). For continuous reads like driving acceleration or zoom control, prefer reading ",e.jsx("code",{children:".state"})," ","in your game loop over subscribing to ",e.jsx("code",{children:'"change"'})," events."]}),e.jsx(f,{code:`// Synchronous read in a game loop
const accel = controller.right.trigger.state;  // 0.0 to 1.0
const brake = controller.left.trigger.state;

// Alias — same value, more readable
controller.left.trigger.pressure;  // 0.0 to 1.0

// Boolean check
if (controller.right.trigger.active) {
  // any amount of pressure applied
}

// Event-driven
controller.left.trigger.on("change", (trigger) => {
  console.log(\`L2 pressure: \${trigger.state.toFixed(2)}\`);
});`}),e.jsx(g,{children:"Trigger Button"}),e.jsx(h,{children:e.jsxs("p",{children:["Each trigger has an independent digital"," ",e.jsx(u,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," button at ",e.jsx("code",{children:".button"}),". This is a separate hardware input — it is not derived from the analog pressure value."]})}),e.jsx(w,{children:"The trigger button actuates at the top of the pull, not the bottom."}),e.jsx(f,{code:`controller.left.trigger.button.on("press", () => {
  console.log("L2 button clicked");
});

// Works with .once() and .promise() too
await controller.right.trigger.button.promise("press");
console.log("R2 clicked once");`}),e.jsx(g,{children:"Adaptive Trigger Feedback"}),e.jsx(h,{children:e.jsxs("p",{children:["The DualSense's adaptive triggers provide programmable physical resistance. Each trigger has a ",e.jsx("code",{children:".feedback"})," property for configuring effects. See the"," ",e.jsx(u,{to:"/outputs/trigger-effects",children:"Trigger Effects"})," page for the full API and interactive controls."]})}),e.jsx(f,{code:`import { TriggerEffect } from "dualsense-ts";

// Zone-based continuous resistance
controller.left.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.2,   // where resistance begins (0-1)
  strength: 0.8,   // resistance force (0-1)
});

// Weapon-style snap release
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.3,
  end: 0.7,
  strength: 1.0,
});

// Reset to normal
controller.left.trigger.feedback.reset();`}),e.jsx(g,{children:"Events"}),e.jsxs(h,{children:[e.jsxs("p",{children:["Trigger events fire at HID report rate (~250 Hz), so they're best suited for triggering discrete actions rather than continuous reads. The ",e.jsx("code",{children:".button"})," sub-input also supports"," ",e.jsx("code",{children:'"press"'})," and ",e.jsx("code",{children:'"release"'}),"."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Event"}),e.jsx("th",{children:"Fires when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"change"'})}),e.jsx("td",{children:"Pressure value changes (subject to threshold)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"input"'})}),e.jsx("td",{children:"Every HID report, regardless of change"})]})]})]}),e.jsxs("p",{children:["All events support ",e.jsx("code",{children:".on()"})," for persistent listeners,"," ",e.jsx("code",{children:".once()"})," for single-fire callbacks, and"," ",e.jsx("code",{children:".promise()"})," for await-based flows."]})]}),e.jsx(f,{code:`controller.left.trigger.on("change", (trigger) => {
  console.log(\`L2: \${trigger.state.toFixed(2)}\`);
});

// Await a full press via the digital button
await controller.right.trigger.button.promise("press");`})]});export{re as default};
