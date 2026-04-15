import{j as e,L as s}from"./index-l8CS40p9.js";import{F as o,P as r,S as t}from"./FeaturePage-DbpfBqym.js";import{a as n}from"./CodeBlock-DSZTVETd.js";const a=()=>e.jsxs(o,{title:"Inputs",subtitle:"Every input on the DualSense controller is accessible through a unified API.",children:[e.jsx(r,{children:e.jsxs("p",{children:["The"," ",e.jsx(s,{to:"/api/input",children:e.jsx("code",{children:"Input<T>"})})," base class provides a consistent interface across all controller inputs. Whether you're reading a"," ",e.jsx(s,{to:"/inputs/buttons",children:"button"}),","," ",e.jsx(s,{to:"/inputs/triggers",children:"trigger"}),","," ",e.jsx(s,{to:"/inputs/analog",children:"analog stick"}),","," ",e.jsx(s,{to:"/inputs/touchpad",children:"touchpad"}),","," ",e.jsx(s,{to:"/inputs/motion",children:"motion sensor"}),", or"," ",e.jsx(s,{to:"/inputs/battery",children:"battery level"}),", the same four access patterns are available."]})}),e.jsx(t,{children:"Synchronous Reads"}),e.jsx(r,{children:e.jsx("p",{children:"Read the current value at any time. When the controller is disconnected, all inputs reset to their neutral state."})}),e.jsx(n,{code:`// Boolean inputs
controller.cross.state;     // true | false
controller.cross.active;    // true when pressed

// Pressure / axis inputs
controller.left.trigger.state;      // 0 to 1
controller.left.analog.x.state;     // -1 to 1`}),e.jsx(t,{children:"Event Callbacks"}),e.jsx(r,{children:e.jsxs("p",{children:["Subscribe to changes with familiar EventEmitter syntax. Every input emits ",e.jsx("code",{children:"change"}),", ",e.jsx("code",{children:"input"}),", ",e.jsx("code",{children:"press"}),", and ",e.jsx("code",{children:"release"})," events."]})}),e.jsx(n,{code:`// Fires when the value changes
controller.cross.on("change", (button) => {
  console.log(button.state);
});

// Shorthand for specific transitions
controller.cross.on("press", () => console.log("Pressed!"));
controller.cross.on("release", () => console.log("Released!"));

// Remove a listener
const handler = ({ state }) => console.log(state);
controller.cross.on("change", handler);
controller.cross.off("change", handler);`}),e.jsx(r,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"input"})," event fires on every HID report, even when the value hasn't changed — the controller may send over 250 reports per second, so use this sparingly."]})}),e.jsx(t,{children:"Promises"}),e.jsx(r,{children:e.jsxs("p",{children:["Wait for a specific event using ",e.jsx("code",{children:"promise()"}),". Useful for one-shot interactions or sequential logic."]})}),e.jsx(n,{code:`// Wait for the user to press cross
await controller.cross.promise("press");
console.log("Cross pressed!");

// Wait for any input at all
await controller.promise();`}),e.jsx(t,{children:"Async Iterators"}),e.jsx(r,{children:e.jsx("p",{children:"Each input is an async iterable that yields on every state change."})}),e.jsx(n,{code:`for await (const cross of controller.cross) {
  console.log(cross.state ? "pressed" : "released");
}

for await (const trigger of controller.left.trigger) {
  console.log(\`Pressure: \${trigger.state}\`);
}`}),e.jsx(t,{children:"Nested Inputs"}),e.jsx(r,{children:e.jsxs("p",{children:["Compound inputs like"," ",e.jsx(s,{to:"/api/unisense",children:e.jsx("code",{children:"Unisense"})})," (left/right halves), ",e.jsx(s,{to:"/api/dpad",children:e.jsx("code",{children:"Dpad"})}),","," ",e.jsx(s,{to:"/api/touchpad",children:e.jsx("code",{children:"Touchpad"})}),", and"," ",e.jsx(s,{to:"/api/battery",children:e.jsx("code",{children:"Battery"})})," contain sub-inputs. You can subscribe at any level — changes in children propagate upward."]})}),e.jsx(n,{code:`// Listen to all left-side inputs at once
controller.left.on("change", (left) => {
  console.log(left.trigger.state, left.analog.x.state);
});

// Or target a specific sub-input
controller.left.trigger.on("change", (trigger) => {
  console.log(trigger.state);
});`}),e.jsx(t,{children:"Input Types"}),e.jsxs(r,{children:[e.jsx("p",{children:"Different controller features use specialized input subclasses:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Class"}),e.jsx("th",{children:"State"}),e.jsx("th",{children:"Used by"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(s,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})}),e.jsx("td",{children:"Face buttons, bumpers, d-pad, touchpad button"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(s,{to:"/api/trigger",children:e.jsx("code",{children:"Trigger"})})}),e.jsx("td",{children:e.jsx("code",{children:"0–1"})}),e.jsx("td",{children:"L2, R2"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(s,{to:"/api/axis",children:e.jsx("code",{children:"Axis"})})}),e.jsx("td",{children:e.jsx("code",{children:"-1–1"})}),e.jsx("td",{children:"Stick axes, gyroscope, accelerometer"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(s,{to:"/api/analog",children:e.jsx("code",{children:"Analog"})})}),e.jsx("td",{children:e.jsx("code",{children:"x, y"})}),e.jsx("td",{children:"Analog sticks, touch points"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(s,{to:"/api/battery",children:e.jsx("code",{children:"Battery"})})}),e.jsx("td",{children:e.jsx("code",{children:"level, status"})}),e.jsx("td",{children:"Battery monitoring"})]})]})]}),e.jsxs("p",{children:["See the ",e.jsx(s,{to:"/api",children:"API reference"})," for the full class hierarchy."]})]})]});export{a as default};
