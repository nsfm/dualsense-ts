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
  mode: "feedback";
  position: number;   // Start position (0–9)
  strength: number;   // Resistance strength (0–8)
}`}
    />

    <Prose><p><strong>Weapon</strong> — Snap-point resistance simulating a trigger pull.</p></Prose>
    <CodeBlock
      code={`interface WeaponEffect {
  mode: "weapon";
  startPosition: number;  // Where resistance begins (0–7)
  endPosition: number;    // Where snap occurs (0–8)
  strength: number;       // Snap strength (0–8)
}`}
    />

    <Prose><p><strong>Bow</strong> — Snap with snap-back force (draw and release feel).</p></Prose>
    <CodeBlock
      code={`interface BowEffect {
  mode: "bow";
  startPosition: number;  // Draw start
  endPosition: number;    // Full draw
  strength: number;       // Draw weight
  snapForce: number;      // Release snap
}`}
    />

    <Prose><p><strong>Galloping</strong> — Two-stroke rhythm resistance.</p></Prose>
    <CodeBlock
      code={`interface GallopingEffect {
  mode: "galloping";
  startPosition: number;
  endPosition: number;
  firstFoot: number;
  secondFoot: number;
  frequency: number;
}`}
    />

    <Prose><p><strong>Vibration</strong> — Zone-based oscillation.</p></Prose>
    <CodeBlock
      code={`interface VibrationEffect {
  mode: "vibration";
  position: number;    // Zone start
  amplitude: number;   // Vibration intensity
  frequency: number;   // Oscillation rate
}`}
    />

    <Prose><p><strong>Machine</strong> — Dual-amplitude vibration with period control.</p></Prose>
    <CodeBlock
      code={`interface MachineEffect {
  mode: "machine";
  startPosition: number;
  endPosition: number;
  amplitudeA: number;
  amplitudeB: number;
  frequency: number;
  period: number;
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
      code={`// Weapon trigger feel
controller.left.trigger.feedback.set({
  mode: "weapon",
  startPosition: 2,
  endPosition: 5,
  strength: 7,
});

// Reset both triggers
controller.resetTriggerFeedback();`}
    />
  </ApiPage>
);

export default TriggerFeedbackPage;
