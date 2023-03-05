export const enum LedOptions {
  Off = 0x0,
  PlayerLedBrightness = 0x1,
  Uninterruptible = 0x2,
  Both = 3, // 0x01 | 0x02
}

export const enum PulseOptions {
  Off = 0x0,
  FadeBlue = 0x1,
  FadeOut = 0x2,
}

export const enum Brightness {
  High = 0x0,
  Medium = 0x1,
  Low = 0x2,
}

export const enum PlayerID {
  Player1 = 4,
  Player2 = 10,
  Player3 = 21,
  Player4 = 27,
  All = 31,
}

export const enum TriggerMode {
  /** No resistance */
  Off = 0x0,
  /** Continuous resistance */
  Rigid = 0x1,
  Pulse = 0x2,
  Calibration = 0xfc,

  rigid_A = 33, // 0x1 | 0x20
  rigid_B = 5, // 0x1 | 0x04
  rigid_AB = 37, // 0x1 | 0x20 | 0x04
  pulse_A = 34, // 0x2 | 0x20
  pulse_B = 6, // 0x2 | 0x04
  pulse_AB = 38, // 0x2 | 0x20 | 0x04
}

export const enum CommandScopeA {
  HapticRumble = 0x01,
  PrimaryRumble = 0x02,
  RightTriggerFeedback = 0x04,
  LeftTriggerFeedback = 0x08,
  AudioVolume = 0x10,
  SpeakerToggle = 0x20,
  MicrophoneVolume = 0x40,
}

export const enum CommandScopeB {
  MicrophoneLED = 0x01,
  Mute = 0x02,
  TouchpadLeds = 0x04,
  DisableLeds = 0x08,
  PlayerLeds = 0x10,
  MotorPower = 0x40,
}

export type CommandScope = CommandScopeA | CommandScopeB;

/** Byte value, 0 to 255 */
type Intensity = number;

/** 48 byte packet that is sent to the controller to update LEDs, rumble, etc */
export interface DualsenseCommand extends Uint8Array {
  /** Packet type */
  [0]: 0x2;
  /** Command effect limited to these bits */
  [1]: CommandScopeA | 0xff;
  /** Command effect also limited to these bits */
  [2]: CommandScopeB | (0x1 | 0x2 | 0x4 | 0x10 | 0x40);
  /** Right rumble intensity */
  [3]: Intensity;
  /** Left rumble intensity */
  [4]: Intensity;
  [5]: 0; // Audio...
  [6]: 0;
  [7]: 0;
  [8]: 0; // ...related
  /** Microphone LED intensity */
  [9]: Intensity;
  /** Microphone mute state (0x10 muted, 0x00 unmuted) */
  [10]: 0x10 | 0x00;
  [11]: TriggerMode; // Right trigger mode
  [12]: number; // Right trigger force 1
  [13]: number; // Right trigger force 2
  [14]: number; // Right trigger force 3
  [15]: number; // Right trigger force 4
  [16]: number; // Right trigger force 5
  [17]: number; // Right trigger force 6
  [20]: number; // Right trigger force 7
  [21]: 0;
  [22]: TriggerMode; // Left trigger mode
  [23]: number; // Left trigger force 1
  [24]: number; // Left trigger force 2
  [25]: number; // Left trigger force 3
  [26]: number; // Left trigger force 4
  [27]: number; // Left trigger force 5
  [28]: number; // Left trigger force 6
  [31]: number; // Left trigger force 7
  [32]: 0;
  [33]: 0;
  [34]: 0;
  [35]: 0;
  [36]: 0;
  [37]: 0;
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
