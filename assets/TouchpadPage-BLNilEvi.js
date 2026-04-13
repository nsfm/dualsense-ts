import{j as e,g as c,a as h,C as k,R as $,L as r}from"./index-GGWi0Ont.js";import{F as S,P as a,S as l,D,a as p,H as x}from"./FeaturePage-DywfdRev.js";import{T as C}from"./PlayerLedControls-DMvf0mZJ.js";import"./BatteryVisualization-5o0no79F.js";import{a as d}from"./CodeBlock-Dvv7tnEL.js";const m=c.div`
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
`,H=c.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,A=c.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,u=c.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,F=c.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,g=c.span`
  color: rgba(191, 204, 214, 0.3);
`,I=c.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 7ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,z=c.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  color: ${t=>t.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
  transition: color 0.06s;
`,E=c.div`
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
`,P=c.span`
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
`;function j(t){const n=t.toFixed(3);return t>=0?` ${n}`:n}const v=({data:t,even:n})=>{const o=t.label.split(".");return e.jsxs(H,{$even:n,children:[e.jsxs(E,{$tip:t.tooltip,children:[e.jsx(P,{children:"i"}),e.jsxs(F,{children:[e.jsx(g,{children:"controller."}),o.map((i,s)=>e.jsxs($.Fragment,{children:[s>0&&e.jsx(g,{children:"."}),s===o.length-1?i:e.jsx(g,{children:i})]},s))]})]}),e.jsx(I,{$highlight:t.highlight,children:t.state}),e.jsx(z,{$active:t.active,children:t.active?"true":"false"})]})};function y(){const n=h.useContext(k).touchpad,[,o]=h.useState(0);return h.useEffect(()=>{const i=()=>o(s=>s+1);return n.on("change",i),()=>{n.removeListener("change",i)}},[n]),n}const L=()=>{const t=y(),n={label:"touchpad.button",tooltip:"Clickable button — pressing down on the touchpad surface.",state:t.button.active?"true":"false",active:t.button.active,highlight:t.button.active};return e.jsx(v,{data:n,even:!1})},R=({side:t})=>{const o=y()[t],i=t==="left"?"1":"2",s=[{label:`touchpad.${t}.contact`,tooltip:`True when ${t==="left"?"a finger":"a second finger"} is touching the touchpad.`,state:o.contact.active?"true":"false",active:o.contact.active,highlight:o.contact.active},{label:`touchpad.${t}.x.state`,tooltip:`Horizontal position of touch ${i}. -1 (left edge) to 1 (right edge).`,state:j(o.x.state),active:o.contact.active,highlight:o.contact.active},{label:`touchpad.${t}.y.state`,tooltip:`Vertical position of touch ${i}. -1 (top edge) to 1 (bottom edge).`,state:j(o.y.state),active:o.contact.active,highlight:o.contact.active},{label:`touchpad.${t}.tracker`,tooltip:`Finger identity tracker${t==="right"?" for the second touch point":""}. Increments when a new finger touches down, allowing you to distinguish between different touch gestures.`,state:String(o.tracker.state),active:o.contact.active,highlight:o.contact.active}];return e.jsx(e.Fragment,{children:s.map((f,T)=>e.jsx(v,{data:f,even:T%2===1},f.label))})},w=()=>e.jsxs(A,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(u,{style:{flex:1},children:"property"}),e.jsx(u,{style:{flexShrink:0,width:"7ch",textAlign:"right"},children:"value"}),e.jsx(u,{style:{flexShrink:0,width:"5ch"},children:"active"})]}),B=()=>e.jsxs(m,{children:[e.jsx(w,{}),e.jsx(L,{})]}),b=({side:t})=>e.jsxs(m,{children:[e.jsx(w,{}),e.jsx(R,{side:t})]}),O=()=>e.jsxs(S,{title:"Touchpad",subtitle:"Multi-touch surface with two independent contact points and a click button.",children:[e.jsx(a,{children:e.jsxs("p",{children:["The DualSense touchpad is a"," ",e.jsx(r,{to:"/api/touchpad",children:e.jsx("code",{children:"Touchpad"})})," input with two independent"," ",e.jsx(r,{to:"/api/touch",children:e.jsx("code",{children:"Touch"})})," contact points (",e.jsx("code",{children:".left"})," and ",e.jsx("code",{children:".right"}),") and a clickable"," ",e.jsx(r,{to:"/api/momentary",children:e.jsx("code",{children:".button"})}),". Each touch point extends"," ",e.jsx(r,{to:"/api/analog",children:e.jsx("code",{children:"Analog"})}),", giving it"," ",e.jsx("code",{children:".x"})," and ",e.jsx("code",{children:".y"})," ",e.jsx(r,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})," values plus a"," ",e.jsx("code",{children:".contact"})," boolean and a ",e.jsx("code",{children:".tracker"})," for finger identity. Since each touch point inherits from Analog, you also have access to ",e.jsx("code",{children:".magnitude"})," and ",e.jsx("code",{children:".direction"})," ","for polar coordinate tracking — useful for radial gestures."]})}),e.jsx(l,{children:"Live State"}),e.jsx(D,{children:"Touch the touchpad — use two fingers for multi-touch"}),e.jsx(p,{children:e.jsx(C,{})}),e.jsx(p,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(B,{})}),e.jsx(p,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsxs("div",{style:{display:"flex",flexWrap:"wrap",gap:16,width:"100%"},children:[e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(b,{side:"left"})}),e.jsx("div",{style:{flex:"1 1 280px",minWidth:0},children:e.jsx(b,{side:"right"})})]})}),e.jsx(l,{children:"Touch Points"}),e.jsx(a,{children:e.jsxs("p",{children:["Each touch point reports ",e.jsx("code",{children:".x"})," (-1 to 1, left to right) and ",e.jsx("code",{children:".y"})," (-1 to 1, top to bottom) coordinates, plus a"," ",e.jsx("code",{children:".contact"})," boolean indicating whether a finger is on the surface. The ",e.jsx("code",{children:".tracker"})," is an incrementing ID that changes when a new finger touches down, letting you distinguish separate touch gestures."]})}),e.jsxs(x,{children:['The "left" and "right" labels refer to the first and second touch points in the HID report, not physical sides of the touchpad. A single finger always registers as ',e.jsx("code",{children:".left"})," regardless of where it touches."]}),e.jsx(x,{children:"Some platforms register the DualSense touchpad as a mouse input device. This can cause unwanted cursor movement and needs to be disabled at the system level (e.g. Steam Input, DS4Windows, or your OS gamepad settings)."}),e.jsxs(x,{children:["The ",e.jsx("code",{children:".tracker"})," value is provided by the controller firmware, not computed by the library. It overflows at 128 back to 0."]}),e.jsx(d,{code:`// First touch point (single-finger)
controller.touchpad.left.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});

