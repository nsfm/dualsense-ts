import{a as o,C,j as e,d as a,g as s,L as v}from"./index-GGWi0Ont.js";import{F as q,P as j,H as V,S as M,D as F}from"./FeaturePage-DywfdRev.js";import{a as S}from"./CodeBlock-Dvv7tnEL.js";const H=s.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child {
    border-radius: 8px 8px 0 0;
  }

  & > :last-child {
    border-radius: 0 0 8px 8px;
  }
`,y=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,A=s.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,J=s.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,K=s.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 86px;
  flex-shrink: 0;
`,X=s.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 40px;
  text-align: right;
  flex-shrink: 0;
`,Z=s.div`
  position: relative;
  flex: 1;
  height: 24px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
`,ee=s.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  background: ${t=>t.$color?`linear-gradient(90deg, ${t.$color}40, ${t.$color}90)`:"linear-gradient(90deg, rgba(72, 175, 240, 0.25), rgba(72, 175, 240, 0.55))"};
  pointer-events: none;
  transition: width 0.04s;
`,te=s.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 16px;
  margin-left: -1.5px;
  border-radius: 1.5px;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-50%);
  pointer-events: none;
  transition: left 0.04s;
`,oe=s.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`,$=s.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,c=s.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${t=>t.$active?"rgba(72, 175, 240, 0.6)":"rgba(72, 175, 240, 0.3)"};
  background: ${t=>t.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.08)"};
  color: ${t=>t.$active?"#48aff0":"rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`,I=s.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid
    ${t=>t.$muted?"rgba(242, 158, 2, 0.6)":"rgba(72, 175, 240, 0.3)"};
  background: ${t=>t.$muted?"rgba(242, 158, 2, 0.2)":"rgba(72, 175, 240, 0.08)"};
  color: ${t=>t.$muted?"#f29e02":"rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: ${t=>t.$muted?"rgba(242, 158, 2, 0.25)":"rgba(72, 175, 240, 0.15)"};
  }
`,ne=s(c)`
  border-color: rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`,b=s.span`
  color: rgba(191, 204, 214, 0.3);
`,O=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,_=s.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,P=s.code`
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
  transition: color 0.06s;
`,w=s.div`
  padding: 6px 16px 2px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`,D=({label:t,value:r,onChange:p,min:n=0,max:l=1,step:d=.01,format:x,even:i,color:m})=>{const h=(r-n)/(l-n)*100;return e.jsxs(J,{$even:i,children:[e.jsx(K,{children:t}),e.jsxs(Z,{children:[e.jsx(ee,{style:{width:`${h}%`},$color:m}),e.jsx(te,{style:{left:`${h}%`}}),e.jsx(oe,{type:"range",min:n,max:l,step:d,value:r,onChange:f=>p(Number(f.target.value))})]}),e.jsx(X,{children:x?x(r):`${Math.round(r*100)}%`})]})},re=()=>{const t=o.useContext(C),[r,p]=o.useState(t.audio.speakerVolume),[n,l]=o.useState(t.audio.headphoneVolume),[d,x]=o.useState(t.audio.microphoneVolume),[i,m]=o.useState(t.audio.speakerMuted),[h,f]=o.useState(t.audio.headphoneMuted),[k,R]=o.useState(t.audio.microphoneMuted),[u,T]=o.useState(t.mute.status.state);o.useEffect(()=>{const g=()=>T(t.mute.status.state);return t.mute.status.on("change",g),()=>{t.mute.status.removeListener("change",g)}},[t]);const U=o.useCallback(g=>{p(g),t.audio.setSpeakerVolume(g)},[t]),N=o.useCallback(g=>{l(g),t.audio.setHeadphoneVolume(g)},[t]),G=o.useCallback(g=>{x(g),t.audio.setMicrophoneVolume(g)},[t]),W=o.useCallback(()=>{t.audio.muteSpeaker(!i),m(!i)},[t,i]),Q=o.useCallback(()=>{t.audio.muteHeadphone(!h),f(!h)},[t,h]),Y=o.useCallback(()=>{t.audio.muteMicrophone(!k),R(!k)},[t,k]);return e.jsxs(H,{children:[e.jsx(y,{children:e.jsx(A,{children:"volume & mute"})}),e.jsx(D,{label:"speaker",value:r,onChange:U}),e.jsx(D,{label:"headphone",value:n,onChange:N,even:!0}),e.jsx(D,{label:"microphone",value:d,onChange:G}),e.jsx(w,{children:"mute"}),e.jsxs($,{children:[e.jsx(I,{$muted:i,onClick:W,children:i?"Speaker Muted":"Speaker"}),e.jsx(I,{$muted:h,onClick:Q,children:h?"Headphone Muted":"Headphone"}),e.jsx(I,{$muted:k,onClick:Y,children:k?"Mic Muted":"Mic"})]}),e.jsxs(O,{children:[e.jsx(_,{children:e.jsxs("bdi",{children:[e.jsx(b,{children:"controller."}),"mute",e.jsx(b,{children:"."}),"status",e.jsx(b,{children:"."}),"state"]})}),e.jsx(P,{$highlight:u,children:u?"true (muted)":"false"})]})]})};function ae(t){switch(t){case a.AudioOutput.Headphone:return"AudioOutput.Headphone";case a.AudioOutput.HeadphoneMono:return"AudioOutput.HeadphoneMono";case a.AudioOutput.Split:return"AudioOutput.Split";case a.AudioOutput.Speaker:return"AudioOutput.Speaker";default:return`${t}`}}const se=()=>{const t=o.useContext(C),[r,p]=o.useState(t.audio.output),n=o.useCallback(l=>{p(l),t.audio.setOutput(l)},[t]);return e.jsxs(H,{children:[e.jsx(y,{children:e.jsx(A,{children:"output routing"})}),e.jsxs($,{children:[e.jsx(c,{$active:r===a.AudioOutput.Headphone,onClick:()=>n(a.AudioOutput.Headphone),children:"Headphone"}),e.jsx(c,{$active:r===a.AudioOutput.HeadphoneMono,onClick:()=>n(a.AudioOutput.HeadphoneMono),children:"HP Mono"}),e.jsx(c,{$active:r===a.AudioOutput.Split,onClick:()=>n(a.AudioOutput.Split),children:"Split"}),e.jsx(c,{$active:r===a.AudioOutput.Speaker,onClick:()=>n(a.AudioOutput.Speaker),children:"Speaker"})]}),e.jsxs(O,{children:[e.jsx(_,{children:e.jsxs("bdi",{children:[e.jsx(b,{children:"controller."}),"audio",e.jsx(b,{children:"."}),"output"]})}),e.jsx(P,{$highlight:r!==a.AudioOutput.Headphone,children:ae(r)})]})]})},ie=()=>{const t=o.useContext(C),[r,p]=o.useState(null),[n,l]=o.useState(a.MicMode.Default),[d,x]=o.useState(t.audio.preampGain),[i,m]=o.useState(t.audio.beamForming),h=o.useCallback(u=>{p(u),t.audio.setMicSelect(u)},[t]),f=o.useCallback(u=>{l(u),t.audio.setMicMode(u)},[t]),k=o.useCallback(u=>{const T=Math.round(u);x(T),t.audio.setPreamp(T,i)},[t,i]),R=o.useCallback(()=>{const u=!i;m(u),t.audio.setPreamp(d,u)},[t,d,i]);return e.jsxs(H,{children:[e.jsx(y,{children:e.jsx(A,{children:"microphone"})}),e.jsx(w,{children:"source"}),e.jsxs($,{children:[e.jsx(c,{$active:r===a.MicSelect.Internal,onClick:()=>h(a.MicSelect.Internal),children:"Internal"}),e.jsx(c,{$active:r===a.MicSelect.Headset,onClick:()=>h(a.MicSelect.Headset),children:"Headset"})]}),e.jsx(w,{children:"mode"}),e.jsxs($,{children:[e.jsx(c,{$active:n===a.MicMode.Default,onClick:()=>f(a.MicMode.Default),children:"Default"}),e.jsx(c,{$active:n===a.MicMode.Chat,onClick:()=>f(a.MicMode.Chat),children:"Chat"}),e.jsx(c,{$active:n===a.MicMode.ASR,onClick:()=>f(a.MicMode.ASR),children:"ASR"})]}),e.jsx(w,{children:"preamp"}),e.jsx(D,{label:"gain",value:d,onChange:k,min:0,max:7,step:1,format:u=>`${Math.round(u)}`}),e.jsx($,{children:e.jsxs(c,{$active:i,onClick:R,children:["Beam Forming ",i?"On":"Off"]})}),e.jsxs(O,{children:[e.jsx(_,{children:e.jsxs("bdi",{children:[e.jsx(b,{children:"controller."}),"audio",e.jsx(b,{children:"."}),"preampGain"]})}),e.jsx(P,{children:d})]}),e.jsxs(O,{$even:!0,children:[e.jsx(_,{children:e.jsxs("bdi",{children:[e.jsx(b,{children:"controller."}),"audio",e.jsx(b,{children:"."}),"beamForming"]})}),e.jsx(P,{$highlight:i,children:i?"true":"false"})]})]})},ce=()=>{const t=o.useContext(C),[r,p]=o.useState("speaker"),[n,l]=o.useState(!1),d=o.useRef(n);d.current=n;const x=o.useCallback(async m=>{n===m?(await t.stopTestTone(),l(!1)):(n&&await t.stopTestTone(),await t.startTestTone(r,m),l(m))},[t,n,r]),i=o.useCallback(async()=>{await t.stopTestTone(),l(!1)},[t]);return o.useEffect(()=>()=>{d.current&&t.stopTestTone()},[t]),e.jsxs(H,{children:[e.jsx(y,{children:e.jsx(A,{children:"test tones"})}),e.jsx(w,{children:"target"}),e.jsxs($,{children:[e.jsx(c,{$active:r==="speaker",onClick:()=>p("speaker"),children:"Speaker"}),e.jsx(c,{$active:r==="headphone",onClick:()=>p("headphone"),children:"Headphone"})]}),e.jsx(w,{children:"tone"}),e.jsxs($,{children:[e.jsx(c,{$active:n==="1khz",onClick:()=>x("1khz"),children:"1 kHz"}),e.jsx(c,{$active:n==="100hz",onClick:()=>x("100hz"),children:"~100 Hz"}),e.jsx(c,{$active:n==="both",onClick:()=>x("both"),children:"Both"}),e.jsx(ne,{onClick:i,children:"Stop"})]})]})},z=s.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${t=>t.$active?"#3dcc91":"rgba(191, 204, 214, 0.15)"};
  box-shadow: ${t=>t.$active?"0 0 6px rgba(61, 204, 145, 0.5)":"none"};
  flex-shrink: 0;
  transition: all 0.15s;
`,B=s.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,E=s.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.6);
  flex: 1;
