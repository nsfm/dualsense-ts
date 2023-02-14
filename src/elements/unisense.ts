import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog, AnalogParams } from "./analog";
import { Haptic } from "../haptics";
import { Input, InputParams } from "../input";

/** Settings for the trigger, bumpers, and analog stick on one side of the controller */
export interface UnisenseParams extends InputParams {
  /** Settings for a trigger */
  trigger?: InputParams;
  /** Settings for a bumper button */
  bumper?: InputParams;
  /** Settings for an analog stick */
  analog?: AnalogParams;
}

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
/** One half of the controller */
export class Unisense extends Input<Unisense> {
  public readonly state: this = this;

  public readonly trigger: Trigger;
  public readonly bumper: Momentary;
  public readonly analog: Analog;
  public readonly haptic: Haptic;

  constructor(params: UnisenseParams = {}) {
    super(params);
    const { trigger, bumper, analog } = params;

    this.trigger = new Trigger({
      icon: "2",
      name: "Trigger",
      threshold: 1 / 255,
      ...trigger,
    });
    this.bumper = new Momentary({ icon: "1", name: "Bumper", ...bumper });
    this.analog = new Analog({
      icon: "⨁",
      name: "Analog",
      threshold: 1 / 128,
      deadzone: 8 / 128,
      ...analog,
    });
    this.haptic = new Haptic();
  }

  public get active(): boolean {
    return this.trigger.active || this.bumper.active || this.analog.active;
  }
}
