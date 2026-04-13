import{j as e}from"./index-DwvD-yqT.js";import{A as o,S as t,a as n}from"./ApiPage-CMo1XAZA.js";import{a as i}from"./CodeBlock-CIY2ZnXU.js";const c=()=>e.jsxs(o,{name:"Analog",extends:"Input<Analog>",description:"A two-axis thumbstick with X/Y position, computed magnitude and direction, deadzone, and a click button.",source:"src/elements/analog.ts",children:[e.jsx(t,{children:"Child Inputs"}),e.jsx(n,{properties:[{name:"x",type:"Axis",description:"Horizontal axis: -1 (left) to 1 (right)",readonly:!0},{name:"y",type:"Axis",description:"Vertical axis: -1 (up) to 1 (down)",readonly:!0},{name:"button",type:"Momentary",description:"Stick click (L3/R3)",readonly:!0}]}),e.jsx(t,{children:"Computed Properties"}),e.jsx(n,{properties:[{name:"active",type:"boolean",description:"True if stick is moved or button is pressed"},{name:"magnitude",type:"Magnitude",description:"Distance from center, 0 (centered) to 1 (full tilt)"},{name:"force",type:"Force",description:"Hypotenuse of x/y forces"},{name:"direction",type:"Radians",description:"Angle from center in radians (same as radians, angle)"},{name:"degrees",type:"Degrees",description:"Angle from center in degrees 0–360"},{name:"deadzone",type:"Magnitude",description:"Stick deadzone — applies to both axes (default: 0)"}]}),e.jsx(t,{children:"Vector"}),e.jsx(i,{code:"const { direction, magnitude } = controller.left.analog.vector;\nconsole.log(`Angle: ${direction} rad, Strength: ${magnitude}`);"}),e.jsx(t,{children:"Example"}),e.jsx(i,{code:`controller.left.analog.on("change", (stick) => {
  if (stick.magnitude > 0.5) {
    moveCharacter(stick.direction, stick.magnitude);
  }
});

// Stick click
controller.left.analog.button.on("press", () => {
  sprint();
});`})]});export{c as default};
