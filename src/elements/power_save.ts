import { PowerSave } from "../hid/command";

/** Options for bulk-setting power save subsystem states */
export interface PowerSaveOptions {
  /** Enable or disable touch processing (default: enabled) */
  touch?: boolean;
  /** Enable or disable motion sensor (IMU) processing (default: enabled) */
  motion?: boolean;
  /** Enable or disable the haptic processor (default: enabled) */
  haptics?: boolean;
  /** Enable or disable the audio processor (default: enabled) */
  audio?: boolean;
  /** Mute or unmute haptic output without disabling the processor (default: unmuted) */
  muteHaptics?: boolean;
}

/**
 * Controls per-subsystem power save flags on the DualSense controller.
 *
 * Disabling a subsystem tells the controller to stop processing that input
 * or output entirely, conserving battery. This is distinct from the
 * per-channel audio mutes on {@link Audio}, which silence individual
 * outputs without powering down the processor.
 *
 * All subsystems are enabled by default.
 */
export class PowerSaveControl {
  /** Bitfield of active PowerSave disable/mute flags */
  private _mask = 0;

  /** Whether touch processing is enabled */
  public get touch(): boolean {
    return (this._mask & PowerSave.DisableTouch) === 0;
  }

  /** Enable or disable touch processing */
  public set touch(enabled: boolean) {
    if (enabled) this._mask &= ~PowerSave.DisableTouch;
    else this._mask |= PowerSave.DisableTouch;
  }

  /** Whether motion sensor (IMU) processing is enabled */
  public get motion(): boolean {
    return (this._mask & PowerSave.DisableMotion) === 0;
  }

  /** Enable or disable motion sensor processing */
  public set motion(enabled: boolean) {
    if (enabled) this._mask &= ~PowerSave.DisableMotion;
    else this._mask |= PowerSave.DisableMotion;
  }

  /** Whether the haptic processor is enabled */
  public get haptics(): boolean {
    return (this._mask & PowerSave.DisableHaptics) === 0;
  }

  /** Enable or disable the haptic processor */
  public set haptics(enabled: boolean) {
    if (enabled) this._mask &= ~PowerSave.DisableHaptics;
    else this._mask |= PowerSave.DisableHaptics;
  }

  /** Whether the audio processor is enabled */
  public get audio(): boolean {
    return (this._mask & PowerSave.DisableAudio) === 0;
  }

  /** Enable or disable the audio processor */
  public set audio(enabled: boolean) {
    if (enabled) this._mask &= ~PowerSave.DisableAudio;
    else this._mask |= PowerSave.DisableAudio;
  }

  /** Whether haptic output is muted (processor still runs) */
  public get hapticsMuted(): boolean {
    return (this._mask & PowerSave.MuteHaptics) !== 0;
  }

  /** Mute or unmute haptic output without disabling the processor */
  public set hapticsMuted(muted: boolean) {
    if (muted) this._mask |= PowerSave.MuteHaptics;
    else this._mask &= ~PowerSave.MuteHaptics;
  }

  /** Set multiple subsystem states at once */
  public set(options: PowerSaveOptions): void {
    if (options.touch !== undefined) this.touch = options.touch;
    if (options.motion !== undefined) this.motion = options.motion;
    if (options.haptics !== undefined) this.haptics = options.haptics;
    if (options.audio !== undefined) this.audio = options.audio;
    if (options.muteHaptics !== undefined) this.hapticsMuted = options.muteHaptics;
  }

  /** Reset all subsystems to their default (enabled/unmuted) state */
  public reset(): void {
    this._mask = 0;
  }

  /** Raw power save flags byte for the output loop */
  public get flags(): number {
    return this._mask;
  }

  /** Change-detection key for the output loop */
  public toKey(): string {
    return String(this._mask);
  }
}
