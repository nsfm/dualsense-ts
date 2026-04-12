export const enum LedOptions {
  Off = 0x0,
  PlayerLedBrightness = 0x1,
  Uninterruptible = 0x2,
  Both = 3, // 0x01 | 0x02
}

export enum PulseOptions {
  Off = 0x0,
  FadeBlue = 0x1,
  FadeOut = 0x2,
}

export enum MuteLedMode {
  Off = 0,
  On = 1,
  Pulse = 2,
}

export enum Brightness {
  High = 0x0,
  Medium = 0x1,
  Low = 0x2,
}

export enum PlayerID {
  Player1 = 4,
  Player2 = 10,
  Player3 = 21,
  Player4 = 27,
  All = 31,
}

/** Audio output routing — controls how L/R channels map to headphone and speaker */
export enum AudioOutput {
  /** Stereo L+R to headphone, speaker muted */
  Headphone = 0x00,
  /** Left channel to headphone (mono), speaker muted */
  HeadphoneMono = 0x10,
  /** Left channel to headphone, right channel to speaker */
  Split = 0x20,
  /** Headphone muted, right channel to speaker only */
  Speaker = 0x30,
}

/** Microphone input source selection */
export enum MicSelect {
  /** Use internal microphone */
  Internal = 0x01,
  /** Use headset microphone */
  Headset = 0x02,
}

/** Microphone processing flags (can be combined) */
export enum MicFlag {
  EchoCancellation = 0x04,
  NoiseCancellation = 0x08,
}

/** Microphone input mode — bits 6-7 of audio flags */
export enum MicMode {
  /** Default mode */
  Default = 0x00,
  /** Chat mode */
  Chat = 0x40,
  /** Automatic speech recognition mode */
  ASR = 0x80,
}

/** Power save control — per-subsystem mute/disable flags (byte 10) */
export const enum PowerSave {
  DisableTouch = 0x01,
  DisableMotion = 0x02,
  DisableHaptics = 0x04,
  DisableAudio = 0x08,
  MuteMicrophone = 0x10,
  MuteSpeaker = 0x20,
  MuteHeadphone = 0x40,
  MuteHaptics = 0x80,
}

export const enum CommandScopeA {
  HapticRumble = 0x01,
  PrimaryRumble = 0x02,
  RightTriggerFeedback = 0x04,
  LeftTriggerFeedback = 0x08,
  HeadphoneVolume = 0x10,
  SpeakerVolume = 0x20,
  MicrophoneVolume = 0x40,
  AudioFlags = 0x80,
}

export const enum CommandScopeB {
  MicrophoneLED = 0x01,
  PowerSave = 0x02,
  TouchpadLeds = 0x04,
  DisableLeds = 0x08,
  PlayerLeds = 0x10,
  MotorPower = 0x40,
  AudioFlags2 = 0x80,
}

export type CommandScope = CommandScopeA | CommandScopeB;

/** Byte value, 0 to 255 */
type Intensity = number;

/** 48 byte packet that is sent to the controller to update LEDs, rumble, etc */
export interface DualsenseCommand extends Uint8Array {
  /** Packet type */
  [0]: 0x2;
  /** Scope A — which subsystems are affected */
  [1]: CommandScopeA | 0xff;
  /** Scope B — which subsystems are affected */
  [2]: CommandScopeB | (0x1 | 0x2 | 0x4 | 0x10 | 0x40);
  /** Right rumble intensity */
  [3]: Intensity;
  /** Left rumble intensity */
  [4]: Intensity;
  /** Headphone volume (0x00–0x7F) */
  [5]: Intensity;
  /** Speaker volume (0x00–0xFF, effective range 0x3D–0x64) */
  [6]: Intensity;
  /** Internal microphone volume (0x00–0x40) */
  [7]: Intensity;
  /** Audio flags: bits 0-3 mic source/processing, bits 4-5 output routing, bits 6-7 mic mode */
  [8]: number;
  /** Mute button LED mode */
  [9]: MuteLedMode;
  /** Power save control — per-subsystem mute/disable bitfield */
  [10]: PowerSave | 0x00;
  // Right trigger effect block (11 bytes: mode + 10 params)
  [11]: number; // Right trigger effect mode
  [12]: number; // Right trigger param 1
  [13]: number; // Right trigger param 2
  [14]: number; // Right trigger param 3
  [15]: number; // Right trigger param 4
  [16]: number; // Right trigger param 5
  [17]: number; // Right trigger param 6
  [18]: number; // Right trigger param 7
  [19]: number; // Right trigger param 8
  [20]: number; // Right trigger param 9
  [21]: number; // Right trigger param 10
  // Left trigger effect block (11 bytes: mode + 10 params)
  [22]: number; // Left trigger effect mode
  [23]: number; // Left trigger param 1
  [24]: number; // Left trigger param 2
  [25]: number; // Left trigger param 3
  [26]: number; // Left trigger param 4
  [27]: number; // Left trigger param 5
  [28]: number; // Left trigger param 6
  [29]: number; // Left trigger param 7
  [30]: number; // Left trigger param 8
  [31]: number; // Left trigger param 9
  [32]: number; // Left trigger param 10
  [33]: 0;
  [34]: 0;
  [35]: 0;
  [36]: 0;
  /** Audio flags 2: bits 0-2 speaker preamp gain (0-7), bit 4 beam forming */
  [37]: number;
  [38]: 0;
  [39]: LedOptions;
  [40]: 0;
  [41]: 0;
  [42]: PulseOptions;
  [43]: Brightness;
  [44]: PlayerID; // White player ID LED
  [45]: Intensity; // Touchpad red
  [46]: Intensity; // Touchpad green
  [47]: Intensity; // Touchpad blue
  [48]: never;
}
