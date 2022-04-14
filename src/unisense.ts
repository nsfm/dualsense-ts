import { Trigger } from "elements/trigger";
import { Momentary } from "elements/momentary";
import { Analog } from "elements/analog";
import { Haptic } from "elements/haptic";
import { Chirality } from "elements/chirality";
import { InputId } from "elements/input_ids";

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense {
  public readonly trigger: Trigger;
  public readonly bumper: Momentary;
  public readonly analog: Analog;
  public readonly haptic: Haptic;

  constructor(chirality: Chirality) {
    const left = chirality === "left";

    this.trigger = new Trigger({
      id: left ? InputId.LeftTrigger : InputId.RightTrigger,
      icon: left ? "/  " : "\\  ",
    });

    this.bumper = new Momentary({
      id: left ? InputId.LeftBumper : InputId.RightBumper,
      icon: left ? "-  " : "  -",
    });

    this.analog = new Analog(chirality);

    this.haptic = new Haptic();
  }
}
