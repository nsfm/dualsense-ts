import{j as e}from"./index-BuZC7I-2.js";import{A as r,S as t,a as s,M as n}from"./ApiPage-s5d_KP1M.js";import{a as o}from"./CodeBlock-68dk7iDt.js";const u=()=>e.jsxs(r,{name:"Mute",extends:"Momentary",description:"The mute button with a software-controllable orange LED. Extends Momentary with LED control methods.",source:"src/elements/mute.ts",children:[e.jsx(t,{children:"Properties"}),e.jsx(s,{properties:[{name:"state",type:"boolean",description:"True when the mute button is pressed (inherited from Momentary)"},{name:"active",type:"boolean",description:"Same as state"},{name:"status",type:"Momentary",description:"Firmware-managed mute LED status",readonly:!0},{name:"ledMode",type:"MuteLedMode | undefined",description:'Current software LED override: "Off", "On", or "Pulse". Undefined when firmware-controlled.'}]}),e.jsx(t,{children:"Methods"}),e.jsx(n,{methods:[{name:"setLed",signature:"setLed(mode: MuteLedMode): void",description:'Override the mute LED: "Off", "On", or "Pulse".'},{name:"resetLed",signature:"resetLed(): void",description:"Return LED control to firmware (default behavior)."}]}),e.jsx(t,{children:"MuteLedMode Enum"}),e.jsx(o,{code:`enum MuteLedMode {
  Off,
  On,
  Pulse,
}`}),e.jsx(t,{children:"Example"}),e.jsx(o,{code:`import { MuteLedMode } from "dualsense-ts";

// Button press events
controller.mute.on("press", () => console.log("Mute toggled"));

// Override the LED
controller.mute.setLed(MuteLedMode.On);    // Solid orange
controller.mute.setLed(MuteLedMode.Pulse); // Pulsing
controller.mute.setLed(MuteLedMode.Off);   // Force off

// Return to firmware control
controller.mute.resetLed();`})]});export{u as default};
