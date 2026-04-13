import{j as e}from"./index-BSVR9c3C.js";import{A as t,S as r,a as s,M as a}from"./ApiPage-CxsK_r0Y.js";import{a as o}from"./CodeBlock-Dg4PHzNE.js";const c=()=>e.jsxs(t,{name:"Lightbar",description:"RGB LED strip on the front edge of the controller. Set colors directly or use fade effects.",source:"src/elements/lightbar.ts",children:[e.jsx(r,{children:"Properties"}),e.jsx(s,{properties:[{name:"color",type:"RGB",description:"Current color as { r, g, b } with values 0–255"}]}),e.jsx(r,{children:"Methods"}),e.jsx(a,{methods:[{name:"set",signature:"set(color: RGB): void",description:"Set the lightbar to an RGB color. Values are clamped to 0–255."},{name:"fadeBlue",signature:"fadeBlue(): void",description:"Smooth fade transition to Sony blue."},{name:"fadeOut",signature:"fadeOut(): void",description:"Smooth fade to black, then restore."}]}),e.jsx(r,{children:"RGB Type"}),e.jsx(o,{code:`interface RGB {
  r: number;  // 0–255
  g: number;  // 0–255
  b: number;  // 0–255
}`}),e.jsx(r,{children:"Example"}),e.jsx(o,{code:`// Solid red
controller.lightbar.set({ r: 255, g: 0, b: 0 });

// Read current color
const { r, g, b } = controller.lightbar.color;

// Fade effect
controller.lightbar.fadeBlue();`})]});export{c as default};
