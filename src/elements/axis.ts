import { Input } from "../input";
import { Force, Magnitude } from "../math";

export class Axis extends Input<Force> {
  public state: Force = 0;

  public deadzone: Magnitude = 0.025;

  public get active(): boolean {
    return this.magnitude > this.deadzone;
  }

  public get force(): Force {
    return this.state;
  }

  public get magnitude(): Magnitude {
    return Math.abs(this.state);
  }

  public changes(state: Magnitude): boolean {
    if (!this.active && Math.abs(state) < this.deadzone) return false;
    return this.state !== state;
  }
}