`,L=s.code`
  font-size: 12px;
  color: ${t=>t.$active?"#3dcc91":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.15s;
`,le=()=>{const t=o.useContext(C),[r,p]=o.useState(t.headphone.state),[n,l]=o.useState(t.microphone.state),[d,x]=o.useState(t.mute.status.state);return o.useEffect(()=>{const i=()=>p(t.headphone.state),m=()=>l(t.microphone.state),h=()=>x(t.mute.status.state);return t.headphone.on("change",i),t.microphone.on("change",m),t.mute.status.on("change",h),()=>{t.headphone.removeListener("change",i),t.microphone.removeListener("change",m),t.mute.status.removeListener("change",h)}},[t]),e.jsxs(H,{children:[e.jsx(y,{children:e.jsx(A,{children:"peripherals"})}),e.jsxs(B,{children:[e.jsx(z,{$active:r}),e.jsx(E,{children:"Headphone"}),e.jsx(L,{$active:r,children:r?"connected":"disconnected"})]}),e.jsxs(B,{$even:!0,children:[e.jsx(z,{$active:n}),e.jsx(E,{children:"Microphone"}),e.jsx(L,{$active:n,children:n?"connected":"disconnected"})]}),e.jsxs(B,{children:[e.jsx(z,{$active:d}),e.jsx(E,{children:"Mic Mute"}),e.jsx(L,{$active:d,children:d?"muted":"unmuted"})]})]})},pe=()=>e.jsxs(q,{title:"Audio",subtitle:"Speaker, headphone, and microphone controls with routing, muting, and test tones.",children:[e.jsx(j,{children:e.jsxs("p",{children:["The DualSense has a built-in speaker, a 3.5mm headphone jack, and a built-in microphone array. The"," ",e.jsx(v,{to:"/api/audio",children:e.jsx("code",{children:"audio"})})," ","subsystem provides volume control, output routing, per-output muting, and microphone configuration — all via HID commands that work over both USB and Bluetooth."]})}),e.jsx(V,{children:"The DualSense registers as a USB Audio Class device only over USB. Audio controls (volume, routing, muting) are sent over both USB and Bluetooth, but they only affect audio playback when connected via USB."}),e.jsx(M,{children:"Volume Control"}),e.jsx(j,{children:e.jsx("p",{children:"Speaker, headphone, and microphone volumes are set as normalized fractions (0.0–1.0). Each output can also be independently muted without changing the volume level."})}),e.jsx(F,{children:"Adjust volume levels and toggle mute per output"}),e.jsx(re,{}),e.jsx(S,{code:`import { AudioOutput } from "dualsense-ts";

// Volume control (0.0–1.0)
controller.audio.setSpeakerVolume(0.8);
controller.audio.setHeadphoneVolume(0.5);
controller.audio.setMicrophoneVolume(1.0);

// Read current levels
controller.audio.speakerVolume;    // 0.8
controller.audio.headphoneVolume;  // 0.5
controller.audio.microphoneVolume; // 1.0

// Per-output muting (preserves volume level)
controller.audio.muteSpeaker(true);
controller.audio.muteHeadphone(true);
controller.audio.muteMicrophone(true);
controller.audio.muteSpeaker(false); // unmute

// Read mute state
controller.audio.speakerMuted;    // false
controller.audio.headphoneMuted;  // false
controller.audio.microphoneMuted; // false`}),e.jsx(M,{children:"Audio Routing"}),e.jsx(j,{children:e.jsxs("p",{children:["The"," ",e.jsx(v,{to:"/api/enums",children:e.jsx("code",{children:"AudioOutput"})})," ","enum controls how left and right audio channels are routed to the headphone jack and built-in speaker."]})}),e.jsx(se,{}),e.jsx(S,{code:`import { AudioOutput } from "dualsense-ts";

controller.audio.setOutput(AudioOutput.Headphone);     // stereo L+R to headphone (default)
controller.audio.setOutput(AudioOutput.HeadphoneMono);  // left channel to headphone (mono)
controller.audio.setOutput(AudioOutput.Split);          // left → headphone, right → speaker
controller.audio.setOutput(AudioOutput.Speaker);        // speaker only, headphone muted`}),e.jsx(M,{children:"Microphone"}),e.jsx(j,{children:e.jsxs("p",{children:["Select between the built-in microphone and a headset mic via"," ",e.jsx(v,{to:"/api/enums",children:e.jsx("code",{children:"MicSelect"})}),", choose an input mode with"," ",e.jsx(v,{to:"/api/enums",children:e.jsx("code",{children:"MicMode"})}),", and configure the speaker preamp gain (0–7) with optional beam forming."]})}),e.jsx(ie,{}),e.jsx(S,{code:`import { MicSelect, MicMode } from "dualsense-ts";

// Microphone source
controller.audio.setMicSelect(MicSelect.Internal); // built-in mic
controller.audio.setMicSelect(MicSelect.Headset);  // headset mic

// Input mode
controller.audio.setMicMode(MicMode.Default);
controller.audio.setMicMode(MicMode.Chat);
controller.audio.setMicMode(MicMode.ASR); // automatic speech recognition

// Speaker preamp gain (0–7) and beam forming
controller.audio.setPreamp(4);
controller.audio.setPreamp(2, true); // enable beam forming

controller.audio.preampGain;  // 2
controller.audio.beamForming; // true`}),e.jsx(M,{children:"Test Tones"}),e.jsx(j,{children:e.jsx("p",{children:"The controller's onboard DSP can generate test tones routed to either the speaker or headphones. These are useful for verifying audio output and routing without streaming audio data."})}),e.jsx(ce,{}),e.jsx(S,{code:`// Play a 1kHz tone through the speaker
await controller.startTestTone("speaker", "1khz");

// Play both tones through headphones
await controller.startTestTone("headphone", "both");

// Stop the current tone
await controller.stopTestTone();`}),e.jsx(V,{children:"Test tones work over both USB and Bluetooth. They are generated by the controller's DSP, not streamed from the host. The ~100 Hz tone only plays through the built-in speaker."}),e.jsx(M,{children:"Audio Streaming"}),e.jsx(j,{children:e.jsxs("p",{children:["The HID commands above control volume and routing but do not stream audio data. To send audio to the controller's speaker or capture from its microphone, use the OS audio device. The helper"," ",e.jsx("code",{children:"findDualsenseAudioDevices()"})," locates matching audio devices in the browser:"]})}),e.jsx(S,{code:`import { findDualsenseAudioDevices } from "dualsense-ts";

const { outputs, inputs } = await findDualsenseAudioDevices();

// Route audio to the controller's speaker
if (outputs.length > 0) {
  const ctx = new AudioContext({ sinkId: outputs[0].deviceId });
}

// Capture from the controller's microphone
if (inputs.length > 0) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: { exact: inputs[0].deviceId } },
  });
}`}),e.jsx(j,{children:e.jsxs("p",{children:["For Node.js, enumerate audio devices by USB vendor ID using your audio library of choice. The constants ",e.jsx("code",{children:"DUALSENSE_AUDIO_VENDOR_ID"})," ","and ",e.jsx("code",{children:"DUALSENSE_AUDIO_PRODUCT_ID"})," are exported for this purpose."]})}),e.jsxs(V,{children:["In ",e.jsx(v,{to:"/multiplayer",children:"multiplayer"})," mode, there is currently no reliable way to link individual controller slots to their corresponding audio devices across all connection types. If you have ideas for solving this, PRs are welcome."]}),e.jsx(M,{children:"Detecting Audio Peripherals"}),e.jsx(j,{children:e.jsxs("p",{children:["The controller reports whether headphones and a microphone are connected via the 3.5mm jack. These are standard"," ",e.jsx(v,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," ","inputs that emit change events. The hardware mute state is also tracked — see the ",e.jsx(v,{to:"/outputs/mute-led",children:"Mute LED"})," page for controlling the mute indicator."]})}),e.jsx(F,{children:"Plug in headphones or press the mute button to see live updates"}),e.jsx(le,{}),e.jsx(S,{code:`controller.headphone.on("change", ({ state }) => {
  console.log(state ? "Headphones connected" : "Headphones disconnected");
});

