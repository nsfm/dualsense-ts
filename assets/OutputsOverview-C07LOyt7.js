import{j as e,L as t}from"./index-GGWi0Ont.js";import{F as o,P as r,H as i,S as s}from"./FeaturePage-DywfdRev.js";import{a as l}from"./CodeBlock-Dvv7tnEL.js";const a=()=>e.jsxs(o,{title:"Outputs",subtitle:"Control the DualSense's haptics, adaptive triggers, lights, and audio.",children:[e.jsx(r,{children:e.jsxs("p",{children:["Unlike inputs which are read-only, outputs let you send commands to the controller — rumble the motors, light up LEDs, create trigger resistance, and configure audio. All output state is managed by"," ",e.jsx("code",{children:"dualsense-ts"})," and sent to the controller automatically via the HID polling loop."]})}),e.jsx(i,{children:"Output state is automatically restored if the controller disconnects and reconnects. You don't need to re-send commands after a reconnection."}),e.jsx(s,{children:"Rumble"}),e.jsx(r,{children:e.jsxs("p",{children:["Two independent haptic motors with normalized intensity control (0–1). The left motor is stronger and lower-frequency; the right is lighter and higher-frequency."," ",e.jsx(t,{to:"/outputs/rumble",children:"Full rumble controls."})]})}),e.jsx(l,{code:`controller.rumble(0.5);         // both motors
controller.left.rumble(1.0);    // left only
controller.right.rumble(0.3);   // right only
controller.rumble(0);           // stop`}),e.jsx(s,{children:"Adaptive Triggers"}),e.jsx(r,{children:e.jsxs("p",{children:["7 firmware-driven resistance modes with per-trigger configuration. Each effect accepts a typed config object with parameters like position, strength, and frequency."," ",e.jsx(t,{to:"/outputs/trigger-effects",children:"Explore all trigger effects."})]})}),e.jsx(l,{code:`import { TriggerEffect } from "dualsense-ts";

controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

controller.resetTriggerFeedback(); // reset both`}),e.jsxs(r,{children:[e.jsx("p",{children:"Available effects:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Effect"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Off"})}),e.jsx("td",{children:"No resistance (default)"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#feedback",children:e.jsx("code",{children:"Feedback"})})}),e.jsx("td",{children:"Zone-based continuous resistance"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#weapon",children:e.jsx("code",{children:"Weapon"})})}),e.jsx("td",{children:"Resistance with snap release"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#bow",children:e.jsx("code",{children:"Bow"})})}),e.jsx("td",{children:"Snap release with snap-back force"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#galloping",children:e.jsx("code",{children:"Galloping"})})}),e.jsx("td",{children:"Rhythmic two-stroke oscillation"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#vibration",children:e.jsx("code",{children:"Vibration"})})}),e.jsx("td",{children:"Zone-based oscillation with frequency"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/trigger-effects#machine",children:e.jsx("code",{children:"Machine"})})}),e.jsx("td",{children:"Dual-amplitude vibration with period"})]})]})]})]}),e.jsx(s,{children:"Lighting"}),e.jsxs(r,{children:[e.jsx("p",{children:"Three separate lighting systems, each independently controllable:"}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"System"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/lightbar",children:e.jsx("code",{children:"lightbar"})})}),e.jsx("td",{children:"Full RGB LED strip along both sides of the touchpad"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/player-leds",children:e.jsx("code",{children:"playerLeds"})})}),e.jsx("td",{children:"5 white LEDs with individual toggle and adjustable brightness"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx(t,{to:"/outputs/mute-led",children:e.jsx("code",{children:"mute"})})}),e.jsx("td",{children:"Orange LED with on / pulse / off / firmware-auto modes"})]})]})]})]}),e.jsx(l,{code:`import { PlayerID, Brightness, MuteLedMode } from "dualsense-ts";

// RGB lightbar
controller.lightbar.set({ r: 0, g: 128, b: 255 });

// Player LEDs
controller.playerLeds.set(PlayerID.Player1);
controller.playerLeds.setBrightness(Brightness.High);

// Mute LED override
controller.mute.setLed(MuteLedMode.Pulse);
controller.mute.resetLed(); // return to firmware control`}),e.jsx(s,{children:"Audio"}),e.jsx(r,{children:e.jsxs("p",{children:["Volume, routing, and mute controls for the built-in speaker, headphone jack, and microphone array. Also includes DSP test tones and a helper for locating audio devices."," ",e.jsx(t,{to:"/outputs/audio",children:"Full audio controls."})]})}),e.jsx(l,{code:`import { AudioOutput, MicSelect } from "dualsense-ts";

controller.audio.setSpeakerVolume(0.8);
controller.audio.setOutput(AudioOutput.Speaker);
controller.audio.setMicSelect(MicSelect.Internal);

// Per-output muting
controller.audio.muteSpeaker(true);
controller.audio.muteHeadphone(false);`}),e.jsx(s,{children:"Output API Pattern"}),e.jsx(r,{children:e.jsx("p",{children:"Outputs follow a consistent pattern: call a setter method to change state, read it back via a getter. The library batches your changes and sends them in the next HID output report — you never need to manage timing or report construction yourself."})}),e.jsx(l,{code:`// Set → read back
controller.lightbar.set({ r: 255, g: 0, b: 0 });
controller.lightbar.color; // { r: 255, g: 0, b: 0 }

controller.left.rumble(0.7);
controller.left.rumble(); // 0.7 (no args = read)

controller.right.trigger.feedback.effect; // TriggerEffect.Off
controller.audio.speakerVolume;           // 0.8`})]});export{a as default};
