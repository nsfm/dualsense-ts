import{j as e,L as t}from"./index-l8CS40p9.js";import{F as n,P as s,S as r,H as d}from"./FeaturePage-DbpfBqym.js";import{a as c}from"./CodeBlock-DSZTVETd.js";const o=()=>e.jsxs(n,{title:"LED Control",subtitle:"Four independent LED systems: lightbar, profile LEDs, player indicator, and status LED.",children:[e.jsxs(s,{children:[e.jsx("p",{children:"The Access controller has four LED systems, all independently controllable via the output API. Changes are batched and sent at 30 Hz — if any system changes, all four are updated together in a single HID output report."}),e.jsx("p",{children:"State is automatically restored on reconnection, so you don't need to re-send LED commands after a disconnect/reconnect cycle."})]}),e.jsx(r,{children:"Lightbar"}),e.jsx(s,{children:e.jsxs("p",{children:["An RGB LED strip, functionally identical to the"," ",e.jsx(t,{to:"/outputs/lightbar",children:"DualSense lightbar"}),". Set it to any color with ",e.jsx("code",{children:"access.lightbar.set()"}),". Defaults to blue."]})}),e.jsx(c,{code:`import { DualsenseAccess } from "dualsense-ts";

const access = new DualsenseAccess();

// Set color
access.lightbar.set({ r: 255, g: 0, b: 128 });

// Read current color
const { r, g, b } = access.lightbar.color;

// Fade effects (firmware-driven)
access.lightbar.fadeBlue();  // Fade to Sony blue and hold
access.lightbar.fadeOut();   // Fade to black, return to set color`}),e.jsx(r,{children:"Profile LEDs"}),e.jsxs(s,{children:[e.jsx("p",{children:"Three small LEDs that indicate the active profile. The firmware normally manages these, but you can override their animation mode."}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Mode"}),e.jsx("th",{children:"Value"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Off"})}),e.jsx("td",{children:e.jsx("code",{children:"0"})}),e.jsx("td",{children:"All profile LEDs off"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"On"})}),e.jsx("td",{children:e.jsx("code",{children:"1"})}),e.jsx("td",{children:"Static — active profile LED lit (default)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Fade"})}),e.jsx("td",{children:e.jsx("code",{children:"2"})}),e.jsx("td",{children:"Breathing / fade animation"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Sweep"})}),e.jsx("td",{children:e.jsx("code",{children:"3"})}),e.jsx("td",{children:"Sweeping animation across all 3 LEDs"})]})]})]})]}),e.jsx(c,{code:`import { AccessProfileLedMode } from "dualsense-ts";

// Set animation mode
access.profileLeds.set(AccessProfileLedMode.Fade);
access.profileLeds.set(AccessProfileLedMode.Sweep);

// Return to static
access.profileLeds.set(AccessProfileLedMode.On);

// Turn off
access.profileLeds.set(AccessProfileLedMode.Off);

// Read current mode
console.log(access.profileLeds.mode); // AccessProfileLedMode`}),e.jsxs(d,{children:["The profile LEDs always indicate the active profile number (1, 2, or 3) when in ",e.jsx("code",{children:"On"})," mode. The animation modes affect all 3 LEDs regardless of which profile is active."]}),e.jsx(r,{children:"Player Indicator"}),e.jsxs(s,{children:[e.jsxs("p",{children:["A 6-segment cross-shaped LED pattern, similar in purpose to the"," ",e.jsx(t,{to:"/outputs/player-leds",children:"DualSense player LEDs"})," but with a different physical layout. Used to indicate player number in multiplayer games."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Pattern"}),e.jsx("th",{children:"Value"}),e.jsx("th",{children:"Segments"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Off"})}),e.jsx("td",{children:e.jsx("code",{children:"0"})}),e.jsx("td",{children:"All off"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Player1"})}),e.jsx("td",{children:e.jsx("code",{children:"1"})}),e.jsx("td",{children:"S (1 segment)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Player2"})}),e.jsx("td",{children:e.jsx("code",{children:"2"})}),e.jsx("td",{children:"S + N (2 segments)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Player3"})}),e.jsx("td",{children:e.jsx("code",{children:"3"})}),e.jsx("td",{children:"S + NE + NW (3 segments)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Player4"})}),e.jsx("td",{children:e.jsx("code",{children:"4"})}),e.jsx("td",{children:"N + S + E + W (cross, 4 segments)"})]})]})]})]}),e.jsx(c,{code:`import { AccessPlayerIndicator } from "dualsense-ts";

access.playerIndicator.set(AccessPlayerIndicator.Player1);
access.playerIndicator.set(AccessPlayerIndicator.Player3);
access.playerIndicator.set(AccessPlayerIndicator.Off);

// Read current pattern
console.log(access.playerIndicator.pattern);`}),e.jsx(r,{children:"Status LED"}),e.jsx(s,{children:e.jsx("p",{children:"A single white LED with simple on/off control. Defaults to on."})}),e.jsx(c,{code:`// Turn off
access.statusLed.set(false);

// Turn on
access.statusLed.set(true);

// Read current state
console.log(access.statusLed.on); // boolean`}),e.jsx(r,{children:"Combined Example"}),e.jsx(s,{children:e.jsx("p",{children:"All four systems can be configured independently. Here's a complete example that sets up all LEDs in one go."})}),e.jsx(c,{code:`import {
  DualsenseAccess,
  AccessProfileLedMode,
  AccessPlayerIndicator,
} from "dualsense-ts";

const access = new DualsenseAccess();

access.connection.on("press", () => {
  // Team color on lightbar
  access.lightbar.set({ r: 0, g: 200, b: 100 });

  // Sweep animation on profile LEDs
  access.profileLeds.set(AccessProfileLedMode.Sweep);

  // Show player number
  access.playerIndicator.set(AccessPlayerIndicator.Player2);

  // Status LED on
  access.statusLed.set(true);
});`}),e.jsx(r,{children:"Comparison with DualSense"}),e.jsx(s,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"LED System"}),e.jsx("th",{children:"DualSense"}),e.jsx("th",{children:"Access"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Lightbar"}),e.jsx("td",{children:"RGB strip + fade effects"}),e.jsx("td",{children:"RGB strip + fade effects (identical)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Player LEDs"}),e.jsxs("td",{children:["5-segment bar, brightness, ",e.jsx("code",{children:"playerLeds"})]}),e.jsxs("td",{children:["6-segment cross, pattern, ",e.jsx("code",{children:"playerIndicator"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Profile LEDs"}),e.jsx("td",{children:"—"}),e.jsxs("td",{children:["3 LEDs, 4 animation modes, ",e.jsx("code",{children:"profileLeds"})]})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Mute LED"}),e.jsx("td",{children:"Orange LED (on / pulse / off)"}),e.jsx("td",{children:"—"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Status LED"}),e.jsx("td",{children:"—"}),e.jsxs("td",{children:["White LED (on / off), ",e.jsx("code",{children:"statusLed"})]})]})]})]})}),e.jsx(d,{children:"Over Bluetooth, the Access controller requires all LED data to be sent in a combined output report. The library handles this automatically — when any LED system changes, all four are included in the next report."})]});export{o as default};
