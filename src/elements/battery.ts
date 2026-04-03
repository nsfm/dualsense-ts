import { Input, InputParams } from "../input";
import { Intensity } from "../math";
import { ChargeStatus } from "../hid/battery_state";

/** Tracks the controller's battery charge level as a 0–1 intensity */
export class BatteryLevel extends Input<Intensity> {
  public state: Intensity = 0;

  public get active(): boolean {
    return this.state > 0;
  }
}

/** Tracks the controller's charging status */
export class BatteryStatus extends Input<ChargeStatus> {
  public state: ChargeStatus = ChargeStatus.Discharging;

  public get active(): boolean {
    return this.state === ChargeStatus.Charging;
  }
}

export interface BatteryParams extends InputParams {
  level?: InputParams;
  status?: InputParams;
}

/** Groups battery level and charging status */
export class Battery extends Input<Battery> {
  public readonly state: Battery = this;

  /** Battery charge level, normalized 0–1 */
  public readonly level: BatteryLevel;
  /** Current charging status */
  public readonly status: BatteryStatus;

  public get active(): boolean {
    return this.level.active || this.status.active;
  }

  constructor(params: BatteryParams = {}) {
    super(params);
    this.level = new BatteryLevel({
      icon: "🔋",
      name: "BatteryLevel",
      ...(params.level ?? {}),
    });
    this.status = new BatteryStatus({
      icon: "🔌",
      name: "BatteryStatus",
      ...(params.status ?? {}),
    });
  }
}
