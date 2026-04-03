/** Describes the charging behavior of the controller's battery */
export enum ChargeStatus {
  Discharging = 0x0,
  Charging = 0x1,
  Full = 0x2,
  AbnormalVoltage = 0xa,
  AbnormalTemperature = 0xb,
  ChargingError = 0xf,
}
