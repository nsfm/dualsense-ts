import{j as e}from"./index-CqgUOPB5.js";import{A as s,S as o,a,M as r}from"./ApiPage-BIA_uZJh.js";import{a as t}from"./CodeBlock-D0xyfFu-.js";const c=()=>e.jsxs(s,{name:"PowerSaveControl",description:"Per-subsystem power save flags. Disable touch, motion, haptics, or audio processing on the controller to conserve battery.",source:"src/elements/power_save.ts",children:[e.jsx(o,{children:"Properties"}),e.jsx(a,{properties:[{name:"touch",type:"boolean",description:"Whether touch processing is enabled (default: true)"},{name:"motion",type:"boolean",description:"Whether IMU (gyroscope + accelerometer) processing is enabled (default: true)"},{name:"haptics",type:"boolean",description:"Whether the haptic processor is enabled (default: true)"},{name:"audio",type:"boolean",description:"Whether the audio DSP is enabled (default: true)"},{name:"hapticsMuted",type:"boolean",description:"Whether haptic output is muted (processor still runs). Default: false"},{name:"flags",type:"number",description:"Raw power save bitfield sent to the controller"}]}),e.jsx(o,{children:"Methods"}),e.jsx(r,{methods:[{name:"set",signature:"set(options: PowerSaveOptions): void",description:"Set multiple subsystem states at once. Omitted keys are unchanged."},{name:"reset",signature:"reset(): void",description:"Re-enable all subsystems and unmute haptics."}]}),e.jsx(o,{children:"PowerSaveOptions"}),e.jsx(t,{code:`interface PowerSaveOptions {
  touch?: boolean;       // enable/disable touchpad
  motion?: boolean;      // enable/disable IMU
  haptics?: boolean;     // enable/disable haptic processor
  audio?: boolean;       // enable/disable audio DSP
  muteHaptics?: boolean; // mute haptic output
}`}),e.jsx(o,{children:"Example"}),e.jsx(t,{code:`// Disable unused subsystems for a button-only game
controller.powerSave.set({
  motion: false,
  touch: false,
  audio: false,
});

// Re-enable motion for a motion-control section
controller.powerSave.motion = true;

// Soft-mute haptics (processor stays on)
controller.powerSave.hapticsMuted = true;

// Restore all defaults
controller.powerSave.reset();`})]});export{c as default};
