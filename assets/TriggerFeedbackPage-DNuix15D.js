import{j as e}from"./index-l8CS40p9.js";import{A as i,S as n,a as s,M as c,P as t}from"./ApiPage-KfA7eOI8.js";import{a as r}from"./CodeBlock-DSZTVETd.js";const d=()=>e.jsxs(i,{name:"TriggerFeedback",description:"Adaptive trigger effects. Each trigger (L2/R2) has an independent TriggerFeedback instance with 7 effect modes.",source:"src/elements/trigger_feedback.ts",children:[e.jsx(n,{children:"Properties"}),e.jsx(s,{properties:[{name:"effect",type:"TriggerEffect",description:"Current effect type"},{name:"config",type:"TriggerFeedbackConfig",description:"Full effect configuration object"}]}),e.jsx(n,{children:"Methods"}),e.jsx(c,{methods:[{name:"set",signature:"set(config: TriggerFeedbackConfig): void",description:"Apply a trigger effect configuration."},{name:"reset",signature:"reset(): void",description:"Reset to Off (no resistance)."},{name:"toBytes",signature:"toBytes(): Uint8Array",description:"Serialize the effect to an 11-byte block for HID output."}]}),e.jsx(n,{children:"Effect Types"}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Off"})," — No resistance (default)."]})}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Feedback"})," — Zone-based continuous resistance."]})}),e.jsx(r,{code:`interface FeedbackEffect {
  effect: TriggerEffect.Feedback;
  position: number;   // Where resistance begins (0–1)
  strength: number;   // Resistance strength (0–1)
}`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Weapon"})," — Snap-point resistance simulating a trigger pull."]})}),e.jsx(r,{code:`interface WeaponEffect {
  effect: TriggerEffect.Weapon;
  start: number;     // Where resistance begins (0–1)
  end: number;       // Where snap occurs (0–1, must be after start)
  strength: number;  // Snap strength (0–1)
}`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Bow"})," — Snap with snap-back force (draw and release feel)."]})}),e.jsx(r,{code:`interface BowEffect {
  effect: TriggerEffect.Bow;
  start: number;      // Draw start (0–1)
  end: number;        // Full draw (0–1, must be after start)
  strength: number;   // Pull strength (0–1)
  snapForce: number;  // Snap-back force (0–1)
}`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Galloping"})," — Two-stroke rhythm resistance."]})}),e.jsx(r,{code:`interface GallopingEffect {
  effect: TriggerEffect.Galloping;
  start: number;       // Where effect begins (0–1)
  end: number;         // Where effect ends (0–1)
  firstFoot: number;   // First foot timing (0–1)
  secondFoot: number;  // Second foot timing (0–1)
  frequency: number;   // Oscillation frequency in Hz (1–255)
}`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Vibration"})," — Zone-based oscillation."]})}),e.jsx(r,{code:`interface VibrationEffect {
  effect: TriggerEffect.Vibration;
  position: number;   // Where vibration begins (0–1)
  amplitude: number;  // Vibration intensity (0–1)
  frequency: number;  // Oscillation frequency in Hz (1–255)
}`}),e.jsx(t,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Machine"})," — Dual-amplitude vibration with period control."]})}),e.jsx(r,{code:`interface MachineEffect {
  effect: TriggerEffect.Machine;
  start: number;       // Where effect begins (0–1)
  end: number;         // Where effect ends (0–1)
  amplitudeA: number;  // First amplitude (0–1)
  amplitudeB: number;  // Second amplitude (0–1)
  frequency: number;   // Vibration frequency in Hz (1–255)
  period: number;      // Period in tenths of a second
}`}),e.jsx(n,{children:"TriggerEffect Enum"}),e.jsx(r,{code:`enum TriggerEffect {
  Off,
  Feedback,
  Weapon,
  Bow,
  Galloping,
  Vibration,
  Machine,
}`}),e.jsx(n,{children:"Example"}),e.jsx(r,{code:`import { TriggerEffect } from "dualsense-ts";

// Weapon trigger feel
controller.left.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

// Reset both triggers
controller.resetTriggerFeedback();`})]});export{d as default};
