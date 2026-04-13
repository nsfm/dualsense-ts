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
import { PlayerLedsDiagnostic } from "../../components/diagnostics/PlayerLedsDiagnostic";

const PlayerLedsPage: React.FC = () => (
  <FeaturePage
    title="Player LEDs"
    subtitle="5 white LEDs with individual control and adjustable brightness."
  >
    <Prose>
      <p>
        Below the touchpad are 5 small white LEDs used to indicate player
        number. Each can be individually toggled via{" "}
        <Link to="/api/player-leds"><code>playerLeds</code></Link>, and the
        overall brightness can be set to one of three levels.
      </p>
    </Prose>

    <DemoLabel>Toggle LEDs, pick a preset, or adjust brightness</DemoLabel>
    <PlayerLedsDiagnostic />

    <SectionHeading>Preset Patterns</SectionHeading>
    <Prose>
      <p>
        Use the{" "}
        <Link to="/api/enums"><code>PlayerID</code></Link> enum for standard PS5 player patterns,
        or pass any 5-bit bitmask directly. Each bit corresponds to one LED
        from left to right.
      </p>
    </Prose>
    <CodeBlock
      code={`import { PlayerID } from "dualsense-ts";

// Use a preset pattern
controller.playerLeds.set(PlayerID.Player1); // center LED
controller.playerLeds.set(PlayerID.All);     // all five on

// Or use a raw bitmask (5 bits, one per LED)
controller.playerLeds.set(0b10101); // LEDs 1, 3, 5 on

// Toggle individual LEDs (index 0–4)
controller.playerLeds.setLed(0, true);
controller.playerLeds.setLed(4, true);

// Clear all
controller.playerLeds.clear();`}
    />

    <SectionHeading>Brightness</SectionHeading>
    <Prose>
      <p>
        The{" "}
        <Link to="/api/enums"><code>Brightness</code></Link> enum provides three levels. This
        affects all five LEDs uniformly.
      </p>
    </Prose>
    <CodeBlock
      code={`import { Brightness } from "dualsense-ts";

controller.playerLeds.setBrightness(Brightness.High);   // default
controller.playerLeds.setBrightness(Brightness.Medium);
controller.playerLeds.setBrightness(Brightness.Low);

// Read the current level
controller.playerLeds.brightness; // Brightness.Low`}
    />

    <SectionHeading>Reading State</SectionHeading>
    <CodeBlock
      code={`// Current 5-bit bitmask
controller.playerLeds.bitmask; // e.g. 4 (0b00100 = Player1)

// Individual LED state
controller.playerLeds.getLed(2); // true

// Current brightness
controller.playerLeds.brightness; // Brightness.High`}
    />

    <SectionHeading>Automatic Player Assignment</SectionHeading>
    <Prose>
      <p>
        When using{" "}
        <Link to="/api/manager"><code>DualsenseManager</code></Link> for{" "}
        <Link to="/multiplayer">multiplayer</Link>, player LEDs are
        automatically assigned as controllers connect. The first four
        follow the PS5 console convention; slots 5–31 use the remaining
        5-bit combinations.
      </p>
    </Prose>
    <HardwareNote>
      Auto-assignment can be disabled with{" "}
      <code>manager.autoAssignPlayerLeds = false</code> if you want full
      manual control.
    </HardwareNote>
    <CodeBlock
      code={`import { DualsenseManager, PlayerID, Brightness } from "dualsense-ts";

const manager = new DualsenseManager();

// Override a specific slot's LED pattern
manager.setPlayerPattern(4, 0b10001); // outer two LEDs

// Disable auto-assignment
manager.autoAssignPlayerLeds = false;
manager.get(0)?.playerLeds.set(PlayerID.All);
manager.get(0)?.playerLeds.setBrightness(Brightness.Low);`}
    />
  </FeaturePage>
);

export default PlayerLedsPage;
