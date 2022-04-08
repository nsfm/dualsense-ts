export interface State {
  // Left analog
  LX: number;
  LY: number;
  L3: boolean;

  // Right analog
  RX: number;
  RY: number;
  R3: boolean;

  dPadState: number;

  R1: boolean;
  R2: number;
  L1: boolean;
  L2: number;

  triangle: boolean;
  circle: boolean;
  cross: boolean;
  square: boolean;

  options: boolean;
  share: boolean;
  R2Btn: boolean;
  L2Btn: boolean;
  ps: boolean;
  touchBtn: boolean;
  micBtn: boolean;
}

export function decode(buffer: Buffer): State {
  const states = [...buffer];
  // states 0 is always 1
  // state 7 always increments -> not used anywhere

  const buttonState: number = states[8];
  const misc: number = states[9];
  const misc2: number = states[10];

  return {
    LX: states[1] - 127,
    LY: states[2] - 127,
    RX: states[3] - 127,
    RY: states[4] - 127,
    L2: states[5],
    R2: states[6],
    triangle: (buttonState & (1 << 7)) != 0,
    circle: (buttonState & (1 << 6)) != 0,
    cross: (buttonState & (1 << 7)) != 0,
    square: (buttonState & (1 << 7)) != 0,
    dPadState: buttonState & 0x0f,
    R3: (misc & (1 << 7)) != 0,
    L3: (misc & (1 << 6)) != 0,
    options: (misc & (1 << 5)) != 0,
    share: (misc & (1 << 4)) != 0,
    R2Btn: (misc & (1 << 3)) != 0,
    L2Btn: (misc & (1 << 2)) != 0,
    R1: (misc & (1 << 1)) != 0,
    L1: (misc & (1 << 0)) != 0,
    ps: (misc2 & (1 << 0)) != 0,
    touchBtn: (misc2 & 0x02) != 0,
    micBtn: (misc2 & 0x04) != 0,
  };
}
