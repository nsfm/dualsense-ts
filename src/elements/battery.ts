import { Input } from "../input";
import { Intensity } from "../math";
import { ChargeStatus } from "../hid";

export class BatteryLevel extends Input<Intensity> {
  public state = 0;
  public active = false;
}

export class BatteryStatus extends Input<ChargeStatus> {
  public state = ChargeStatus.Discharging;
  public active = false;
}

export class Battery extends Input<Battery> {
  public state = this;
  public active = false;

  public readonly level: BatteryLevel = new BatteryLevel({
    icon: "",
    name: "BatteryLevel",
  });
  public readonly status: BatteryStatus = new BatteryStatus({
    icon: "",
    name: "BatteryStatus",
  });
}
