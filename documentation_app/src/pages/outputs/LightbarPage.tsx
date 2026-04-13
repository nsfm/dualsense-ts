import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoLabel,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";
import {
  LightbarColorPicker,
  LightbarFadeEffects,
} from "../../components/diagnostics/LightbarDiagnostic";

const LightbarPage: React.FC = () => (
  <FeaturePage
    title="Lightbar"
    subtitle="Full RGB LED strip with color control and fade effects."
  >
    <Prose>
      <p>
        The lightbar is an RGB LED strip that runs along both sides of the
        touchpad. Set it to any color using{" "}
        <Link to="/api/lightbar">
          <code>lightbar.set()</code>
        </Link>{" "}
        with RGB values (0–255 per channel), or trigger firmware-driven fade
        animations.
      </p>
    </Prose>

    <SectionHeading>Color</SectionHeading>
    <DemoLabel>Pick a color or drag the channel sliders</DemoLabel>
    <LightbarColorPicker />

    <SectionHeading>Setting Color</SectionHeading>
    <Prose>
      <p>
        The <code>{`{r, g, b}`}</code> format is compatible with popular color
        libraries — pass the output of <code>colord().toRgb()</code>,{" "}
        <code>tinycolor().toRgb()</code>, or <code>Color().object()</code>{" "}
        straight to <code>lightbar.set()</code>.
      </p>
    </Prose>
    <CodeBlock
      code={`// Set to a specific RGB color
controller.lightbar.set({ r: 0, g: 128, b: 255 });

// Read the current color
const { r, g, b } = controller.lightbar.color;
console.log(\`R=\${r} G=\${g} B=\${b}\`);`}
    />

    <SectionHeading>Fade Effects</SectionHeading>
    <Prose>
      <p>
        The lightbar supports firmware-driven fade animations corresponding to
        the official Sony behavior. These are one-shot commands; the controller
        handles the animation internally.
      </p>
    </Prose>
    <LightbarFadeEffects />
    <HardwareNote>
      <code>fadeBlue()</code> overrides your custom lightbar color to Sony blue
      and holds it. You must send <code>fadeOut()</code> to return to your set
      color.
    </HardwareNote>
    <CodeBlock
      code={`// Fade to Sony blue and hold
controller.lightbar.fadeBlue();

// Fade to black, then return to your set color
controller.lightbar.fadeOut();`}
    />
  </FeaturePage>
);

export default LightbarPage;
