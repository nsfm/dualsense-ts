import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const TriggerFeedbackPage: React.FC = () => (
  <ApiPage
    name="TriggerFeedback"
    description="Adaptive trigger effects. Each trigger (L2/R2) has an independent TriggerFeedback instance with 7 effect modes."
    source="src/elements/trigger_feedback.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "effect", type: "TriggerEffect", description: "Current effect type" },
        { name: "config", type: "TriggerFeedbackConfig", description: "Full effect configuration object" },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "set", signature: "set(config: TriggerFeedbackConfig): void", description: "Apply a trigger effect configuration." },
        { name: "reset", signature: "reset(): void", description: "Reset to Off (no resistance)." },
        { name: "toBytes", signature: "toBytes(): Uint8Array", description: "Serialize the effect to an 11-byte block for HID output." },
      ]}
    />

    <SectionHeading>Effect Types</SectionHeading>

    <Prose><p><strong>Off</strong> — No resistance (default).</p></Prose>

    <Prose><p><strong>Feedback</strong> — Zone-based continuous resistance.</p></Prose>
    <CodeBlock
      code={`interface FeedbackEffect {
  effect: TriggerEffect.Feedback;
  position: number;   // Where resistance begins (0–1)
  strength: number;   // Resistance strength (0–1)
}`}
    />

    <Prose><p><strong>Weapon</strong> — Snap-point resistance simulating a trigger pull.</p></Prose>
    <CodeBlock
      code={`interface WeaponEffect {
  effect: TriggerEffect.Weapon;
  start: number;     // Where resistance begins (0–1)
  end: number;       // Where snap occurs (0–1, must be after start)
  strength: number;  // Snap strength (0–1)
}`}
    />

    <Prose><p><strong>Bow</strong> — Snap with snap-back force (draw and release feel).</p></Prose>
    <CodeBlock
      code={`interface BowEffect {
  effect: TriggerEffect.Bow;
  start: number;      // Draw start (0–1)
  end: number;        // Full draw (0–1, must be after start)
  strength: number;   // Pull strength (0–1)
  snapForce: number;  // Snap-back force (0–1)
}`}
    />

    <Prose><p><strong>Galloping</strong> — Two-stroke rhythm resistance.</p></Prose>
    <CodeBlock
      code={`interface GallopingEffect {
  effect: TriggerEffect.Galloping;
  start: number;       // Where effect begins (0–1)
  end: number;         // Where effect ends (0–1)
  firstFoot: number;   // First foot timing (0–1)
  secondFoot: number;  // Second foot timing (0–1)
  frequency: number;   // Oscillation frequency in Hz (1–255)
}`}
    />

    <Prose><p><strong>Vibration</strong> — Zone-based oscillation.</p></Prose>
    <CodeBlock
      code={`interface VibrationEffect {
  effect: TriggerEffect.Vibration;
  position: number;   // Where vibration begins (0–1)
  amplitude: number;  // Vibration intensity (0–1)
  frequency: number;  // Oscillation frequency in Hz (1–255)
}`}
    />

    <Prose><p><strong>Machine</strong> — Dual-amplitude vibration with period control.</p></Prose>
    <CodeBlock
      code={`interface MachineEffect {
  effect: TriggerEffect.Machine;
  start: number;       // Where effect begins (0–1)
  end: number;         // Where effect ends (0–1)
  amplitudeA: number;  // First amplitude (0–1)
  amplitudeB: number;  // Second amplitude (0–1)
  frequency: number;   // Vibration frequency in Hz (1–255)
  period: number;      // Period in tenths of a second
}`}
    />

    <SectionHeading>TriggerEffect Enum</SectionHeading>
    <CodeBlock
      code={`enum TriggerEffect {
  Off,
  Feedback,
  Weapon,
  Bow,
  Galloping,
  Vibration,
  Machine,
}`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`import { TriggerEffect } from "dualsense-ts";

// Weapon trigger feel
controller.left.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

// Reset both triggers
controller.resetTriggerFeedback();`}
    />
  </ApiPage>
);

export default TriggerFeedbackPage;
