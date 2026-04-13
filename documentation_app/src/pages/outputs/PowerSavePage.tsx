import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";
import { PowerSaveDiagnostic } from "../../components/diagnostics/PowerSaveDiagnostic";

const PowerSavePage: React.FC = () => (
  <FeaturePage
    title="Power Save"
    subtitle="Selectively disable controller subsystems to conserve battery."
  >
    <Prose>
      <p>
        The DualSense's output report includes a set of power save flags
        intended to control individual subsystems on the controller hardware.
        The <strong>mute flags</strong> (haptic mute and the per-channel
        audio mutes on{" "}
        <Link to="/outputs/audio"><code>Audio</code></Link>) have confirmed
        observable effects. The <strong>subsystem disable flags</strong>{" "}
        (touch, motion, haptics, audio) are valid protocol bits but produce
        no confirmed observable change in our testing — they may affect
        internal power draw without changing host-visible behavior.
      </p>
      <p>
        Power save is controlled through{" "}
        <code>controller.powerSave</code>, which exposes boolean
        properties for each subsystem. All subsystems are enabled by default.
      </p>
    </Prose>
    <HardwareNote>
      The <strong>mute flags</strong> (<code>hapticsMuted</code> and the
      per-channel audio mutes on <code>Audio</code>) have confirmed
      observable effects. The <strong>disable flags</strong>{" "}
      (<code>touch</code>, <code>motion</code>, <code>haptics</code>,{" "}
      <code>audio</code>) are valid protocol bits sent to the controller,
      but in our testing they produce no observable change to the input data
      stream or output behavior. They may reduce internal power draw without
      changing host-visible behavior, or they may be unimplemented in
      current DualSense firmware. The flags are included because they are
      part of the documented output report structure and may be honored by
      future firmware revisions or hardware variants.
    </HardwareNote>

    <SectionHeading>Live Control</SectionHeading>
    <DemoLabel>Toggle subsystems and test mute/disable flags</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <PowerSaveDiagnostic />
    </DemoArea>

    <SectionHeading>Subsystem Control</SectionHeading>
    <Prose>
      <p>
        Four subsystems can be independently disabled: <strong>touch</strong>{" "}
        (touchpad input), <strong>motion</strong> (gyroscope and
        accelerometer), <strong>haptics</strong> (rumble motors and adaptive
        triggers), and <strong>audio</strong> (speaker, headphone, and
        microphone processing).
      </p>
    </Prose>
    <CodeBlock
      code={`// Disable subsystems you don't need
controller.powerSave.motion = false;  // turn off IMU
controller.powerSave.touch = false;   // turn off touchpad

// Re-enable when needed
controller.powerSave.motion = true;

// Check current state
controller.powerSave.motion; // true`}
    />

    <SectionHeading>Bulk Control</SectionHeading>
    <Prose>
      <p>
        Use <code>set()</code> to configure multiple subsystems at once,
        or <code>reset()</code> to re-enable everything.
      </p>
    </Prose>
    <CodeBlock
      code={`// Disable everything except audio
controller.powerSave.set({
  touch: false,
  motion: false,
  haptics: false,
});

// Re-enable all subsystems
controller.powerSave.reset();`}
    />

    <SectionHeading>Haptic Mute</SectionHeading>
    <Prose>
      <p>
        In addition to fully disabling the haptic processor, you can
        <strong> mute</strong> haptic output while keeping the processor
        running. This is a lighter-weight option — the controller still
        processes haptic commands but suppresses the motors.
      </p>
    </Prose>
    <CodeBlock
      code={`// Soft mute: processor stays active, motors silenced
controller.powerSave.hapticsMuted = true;

// Hard disable: processor powers down entirely
controller.powerSave.haptics = false;`}
    />

    <SectionHeading>Audio Mutes vs Audio Disable</SectionHeading>
    <Prose>
      <p>
        The <Link to="/outputs/audio"><code>Audio</code></Link> controls
        include per-channel mutes (speaker, headphone, microphone) that
        silence individual outputs without powering down the audio processor.
        The <code>powerSave.audio</code> flag is more aggressive — it
        disables the entire audio DSP, which saves more power but cuts off
        all audio functionality.
      </p>
    </Prose>
    <CodeBlock
      code={`// Soft mutes (per-channel, audio processor stays on)
controller.audio.muteSpeaker();
controller.audio.muteMicrophone();

// Hard disable (powers down the entire audio DSP)
controller.powerSave.audio = false;`}
    />

    <HardwareNote>
      The controller does not report power save status back in the input
      report. <code>controller.powerSave</code> is always the authoritative
      source of truth for which flags have been sent.
    </HardwareNote>

    <SectionHeading>Battery Optimization Example</SectionHeading>
    <Prose>
      <p>
        A typical optimization for a game that only uses buttons and analog
        sticks — disable everything else to maximize battery life:
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();

// Only keep buttons and analog sticks
controller.powerSave.set({
  motion: false,    // no gyro/accel needed
  touch: false,     // no touchpad needed
  audio: false,     // no speaker/mic needed
});

// Haptics stay enabled for rumble feedback
controller.powerSave.haptics; // true

// Later, when entering a motion-control section:
controller.powerSave.motion = true;`}
    />
  </FeaturePage>
);

export default PowerSavePage;
