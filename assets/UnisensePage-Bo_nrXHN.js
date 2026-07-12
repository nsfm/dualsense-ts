import{j as e}from"./index-B3Vc337h.js";import{A as r,S as t,a as o,M as n}from"./ApiPage-D8x_ov17.js";import{C as s}from"./CodeBlock-C5O9LPzb.js";import"./Switch-BI-2z897.js";const d=()=>e.jsxs(r,{name:"Unisense",extends:"Input<Unisense>",description:"Groups one side of the controller: analog stick, trigger, bumper, and rumble motor. Accessed as controller.left and controller.right.",source:"src/elements/unisense.ts",children:[e.jsx(t,{children:"Child Inputs"}),e.jsx(o,{properties:[{name:"trigger",type:"Trigger",description:"L2/R2 pressure-sensitive trigger with adaptive feedback",readonly:!0},{name:"bumper",type:"Momentary",description:"L1/R1 bumper button",readonly:!0},{name:"analog",type:"Analog",description:"Thumbstick with X/Y axes and click",readonly:!0}]}),e.jsx(t,{children:"Methods"}),e.jsx(n,{methods:[{name:"rumble",signature:"rumble(intensity?: Intensity | boolean): Intensity",description:"Get or set rumble motor intensity. 0–1 numeric, or boolean (true = 1, false = 0)."}]}),e.jsx(t,{children:"Example"}),e.jsx(s,{code:`// Set rumble on left motor (heavy)
controller.left.rumble(0.8);

// Right motor (light)
controller.right.rumble(0.3);

// Listen to any left-side input
controller.left.on("change", (side) => {
  console.log("Left side changed");
  console.log("Trigger:", side.trigger.state);
  console.log("Bumper:", side.bumper.active);
  console.log("Stick:", side.analog.magnitude);
});`})]});export{d as default};
