import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog, AnalogParams } from "./analog";
import { Input, InputParams } from "../input";
import { Intensity } from "math";

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
  private rumbleIntensity: Intensity = 0;

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
  }

  /** Check or adjust rumble intensity for one side of the controller */
  public rumble(intensity?: Intensity | boolean): Intensity {
    if (typeof intensity === "number")
      this.rumbleIntensity = Math.max(Math.min(intensity, 1), 0);
    if (intensity === false) this.rumbleIntensity = 0;
    if (intensity === true) this.rumbleIntensity = 1;
    return this.rumbleIntensity;
  }

  public get active(): boolean {
    return this.trigger.active || this.bumper.active || this.analog.active;
  }
}
