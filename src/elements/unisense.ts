import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog } from "./analog";
import { Haptic } from "../haptics";
import { Input, InputParams } from "../inputs";

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense extends Input<Unisense> {
  public readonly state: Unisense = this;

  public readonly trigger: Trigger;
  public readonly bumper: Momentary;
  public readonly analog: Analog;
  public readonly haptic: Haptic;

  constructor(params: InputParams) {
    super(params);

    this.trigger = new Trigger({});
    this.bumper = new Momentary({});
    this.analog = new Analog({});
    this.haptic = new Haptic();
  }

  public get active(): boolean {
    return this.trigger.active || this.bumper.active || this.analog.active;
  }
}
