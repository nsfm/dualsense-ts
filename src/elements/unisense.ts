import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog } from "./analog";
import { Haptic } from "../haptics";
import { Input, InputParams, Chirality } from "../inputs";

export interface UnisenseParams extends InputParams {
  chirality: Chirality;
}

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense extends Input<Unisense> {
  public readonly state: Unisense = this;

  public readonly trigger: Trigger;
  public readonly bumper: Momentary;
  public readonly analog: Analog;
  public readonly haptic: Haptic;

  constructor(params: UnisenseParams) {
    super(params);

    const { chirality } = params;
    const left = chirality === "left";

    this.trigger = new Trigger({ icon: left ? "/  " : "\\  " });
    this.bumper = new Momentary({ icon: left ? "-  " : "  -" });
    this.analog = new Analog({ chirality });
    this.haptic = new Haptic();
  }

  public get active(): boolean {
    return this.trigger.active || this.bumper.active || this.analog.active;
  }
}
