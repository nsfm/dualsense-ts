import{j as e}from"./index-l8CS40p9.js";import{A as t,S as r,P as n}from"./ApiPage-KfA7eOI8.js";import{a as o}from"./CodeBlock-DSZTVETd.js";const a=()=>e.jsxs(t,{name:"Enums",description:"All enum types exported by dualsense-ts.",children:[e.jsx(r,{children:"TriggerEffect"}),e.jsx(n,{children:e.jsx("p",{children:"Adaptive trigger effect modes."})}),e.jsx(o,{code:`enum TriggerEffect {
  Off, Feedback, Weapon, Bow, Galloping, Vibration, Machine
}`}),e.jsx(r,{children:"ChargeStatus"}),e.jsx(n,{children:e.jsx("p",{children:"Battery charge state."})}),e.jsx(o,{code:`enum ChargeStatus {
  Discharging = 0x0,
  Charging = 0x1,
  Full = 0x2,
  AbnormalVoltage = 0xa,
  AbnormalTemperature = 0xb,
  ChargingError = 0xf,
}`}),e.jsx(r,{children:"PlayerID"}),e.jsx(n,{children:e.jsx("p",{children:"Preset player LED patterns matching the PS5 convention."})}),e.jsx(o,{code:`enum PlayerID {
  Player1 = 4,   // 00100
  Player2 = 10,  // 01010
  Player3 = 21,  // 10101
  Player4 = 27,  // 11011
  All = 31,      // 11111
}`}),e.jsx(r,{children:"DualsenseColor"}),e.jsx(n,{children:e.jsxs("p",{children:["Body color enum values. See ",e.jsx("a",{href:"/dualsense-ts/status",children:"Controller Info"})," for the full color table."]})}),e.jsx(o,{code:`enum DualsenseColor {
  White, MidnightBlack, CosmicRed, NovaPink, GalacticPurple,
  StarlightBlue, GreyCamouflage, VolcanicRed, SterlingSilver,
  CobaltBlue, ChromaTeal, ChromaIndigo, ChromaPearl, Anniversary30th,
  GodOfWarRagnarok, SpiderMan2, AstroBot, Fortnite, TheLastOfUs,
  IconBlueLimitedEdition, GenshinImpact, Unknown,
}`}),e.jsx(r,{children:"Brightness"}),e.jsx(n,{children:e.jsx("p",{children:"Player LED brightness levels."})}),e.jsx(o,{code:"enum Brightness { High, Medium, Low }"}),e.jsx(r,{children:"MuteLedMode"}),e.jsx(n,{children:e.jsx("p",{children:"Mute button LED override modes."})}),e.jsx(o,{code:"enum MuteLedMode { Off, On, Pulse }"}),e.jsx(r,{children:"AudioOutput"}),e.jsx(n,{children:e.jsx("p",{children:"Audio routing targets."})}),e.jsx(o,{code:"enum AudioOutput { Headphone, HeadphoneMono, Split, Speaker }"}),e.jsx(r,{children:"MicSelect"}),e.jsx(n,{children:e.jsx("p",{children:"Microphone source selection."})}),e.jsx(o,{code:"enum MicSelect { Internal, Headset }"}),e.jsx(r,{children:"MicMode"}),e.jsx(n,{children:e.jsx("p",{children:"Microphone processing modes."})}),e.jsx(o,{code:"enum MicMode { Default, Chat, ASR }"}),e.jsx(r,{children:"InputId"}),e.jsx(n,{children:e.jsx("p",{children:"String identifiers for every input on the controller."})}),e.jsx(o,{code:`enum InputId {
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
}`}),e.jsx(r,{children:"PulseOptions"}),e.jsx(n,{children:e.jsx("p",{children:"Lightbar fade effects."})}),e.jsx(o,{code:"enum PulseOptions { Off, FadeBlue, FadeOut }"}),e.jsx(r,{children:"PowerSave"}),e.jsx(n,{children:e.jsx("p",{children:"Power-save flags for selectively disabling features."})}),e.jsx(o,{code:`enum PowerSave {
  DisableTouch, DisableMotion, DisableHaptics, DisableAudio,
  MuteMicrophone, MuteSpeaker, MuteHeadphone, MuteHaptics,
}`})]});export{a as default};
