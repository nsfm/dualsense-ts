import { Trigger } from "elements/trigger";
import { Momentary } from "elements/momentary";
import { Analog } from "elements/analog";
import { Haptic } from "elements/haptic";

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense {
  public readonly trigger = new Trigger();
  public readonly bumper = new Momentary();
  public readonly analog = new Analog();
  public readonly haptic = new Haptic();
}
