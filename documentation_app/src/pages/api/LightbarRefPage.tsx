import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const LightbarRefPage: React.FC = () => (
  <ApiPage
    name="Lightbar"
    description="RGB LED strip on the front edge of the controller. Set colors directly or use fade effects."
    source="src/elements/lightbar.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "color", type: "RGB", description: "Current color as { r, g, b } with values 0–255" },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "set", signature: "set(color: RGB): void", description: "Set the lightbar to an RGB color. Values are clamped to 0–255." },
        { name: "fadeBlue", signature: "fadeBlue(): void", description: "Smooth fade transition to Sony blue." },
        { name: "fadeOut", signature: "fadeOut(): void", description: "Smooth fade to black, then restore." },
      ]}
    />

    <SectionHeading>RGB Type</SectionHeading>
    <CodeBlock
      code={`interface RGB {
  r: number;  // 0–255
  g: number;  // 0–255
  b: number;  // 0–255
}`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Solid red
controller.lightbar.set({ r: 255, g: 0, b: 0 });

// Read current color
const { r, g, b } = controller.lightbar.color;

// Fade effect
controller.lightbar.fadeBlue();`}
    />
  </ApiPage>
);

export default LightbarRefPage;
