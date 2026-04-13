import{j as e}from"./index-DwvD-yqT.js";import{A as c,S as o,a as t,P as n}from"./ApiPage-CMo1XAZA.js";import{a as r}from"./CodeBlock-CIY2ZnXU.js";const p=()=>e.jsxs(c,{name:"Touchpad",extends:"Input<Touchpad>",description:"Multi-touch surface supporting two simultaneous contact points and a clickable button.",source:"src/elements/touchpad.ts",children:[e.jsx(o,{children:"Child Inputs"}),e.jsx(t,{properties:[{name:"button",type:"Momentary",description:"Touchpad click (pressing down on the surface)",readonly:!0},{name:"left",type:"Touch",description:"Primary (first) touch point",readonly:!0},{name:"right",type:"Touch",description:"Secondary (second) touch point",readonly:!0}]}),e.jsx(o,{children:"Touch Class"}),e.jsx(n,{children:e.jsxs("p",{children:["Each touch point is a ",e.jsx("code",{children:"Touch"})," extending ",e.jsx("code",{children:"Analog"}),", so it has ",e.jsx("code",{children:"x"}),", ",e.jsx("code",{children:"y"}),", ",e.jsx("code",{children:"magnitude"}),", and"," ",e.jsx("code",{children:"direction"})," — plus touch-specific properties:"]})}),e.jsx(t,{properties:[{name:"x",type:"Axis",description:"Horizontal position on the touchpad surface"},{name:"y",type:"Axis",description:"Vertical position on the touchpad surface"},{name:"contact",type:"Momentary",description:"True when a finger is on the surface"},{name:"tracker",type:"Increment",description:"Finger identity counter — changes when a new finger touches"}]}),e.jsx(o,{children:"Example"}),e.jsx(r,{code:`// Track first touch point
controller.touchpad.left.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(\`Touch: x=\${touch.x.state} y=\${touch.y.state}\`);
  }
});

// Detect finger down/up
controller.touchpad.left.contact.on("press", () => console.log("Finger down"));
controller.touchpad.left.contact.on("release", () => console.log("Finger up"));

// Touchpad click
controller.touchpad.button.on("press", () => console.log("Clicked"));`})]});export{p as default};
