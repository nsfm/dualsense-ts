import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { LightbarControls, LightbarStrip, LightbarFadeButtons } from "../../components/hud";

const LightbarPage: React.FC = () => (
  <FeaturePage
    title="Lightbar"
    subtitle="Full RGB LED strip with color control and fade effects."
  >
    <Prose>
      <p>
        The lightbar is an RGB LED strip on the front edge of the controller.
        Set it to any color using RGB values (0–255 per channel), or use the
        built-in fade effects for smooth transitions.
      </p>
    </Prose>

    <DemoLabel>Live Demo — pick a color for the lightbar</DemoLabel>
    <DemoArea style={{ flexDirection: "column", gap: 16 }}>
      <LightbarStrip />
      <LightbarControls />
      <LightbarFadeButtons />
    </DemoArea>

    <SectionHeading>Setting Color</SectionHeading>
    <CodeBlock
      code={`// Set to a specific RGB color
controller.lightbar.set({ r: 0, g: 128, b: 255 });

// Read the current color
const color = controller.lightbar.color;
console.log(\`R=\${color.r} G=\${color.g} B=\${color.b}\`);`}
    />

    <SectionHeading>Fade Effects</SectionHeading>
    <Prose>
      <p>
        The lightbar supports smooth fade transitions:
      </p>
    </Prose>
    <CodeBlock
      code={`// Fade to blue
controller.lightbar.fadeToBlue();

// Fade out (turn off smoothly)
controller.lightbar.fadeOut();`}
    />

    <SectionHeading>Reading the Controller's Body Color</SectionHeading>
    <Prose>
      <p>
        The DualSense stores its body color in firmware. You can read it to
        match your UI or lightbar to the physical controller color:
      </p>
    </Prose>
    <CodeBlock
      code={`// Returns a DualsenseColor enum value
console.log(controller.color);`}
    />
  </FeaturePage>
);

export default LightbarPage;
