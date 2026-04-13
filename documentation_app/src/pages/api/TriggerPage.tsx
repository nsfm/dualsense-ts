import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const TriggerPage: React.FC = () => (
  <ApiPage
    name="Trigger"
    extends="Input<Magnitude>"
    description="A pressure-sensitive trigger (L2/R2) with analog 0–1 range, an independent digital button, and adaptive trigger feedback."
    source="src/elements/trigger.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "state", type: "Magnitude", description: "Analog pressure from 0 (released) to 1 (fully pressed)" },
        { name: "pressure", type: "Magnitude", description: "Alias for state" },
        { name: "magnitude", type: "Magnitude", description: "Alias for state" },
        { name: "active", type: "boolean", description: "True when pressure > 0" },
        { name: "button", type: "Momentary", description: "Independent digital button that actuates at the top of the trigger pull", readonly: true },
        { name: "feedback", type: "TriggerFeedback", description: "Adaptive trigger effect controller", readonly: true },
      ]}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Analog pressure
controller.left.trigger.on("change", (t) => {
  console.log(\`L2: \${(t.state * 100).toFixed(0)}%\`);
});

// Digital button (top of pull)
controller.left.trigger.button.on("press", () => {
  console.log("L2 button pressed");
});

// Adaptive trigger effect
import { TriggerEffect } from "dualsense-ts";
controller.left.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.3,
  strength: 0.8,
});`}
    />
  </ApiPage>
);

export default TriggerPage;
