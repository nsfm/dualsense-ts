import{j as e,g as o,a as l,C as z,R as $,L as f}from"./index-BuZC7I-2.js";import{F,P as g,S as p,D as v,a as j,H as y}from"./FeaturePage-Db3oQNj0.js";import"./PlayerLedControls-DxuOl3FP.js";import{R as H,a as T}from"./RightStick-DrlP6J5z.js";import"./BatteryVisualization-DPA9NqDh.js";import{a as m}from"./CodeBlock-68dk7iDt.js";const S=o.div`
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
`,E=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,C=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,h=o.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,P=o.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,x=o.span`
  color: rgba(191, 204, 214, 0.3);
`,I=o.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,L=o.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`;function u(t){const i=t.toFixed(3);return t>=0?` ${i}`:i}function W(t){return t.toFixed(3)}function q(t){return`${t.toFixed(1)}°`}function N(t){const[,i]=l.useState(0);return l.useEffect(()=>{const a=()=>i(n=>n+1);return t.on("change",a),()=>{t.removeListener("change",a)}},[t]),t}const U=o.div`
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
`,V=o.span`
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
`,M=({data:t,even:i})=>{const a=t.label.split(".");return e.jsxs(E,{$even:i,children:[e.jsxs(U,{$tip:t.tooltip,children:[e.jsx(V,{children:"i"}),e.jsxs(P,{children:[e.jsx(x,{children:"controller."}),a.map((n,d)=>e.jsxs($.Fragment,{children:[d>0&&e.jsx(x,{children:"."}),d===a.length-1?n:e.jsx(x,{children:n})]},d))]})]}),e.jsx(I,{$highlight:t.highlight,children:t.state}),e.jsx(L,{$active:t.active,children:t.active?"true":"false"})]})},B=({prefix:t,selector:i})=>{const a=l.useContext(z),n=i(a);N(n);const d=[{label:`${t}.x.state`,tooltip:"Raw horizontal axis position. -1 (left) to 1 (right). No deadzone applied.",state:u(n.x.state),active:n.x.active,highlight:n.x.state!==0},{label:`${t}.x.force`,tooltip:"Horizontal position with deadzone applied. Returns 0 when inside the axis deadzone.",state:u(n.x.force),active:n.x.active,highlight:n.x.force!==0},{label:`${t}.y.state`,tooltip:"Raw vertical axis position. -1 (up) to 1 (down). No deadzone applied.",state:u(n.y.state),active:n.y.active,highlight:n.y.state!==0},{label:`${t}.y.force`,tooltip:"Vertical position with deadzone applied. Returns 0 when inside the axis deadzone.",state:u(n.y.force),active:n.y.active,highlight:n.y.force!==0},{label:`${t}.magnitude`,tooltip:"Distance from center (0 to 1), deadzone-normalized. Computed from x.force and y.force, then scaled by the stick deadzone.",state:W(n.magnitude),active:n.magnitude>0,highlight:n.magnitude>0},{label:`${t}.direction`,tooltip:"Angle of the stick in degrees. Computed from x.force and y.force via atan2.",state:q(n.degrees),active:n.magnitude>0,highlight:n.magnitude>0},{label:`${t}.active`,tooltip:"True when magnitude > 0 or the stick button is pressed.",state:n.active?"true":"false",active:n.active,highlight:n.active},{label:`${t}.button`,tooltip:"Stick click (L3/R3). Independent digital input.",state:n.button.active?"true":"false",active:n.button.active,highlight:n.button.active}];return e.jsx(e.Fragment,{children:d.map((s,c)=>e.jsx(M,{data:s,even:c%2===1},s.label))})},G=o.input`
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
`,X=o.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,Y=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
`,J=o.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,O=o.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: rgba(191, 204, 214, 0.5);
`,b=({label:t,value:i,onChange:a,even:n})=>{const d=t.split(".");return e.jsxs(X,{$even:n,children:[e.jsxs(Y,{children:[e.jsxs(J,{children:[e.jsx(x,{children:"controller."}),d.map((s,c)=>e.jsxs($.Fragment,{children:[c>0&&e.jsx(x,{children:"."}),c===d.length-1?s:e.jsx(x,{children:s})]},c))]}),e.jsx(O,{children:i.toFixed(3)})]}),e.jsx(G,{type:"range",min:0,max:.2,step:.001,value:i,onChange:s=>a(parseFloat(s.target.value))})]})},K=({prefix:t,selector:i})=>{const a=l.useContext(z),n=i(a),[,d]=l.useState(0),s=l.useCallback(()=>d(r=>r+1),[]),c=l.useRef({deadzone:n.deadzone,xDeadzone:n.x.deadzone,yDeadzone:n.y.deadzone});l.useEffect(()=>{const r=c.current;return()=>{n.deadzone=r.deadzone,n.x.deadzone=r.xDeadzone,n.y.deadzone=r.yDeadzone}},[n]);const D=l.useCallback(r=>{n.deadzone=r,s()},[n,s]),A=l.useCallback(r=>{n.x.deadzone=r,s()},[n,s]),R=l.useCallback(r=>{n.y.deadzone=r,s()},[n,s]);return e.jsxs(e.Fragment,{children:[e.jsx(b,{label:`${t}.deadzone`,value:n.deadzone,onChange:D,even:!1}),e.jsx(b,{label:`${t}.x.deadzone`,value:n.x.deadzone,onChange:A,even:!0}),e.jsx(b,{label:`${t}.y.deadzone`,value:n.y.deadzone,onChange:R,even:!1})]})},Q=()=>e.jsxs(C,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(h,{style:{flex:1},children:"property"}),e.jsx(h,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(h,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),Z=()=>e.jsxs(C,{children:[e.jsx(h,{style:{flexShrink:0},children:"config"}),e.jsx(h,{style:{flex:1}}),e.jsx(h,{style:{flexShrink:0,width:"5ch",textAlign:"right"},children:"value"})]}),w=({prefix:t,selector:i})=>e.jsxs(S,{children:[e.jsx(Q,{}),e.jsx(B,{prefix:t,selector:i})]}),k=({prefix:t,selector:i})=>e.jsxs(S,{children:[e.jsx(Z,{}),e.jsx(K,{prefix:t,selector:i})]}),se=()=>e.jsxs(F,{title:"Analog Sticks",subtitle:"Two thumbsticks with X/Y axes, magnitude, direction, and click.",children:[e.jsxs(g,{children:[e.jsxs("p",{children:["Each analog stick is an"," ",e.jsx(f,{to:"/api/analog",children:e.jsx("code",{children:"Analog"})})," input containing two"," ",e.jsx(f,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})," sub-inputs (",e.jsx("code",{children:".x"})," and ",e.jsx("code",{children:".y"}),"), plus computed"," ",e.jsx("code",{children:".magnitude"})," and ",e.jsx("code",{children:".direction"})," values. The sticks also have a click button (",e.jsx(f,{to:"/inputs/buttons",children:"L3/R3"}),") accessible as ",e.jsx("code",{children:".button"}),"."]}),e.jsxs("p",{children:["Unlike buttons where ",e.jsx("code",{children:".state"})," and ",e.jsx("code",{children:".active"})," are identical, here they diverge: ",e.jsx("code",{children:".x.state"})," is the raw axis position (-1 to 1), while ",e.jsx("code",{children:".x.active"})," is"," ",e.jsx("code",{children:"true"})," only when the axis exceeds its"," ",e.jsx("code",{children:".deadzone"}),". The top-level ",e.jsx("code",{children:".active"})," is"," ",e.jsx("code",{children:"true"})," when the stick has moved past its deadzone or the button is pressed."]})]}),e.jsx(p,{children:"Live State"}),e.jsx(v,{children:"Move your analog sticks"}),e.jsxs(j,{style:{gap:48},children:[e.jsx(H,{}),e.jsx(T,{})]}),e.jsx(j,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(w,{prefix:"left.analog",selector:t=>t.left.analog})}),e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(w,{prefix:"right.analog",selector:t=>t.right.analog})})]})}),e.jsx(p,{children:"Configuration"}),e.jsx(g,{children:e.jsxs("p",{children:["Each stick and its axes have configurable ",e.jsx("code",{children:".deadzone"})," and"," ",e.jsx("code",{children:".threshold"})," values. The deadzone suppresses small inputs near the center position. The threshold controls the minimum change required to emit a ",e.jsx("code",{children:'"change"'})," event."]})}),e.jsxs(y,{children:[e.jsx("code",{children:".x.state"})," and ",e.jsx("code",{children:".y.state"})," are raw axis values with no deadzone applied. Physical sticks rarely return to exactly 0,0 at rest and will fluctuate slightly. Prefer"," ",e.jsx("code",{children:".magnitude"})," and ",e.jsx("code",{children:".direction"})," for movement, or check ",e.jsx("code",{children:".active"})," before reading — these respect the deadzone setting."]}),e.jsx(v,{children:"Adjust deadzone — watch the state table above respond"}),e.jsx(j,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(k,{prefix:"left.analog",selector:t=>t.left.analog})}),e.jsx("div",{style:{flex:"1 1 320px",minWidth:0},children:e.jsx(k,{prefix:"right.analog",selector:t=>t.right.analog})})]})}),e.jsx(g,{children:e.jsxs("p",{children:["Deadzones operate at two levels. Per-axis deadzones (",e.jsx("code",{children:".x.deadzone"}),", ",e.jsx("code",{children:".y.deadzone"}),") zero out ",e.jsx("code",{children:".x.force"})," and ",e.jsx("code",{children:".y.force"})," independently. The top-level ",e.jsx("code",{children:".deadzone"})," then applies to the combined magnitude — ",e.jsx("code",{children:".magnitude"})," and ",e.jsx("code",{children:".active"})," won't register until the stick moves past both thresholds. The two levels stack rather than override each other."]})}),e.jsx(m,{code:`// Ignore small stick movements near center
controller.left.analog.deadzone = 0.1;

