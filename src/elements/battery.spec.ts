import { InputSet } from "../input";
import { BatteryLevel, BatteryStatus, Battery } from "./battery";
import { ChargeStatus } from "../hid/battery_state";

describe("BatteryLevel", () => {
  it("should default to 0 and inactive", () => {
    const level = new BatteryLevel();
    expect(level.state).toEqual(0);
    expect(level.active).toEqual(false);
  });

  it("should be active when state > 0", () => {
    const level = new BatteryLevel();
    level[InputSet](0.5);
    expect(level.active).toEqual(true);
  });
});

describe("BatteryStatus", () => {
  it("should default to Discharging and inactive", () => {
    const status = new BatteryStatus();
    expect(status.state).toEqual(ChargeStatus.Discharging);
    expect(status.active).toEqual(false);
  });

  it("should be active when Charging", () => {
    const status = new BatteryStatus();
    status[InputSet](ChargeStatus.Charging);
    expect(status.active).toEqual(true);
  });
});

describe("Battery", () => {
  it("should construct", () => {
    expect(new Battery()).toBeInstanceOf(Battery);
  });

  it("should have level and status children", () => {
    const battery = new Battery();
    expect(battery.level).toBeInstanceOf(BatteryLevel);
    expect(battery.status).toBeInstanceOf(BatteryStatus);
  });

  it("should be active when either child is active", () => {
    const battery = new Battery();
    expect(battery.active).toEqual(false);
    battery.level[InputSet](0.5);
    expect(battery.active).toEqual(true);
    battery.level[InputSet](0);
    expect(battery.active).toEqual(false);
    battery.status[InputSet](ChargeStatus.Charging);
    expect(battery.active).toEqual(true);
  });
});
