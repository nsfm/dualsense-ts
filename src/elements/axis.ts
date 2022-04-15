import { Input, Magnitude } from "../inputs";

export class Axis extends Input<Magnitude> {
  public state: Magnitude = 0;

  public get active(): boolean {
    return this.state !== 0;
  }
}
