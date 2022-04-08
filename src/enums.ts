export const enum ConnectionType {
  BT = 0x0,
  USB = 0x1,
}

export const enum LedOptions {
  Off = 0x0,
  PlayerLedBrightness = 0x1,
  Uninterruptible = 0x2,
  Both = 0x01 | 0x02,
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
  Off = 0x0, //no resistance
  Rigid = 0x1, //continous resistance
  Pulse = 0x2, //section resistance
  Calibration = 0xfc,

  rigid_A = 0x1 | 0x20,
  rigid_B = 0x1 | 0x04,
  rigid_AB = 0x1 | 0x20 | 0x04,
  pulse_A = 0x2 | 0x20,
  pulse_B = 0x2 | 0x04,
  pulse_AB = 0x2 | 0x20 | 0x04,
}
