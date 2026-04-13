import{j as e,g as r,a as o,C as W,R as I,L as T}from"./index-DwvD-yqT.js";import{F as O,P as p,D as U,H as w,S as f}from"./FeaturePage-o7D6sE4P.js";import{a as j}from"./CodeBlock-CIY2ZnXU.js";const M=r.div`
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
`,N=r.div`
  position: relative;
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  cursor: pointer;
`,Y=r.div`
  position: absolute;
  inset: 0;
  right: ${t=>100-t.$pct}%;
  background: linear-gradient(
    90deg,
    rgba(242, 158, 2, ${t=>.08+t.$pct*.003}),
    rgba(242, 158, 2, ${t=>.15+t.$pct*.005})
  );
  transition: right 0.04s;
`,G=r.div`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: ${t=>t.$pct}%;
  width: 4px;
  margin-left: -2px;
  border-radius: 2px;
  background: #f29e02;
  opacity: ${t=>t.$pct>0?.9:.3};
  transition: left 0.04s, opacity 0.1s;
`,J=r.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`,K=r.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,Q=r.div`
  display: flex;
  align-items: center;
  gap: 14px;
`,g=r.span`
  color: rgba(191, 204, 214, 0.3);
`,X=r.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,Z=r.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,_=r.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,P=r.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,S=r.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,m=r.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${t=>{switch(t.$variant){case"stop":return"rgba(255, 107, 107, 0.4)";case"full":return"rgba(242, 158, 2, 0.4)";case"toggle":return"rgba(72, 175, 240, 0.4)";case"pattern":return"rgba(72, 175, 240, 0.4)"}}};
  background: ${t=>{switch(t.$variant){case"stop":return"rgba(255, 107, 107, 0.1)";case"full":return"rgba(242, 158, 2, 0.1)";case"toggle":return"rgba(72, 175, 240, 0.1)";case"pattern":return"rgba(72, 175, 240, 0.1)"}}};
  color: ${t=>{switch(t.$variant){case"stop":return"#ff6b6b";case"full":return"#f29e02";case"toggle":return"#48aff0";case"pattern":return"#48aff0"}}};

  &:hover {
    background: ${t=>{switch(t.$variant){case"stop":return"rgba(255, 107, 107, 0.2)";case"full":return"rgba(242, 158, 2, 0.2)";case"toggle":return"rgba(72, 175, 240, 0.2)";case"pattern":return"rgba(72, 175, 240, 0.2)"}}};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`,ee=r(m)`
  background: rgba(72, 175, 240, 0.25);
  border-color: rgba(72, 175, 240, 0.6);
`,F=({label:t,value:a,onChange:s,even:b})=>{const i=t.split("."),l=a*100;return e.jsxs(K,{$even:b,children:[e.jsxs(Q,{children:[e.jsx(X,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),i.map((c,d)=>e.jsxs(I.Fragment,{children:[d>0&&e.jsx(g,{children:"."}),d===i.length-1?c:e.jsx(g,{children:c})]},d))]})}),e.jsxs(Z,{$highlight:a>0,children:[l.toFixed(0),"%"]})]}),e.jsxs(N,{children:[e.jsx(Y,{$pct:l}),e.jsx(G,{$pct:l}),e.jsx(J,{type:"range",min:0,max:1,step:.01,value:a,onChange:c=>s(parseFloat(c.target.value))})]})]})},y=r.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,$=r.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,R=r.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
  transition: color 0.06s;
