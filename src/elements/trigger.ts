import { Intensity } from "./intensity";
import { Momentary } from "./momentary";
import { Haptic } from "./haptic";

export class Trigger {
  public readonly pressure: Intensity = new Intensity(0);
  public readonly haptic = new Haptic();

  public readonly maxed = new Momentary(); // TODO virtual input linked to the pressure
  public readonly active = new Momentary();
}
