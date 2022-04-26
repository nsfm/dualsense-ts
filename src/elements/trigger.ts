import { Haptic } from "../haptics";
import { Input, Intensity } from "../inputs";
import { Momentary } from "./momentary";

export class Trigger extends Input<Intensity> {
  public state: Intensity = new Intensity(0);

  public button: Momentary = new Momentary({});

  public get active(): boolean {
    return this.state.value > 0;
  }

  get pressure(): number {
    return this.state.value;
  }

  public changes(state: Intensity): boolean {
    return this.state.value !== state.value;
  }

  public readonly haptic = new Haptic();
}
