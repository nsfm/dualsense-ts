import{j as e}from"./index-DwvD-yqT.js";import{A as s,S as o,a as r}from"./ApiPage-CMo1XAZA.js";import{a as t}from"./CodeBlock-CIY2ZnXU.js";const c=()=>e.jsxs(s,{name:"Gyroscope",extends:"Input<Gyroscope>",description:"3-axis angular velocity sensor measuring rotation rate on the X (pitch), Y (roll), and Z (yaw) axes.",source:"src/elements/gyroscope.ts",children:[e.jsx(o,{children:"Child Inputs"}),e.jsx(r,{properties:[{name:"x",type:"Axis",description:"Pitch — rotation around the X axis",readonly:!0},{name:"y",type:"Axis",description:"Roll — rotation around the Y axis",readonly:!0},{name:"z",type:"Axis",description:"Yaw — rotation around the Z axis",readonly:!0}]}),e.jsx(o,{children:"Properties"}),e.jsx(r,{properties:[{name:"active",type:"false",description:"Always false — motion sensors report continuously, not discretely"}]}),e.jsx(o,{children:"Example"}),e.jsx(t,{code:`controller.gyroscope.on("change", (gyro) => {
  updateOrientation(gyro.x.force, gyro.y.force, gyro.z.force);
});

// Individual axis
controller.gyroscope.z.on("change", (axis) => {
  console.log(\`Yaw rate: \${axis.force}\`);
});`})]});export{c as default};
