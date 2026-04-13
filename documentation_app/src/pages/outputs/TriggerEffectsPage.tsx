import React, { useContext, useEffect } from "react";
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
  FeedbackDemo,
  WeaponDemo,
  BowDemo,
  GallopingDemo,
  VibrationDemo,
  MachineDemo,
  ResetDemo,
} from "../../components/diagnostics/TriggerEffectsDiagnostic";
import { ControllerContext } from "../../controller";

const TriggerEffectsPage: React.FC = () => {
  const controller = useContext(ControllerContext);

  useEffect(() => {
    return () => {
      controller.resetTriggerFeedback();
    };
  }, [controller]);

  return (
    <FeaturePage
      title="Adaptive Trigger Effects"
      subtitle="7 firmware-driven resistance modes with per-trigger configuration."
    >
      <Prose>
        <p>
          The DualSense's adaptive triggers use built-in motors to create
          physical resistance as you press L2 and R2. Each trigger can be
          independently configured with one of 7 effect types from the{" "}
          <Link to="/api/enums">
            <code>TriggerEffect</code>
          </Link>{" "}
          enum, each with its own set of parameters controlling where the
          resistance starts, how strong it is, and how it behaves.
        </p>
      </Prose>

      <HardwareNote>
        Trigger effect state is automatically restored if the controller
        disconnects and reconnects — no handling required on your end.
      </HardwareNote>

      <SectionHeading>Effect Types</SectionHeading>
      <Prose>
        <p>
          Effect names are based on{" "}
          <a
            href="https://gist.github.com/Nielk1/6d54cc2c00d2201ccb8c2720ad7538db"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nielk1's DualSense trigger effect documentation
          </a>
          . All normalized parameters (0–1) are mapped to the firmware's
          internal ranges automatically.
        </p>
      </Prose>

      <SectionHeading>Feedback</SectionHeading>
      <Prose>
        <p>
          Zone-based continuous resistance from a start position. Everything
          past the <code>position</code> threshold feels stiff — useful for
          braking, aiming tension, or any "hold against pressure" feel.
        </p>
      </Prose>
      <DemoLabel>Adjust parameters and apply to either trigger</DemoLabel>
      <FeedbackDemo />
      <CodeBlock
        code={`import { TriggerEffect } from "dualsense-ts";

controller.right.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.3, // resistance starts at 30% travel
  strength: 0.8, // 0–1
});`}
      />

      <SectionHeading>Weapon</SectionHeading>
      <Prose>
        <p>
          Resistance builds between <code>start</code> and <code>end</code>,
          then snaps through — like pulling a gun trigger. The release point
          creates a satisfying click.
        </p>
      </Prose>
      <WeaponDemo />
      <CodeBlock
        code={`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,    // resistance begins
  end: 0.6,      // snap release point
  strength: 0.9, // 0–1
});`}
      />

      <SectionHeading>Bow</SectionHeading>
      <Prose>
        <p>
          Like Weapon, but with an additional snap-back force after the release
          point — the trigger pushes back against your finger, simulating
          drawing and releasing a bowstring.
        </p>
      </Prose>
      <BowDemo />
      <CodeBlock
        code={`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Bow,
  start: 0.2,
  end: 0.6,
  strength: 0.8,  // pull resistance
  snapForce: 0.6, // snap-back force
});`}
      />

      <SectionHeading>Galloping</SectionHeading>
      <Prose>
        <p>
          Rhythmic two-stroke oscillation between two timing points. Feels like
          a galloping horse or a repeating mechanical action. The{" "}
          <code>firstFoot</code> and <code>secondFoot</code> parameters control
          the timing of each stroke within the cycle.
        </p>
      </Prose>
      <GallopingDemo />
      <CodeBlock
        code={`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Galloping,
  start: 0.1,
  end: 0.9,
  firstFoot: 0.3,  // first stroke timing (0–1)
  secondFoot: 0.6, // second stroke timing (0–1)
  frequency: 20,   // Hz (1–255)
});`}
      />

      <SectionHeading>Vibration</SectionHeading>
      <Prose>
        <p>
          Zone-based oscillation — the trigger vibrates from the{" "}
          <code>position</code> point onward. Good for engine rumble, terrain
          feedback, or any continuous haptic texture.
        </p>
      </Prose>
      <VibrationDemo />
      <CodeBlock
        code={`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Vibration,
  position: 0.1,   // vibration starts at 10% travel
  amplitude: 0.7,  // 0–1
  frequency: 40,   // Hz (1–255)
});`}
      />

      <SectionHeading>Machine</SectionHeading>
      <Prose>
        <p>
          Dual-amplitude vibration that alternates between two intensity levels
          at a configurable frequency and period. The most complex effect —
          simulates machinery, engines, or rhythmic industrial feedback.
        </p>
      </Prose>
      <MachineDemo />
      <CodeBlock
        code={`controller.right.trigger.feedback.set({
  effect: TriggerEffect.Machine,
  start: 0.1,
  end: 0.9,
  amplitudeA: 0.5, // first amplitude (0–1)
  amplitudeB: 0.8, // second amplitude (0–1)
  frequency: 30,   // Hz (1–255)
  period: 5,       // tenths of a second
});`}
      />

      <SectionHeading>Resetting</SectionHeading>
      <Prose>
        <p>
          Reset a single trigger to the default linear feel, or reset both at
          once. The trigger immediately returns to zero resistance.
        </p>
      </Prose>
      <ResetDemo />
      <CodeBlock
        code={`// Reset a single trigger
controller.right.trigger.feedback.reset();

// Reset both triggers at once
controller.resetTriggerFeedback();`}
      />

      <SectionHeading>Reading State</SectionHeading>
      <Prose>
        <p>
          You can read the current effect type and the full configuration
          object at any time. Your editor's type hints will narrow the config
          type based on the active effect.
        </p>
      </Prose>
      <CodeBlock
        code={`// Current effect type
controller.right.trigger.feedback.effect; // TriggerEffect.Off

// Full configuration object
controller.right.trigger.feedback.config;
// { effect: "weapon", start: 0.2, end: 0.6, strength: 0.9 }`}
      />

    </FeaturePage>
  );
};

export default TriggerEffectsPage;
