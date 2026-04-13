import{j as e,L as s}from"./index-DKhcrciQ.js";import{F as t,S as r,P as n}from"./FeaturePage-BkaKAGuw.js";import{a as o}from"./CodeBlock-ByGo0dcz.js";const a=()=>e.jsxs(t,{title:"Getting Started",subtitle:"Install, connect, and start reading inputs in minutes.",children:[e.jsx(r,{children:"Installation"}),e.jsx(n,{children:e.jsx("p",{children:"Install from npm:"})}),e.jsx(o,{code:"npm install dualsense-ts",language:"bash"}),e.jsx(r,{children:"Browser Setup"}),e.jsxs(n,{children:[e.jsxs("p",{children:["In the browser, ",e.jsx("code",{children:"dualsense-ts"})," has zero dependencies — it uses the built-in WebHID API directly. Compatible browsers:"]}),e.jsxs("ul",{children:[e.jsx("li",{children:"Chrome 89+"}),e.jsx("li",{children:"Edge 89+"}),e.jsx("li",{children:"Opera 75+"})]}),e.jsx("p",{children:"Firefox, Safari, and mobile browsers do not currently support WebHID."})]}),e.jsx(r,{children:"Node.js Setup"}),e.jsx(n,{children:e.jsxs("p",{children:["For Node.js, install the one peer dependency, ",e.jsx("code",{children:"node-hid"}),":"]})}),e.jsx(o,{code:"npm install node-hid",language:"bash"}),e.jsx(r,{children:"Connecting a Controller"}),e.jsx(n,{children:e.jsxs("p",{children:["In Node.js, simply creating a"," ",e.jsx(s,{to:"/api/dualsense",children:e.jsx("code",{children:"Dualsense"})})," ","instance automatically discovers and connects to the first available controller:"]})}),e.jsx(o,{code:`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();`}),e.jsx(n,{children:e.jsxs("p",{children:["In the browser, WebHID requires a"," ",e.jsx("a",{href:"https://developer.mozilla.org/en-US/docs/Web/Security/User_activation",target:"_blank",rel:"noopener noreferrer",children:"user gesture"})," ","to grant device access. The ",e.jsx("code",{children:"Dualsense"})," class provides a callback you can wire to a click handler:"]})}),e.jsx(o,{code:`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();

// Wire to a click handler
button.addEventListener("click", controller.hid.provider.getRequest());`}),e.jsx(n,{children:e.jsxs("p",{children:["For ",e.jsx(s,{to:"/multiplayer",children:"multiplayer support"}),", use"," ",e.jsx(s,{to:"/api/manager",children:e.jsx("code",{children:"DualsenseManager"})})," ","to handle permission flow and manage multiple controllers."]})}),e.jsx(r,{children:"Monitoring Connections"}),e.jsx(n,{children:e.jsxs("p",{children:["The controller's ",e.jsx("code",{children:"connection"})," property is an"," ",e.jsx(s,{to:"/api/input",children:e.jsx("code",{children:"Input"})})," ","that tracks connected state. Like every input in the library, it supports events, promises, and synchronous reads:"]})}),e.jsx(o,{code:`// Event-based
controller.connection.on("change", (conn) => {
  console.log(conn.state ? "Connected" : "Disconnected");
});

// Synchronous check
if (controller.connection.state) {
  console.log("Controller is connected");
}

// Check if wired or wireless
console.log(controller.wireless ? "Bluetooth" : "USB");`}),e.jsx(r,{children:"Reading Inputs"}),e.jsx(n,{children:e.jsxs("p",{children:["Every"," ",e.jsx(s,{to:"/api/input",children:e.jsx("code",{children:"Input<T>"})})," ","on the controller supports four access patterns — choose whichever fits your use case:"]})}),e.jsx(o,{code:`// 1. Synchronous read
const pressed = controller.cross.state;
const pressure = controller.left.trigger.pressure;

// 2. Event callbacks
controller.cross.on("press", () => console.log("Cross pressed"));
controller.cross.on("release", () => console.log("Cross released"));
controller.cross.on("change", (btn) => console.log(btn.state));

// 3. Promises
await controller.cross.promise("press");
console.log("Cross was pressed!");

// 4. Async iterators
for await (const { state } of controller.cross) {
  console.log(\`Cross is \${state ? "pressed" : "released"}\`);
}`}),e.jsx(n,{children:e.jsxs("p",{children:["These patterns work for every input type —"," ",e.jsx(s,{to:"/inputs/buttons",children:"buttons"}),","," ",e.jsx(s,{to:"/inputs/analog",children:"analog sticks"}),","," ",e.jsx(s,{to:"/inputs/triggers",children:"triggers"}),","," ",e.jsx(s,{to:"/inputs/touchpad",children:"touchpad"}),","," ",e.jsx(s,{to:"/inputs/motion",children:"motion sensors"}),", and"," ",e.jsx(s,{to:"/inputs/battery",children:"battery"}),". See the"," ",e.jsx(s,{to:"/inputs",children:"Inputs overview"})," for a deeper look at the input system."]})})]});export{a as default};
