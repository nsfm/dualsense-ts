import { AudioOutput, MicSelect, MicFlag, MicMode, PowerSave } from "../hid/command";

/** Audio control state for the DualSense controller */
export class Audio {
  /** Headphone volume (0.0–1.0) */
  private _headphoneVolume = 1.0;
  /** Speaker volume (0.0–1.0) */
  private _speakerVolume = 1.0;
  /** Microphone volume (0.0–1.0) */
  private _microphoneVolume = 1.0;
  /** Audio output routing */
  private _output = AudioOutput.Headphone;
  /** Microphone source selection */
  private _micSelect?: MicSelect;
  /** Microphone processing flags */
  private _micFlags = 0;
  /** Microphone input mode */
  private _micMode = MicMode.Default;
  /** Speaker preamp gain (0–7) */
  private _preampGain = 2;
  /** Beam forming enabled */
  private _beamForming = false;
  /** Per-subsystem mute flags */
  private _muteMask = 0;

  /** Get headphone volume as a fraction (0.0–1.0) */
  public get headphoneVolume(): number {
    return this._headphoneVolume;
  }

  /** Set headphone volume (0.0–1.0) */
  public setHeadphoneVolume(volume: number): void {
    this._headphoneVolume = Math.max(0, Math.min(1, volume));
  }

  /** Get speaker volume as a fraction (0.0–1.0) */
  public get speakerVolume(): number {
    return this._speakerVolume;
  }

  /** Set speaker volume (0.0–1.0) */
  public setSpeakerVolume(volume: number): void {
    this._speakerVolume = Math.max(0, Math.min(1, volume));
  }

  /** Get microphone volume as a fraction (0.0–1.0) */
  public get microphoneVolume(): number {
    return this._microphoneVolume;
  }

  /** Set microphone volume (0.0–1.0) */
  public setMicrophoneVolume(volume: number): void {
    this._microphoneVolume = Math.max(0, Math.min(1, volume));
  }

  /** Get audio output routing */
  public get output(): AudioOutput {
    return this._output;
  }

  /** Set audio output routing */
  public setOutput(output: AudioOutput): void {
    this._output = output;
  }

  /** Get speaker preamp gain (0–7) */
  public get preampGain(): number {
    return this._preampGain;
  }

  /** Set speaker preamp gain (0–7) and optional beam forming */
  public setPreamp(gain: number, beamForming?: boolean): void {
    this._preampGain = Math.max(0, Math.min(7, gain | 0));
    if (beamForming !== undefined) {
      this._beamForming = beamForming;
    }
  }

  /** Whether beam forming is enabled */
  public get beamForming(): boolean {
    return this._beamForming;
  }

  /** Set microphone source */
  public setMicSelect(source: MicSelect): void {
    this._micSelect = source;
  }

  /** Set microphone processing flags (echo cancellation, noise cancellation) */
  public setMicFlags(flags: number): void {
    this._micFlags = flags & (MicFlag.EchoCancellation | MicFlag.NoiseCancellation);
  }

  /** Set microphone input mode */
  public setMicMode(mode: MicMode): void {
    this._micMode = mode;
  }

  /** Mute the speaker */
  public muteSpeaker(muted = true): void {
    if (muted) this._muteMask |= PowerSave.MuteSpeaker;
    else this._muteMask &= ~PowerSave.MuteSpeaker;
  }

  /** Mute the headphone output */
  public muteHeadphone(muted = true): void {
    if (muted) this._muteMask |= PowerSave.MuteHeadphone;
    else this._muteMask &= ~PowerSave.MuteHeadphone;
  }

  /** Mute the microphone */
  public muteMicrophone(muted = true): void {
    if (muted) this._muteMask |= PowerSave.MuteMicrophone;
    else this._muteMask &= ~PowerSave.MuteMicrophone;
  }

  /** Whether the speaker is muted */
  public get speakerMuted(): boolean {
    return (this._muteMask & PowerSave.MuteSpeaker) !== 0;
  }

  /** Whether headphone output is muted */
  public get headphoneMuted(): boolean {
    return (this._muteMask & PowerSave.MuteHeadphone) !== 0;
  }

  /** Whether the microphone is muted */
  public get microphoneMuted(): boolean {
    return (this._muteMask & PowerSave.MuteMicrophone) !== 0;
  }

  // --- Output loop helpers ---

  /** Raw headphone volume byte (0x00–0x7F) */
  public get headphoneVolumeRaw(): number {
    return Math.round(this._headphoneVolume * 0x7f);
  }

  /** Raw speaker volume byte (0x00–0x64) */
  public get speakerVolumeRaw(): number {
    return Math.round(this._speakerVolume * 0x64);
  }

  /** Raw microphone volume byte (0x00–0x40) */
  public get microphoneVolumeRaw(): number {
    return Math.round(this._microphoneVolume * 0x40);
  }

  /** Composed audio flags byte */
  public get audioFlags(): number {
    return (this._micSelect ?? 0) | this._micFlags | this._output | this._micMode;
  }

  /** Power save mute mask */
  public get powerSaveFlags(): number {
    return this._muteMask;
  }

  /** Change-detection key for the output loop */
  public toKey(): string {
    return `${this._headphoneVolume},${this._speakerVolume},${this._microphoneVolume},${this._output},${String(this._micSelect)},${this._micFlags},${String(this._micMode)},${this._preampGain},${String(this._beamForming)},${this._muteMask}`;
  }
}
