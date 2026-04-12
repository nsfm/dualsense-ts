import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { PlayerLedControls, PlayerLedBar } from "../../components/hud";

const PlayerLedsPage: React.FC = () => (
  <FeaturePage
    title="Player LEDs"
    subtitle="5 white LEDs with individual control and adjustable brightness."
  >
    <Prose>
      <p>
        Below the touchpad are 5 small white LEDs used to indicate player
        number. Each LED can be individually toggled, and the overall brightness
        can be adjusted.
      </p>
    </Prose>

    <DemoLabel>Live Demo — toggle LEDs and adjust brightness</DemoLabel>
    <DemoArea style={{ flexDirection: "column", gap: 16 }}>
      <PlayerLedBar />
      <PlayerLedControls />
    </DemoArea>

    <SectionHeading>Setting a Pattern</SectionHeading>
    <CodeBlock
      code={`// Set using a 5-bit bitmask (each bit = one LED)
controller.playerLeds.set(0b10101);  // LEDs 1, 3, 5 on

// Set individual LEDs (index 0–4, on/off)
controller.playerLeds.setLed(0, true);
controller.playerLeds.setLed(2, true);
controller.playerLeds.setLed(4, true);

// Clear all LEDs
controller.playerLeds.clear();`}
    />

    <SectionHeading>Brightness</SectionHeading>
    <CodeBlock
      code={`// Adjust brightness
controller.playerLeds.setBrightness("high");
controller.playerLeds.setBrightness("medium");
controller.playerLeds.setBrightness("low");`}
    />

    <SectionHeading>Reading LED State</SectionHeading>
    <CodeBlock
      code={`// Read the current 5-bit bitmask
const mask = controller.playerLeds.bitmask;
console.log(mask.toString(2).padStart(5, "0"));`}
    />

    <SectionHeading>Automatic Player Assignment</SectionHeading>
    <Prose>
      <p>
        When using <code>DualsenseManager</code> for multiplayer, player LEDs
        are automatically assigned to indicate player number. See the{" "}
        <a href="/dualsense-ts/multiplayer">Multiplayer</a> page for details.
      </p>
    </Prose>
  </FeaturePage>
);

export default PlayerLedsPage;
