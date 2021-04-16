const ConnectionType = {
  bT: 0x0,
  uSB: 0x1
};

const LedOptions = {
  off: 0x0,
  playerLedBrightness: 0x1,
  uninterrumpableLed: 0x2,
  both: 0x01 | 0x02
};

const PulseOptions = {
  off: 0x0,
  fadeBlue: 0x1,
  fadeOut: 0x2
};

const Brightness = {
  high: 0x0,
  medium: 0x1,
  low: 0x2
};

const PlayerID = {
  player1: 4,
  player2: 10,
  player3: 21,
  player4: 27,
  all: 31
};

const TriggerModes = {
  off: 0x0, //no resistance
  rigid: 0x1, //continous resistance
  pulse: 0x2, //section resistance
  rigid_A: 0x1 | 0x20,
  rigid_B: 0x1 | 0x04,
  rigid_AB: 0x1 | 0x20 | 0x04,
  pulse_A: 0x2 | 0x20,
  pulse_B: 0x2 | 0x04,
  pulse_AB: 0x2 | 0x20 | 0x04,
  calibration: 0xFC
};

module.exports = {
  ConnectionType,
  LedOptions,
  PulseOptions,
  Brightness,
  PlayerID,
  TriggerModes, 
};