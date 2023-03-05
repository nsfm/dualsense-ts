import { Input } from "../input";
import { Magnitude } from "../math";
import { Momentary } from "./momentary";

export class Trigger extends Input<Magnitude> {
  public state: Magnitude = 0;

  public button: Momentary = new Momentary();

  public get active(): boolean {
    return this.state > 0;
  }

  public get pressure(): Magnitude {
    return this.state;
  }

  public get magnitude(): Magnitude {
    return this.state;
  }

  public changes(state: Magnitude): boolean {
    return this.state !== state;
  }
}
