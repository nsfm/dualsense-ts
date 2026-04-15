import{j as e}from"./index-l8CS40p9.js";import{A as o,P as t,S as n,a as r,M as a}from"./ApiPage-KfA7eOI8.js";import{a as s}from"./CodeBlock-DSZTVETd.js";const p=()=>e.jsxs(o,{name:"Input<T>",description:"Abstract base class for all inputs. Provides a consistent event API, async iteration, and composability.",source:"src/input.ts",children:[e.jsx(t,{children:e.jsxs("p",{children:["Every readable value on the controller extends ",e.jsx("code",{children:"Input"}),". This means buttons, axes, the touchpad, battery, and even the controller itself all share the same event interface. You never need to learn a different API for different input types."]})}),e.jsx(n,{children:"Properties"}),e.jsx(r,{properties:[{name:"state",type:"T",description:"The current value of this input (boolean, number, or compound type)"},{name:"active",type:"boolean",description:"True if the input is currently in an active state"},{name:"id",type:"InputId",description:"Identifier enum for this input"},{name:"threshold",type:"number",description:"Minimum change amount to trigger events (default: 0)"},{name:"deadzone",type:"number",description:"Minimum absolute value to register as active (default: 0)"}]}),e.jsx(n,{children:"Event Methods"}),e.jsx(a,{methods:[{name:"on",signature:'on(event: "change" | "press" | "release" | "input", callback): this',description:"Subscribe to events. Returns this for chaining."},{name:"once",signature:'once(event: "change" | "press" | "release", callback): this',description:"Subscribe to a single occurrence, then auto-remove."},{name:"off",signature:"off(event, callback): this",description:"Remove a listener."},{name:"removeAllListeners",signature:"removeAllListeners(event?): this",description:"Remove all listeners, optionally filtered by event type."}]}),e.jsx(n,{children:"Event Types"}),e.jsx(r,{properties:[{name:'"change"',type:"InputChangeType",description:"Fires when the input value changes (any direction)"},{name:'"press"',type:"InputChangeType",description:"Fires when the input becomes active (button down, axis moves)"},{name:'"release"',type:"InputChangeType",description:"Fires when the input becomes inactive (button up, axis returns)"},{name:'"input"',type:"InputEventType",description:"Fires on every HID report, even if the value hasn't changed"}]}),e.jsx(n,{children:"Four Ways to Read"}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"1. Synchronous read"})," — poll the current value:"]})}),e.jsx(s,{code:`if (controller.cross.active) {
  console.log("Cross is held down");
}
const pressure = controller.left.trigger.state; // 0.0–1.0`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"2. Event callbacks"})," — subscribe to changes:"]})}),e.jsx(s,{code:`controller.cross.on("press", () => console.log("pressed"));
controller.cross.on("release", () => console.log("released"));
controller.cross.on("change", (btn) => console.log(btn.active));`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"3. Promises"})," — wait for a single event:"]})}),e.jsx(s,{code:`await controller.cross.promise("press");
console.log("Cross was pressed");

// With timeout
const result = await Promise.race([
  controller.cross.promise("press"),
  new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000)),
]);`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"4. Async iteration"})," — stream values:"]})}),e.jsx(s,{code:`for await (const state of controller.left.analog) {
  console.log(\`x=\${state.x.state} y=\${state.y.state}\`);
}

// Or with next()
const { value } = await controller.cross.next("press");
console.log(value.active);`}),e.jsx(n,{children:"Callback Signature"}),e.jsx(s,{code:`type InputCallback<Instance> = (
  input: Instance,       // The input that owns the listener
  changed: Instance | Input<unknown>  // The specific child that changed
) => unknown | Promise<unknown>;

// Example: the second argument tells you which child triggered a parent event
controller.dpad.on("change", (dpad, changed) => {
  console.log("Dpad changed because:", changed);
});`})]});export{p as default};