// Second touch point (multi-touch)
controller.touchpad.right.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch 2: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});`}),e.jsx(l,{children:"Contact Detection"}),e.jsx(a,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:".contact"})," property on each touch point is a"," ",e.jsx(r,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," input that supports ",e.jsx("code",{children:'"press"'})," and ",e.jsx("code",{children:'"release"'})," events for detecting when fingers touch down or lift off."]})}),e.jsx(d,{code:`controller.touchpad.left.contact.on("press", () => {
  console.log("Finger touched");
});

controller.touchpad.left.contact.on("release", () => {
  console.log("Finger lifted");
});

// Await the next touch
await controller.touchpad.left.contact.promise("press");`}),e.jsx(l,{children:"Touchpad Button"}),e.jsx(a,{children:e.jsxs("p",{children:["The entire touchpad surface is a clickable"," ",e.jsx(r,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," button, independent of the touch contact state."]})}),e.jsx(d,{code:`controller.touchpad.button.on("press", () => {
  console.log("Touchpad clicked");
});`}),e.jsx(l,{children:"Listening to All Changes"}),e.jsx(a,{children:e.jsxs("p",{children:["The parent ",e.jsx("code",{children:"touchpad"})," input fires ",e.jsx("code",{children:'"change"'})," ","on any child change — touch positions, contacts, or button."]})}),e.jsx(d,{code:`controller.touchpad.on("change", (tp) => {
  const t1 = tp.left;
  const t2 = tp.right;

  if (t1.contact.active) {
    console.log(\`Touch 1: \${t1.x.state}, \${t1.y.state}\`);
  }
  if (t2.contact.active) {
    console.log(\`Touch 2: \${t2.x.state}, \${t2.y.state}\`);
  }
});`}),e.jsx(l,{children:"Events"}),e.jsxs(a,{children:[e.jsxs("p",{children:["Touch inputs fire events at HID report rate. The ",e.jsx("code",{children:".contact"})," ","and ",e.jsx("code",{children:".button"})," sub-inputs also support"," ",e.jsx("code",{children:'"press"'})," and ",e.jsx("code",{children:'"release"'}),"."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Event"}),e.jsx("th",{children:"Fires when"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"change"'})}),e.jsx("td",{children:"Any touch position, contact, or button state changes"})]}),e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:'"press"'})," / ",e.jsx("code",{children:'"release"'})]}),e.jsx("td",{children:"Contact begins / ends, or button click"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:'"input"'})}),e.jsx("td",{children:"Every HID report, regardless of change"})]})]})]}),e.jsxs("p",{children:["All events support ",e.jsx("code",{children:".on()"})," for persistent listeners,"," ",e.jsx("code",{children:".once()"})," for single-fire callbacks, and"," ",e.jsx("code",{children:".promise()"})," for await-based flows."]})]}),e.jsx(d,{code:`// Detect swipe gesture with contact tracking
controller.touchpad.left.contact.on("press", () => {
  const startX = controller.touchpad.left.x.state;
  controller.touchpad.left.contact.once("release", () => {
    const delta = controller.touchpad.left.x.state - startX;
    if (Math.abs(delta) > 0.3) {
      console.log(delta > 0 ? "Swipe right" : "Swipe left");
    }
  });
});`})]});export{O as default};
