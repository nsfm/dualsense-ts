import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog } from "./analog";
import { Haptic } from "../haptics";
import { Input, InputParams } from "../input";

export interface UnisenseParams extends InputParams {
  trigger?: InputParams;
  bumper?: InputParams;
  analog?: InputParams;
}

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense extends Input<Unisense> {
  public readonly state: Unisense = this;

  public readonly trigger: Trigger;
  public readonly bumper: Momentary;
  public readonly analog: Analog;
  public readonly haptic: Haptic;

  constructor(params?: UnisenseParams) {
    super(params);

    this.trigger = new Trigger(
      params?.trigger || {
        icon: "2",
        name: "Trigger",
        threshold: (1 / 255) * 3,
      }
    );
    this.bumper = new Momentary(
      params?.bumper || { icon: "1", name: "Bumper" }
    );
    this.analog = new Analog(
      params?.analog || { icon: "⨁", name: "Analog", threshold: 0.07 }
    );
    this.haptic = new Haptic();
  }

  public get active(): boolean {
    return this.trigger.active || this.bumper.active || this.analog.active;
  }
}
