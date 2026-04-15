import{j as e,g as n,a as d,C as D,R as C,L as h}from"./index-l8CS40p9.js";import{F as B,P as x,S as c,D as p,a as r,H as b}from"./FeaturePage-DbpfBqym.js";import{F as L,D as T,P as R,C as P,O as F,M as H,L as $,R as E}from"./PlayerLedControls-D1bktx-y.js";import"./BatteryVisualization-CxudYak9.js";import{a}from"./CodeBlock-DSZTVETd.js";const u=n.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
`,I=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${s=>s.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,A=n.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${s=>s.$active?"#f29e02":"rgba(255, 255, 255, 0.08)"};
  border: 1.5px solid ${s=>s.$active?"#f29e02":"rgba(255, 255, 255, 0.12)"};
  box-shadow: ${s=>s.$active?"0 0 8px 2px rgba(242, 158, 2, 0.4)":"none"};
  transition: all 0.06s;
`,O=n.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,f=n.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,U=n.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,m=n.span`
  color: rgba(191, 204, 214, 0.3);
`,w=n.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${s=>s.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,M=n.span`
  font-family: monospace;
  font-size: 11px;
  color: rgba(191, 204, 214, 0.25);
  flex-shrink: 0;
  min-width: 24px;
  text-align: right;
`;function z(s,l){const[t,o]=d.useState(s.state),i=d.useRef(0),[S,k]=d.useState(0);return d.useEffect(()=>{const v=()=>{const y=s.state;o(y),y&&(i.current+=1,k(i.current))};return s.on("change",v),()=>{s.removeListener("change",v)}},[s]),{label:l,active:t,pressCount:S}}const q=({data:s,even:l})=>{const t=s.label.split(".");return e.jsxs(I,{$even:l,children:[e.jsx(A,{$active:s.active}),e.jsxs(U,{children:[e.jsx(m,{children:"controller."}),t.map((o,i)=>e.jsxs(C.Fragment,{children:[i>0&&e.jsx(m,{children:"."}),i===t.length-1?o:e.jsx(m,{children:o})]},i))]}),e.jsx(w,{$active:s.active,children:s.active?"true":"false"}),e.jsx(w,{$active:s.active,children:s.active?"true":"false"}),e.jsx(M,{children:s.pressCount>0?s.pressCount:""})]})},N=[{label:"triangle",selector:s=>s.triangle},{label:"circle",selector:s=>s.circle},{label:"cross",selector:s=>s.cross},{label:"square",selector:s=>s.square}],_=[{label:"dpad.up",selector:s=>s.dpad.up},{label:"dpad.down",selector:s=>s.dpad.down},{label:"dpad.left",selector:s=>s.dpad.left},{label:"dpad.right",selector:s=>s.dpad.right}],V=[{label:"ps",selector:s=>s.ps},{label:"create",selector:s=>s.create},{label:"options",selector:s=>s.options},{label:"mute",selector:s=>s.mute}],Y=[{label:"left.bumper",selector:s=>s.left.bumper},{label:"right.bumper",selector:s=>s.right.bumper},{label:"left.trigger.button",selector:s=>s.left.trigger.button},{label:"right.trigger.button",selector:s=>s.right.trigger.button},{label:"left.analog.button",selector:s=>s.left.analog.button},{label:"right.analog.button",selector:s=>s.right.analog.button}],g=({buttons:s})=>{const l=d.useContext(D);return e.jsx(e.Fragment,{children:s.map((t,o)=>e.jsx(G,{input:t.selector(l),label:t.label,even:o%2===1},t.label))})},G=({input:s,label:l,even:t})=>{const o=z(s,l);return e.jsx(q,{data:o,even:t})},j=()=>e.jsxs(O,{children:[e.jsx("div",{style:{width:10,flexShrink:0}}),e.jsx(f,{style:{flex:1},children:"input"}),e.jsx(f,{style:{flexShrink:0,width:"5ch"},children:"state"}),e.jsx(f,{style:{flexShrink:0,width:"5ch"},children:"active"}),e.jsx("div",{style:{minWidth:24,flexShrink:0}})]}),W=()=>e.jsxs(u,{children:[e.jsx(j,{}),e.jsx(g,{buttons:N})]}),J=()=>e.jsxs(u,{children:[e.jsx(j,{}),e.jsx(g,{buttons:_})]}),K=()=>e.jsxs(u,{children:[e.jsx(j,{}),e.jsx(g,{buttons:V})]}),Q=()=>e.jsxs(u,{children:[e.jsx(j,{}),e.jsx(g,{buttons:Y})]}),ne=()=>e.jsxs(B,{title:"Buttons",subtitle:"Face buttons, D-Pad, and utility buttons.",children:[e.jsxs(x,{children:[e.jsxs("p",{children:["The DualSense exposes 18 discrete button inputs. Each is a"," ",e.jsx(h,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," ","input with boolean state — pressed (",e.jsx("code",{children:"true"}),") or released (",e.jsx("code",{children:"false"}),"). Every button is an"," ",e.jsx(h,{to:"/api/input",children:e.jsx("code",{children:"Input<boolean>"})})," ","with the same event API: ",e.jsx("code",{children:'.on("press")'}),","," ",e.jsx("code",{children:'.on("release")'}),", ",e.jsx("code",{children:'.on("change")'}),"."]}),e.jsxs("p",{children:["The tables below show both ",e.jsx("code",{children:".state"})," and"," ",e.jsx("code",{children:".active"})," for each button. For boolean inputs these are identical — ",e.jsx("code",{children:".active"})," simply returns ",e.jsx("code",{children:".state"}),". For analog inputs like sticks and triggers, ",e.jsx("code",{children:".state"})," is the raw numeric value while ",e.jsx("code",{children:".active"})," is a derived boolean (e.g. whether the stick has moved past its deadzone)."]})]}),e.jsx(c,{children:"Face Buttons"}),e.jsx(p,{children:"Live State — press buttons on your controller"}),e.jsx(r,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",gap:24,width:"100%",alignItems:"center"},children:[e.jsx(r,{style:{flex:"0 0 auto",margin:0,minHeight:0},children:e.jsx(L,{})}),e.jsx("div",{style:{flex:1},children:e.jsx(W,{})})]})}),e.jsx(a,{code:`// Face buttons
controller.triangle.on("press", () => console.log("Triangle"));
controller.circle.on("press", () => console.log("Circle"));
controller.cross.on("press", () => console.log("Cross"));
controller.square.on("press", () => console.log("Square"));

// Synchronous read
if (controller.cross.active) {
  console.log("Cross is held down");
}`}),e.jsx(c,{children:"D-Pad"}),e.jsx(x,{children:e.jsxs("p",{children:["The D-Pad is a compound input with four directional sub-inputs. You can listen to the parent ",e.jsx("code",{children:"dpad"})," for any change, or subscribe to individual directions."]})}),e.jsxs(b,{children:["The D-Pad reports a single direction value, so opposing axes are mutually exclusive — you'll never see ",e.jsx("code",{children:"up"})," and"," ",e.jsx("code",{children:"down"})," (or ",e.jsx("code",{children:"left"})," and ",e.jsx("code",{children:"right"}),") active at the same time. Adjacent pairs like up + left are fine."]}),e.jsx(p,{children:"Live State"}),e.jsx(r,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",gap:24,width:"100%",alignItems:"center"},children:[e.jsx(r,{style:{flex:"0 0 auto",margin:0,minHeight:0},children:e.jsx(T,{})}),e.jsx("div",{style:{flex:1},children:e.jsx(J,{})})]})}),e.jsx(a,{code:`// Listen to all dpad changes
controller.dpad.on("change", (dpad) => {
  console.log(dpad.up.active, dpad.down.active,
              dpad.left.active, dpad.right.active);
});

// Or individual directions
controller.dpad.up.on("press", () => console.log("Up!"));`}),e.jsx(c,{children:"Utility Buttons"}),e.jsxs(b,{children:["Pressing the mute button always toggles the"," ",e.jsx(h,{to:"/outputs/mute-led",children:"mute LED"})," at the hardware level, regardless of any software configuration."]}),e.jsx(p,{children:"Live State"}),e.jsx(r,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",gap:24,width:"100%",alignItems:"center"},children:[e.jsxs(r,{style:{flex:"0 0 auto",margin:0,minHeight:0,flexDirection:"column",gap:8},children:[e.jsx(R,{}),e.jsxs("div",{style:{display:"flex",gap:16},children:[e.jsx(P,{}),e.jsx(F,{})]}),e.jsx(H,{})]}),e.jsx("div",{style:{flex:1},children:e.jsx(K,{})})]})}),e.jsx(a,{code:`// PlayStation button
controller.ps.on("press", () => console.log("PS button"));

// Create and Options
controller.create.on("press", () => console.log("Create"));
controller.options.on("press", () => console.log("Options"));

// Mute button (also controls the mute LED)
controller.mute.on("press", () => console.log("Mute toggled"));`}),e.jsx(c,{children:"Bumpers, Triggers & Stick Clicks"}),e.jsx(x,{children:e.jsxs("p",{children:["The bumpers (L1/R1), trigger buttons (L2/R2), and stick clicks (L3/R3) are all ",e.jsx("code",{children:"Momentary"})," inputs accessible as children of ",e.jsx("code",{children:".left"})," and ",e.jsx("code",{children:".right"}),"."]})}),e.jsx(b,{children:"The trigger buttons are independent hardware inputs that actuate at the top of the trigger pull — they are not derived from the analog pressure value."}),e.jsx(p,{children:"Live State"}),e.jsx(r,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",gap:24,width:"100%",alignItems:"center"},children:[e.jsxs(r,{style:{flex:"0 0 auto",margin:0,minHeight:0,gap:16},children:[e.jsx($,{}),e.jsx(E,{})]}),e.jsx("div",{style:{flex:1},children:e.jsx(Q,{})})]})}),e.jsx(a,{code:`controller.left.bumper.on("press", () => console.log("L1"));
controller.right.bumper.on("press", () => console.log("R1"));

// Trigger button (digital click at top of trigger pull)
controller.left.trigger.button.on("press", () => console.log("L2 click"));

// Stick clicks
controller.left.analog.button.on("press", () => console.log("L3"));
controller.right.analog.button.on("press", () => console.log("R3"));`}),e.jsx(c,{children:"Events"}),e.jsxs(x,{children:[e.jsxs("p",{children:["All button inputs share the same event API inherited from"," ",e.jsx(h,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})}),"."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Event"}),e.jsx("th",{children:"Fires when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"change"'})}),e.jsx("td",{children:"State transitions in either direction"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"press"'})}),e.jsxs("td",{children:["State becomes ",e.jsx("code",{children:"true"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"release"'})}),e.jsxs("td",{children:["State becomes ",e.jsx("code",{children:"false"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"input"'})}),e.jsx("td",{children:"Every HID report, regardless of whether the value changed"})]})]})]}),e.jsxs("p",{children:["All events support ",e.jsx("code",{children:".on()"})," for persistent listeners,"," ",e.jsx("code",{children:".once()"})," for single-fire callbacks, and"," ",e.jsx("code",{children:".promise()"})," for await-based flows."]})]}),e.jsx(a,{code:`controller.cross.on("press", () => console.log("Pressed"));
controller.cross.on("release", () => console.log("Released"));

// Fire once then stop listening
controller.triangle.once("press", () => console.log("First press"));

// Await the next press
await controller.square.promise("press");`})]});export{ne as default};
