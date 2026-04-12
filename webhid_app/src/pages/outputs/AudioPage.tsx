import React, { useContext } from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { AudioControls, AudioIndicator } from "../../components/hud";
import { ControllerContext } from "../../controller";

const AudioPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  return (
  <FeaturePage
    title="Audio"
    subtitle="Speaker, headphone, and microphone controls with routing and test tones."
  >
    <Prose>
      <p>
        The DualSense has a built-in speaker, a 3.5mm headphone jack, and a
        built-in microphone array. The audio system supports volume control,
        output routing, microphone modes, and DSP test tones.
      </p>
      <p>
        <strong>Note:</strong> Audio streaming requires a USB connection.
        Bluetooth connections have limited audio support.
      </p>
    </Prose>

    <DemoLabel>Live Demo — adjust audio settings</DemoLabel>
    <DemoArea style={{ flexDirection: "column", gap: 16 }}>
      <AudioIndicator />
      {controller && <AudioControls controller={controller} />}
    </DemoArea>

    <SectionHeading>Volume Control</SectionHeading>
    <CodeBlock
      code={`// Speaker volume (0–255)
controller.audio.setSpeakerVolume(128);

// Headphone volume (0–255)
controller.audio.setHeadphoneVolume(200);

// Microphone volume (0–255)
controller.audio.setMicrophoneVolume(100);`}
    />

    <SectionHeading>Audio Routing</SectionHeading>
    <CodeBlock
      code={`// Route audio to different outputs
controller.audio.setOutput("speaker");
controller.audio.setOutput("headphone");
controller.audio.setOutput("both");`}
    />

    <SectionHeading>Microphone</SectionHeading>
    <CodeBlock
      code={`// Microphone source
controller.audio.setMicSelect("internal");
controller.audio.setMicSelect("external");

// Microphone mode
controller.audio.setMicMode("normal");

// Preamp gain
controller.audio.setPreamp(128);`}
    />

    <SectionHeading>Test Tones</SectionHeading>
    <Prose>
      <p>
        The controller's DSP can generate test tones routed to the speaker or
        headphones:
      </p>
    </Prose>
    <CodeBlock
      code={`// Start a test tone
controller.startTestTone("speaker", "sine250");

// Stop the test tone
controller.stopTestTone();`}
    />

    <SectionHeading>Detecting Audio Peripherals</SectionHeading>
    <CodeBlock
      code={`// Check if headphones are connected
controller.headphone.on("change", (hp) => {
  console.log(hp.state ? "Headphones connected" : "Headphones disconnected");
});

// Check if microphone is active
controller.microphone.on("change", (mic) => {
  console.log(mic.state ? "Mic active" : "Mic inactive");
});`}
    />
  </FeaturePage>
  );
};

export default AudioPage;