`,te=()=>{const t=o.useContext(W),[a,s]=o.useState(0),[b,i]=o.useState(0),[l,c]=o.useState(!1),[d,k]=o.useState(!1),v=o.useRef(null);o.useEffect(()=>()=>{t.left.rumble(0),t.right.rumble(0)},[t]),o.useEffect(()=>{if(!l)return;const n=h=>{const u=h.state;s(u),t.left.rumble(u)},x=h=>{const u=h.state;i(u),t.right.rumble(u)};return t.left.trigger.on("change",n),t.right.trigger.on("change",x),()=>{t.left.trigger.removeListener("change",n),t.right.trigger.removeListener("change",x)}},[t,l]);const L=o.useCallback(n=>{l||(s(n),t.left.rumble(n))},[t,l]),E=o.useCallback(n=>{l||(i(n),t.right.rumble(n))},[t,l]),A=o.useCallback(()=>{c(!1),s(0),i(0),t.rumble(0)},[t]),B=o.useCallback(()=>{s(1),i(1),t.rumble(1)},[t]),D=o.useCallback(()=>{c(n=>(n&&(s(0),i(0),t.rumble(0)),!n))},[t]),H=o.useCallback(async()=>{if(d)return;c(!1),k(!0);const n=new AbortController;v.current=n;const x=h=>new Promise((u,V)=>{const q=setTimeout(u,h);n.signal.addEventListener("abort",()=>{clearTimeout(q),V(new Error("aborted"))})});try{for(let h=0;h<3;h++)t.rumble(.6),s(.6),i(.6),await x(200),t.rumble(0),s(0),i(0),await x(200)}catch{}finally{t.rumble(0),s(0),i(0),k(!1),v.current=null}},[t,d]);o.useEffect(()=>()=>{var n;(n=v.current)==null||n.abort()},[]);const C=(a+b)/2,z=l?ee:m;return e.jsxs(e.Fragment,{children:[e.jsx(F,{label:"left.rumble",value:a,onChange:L,even:!1}),e.jsx(F,{label:"right.rumble",value:b,onChange:E,even:!0}),e.jsxs(S,{children:[e.jsx(m,{$variant:"stop",onClick:A,children:"Stop"}),e.jsx(m,{$variant:"full",onClick:B,children:"Full"})]}),e.jsxs(S,{children:[e.jsx(z,{$variant:"toggle",onClick:D,children:l?"Trigger Reactive: On":"Trigger Reactive: Off"}),e.jsx(m,{$variant:"pattern",onClick:H,disabled:d,children:d?"Pulsing...":"Pulse Pattern"})]}),e.jsxs(y,{children:[e.jsx($,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),"left",e.jsx(g,{children:"."}),"rumble()"]})}),e.jsx(R,{$highlight:a>0,children:a.toFixed(2)})]}),e.jsxs(y,{$even:!0,children:[e.jsx($,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),"right",e.jsx(g,{children:"."}),"rumble()"]})}),e.jsx(R,{$highlight:b>0,children:b.toFixed(2)})]}),e.jsxs(y,{children:[e.jsx($,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),"rumble()"]})}),e.jsx(R,{$highlight:C>0,children:C.toFixed(2)})]})]})},re=()=>e.jsxs(M,{children:[e.jsxs(_,{children:[e.jsx(P,{style:{flex:1},children:"motor"}),e.jsx(P,{style:{flexShrink:0,width:"5ch",textAlign:"right"},children:"value"})]}),e.jsx(te,{})]}),ie=()=>e.jsxs(O,{title:"Rumble",subtitle:"Independent left and right haptic motors with intensity control.",children:[e.jsx(p,{children:e.jsxs("p",{children:["The DualSense has two independent rumble motors — a larger one on the left for low-frequency vibrations and a smaller one on the right for high-frequency feedback. Each accepts an intensity from 0 (off) to 1 (maximum). Use"," ",e.jsx("code",{children:"controller.rumble()"})," to set both at once, or control them independently via"," ",e.jsx(T,{to:"/api/unisense",children:e.jsx("code",{children:"controller.left"})})," and"," ",e.jsx("code",{children:"controller.right"}),"."]})}),e.jsx(U,{children:"Drag the sliders to feel the rumble"}),e.jsx(re,{}),e.jsx(w,{children:"The left motor is significantly stronger than the right. For a perceptually centered rumble, set the left motor to roughly 70% of the right motor's intensity."}),e.jsx(f,{children:"Basic Usage"}),e.jsx(p,{children:e.jsxs("p",{children:["The convenience method ",e.jsx("code",{children:"controller.rumble()"})," sets both motors to the same intensity. Pass a number (0–1) or a boolean:"]})}),e.jsx(j,{code:`// Set both motors at once
controller.rumble(0.5);

// Boolean shorthand
controller.rumble(true);   // 100%
controller.rumble(false);  // stop`}),e.jsxs(w,{children:["The controller firmware automatically stops rumble after ~5 seconds of inactivity. While ",e.jsx("code",{children:"dualsense-ts"})," is connected, it periodically resends the rumble command to keep the motors running."]}),e.jsx(f,{children:"Independent Motor Control"}),e.jsx(p,{children:e.jsx("p",{children:"For finer control, set each motor separately. You can also read the current intensity by calling the method with no arguments:"})}),e.jsx(j,{code:`// Left motor (heavy / low frequency)
controller.left.rumble(1.0);

// Right motor (light / high frequency)
controller.right.rumble(0.3);

// Read current intensity (call with no arguments)
controller.left.rumble();  // 1
controller.right.rumble(); // 0.3

// Stop all rumble
controller.rumble(0);`}),e.jsx(w,{children:"Rumble state is restored automatically if the controller disconnects and reconnects — no handling required on your end."}),e.jsx(f,{children:"Trigger Reactive Rumble"}),e.jsx(p,{children:e.jsxs("p",{children:["Wire rumble intensity to any input. For example, map the"," ",e.jsx(T,{to:"/inputs/triggers",children:"trigger pressure"})," directly to the corresponding motor. Try this now with the"," ",e.jsx("strong",{children:"Trigger Reactive"})," button above."]})}),e.jsx(j,{code:`// Rumble follows trigger pressure
controller.right.trigger.on("change", (trigger) => {
  controller.right.rumble(trigger.state);
});

controller.left.trigger.on("change", (trigger) => {
  controller.left.rumble(trigger.state);
});`}),e.jsx(f,{children:"Patterns"}),e.jsx(p,{children:e.jsxs("p",{children:["The library doesn't include a built-in pattern system, but it's straightforward to build one with timers. Hit the"," ",e.jsx("strong",{children:"Pulse Pattern"})," button above to try this example:"]})}),e.jsx(j,{code:`async function pulse(count: number, ms: number) {
  for (let i = 0; i < count; i++) {
    controller.rumble(0.6);
    await new Promise((r) => setTimeout(r, ms));
    controller.rumble(0);
    await new Promise((r) => setTimeout(r, ms));
  }
}`})]});export{ie as default};
