/** Describes charge / discharge behavior */
export enum ChargeStatus {
  Discharging = 0x0,
  Charging = 0x1,
  Full = 0x2,
  NotCharging = 0xb,
  Error = 0xf,
  BadTemperatureOrVoltage = 0xa,
}
