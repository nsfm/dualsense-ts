import{j as e}from"./index-CqgUOPB5.js";import{A as a,S as n,a as r,M as s}from"./ApiPage-BIA_uZJh.js";import{a as t}from"./CodeBlock-D0xyfFu-.js";const c=()=>e.jsxs(a,{name:"DualsenseManager",extends:"Input<DualsenseManagerState>",description:"Manages multiple DualSense controllers with auto-discovery, player LED assignment, and slot management.",source:"src/manager.ts",children:[e.jsx(t,{code:`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// Browser: trigger the WebHID device picker
const requestPermission = manager.getRequest();
button.addEventListener("click", requestPermission);

// React to connections
manager.on("change", ({ active }) => {
  console.log(\`\${active} controller(s) connected\`);
});`}),e.jsx(n,{children:"Constructor Options"}),e.jsx(r,{properties:[{name:"discoveryInterval",type:"number",description:"Polling interval in ms for device discovery (default: 2000)"},{name:"autoAssignPlayerLeds",type:"boolean",description:"Automatically assign LED patterns per player slot (default: true)"}]}),e.jsx(n,{children:"Properties"}),e.jsx(r,{properties:[{name:"state",type:"DualsenseManagerState",description:"Current state: { active: number, players: ReadonlyMap }"},{name:"controllers",type:"readonly Dualsense[]",description:"All managed controller instances"},{name:"active",type:"boolean",description:"True if at least one controller is connected"},{name:"count",type:"number",description:"Total number of managed controllers"},{name:"pending",type:"boolean",description:"True while waiting for device firmware info"},{name:"autoAssignPlayerLeds",type:"boolean",description:"Whether LED patterns are auto-assigned"}]}),e.jsx(n,{children:"Methods"}),e.jsx(s,{methods:[{name:"get",signature:"get(index: number): Dualsense | undefined",description:"Get a controller by its slot index."},{name:"getRequest",signature:"getRequest(): () => Promise<void>",description:"Returns a function that opens the WebHID device picker. Call on user gesture."},{name:"release",signature:"release(index: number): void",description:"Release a specific controller slot."},{name:"releaseDisconnected",signature:"releaseDisconnected(): void",description:"Release all slots where the controller is disconnected."},{name:"setPlayerPattern",signature:"setPlayerPattern(index: number, bitmask: number): void",description:"Override the LED pattern (0x00–0x1f) for a player slot."},{name:"getPlayerPattern",signature:"getPlayerPattern(index: number): number",description:"Get the current LED pattern for a slot."},{name:"dispose",signature:"dispose(): void",description:"Stop discovery polling and disconnect all controllers."}]}),e.jsx(n,{children:"Iteration"}),e.jsx(t,{code:`// Iterate with for...of
for (const controller of manager) {
  console.log(controller.connection.state);
}

// Or use the controllers array
manager.controllers.forEach((c, i) => {
  console.log(\`Player \${i + 1}: \${c.connection.state}\`);
});`}),e.jsx(n,{children:"State Type"}),e.jsx(t,{code:`interface DualsenseManagerState {
  active: number;
  players: ReadonlyMap<number, Dualsense>;
}`})]});export{c as default};