controller.microphone.on("change", ({ state }) => {
  console.log(state ? "Microphone active" : "Microphone inactive");
});

controller.mute.status.on("change", ({ state }) => {
  console.log(state ? "Muted" : "Unmuted");
});

controller.headphone.state;  // true when headphones are plugged in
controller.microphone.state; // true when a microphone is available
controller.mute.status.state; // true when hardware mute is active`}),e.jsx(M,{children:"Quirks"}),e.jsx(j,{children:e.jsxs("p",{children:[e.jsx("strong",{children:"Linux — headphone audio plays in one ear only:"})," ",'PulseAudio defaults to the mono "Speaker" profile when the DualSense is connected, sending a single audio channel that the controller routes to the right side only. Switch to the headphones profile for stereo output:']})}),e.jsx(S,{code:`# Switch to stereo headphone profile
pactl set-card-profile alsa_card.usb-Sony_Interactive_Entertainment_Wireless_Controller-00 \\
  "HiFi (Headphones, Mic)"

# Set as default output and adjust volume
pactl set-default-sink \\
  alsa_output.usb-Sony_Interactive_Entertainment_Wireless_Controller-00.HiFi__Headphones__sink
pactl set-sink-volume \\
  alsa_output.usb-Sony_Interactive_Entertainment_Wireless_Controller-00.HiFi__Headphones__sink 100%`})]});export{pe as default};
