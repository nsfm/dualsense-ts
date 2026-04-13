import{j as e,L as s}from"./index-DKhcrciQ.js";import{F as r,P as o,D as c,S as n}from"./FeaturePage-BkaKAGuw.js";import{C as l}from"./ControllerInfoDiagnostic-CDjRdq9n.js";import{a as t}from"./CodeBlock-ByGo0dcz.js";const u=()=>e.jsxs(r,{title:"Connection",subtitle:"Detect connect/disconnect events and query transport type.",children:[e.jsx(o,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"connection"})," property is a"," ",e.jsx(s,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," input — a virtual button that is ",e.jsx("code",{children:"true"})," when the controller is connected and ",e.jsx("code",{children:"false"})," when it isn't. Like any input, it emits ",e.jsx("code",{children:"change"})," events, supports"," ",e.jsx("code",{children:"await"}),", and works with async iterators."]})}),e.jsx(c,{children:"Connect or disconnect your controller to see live updates"}),e.jsx(l,{}),e.jsx(n,{children:"Connection State"}),e.jsx(o,{children:e.jsx("p",{children:"Read the current state directly, or subscribe to changes. The change event fires on both connect and disconnect."})}),e.jsx(t,{code:`// Read current state
controller.connection.state; // boolean

// Subscribe to changes
controller.connection.on("change", ({ state }) => {
  console.log(state ? "Connected" : "Disconnected");
});

// Wait for connection
await controller.connection.waitFor("change");

// Async iterator
for await (const { state } of controller.connection) {
  console.log(state ? "Connected" : "Disconnected");
}`}),e.jsx(n,{children:"Transport Type"}),e.jsx(o,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"wireless"})," getter reports whether the controller is connected via Bluetooth (",e.jsx("code",{children:"true"}),") or USB (",e.jsx("code",{children:"false"}),")."]})}),e.jsx(t,{code:`controller.wireless; // true = Bluetooth, false = USB

if (controller.wireless) {
  console.log("Connected via Bluetooth");
} else {
  console.log("Connected via USB");
}`}),e.jsx(n,{children:"Reconnection"}),e.jsx(o,{children:e.jsxs("p",{children:["When a controller disconnects and reconnects, the library automatically matches it to its previous slot using a stable hardware identity (see"," ",e.jsx(s,{to:"/status#identity-resolution",children:"identity resolution"}),"). All output state — rumble, lightbar, trigger effects, player LEDs — is restored automatically. You don't need to re-send commands after a reconnection."]})}),e.jsx(t,{code:`// Output state persists across reconnections
controller.lightbar.set({ r: 255, g: 0, b: 0 });
controller.left.rumble(0.5);

// Disconnect and reconnect — lightbar and rumble resume automatically

// Track reconnections
controller.connection.on("change", ({ state }) => {
  if (state) {
    console.log("Reconnected — outputs auto-restored");
    console.log(controller.wireless ? "via Bluetooth" : "via USB");
  }
});`}),e.jsx(n,{children:"WebHID Permissions"}),e.jsx(o,{children:e.jsxs("p",{children:["In the browser, WebHID requires a user gesture to grant device access. The library provides a ",e.jsx("code",{children:"requestPermission()"}),"helper that opens the browser's HID device picker. Once granted, permissions persist for the origin and the device will auto-connect on future visits."]})}),e.jsx(t,{code:`import { Dualsense } from "dualsense-ts";

// Browser — requires user gesture (e.g. button click)
const controller = new Dualsense();

// Node.js — connects automatically, no permission needed
const controller = new Dualsense();`}),e.jsx(n,{children:"Node.js Discovery"}),e.jsx(o,{children:e.jsxs("p",{children:["In Node.js with ",e.jsx("code",{children:"node-hid"}),", controllers are discovered automatically by USB vendor/product ID. No permission prompt is needed. The ",e.jsx(s,{to:"/multiplayer",children:"DualsenseManager"})," handles hot-plug detection for multiple controllers."]})}),e.jsx(t,{code:`import { Dualsense, DualsenseManager } from "dualsense-ts";

// Single controller — auto-discovers first available
const controller = new Dualsense();

// Multiple controllers — auto-discovers all
const manager = new DualsenseManager();
manager.on("add", (controller) => {
  console.log("New controller:", controller.serialNumber);
});`})]});export{u as default};