// Per-axis deadzone
controller.left.analog.x.deadzone = 0.08;
controller.left.analog.y.deadzone = 0.08;

// Minimum change to trigger a "change" event
controller.left.analog.x.threshold = 0.01;`}),e.jsx(p,{children:"Synchronous API"}),e.jsx(g,{children:e.jsxs("p",{children:["The recommended approach for most use cases. Read stick values directly in your game loop or ",e.jsx("code",{children:"requestAnimationFrame"})," ","callback."]})}),e.jsx(y,{children:"Analog sticks report at a high frequency. For most use cases — game loops, animation frames, UI updates — reading the values synchronously is simpler and more efficient than subscribing to events."}),e.jsx(m,{code:`// In a game loop or animation frame
const { x, y } = controller.left.analog;
player.velocity.x = x.state;  // -1 (left) to 1 (right)
player.velocity.y = y.state;  // -1 (up) to 1 (down)

// Polar coordinates
const speed = controller.left.analog.magnitude;  // 0 to 1
const angle = controller.left.analog.direction;  // radians

// Degrees if you prefer
const deg = controller.left.analog.degrees;`}),e.jsx(p,{children:"Events"}),e.jsxs(g,{children:[e.jsx("p",{children:"Event subscriptions are available but fire at HID report rate (~250Hz), so they're best suited for triggering discrete actions rather than continuous reads."}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Event"}),e.jsx("th",{children:"Fires when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"change"'})}),e.jsx("td",{children:"Any axis value changes (subject to threshold)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"input"'})}),e.jsx("td",{children:"Every HID report, regardless of change"})]})]})]}),e.jsxs("p",{children:["All events support ",e.jsx("code",{children:".on()"})," for persistent listeners,"," ",e.jsx("code",{children:".once()"})," for single-fire callbacks, and"," ",e.jsx("code",{children:".promise()"})," for await-based flows."]})]}),e.jsx(m,{code:`// Event-driven (high frequency — use sparingly)
controller.left.analog.on("change", (stick) => {
  console.log(\`x=\${stick.x.state} y=\${stick.y.state}\`);
});

// Await the next change
const stick = await controller.left.analog.promise("change");
console.log(stick.magnitude);`})]});export{se as default};
