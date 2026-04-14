import { ChargeStatus } from "../battery_state";

/** Profile LED animation modes */
export const enum AccessProfileLedMode {
  Off = 0,
  On = 1,
  Fade = 2,
  Sweep = 3,
}

/** Player indicator patterns (6-segment cross LED) */
export const enum AccessPlayerIndicator {
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
}

/** Describes an observation of the input state of an Access controller */
export interface AccessHIDState {
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
}

/** Default values for all Access inputs */
export const DefaultAccessHIDState: AccessHIDState = {
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
};
