import { Input } from "./input";

// -1.0 to 1.0
export type Magnitude = number;

export class Axis extends Input<Magnitude> {
  public state: Magnitude = 0;

  public get active(): boolean {
    return this.state !== 0;
  }
}
