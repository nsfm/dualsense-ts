import{j as e}from"./index-Bm_ty-o0.js";import{A as i,P as r,S as o,a as t,M as n}from"./ApiPage-CauOyyZd.js";import{a}from"./CodeBlock-BDmjJVby.js";const m=()=>e.jsxs(i,{name:"Audio",description:"Speaker, headphone, and microphone controls including volume, routing, muting, preamp, and DSP test tones. Requires USB connection.",source:"src/elements/audio.ts",children:[e.jsx(r,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"Audio"})," class is not an ",e.jsx("code",{children:"Input"})," subclass — it's an output-only controller accessed via ",e.jsx("code",{children:"controller.audio"}),". Audio streaming requires a USB connection; Bluetooth has limited support."]})}),e.jsx(o,{children:"Volume Properties"}),e.jsx(t,{properties:[{name:"speakerVolume",type:"number",description:"Speaker volume 0.0–1.0"},{name:"headphoneVolume",type:"number",description:"Headphone volume 0.0–1.0"},{name:"microphoneVolume",type:"number",description:"Microphone volume 0.0–1.0"},{name:"speakerMuted",type:"boolean",description:"Whether the speaker is muted"},{name:"headphoneMuted",type:"boolean",description:"Whether the headphone is muted"},{name:"microphoneMuted",type:"boolean",description:"Whether the microphone is muted"}]}),e.jsx(o,{children:"Routing Properties"}),e.jsx(t,{properties:[{name:"output",type:"AudioOutput",description:"Current audio routing: Headphone, Speaker, or Split"},{name:"preampGain",type:"number",description:"Speaker preamp gain 0–7"},{name:"beamForming",type:"boolean",description:"Microphone beam forming enabled"}]}),e.jsx(o,{children:"Volume Methods"}),e.jsx(n,{methods:[{name:"setSpeakerVolume",signature:"setSpeakerVolume(volume: number): void",description:"Set speaker volume (0.0–1.0, mapped to 0x00–0x64)."},{name:"setHeadphoneVolume",signature:"setHeadphoneVolume(volume: number): void",description:"Set headphone volume (0.0–1.0, mapped to 0x00–0x7F)."},{name:"setMicrophoneVolume",signature:"setMicrophoneVolume(volume: number): void",description:"Set microphone volume (0.0–1.0, mapped to 0x00–0x40)."},{name:"muteSpeaker",signature:"muteSpeaker(muted?: boolean): void",description:"Mute or unmute the speaker."},{name:"muteHeadphone",signature:"muteHeadphone(muted?: boolean): void",description:"Mute or unmute the headphone."},{name:"muteMicrophone",signature:"muteMicrophone(muted?: boolean): void",description:"Mute or unmute the microphone."}]}),e.jsx(o,{children:"Routing Methods"}),e.jsx(n,{methods:[{name:"setOutput",signature:"setOutput(output: AudioOutput): void",description:"Route audio to Speaker, Headphone, or Split."},{name:"setPreamp",signature:"setPreamp(gain: number, beamForming?: boolean): void",description:"Set speaker preamp gain (0–7) and optional beam forming."},{name:"setMicSelect",signature:"setMicSelect(source: MicSelect): void",description:'Select microphone source: "Internal" or "Headset".'},{name:"setMicMode",signature:"setMicMode(mode: MicMode): void",description:'Set mic processing mode: "Default", "Chat", or "ASR".'},{name:"setMicFlags",signature:"setMicFlags(flags: number): void",description:"Set raw microphone processing flags (echo/noise cancel)."}]}),e.jsx(o,{children:"Enums"}),e.jsx(a,{code:`enum AudioOutput {
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
}`})]});export{m as default};
