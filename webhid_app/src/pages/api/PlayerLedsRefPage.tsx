import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  CodeBlock,
} from "../../components/ApiPage";

const PlayerLedsRefPage: React.FC = () => (
  <ApiPage
    name="PlayerLeds"
    description="Five white LEDs below the touchpad. Individually toggleable with adjustable brightness."
    source="src/elements/player_leds.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "bitmask", type: "number", description: "Current 5-bit LED pattern (0–31). Each bit = one LED." },
        { name: "brightness", type: "Brightness", description: 'Current brightness level: "High", "Medium", or "Low"' },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "set", signature: "set(bitmask: number): void", description: "Set all 5 LEDs at once using a bitmask (0b00000 to 0b11111)." },
        { name: "setLed", signature: "setLed(index: number, on: boolean): void", description: "Toggle a single LED by index (0–4)." },
        { name: "getLed", signature: "getLed(index: number): boolean", description: "Check if a specific LED is on." },
        { name: "clear", signature: "clear(): void", description: "Turn all LEDs off." },
        { name: "setBrightness", signature: "setBrightness(brightness: Brightness): void", description: 'Set brightness: "High", "Medium", or "Low".' },
      ]}
    />

    <SectionHeading>Brightness Enum</SectionHeading>
    <CodeBlock
      code={`enum Brightness {
  High,
  Medium,
  Low,
}`}
    />

    <SectionHeading>Example</SectionHeading>
    <CodeBlock
      code={`// Player 1 pattern
controller.playerLeds.set(0b00100);

// Player 3 pattern
controller.playerLeds.set(0b10101);

// Toggle individual LEDs
controller.playerLeds.setLed(0, true);
controller.playerLeds.setLed(4, true);

// Adjust brightness
controller.playerLeds.setBrightness("medium");`}
    />
  </ApiPage>
);

export default PlayerLedsRefPage;
