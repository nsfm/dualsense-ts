import { ChargeStatus } from "../battery_state";

/** Profile LED animation modes */
export enum AccessProfileLedMode {
  Off = 0,
  On = 1,
  Fade = 2,
  Sweep = 3,
}

/** Player indicator patterns (6-segment cross LED) */
export enum AccessPlayerIndicator {
  Off = 0,
  /** S (1 segment) */
  Player1 = 1,
  /** S + N (2 segments) */
  Player2 = 2,
  /** S + NE + NW (3 segments) */
  Player3 = 3,
  /** N + S + E + W (cross, 4 segments) */
  Player4 = 4,
}

/** IDs for Access controller inputs */
export const enum AccessInputId {
  // Raw hardware inputs (bytes 16–19, profile-independent)
  B1 = "B1",
  B2 = "B2",
  B3 = "B3",
  B4 = "B4",
  B5 = "B5",
  B6 = "B6",
  B7 = "B7",
  B8 = "B8",
  Center = "Center",
  StickClick = "StickClick",
  PS = "PS",
  Profile = "Profile",
  StickX = "StickX",
  StickY = "StickY",
  BatteryLevel = "BatteryLevel",
  BatteryStatus = "BatteryStatus",
  ProfileId = "ProfileId",

  // Profile-mapped inputs (bytes 1–10, DualSense-compatible format)
  MappedLeftStickX = "MappedLeftStickX",
  MappedLeftStickY = "MappedLeftStickY",
  MappedRightStickX = "MappedRightStickX",
  MappedRightStickY = "MappedRightStickY",
  MappedL2 = "MappedL2",
  MappedR2 = "MappedR2",
  DpadUp = "DpadUp",
  DpadDown = "DpadDown",
  DpadLeft = "DpadLeft",
  DpadRight = "DpadRight",
  Cross = "Cross",
  Circle = "Circle",
  Square = "Square",
  Triangle = "Triangle",
  L1 = "L1",
  R1 = "R1",
  L2Button = "L2Button",
  R2Button = "R2Button",
  L3 = "L3",
  R3 = "R3",
  Options = "Options",
  Create = "Create",
  TouchButton = "TouchButton",
  MuteButton = "MuteButton",
}

/** Describes an observation of the input state of an Access controller */
export interface AccessHIDState {
  // Raw hardware inputs
  [AccessInputId.B1]: boolean;
  [AccessInputId.B2]: boolean;
  [AccessInputId.B3]: boolean;
  [AccessInputId.B4]: boolean;
  [AccessInputId.B5]: boolean;
  [AccessInputId.B6]: boolean;
  [AccessInputId.B7]: boolean;
  [AccessInputId.B8]: boolean;
  [AccessInputId.Center]: boolean;
  [AccessInputId.StickClick]: boolean;
  [AccessInputId.PS]: boolean;
  [AccessInputId.Profile]: boolean;
  [AccessInputId.StickX]: number;
  [AccessInputId.StickY]: number;
  [AccessInputId.BatteryLevel]: number;
  [AccessInputId.BatteryStatus]: ChargeStatus;
  [AccessInputId.ProfileId]: number;

  // Profile-mapped inputs
  [AccessInputId.MappedLeftStickX]: number;
  [AccessInputId.MappedLeftStickY]: number;
  [AccessInputId.MappedRightStickX]: number;
  [AccessInputId.MappedRightStickY]: number;
  [AccessInputId.MappedL2]: number;
  [AccessInputId.MappedR2]: number;
  [AccessInputId.DpadUp]: boolean;
  [AccessInputId.DpadDown]: boolean;
  [AccessInputId.DpadLeft]: boolean;
  [AccessInputId.DpadRight]: boolean;
  [AccessInputId.Cross]: boolean;
  [AccessInputId.Circle]: boolean;
  [AccessInputId.Square]: boolean;
  [AccessInputId.Triangle]: boolean;
  [AccessInputId.L1]: boolean;
  [AccessInputId.R1]: boolean;
  [AccessInputId.L2Button]: boolean;
  [AccessInputId.R2Button]: boolean;
  [AccessInputId.L3]: boolean;
  [AccessInputId.R3]: boolean;
  [AccessInputId.Options]: boolean;
  [AccessInputId.Create]: boolean;
  [AccessInputId.TouchButton]: boolean;
  [AccessInputId.MuteButton]: boolean;
}

/** Default values for all Access inputs */
export const DefaultAccessHIDState: AccessHIDState = {
  // Raw hardware inputs
  [AccessInputId.B1]: false,
  [AccessInputId.B2]: false,
  [AccessInputId.B3]: false,
  [AccessInputId.B4]: false,
  [AccessInputId.B5]: false,
  [AccessInputId.B6]: false,
  [AccessInputId.B7]: false,
  [AccessInputId.B8]: false,
  [AccessInputId.Center]: false,
  [AccessInputId.StickClick]: false,
  [AccessInputId.PS]: false,
  [AccessInputId.Profile]: false,
  [AccessInputId.StickX]: 0,
  [AccessInputId.StickY]: 0,
  [AccessInputId.BatteryLevel]: 0,
  [AccessInputId.BatteryStatus]: ChargeStatus.Discharging,
  [AccessInputId.ProfileId]: 1,

  // Profile-mapped inputs
  [AccessInputId.MappedLeftStickX]: 0,
  [AccessInputId.MappedLeftStickY]: 0,
  [AccessInputId.MappedRightStickX]: 0,
  [AccessInputId.MappedRightStickY]: 0,
  [AccessInputId.MappedL2]: 0,
  [AccessInputId.MappedR2]: 0,
  [AccessInputId.DpadUp]: false,
  [AccessInputId.DpadDown]: false,
  [AccessInputId.DpadLeft]: false,
  [AccessInputId.DpadRight]: false,
  [AccessInputId.Cross]: false,
  [AccessInputId.Circle]: false,
  [AccessInputId.Square]: false,
  [AccessInputId.Triangle]: false,
  [AccessInputId.L1]: false,
  [AccessInputId.R1]: false,
  [AccessInputId.L2Button]: false,
  [AccessInputId.R2Button]: false,
  [AccessInputId.L3]: false,
  [AccessInputId.R3]: false,
  [AccessInputId.Options]: false,
  [AccessInputId.Create]: false,
  [AccessInputId.TouchButton]: false,
  [AccessInputId.MuteButton]: false,
};
