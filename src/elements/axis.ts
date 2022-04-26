import { Input, Magnitude } from "../inputs";

export class Axis extends Input<Magnitude> {
  public state: Magnitude = 0;

  public deadzone: Magnitude = 5;

  public get active(): boolean {
    return this.state < this.deadzone;
  }

  public changes(state: Magnitude): boolean {
    if (this.state < this.deadzone && state < this.deadzone) return false;
    return this.state !== state;
  }
}
