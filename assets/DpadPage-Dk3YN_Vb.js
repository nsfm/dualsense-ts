import{j as e}from"./index-B3Vc337h.js";import{A as a,S as t,a as r}from"./ApiPage-D8x_ov17.js";import{C as n}from"./CodeBlock-C5O9LPzb.js";import"./Switch-BI-2z897.js";const s=()=>e.jsxs(a,{name:"Dpad",extends:"Input<Dpad>",description:"The directional pad with four Momentary sub-inputs. Fires change events when any direction changes.",source:"src/elements/dpad.ts",children:[e.jsx(t,{children:"Child Inputs"}),e.jsx(r,{properties:[{name:"up",type:"Momentary",description:"D-pad up",readonly:!0},{name:"down",type:"Momentary",description:"D-pad down",readonly:!0},{name:"left",type:"Momentary",description:"D-pad left",readonly:!0},{name:"right",type:"Momentary",description:"D-pad right",readonly:!0}]}),e.jsx(t,{children:"Properties"}),e.jsx(r,{properties:[{name:"active",type:"boolean",description:"True if any direction is pressed"}]}),e.jsx(t,{children:"Example"}),e.jsx(n,{code:`// Listen to all directions
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
controller.dpad.up.on("press", () => navigate("up"));`})]});export{s as default};
