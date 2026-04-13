import{a as t,C as b,d as y,j as e,g as h,L as q}from"./index-GGWi0Ont.js";import{F as z,P as u,H as D,S as f,D as H}from"./FeaturePage-DywfdRev.js";import{a as x}from"./CodeBlock-Dvv7tnEL.js";const j=h.div`
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
`,m=h.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,k=h.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,$=h.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${n=>n.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,L=h.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 96px;
  flex-shrink: 0;
`,M=h.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 52px;
  text-align: right;
  flex-shrink: 0;
`,P=h.div`
  position: relative;
  flex: 1;
  height: 24px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
`,W=h.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(90deg, rgba(242, 158, 2, 0.25), rgba(242, 158, 2, 0.55));
  pointer-events: none;
  transition: width 0.04s;
`,G=h.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 16px;
  margin-left: -1.5px;
  border-radius: 1.5px;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-50%);
  pointer-events: none;
  transition: left 0.04s;
`,V=h.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`,A=h.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,E=h.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid rgba(242, 158, 2, 0.3);
  background: rgba(242, 158, 2, 0.08);
  color: rgba(191, 204, 214, 0.5);

  &:hover {
    background: rgba(242, 158, 2, 0.15);
    border-color: rgba(242, 158, 2, 0.6);
    color: #f29e02;
  }
`,a=({label:n,value:r,onChange:i,min:s=0,max:l=1,step:o=.01,format:d,even:c})=>{const g=(r-s)/(l-s)*100;return e.jsxs($,{$even:c,children:[e.jsx(L,{children:n}),e.jsxs(P,{children:[e.jsx(W,{style:{width:`${g}%`}}),e.jsx(G,{style:{left:`${g}%`}}),e.jsx(V,{type:"range",min:s,max:l,step:o,value:r,onChange:p=>i(Number(p.target.value))})]}),e.jsx(M,{children:d?d(r):r.toFixed(2)})]})};function v(n,r,i){(r==="left"||r==="both")&&n.left.trigger.feedback.set(i),(r==="right"||r==="both")&&n.right.trigger.feedback.set(i)}const C=({onApply:n})=>e.jsxs(A,{children:[e.jsx(E,{onClick:()=>n("left"),children:"Apply to L2"}),e.jsx(E,{onClick:()=>n("both"),children:"Apply to Both"}),e.jsx(E,{onClick:()=>n("right"),children:"Apply to R2"})]}),R=h(E)`
  border-color: rgba(72, 175, 240, 0.4);
  background: rgba(72, 175, 240, 0.1);
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
    border-color: rgba(72, 175, 240, 0.6);
  }
`,N=()=>{const n=t.useContext(b),r=t.useCallback(i=>{(i==="left"||i==="both")&&n.left.trigger.feedback.reset(),(i==="right"||i==="both")&&n.right.trigger.feedback.reset()},[n]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"reset triggers"})}),e.jsxs(A,{children:[e.jsx(R,{onClick:()=>r("left"),children:"Reset L2"}),e.jsx(R,{onClick:()=>r("both"),children:"Reset Both"}),e.jsx(R,{onClick:()=>r("right"),children:"Reset R2"})]})]})},Y=()=>{const n=t.useContext(b),[r,i]=t.useState(.3),[s,l]=t.useState(.8),o=t.useCallback(d=>{v(n,d,{effect:y.TriggerEffect.Feedback,position:r,strength:s})},[n,r,s]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"feedback parameters"})}),e.jsx(a,{label:"position",value:r,onChange:i}),e.jsx(a,{label:"strength",value:s,onChange:l,even:!0}),e.jsx(C,{onApply:o})]})},Z=()=>{const n=t.useContext(b),[r,i]=t.useState(.2),[s,l]=t.useState(.6),[o,d]=t.useState(.9),c=t.useCallback(g=>{v(n,g,{effect:y.TriggerEffect.Weapon,start:r,end:s,strength:o})},[n,r,s,o]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"weapon parameters"})}),e.jsx(a,{label:"start",value:r,onChange:i}),e.jsx(a,{label:"end",value:s,onChange:l,even:!0}),e.jsx(a,{label:"strength",value:o,onChange:d}),e.jsx(C,{onApply:c})]})},O=()=>{const n=t.useContext(b),[r,i]=t.useState(.2),[s,l]=t.useState(.6),[o,d]=t.useState(.8),[c,g]=t.useState(.6),p=t.useCallback(w=>{v(n,w,{effect:y.TriggerEffect.Bow,start:r,end:s,strength:o,snapForce:c})},[n,r,s,o,c]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"bow parameters"})}),e.jsx(a,{label:"start",value:r,onChange:i}),e.jsx(a,{label:"end",value:s,onChange:l,even:!0}),e.jsx(a,{label:"strength",value:o,onChange:d}),e.jsx(a,{label:"snapForce",value:c,onChange:g,even:!0}),e.jsx(C,{onApply:p})]})},_=()=>{const n=t.useContext(b),[r,i]=t.useState(.1),[s,l]=t.useState(.9),[o,d]=t.useState(.3),[c,g]=t.useState(.6),[p,w]=t.useState(20),S=t.useCallback(T=>{v(n,T,{effect:y.TriggerEffect.Galloping,start:r,end:s,firstFoot:o,secondFoot:c,frequency:p})},[n,r,s,o,c,p]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"galloping parameters"})}),e.jsx(a,{label:"start",value:r,onChange:i}),e.jsx(a,{label:"end",value:s,onChange:l,even:!0}),e.jsx(a,{label:"firstFoot",value:o,onChange:d}),e.jsx(a,{label:"secondFoot",value:c,onChange:g,even:!0}),e.jsx(a,{label:"frequency",value:p,onChange:w,min:1,max:255,step:1,format:T=>`${Math.round(T)} Hz`}),e.jsx(C,{onApply:S})]})},I=()=>{const n=t.useContext(b),[r,i]=t.useState(.1),[s,l]=t.useState(.7),[o,d]=t.useState(40),c=t.useCallback(g=>{v(n,g,{effect:y.TriggerEffect.Vibration,position:r,amplitude:s,frequency:o})},[n,r,s,o]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"vibration parameters"})}),e.jsx(a,{label:"position",value:r,onChange:i}),e.jsx(a,{label:"amplitude",value:s,onChange:l,even:!0}),e.jsx(a,{label:"frequency",value:o,onChange:d,min:1,max:255,step:1,format:g=>`${Math.round(g)} Hz`}),e.jsx(C,{onApply:c})]})},J=()=>{const n=t.useContext(b),[r,i]=t.useState(.1),[s,l]=t.useState(.9),[o,d]=t.useState(.5),[c,g]=t.useState(.8),[p,w]=t.useState(30),[S,T]=t.useState(5),B=t.useCallback(F=>{v(n,F,{effect:y.TriggerEffect.Machine,start:r,end:s,amplitudeA:o,amplitudeB:c,frequency:p,period:S})},[n,r,s,o,c,p,S]);return e.jsxs(j,{children:[e.jsx(m,{children:e.jsx(k,{children:"machine parameters"})}),e.jsx(a,{label:"start",value:r,onChange:i}),e.jsx(a,{label:"end",value:s,onChange:l,even:!0}),e.jsx(a,{label:"amplitudeA",value:o,onChange:d}),e.jsx(a,{label:"amplitudeB",value:c,onChange:g,even:!0}),e.jsx(a,{label:"frequency",value:p,onChange:w,min:1,max:255,step:1,format:F=>`${Math.round(F)} Hz`}),e.jsx(a,{label:"period",value:S,onChange:T,min:1,max:255,step:1,format:F=>`${Math.round(F)}`,even:!0}),e.jsx(C,{onApply:B})]})},X=()=>{const n=t.useContext(b);return t.useEffect(()=>()=>{n.resetTriggerFeedback()},[n]),e.jsxs(z,{title:"Adaptive Trigger Effects",subtitle:"7 firmware-driven resistance modes with per-trigger configuration.",children:[e.jsx(u,{children:e.jsxs("p",{children:["The DualSense's adaptive triggers use built-in motors to create physical resistance as you press L2 and R2. Each trigger can be independently configured with one of 7 effect types from the"," ",e.jsx(q,{to:"/api/enums",children:e.jsx("code",{children:"TriggerEffect"})})," ","enum, each with its own set of parameters controlling where the resistance starts, how strong it is, and how it behaves."]})}),e.jsx(D,{children:"Trigger effect state is automatically restored if the controller disconnects and reconnects — no handling required on your end."}),e.jsx(f,{children:"Effect Types"}),e.jsx(u,{children:e.jsxs("p",{children:["Effect names are based on"," ",e.jsx("a",{href:"https://gist.github.com/Nielk1/6d54cc2c00d2201ccb8c2720ad7538db",target:"_blank",rel:"noopener noreferrer",children:"Nielk1's DualSense trigger effect documentation"}),". All normalized parameters (0–1) are mapped to the firmware's internal ranges automatically."]})}),e.jsx(f,{children:"Feedback"}),e.jsx(u,{children:e.jsxs("p",{children:["Zone-based continuous resistance from a start position. Everything past the ",e.jsx("code",{children:"position"}),' threshold feels stiff — useful for braking, aiming tension, or any "hold against pressure" feel.']})}),e.jsx(H,{children:"Adjust parameters and apply to either trigger"}),e.jsx(Y,{}),e.jsx(x,{code:`import { TriggerEffect } from "dualsense-ts";

controller.right.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.3, // resistance starts at 30% travel
  strength: 0.8, // 0–1
});`}),e.jsx(f,{children:"Weapon"}),e.jsx(u,{children:e.jsxs("p",{children:["Resistance builds between ",e.jsx("code",{children:"start"})," and ",e.jsx("code",{children:"end"}),", then snaps through — like pulling a gun trigger. The release point creates a satisfying click."]})}),e.jsx(Z,{}),e.jsx(x,{code:`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,    // resistance begins
  end: 0.6,      // snap release point
  strength: 0.9, // 0–1
});`}),e.jsx(f,{children:"Bow"}),e.jsx(u,{children:e.jsx("p",{children:"Like Weapon, but with an additional snap-back force after the release point — the trigger pushes back against your finger, simulating drawing and releasing a bowstring."})}),e.jsx(O,{}),e.jsx(x,{code:`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Bow,
  start: 0.2,
  end: 0.6,
  strength: 0.8,  // pull resistance
  snapForce: 0.6, // snap-back force
});`}),e.jsx(f,{children:"Galloping"}),e.jsx(u,{children:e.jsxs("p",{children:["Rhythmic two-stroke oscillation between two timing points. Feels like a galloping horse or a repeating mechanical action. The"," ",e.jsx("code",{children:"firstFoot"})," and ",e.jsx("code",{children:"secondFoot"})," parameters control the timing of each stroke within the cycle."]})}),e.jsx(_,{}),e.jsx(x,{code:`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Galloping,
  start: 0.1,
  end: 0.9,
  firstFoot: 0.3,  // first stroke timing (0–1)
  secondFoot: 0.6, // second stroke timing (0–1)
  frequency: 20,   // Hz (1–255)
});`}),e.jsx(f,{children:"Vibration"}),e.jsx(u,{children:e.jsxs("p",{children:["Zone-based oscillation — the trigger vibrates from the"," ",e.jsx("code",{children:"position"})," point onward. Good for engine rumble, terrain feedback, or any continuous haptic texture."]})}),e.jsx(I,{}),e.jsx(x,{code:`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Vibration,
  position: 0.1,   // vibration starts at 10% travel
  amplitude: 0.7,  // 0–1
  frequency: 40,   // Hz (1–255)
});`}),e.jsx(f,{children:"Machine"}),e.jsx(u,{children:e.jsx("p",{children:"Dual-amplitude vibration that alternates between two intensity levels at a configurable frequency and period. The most complex effect — simulates machinery, engines, or rhythmic industrial feedback."})}),e.jsx(J,{}),e.jsx(x,{code:`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Machine,
  start: 0.1,
  end: 0.9,
  amplitudeA: 0.5, // first amplitude (0–1)
  amplitudeB: 0.8, // second amplitude (0–1)
  frequency: 30,   // Hz (1–255)
  period: 5,       // tenths of a second
});`}),e.jsx(f,{children:"Resetting"}),e.jsx(u,{children:e.jsx("p",{children:"Reset a single trigger to the default linear feel, or reset both at once. The trigger immediately returns to zero resistance."})}),e.jsx(N,{}),e.jsx(x,{code:`// Reset a single trigger
controller.right.trigger.feedback.reset();

// Reset both triggers at once
controller.resetTriggerFeedback();`}),e.jsx(f,{children:"Reading State"}),e.jsx(u,{children:e.jsx("p",{children:"You can read the current effect type and the full configuration object at any time. Your editor's type hints will narrow the config type based on the active effect."})}),e.jsx(x,{code:`// Current effect type
controller.right.trigger.feedback.effect; // TriggerEffect.Off

// Full configuration object
controller.right.trigger.feedback.config;
// { effect: "weapon", start: 0.2, end: 0.6, strength: 0.9 }`})]})};export{X as default};
