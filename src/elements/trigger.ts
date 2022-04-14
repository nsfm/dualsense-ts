import { Intensity } from "./intensity";
import { Haptic } from "./haptic";
import { Input } from "./input";

export class Trigger extends Input<Intensity> {
  public state: Intensity = new Intensity(0);

  public get active(): boolean {
    return this.state.value > 0;
  }

  get pressure(): Intensity {
    return this.state;
  }

  public readonly haptic = new Haptic();
}
