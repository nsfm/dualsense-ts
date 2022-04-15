import { Haptic } from "../haptics";
import { Input, Intensity } from "../inputs";

export class Trigger extends Input<Intensity> {
  public state: Intensity = new Intensity(0);

  public get active(): boolean {
    return this.state.value > 0;
  }

  get pressure(): number {
    return this.state.value;
  }

  public readonly haptic = new Haptic();
}
