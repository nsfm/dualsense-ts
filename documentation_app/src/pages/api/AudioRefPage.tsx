import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const AudioRefPage: React.FC = () => (
  <ApiPage
    name="Audio"
    description="Speaker, headphone, and microphone controls including volume, routing, muting, preamp, and DSP test tones. Requires USB connection."
    source="src/elements/audio.ts"
  >
    <Prose>
      <p>
        The <code>Audio</code> class is not an <code>Input</code> subclass — it's
        an output-only controller accessed via <code>controller.audio</code>.
        Audio streaming requires a USB connection; Bluetooth has limited support.
      </p>
    </Prose>

    <SectionHeading>Volume Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "speakerVolume", type: "number", description: "Speaker volume 0.0–1.0" },
        { name: "headphoneVolume", type: "number", description: "Headphone volume 0.0–1.0" },
        { name: "microphoneVolume", type: "number", description: "Microphone volume 0.0–1.0" },
        { name: "speakerMuted", type: "boolean", description: "Whether the speaker is muted" },
        { name: "headphoneMuted", type: "boolean", description: "Whether the headphone is muted" },
        { name: "microphoneMuted", type: "boolean", description: "Whether the microphone is muted" },
      ]}
    />

    <SectionHeading>Routing Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "output", type: "AudioOutput", description: "Current audio routing: Headphone, Speaker, or Split" },
        { name: "preampGain", type: "number", description: "Speaker preamp gain 0–7" },
        { name: "beamForming", type: "boolean", description: "Microphone beam forming enabled" },
      ]}
    />

    <SectionHeading>Volume Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "setSpeakerVolume", signature: "setSpeakerVolume(volume: number): void", description: "Set speaker volume (0.0–1.0, mapped to 0x00–0x64)." },
        { name: "setHeadphoneVolume", signature: "setHeadphoneVolume(volume: number): void", description: "Set headphone volume (0.0–1.0, mapped to 0x00–0x7F)." },
        { name: "setMicrophoneVolume", signature: "setMicrophoneVolume(volume: number): void", description: "Set microphone volume (0.0–1.0, mapped to 0x00–0x40)." },
        { name: "muteSpeaker", signature: "muteSpeaker(muted?: boolean): void", description: "Mute or unmute the speaker." },
        { name: "muteHeadphone", signature: "muteHeadphone(muted?: boolean): void", description: "Mute or unmute the headphone." },
        { name: "muteMicrophone", signature: "muteMicrophone(muted?: boolean): void", description: "Mute or unmute the microphone." },
      ]}
    />

    <SectionHeading>Routing Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "setOutput", signature: "setOutput(output: AudioOutput): void", description: "Route audio to Speaker, Headphone, or Split." },
        { name: "setPreamp", signature: "setPreamp(gain: number, beamForming?: boolean): void", description: "Set speaker preamp gain (0–7) and optional beam forming." },
        { name: "setMicSelect", signature: "setMicSelect(source: MicSelect): void", description: 'Select microphone source: "Internal" or "Headset".' },
        { name: "setMicMode", signature: "setMicMode(mode: MicMode): void", description: 'Set mic processing mode: "Default", "Chat", or "ASR".' },
        { name: "setMicFlags", signature: "setMicFlags(flags: number): void", description: "Set raw microphone processing flags (echo/noise cancel)." },
      ]}
    />

    <SectionHeading>Enums</SectionHeading>
    <CodeBlock
      code={`enum AudioOutput {
  Headphone,
  HeadphoneMono,
  Split,
  Speaker,
}

enum MicSelect {
  Internal,
  Headset,
}

enum MicMode {
  Default,
  Chat,
  ASR,
}`}
    />
  </ApiPage>
);

export default AudioRefPage;
