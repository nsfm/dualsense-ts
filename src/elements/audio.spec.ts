import { Audio } from "./audio";
import { AudioOutput } from "../hid/command";

describe("Audio", () => {
  it("should default volumes to 1.0", () => {
    const audio = new Audio();
    expect(audio.headphoneVolume).toEqual(1.0);
    expect(audio.speakerVolume).toEqual(1.0);
    expect(audio.microphoneVolume).toEqual(1.0);
  });

  it("should clamp headphone volume to 0-1", () => {
    const audio = new Audio();
    audio.setHeadphoneVolume(2);
    expect(audio.headphoneVolume).toEqual(1);
    audio.setHeadphoneVolume(-1);
    expect(audio.headphoneVolume).toEqual(0);
  });

  it("should clamp speaker volume to 0-1", () => {
    const audio = new Audio();
    audio.setSpeakerVolume(2);
    expect(audio.speakerVolume).toEqual(1);
    audio.setSpeakerVolume(-1);
    expect(audio.speakerVolume).toEqual(0);
  });

  it("should clamp microphone volume to 0-1", () => {
    const audio = new Audio();
    audio.setMicrophoneVolume(2);
    expect(audio.microphoneVolume).toEqual(1);
    audio.setMicrophoneVolume(-1);
    expect(audio.microphoneVolume).toEqual(0);
  });

  it("should convert headphone volume to raw 0x7F", () => {
    const audio = new Audio();
    expect(audio.headphoneVolumeRaw).toEqual(0x7f);
    audio.setHeadphoneVolume(0);
    expect(audio.headphoneVolumeRaw).toEqual(0);
  });

  it("should convert speaker volume to raw 0x64", () => {
    const audio = new Audio();
    expect(audio.speakerVolumeRaw).toEqual(0x64);
    audio.setSpeakerVolume(0);
    expect(audio.speakerVolumeRaw).toEqual(0);
  });

  it("should convert microphone volume to raw 0x40", () => {
    const audio = new Audio();
    expect(audio.microphoneVolumeRaw).toEqual(0x40);
    audio.setMicrophoneVolume(0);
    expect(audio.microphoneVolumeRaw).toEqual(0);
  });

  it("should set and get output routing", () => {
    const audio = new Audio();
    expect(audio.output).toEqual(AudioOutput.Headphone);
    audio.setOutput(AudioOutput.Speaker);
    expect(audio.output).toEqual(AudioOutput.Speaker);
  });

  it("should mute and unmute speaker", () => {
    const audio = new Audio();
    expect(audio.speakerMuted).toEqual(false);
    audio.muteSpeaker();
    expect(audio.speakerMuted).toEqual(true);
    audio.muteSpeaker(false);
    expect(audio.speakerMuted).toEqual(false);
  });

  it("should mute and unmute headphone", () => {
    const audio = new Audio();
    expect(audio.headphoneMuted).toEqual(false);
    audio.muteHeadphone();
    expect(audio.headphoneMuted).toEqual(true);
    audio.muteHeadphone(false);
    expect(audio.headphoneMuted).toEqual(false);
  });

  it("should mute and unmute microphone", () => {
    const audio = new Audio();
    expect(audio.microphoneMuted).toEqual(false);
    audio.muteMicrophone();
    expect(audio.microphoneMuted).toEqual(true);
    audio.muteMicrophone(false);
    expect(audio.microphoneMuted).toEqual(false);
  });

  it("should clamp preamp gain to 0-7", () => {
    const audio = new Audio();
    audio.setPreamp(10);
    expect(audio.preampGain).toEqual(7);
    audio.setPreamp(-1);
    expect(audio.preampGain).toEqual(0);
  });

  it("should toggle beam forming", () => {
    const audio = new Audio();
    expect(audio.beamForming).toEqual(false);
    audio.setPreamp(2, true);
    expect(audio.beamForming).toEqual(true);
    audio.setPreamp(2, false);
    expect(audio.beamForming).toEqual(false);
  });

  it("should change toKey when settings change", () => {
    const audio = new Audio();
    const key1 = audio.toKey();
    audio.setHeadphoneVolume(0.5);
    const key2 = audio.toKey();
    expect(key1).not.toEqual(key2);
  });
});
