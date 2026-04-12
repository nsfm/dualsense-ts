import React from "react";
import {
  ApiPage,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const EnumsPage: React.FC = () => (
  <ApiPage
    name="Enums"
    description="All enum types exported by dualsense-ts."
  >
    <SectionHeading>TriggerEffect</SectionHeading>
    <Prose><p>Adaptive trigger effect modes.</p></Prose>
    <CodeBlock code={`enum TriggerEffect {
  Off, Feedback, Weapon, Bow, Galloping, Vibration, Machine
}`} />

    <SectionHeading>ChargeStatus</SectionHeading>
    <Prose><p>Battery charge state.</p></Prose>
    <CodeBlock code={`enum ChargeStatus {
  Discharging, Charging, ChargingError
}`} />

    <SectionHeading>Brightness</SectionHeading>
    <Prose><p>Player LED brightness levels.</p></Prose>
    <CodeBlock code={`enum Brightness { High, Medium, Low }`} />

    <SectionHeading>MuteLedMode</SectionHeading>
    <Prose><p>Mute button LED override modes.</p></Prose>
    <CodeBlock code={`enum MuteLedMode { Off, On, Pulse }`} />

    <SectionHeading>AudioOutput</SectionHeading>
    <Prose><p>Audio routing targets.</p></Prose>
    <CodeBlock code={`enum AudioOutput { Headphone, HeadphoneMono, Split, Speaker }`} />

    <SectionHeading>MicSelect</SectionHeading>
    <Prose><p>Microphone source selection.</p></Prose>
    <CodeBlock code={`enum MicSelect { Internal, Headset }`} />

    <SectionHeading>MicMode</SectionHeading>
    <Prose><p>Microphone processing modes.</p></Prose>
    <CodeBlock code={`enum MicMode { Default, Chat, ASR }`} />

    <SectionHeading>InputId</SectionHeading>
    <Prose><p>String identifiers for every input on the controller.</p></Prose>
    <CodeBlock code={`enum InputId {
  Options, Create, Playstation, Mute,
  Triangle, Circle, Cross, Square,
  DpadUp, DpadDown, DpadLeft, DpadRight,
  TouchButton, TouchX0, TouchX1, TouchY0, TouchY1,
  TouchContact0, TouchContact1, TouchId0, TouchId1,
  LeftAnalogButton, RightAnalogButton,
  LeftTrigger, RightTrigger,
  LeftBumper, RightBumper,
  LeftAnalogX, LeftAnalogY, RightAnalogX, RightAnalogY,
  GyroX, GyroY, GyroZ, AccelX, AccelY, AccelZ,
  BatteryLevel, BatteryStatus, MuteLed,
  Microphone, Headphone, Unknown,
}`} />

    <SectionHeading>PulseOptions</SectionHeading>
    <Prose><p>Lightbar fade effects.</p></Prose>
    <CodeBlock code={`enum PulseOptions { Off, FadeBlue, FadeOut }`} />

    <SectionHeading>PowerSave</SectionHeading>
    <Prose><p>Power-save flags for selectively disabling features.</p></Prose>
    <CodeBlock code={`enum PowerSave {
  DisableTouch, DisableMotion, DisableHaptics, DisableAudio,
  MuteMicrophone, MuteSpeaker, MuteHeadphone, MuteHaptics,
}`} />
  </ApiPage>
);

export default EnumsPage;
