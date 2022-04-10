import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog } from "./analog";

// The name "Dualsense" clearly implies a composition of two Unisense elements 🤔
export class Unisense {
  public readonly trigger = new Trigger();
  public readonly bumper = new Momentary();
  public readonly analog = new Analog();
}
