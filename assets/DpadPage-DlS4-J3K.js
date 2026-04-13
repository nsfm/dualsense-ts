import{j as e}from"./index-BuZC7I-2.js";import{A as r,S as t,a}from"./ApiPage-s5d_KP1M.js";import{a as n}from"./CodeBlock-68dk7iDt.js";const p=()=>e.jsxs(r,{name:"Dpad",extends:"Input<Dpad>",description:"The directional pad with four Momentary sub-inputs. Fires change events when any direction changes.",source:"src/elements/dpad.ts",children:[e.jsx(t,{children:"Child Inputs"}),e.jsx(a,{properties:[{name:"up",type:"Momentary",description:"D-pad up",readonly:!0},{name:"down",type:"Momentary",description:"D-pad down",readonly:!0},{name:"left",type:"Momentary",description:"D-pad left",readonly:!0},{name:"right",type:"Momentary",description:"D-pad right",readonly:!0}]}),e.jsx(t,{children:"Properties"}),e.jsx(a,{properties:[{name:"active",type:"boolean",description:"True if any direction is pressed"}]}),e.jsx(t,{children:"Example"}),e.jsx(n,{code:`// Listen to all directions
controller.dpad.on("change", (dpad) => {
  const dirs = [
    dpad.up.active && "up",
    dpad.down.active && "down",
    dpad.left.active && "left",
    dpad.right.active && "right",
  ].filter(Boolean);
  console.log("D-pad:", dirs.join("+") || "neutral");
});

// Or individual directions
controller.dpad.up.on("press", () => navigate("up"));`})]});export{p as default};
