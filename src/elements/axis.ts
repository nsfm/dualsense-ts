import { Input, InputParams } from "../input";

export type Direction = "Left" | "Right" | "Up" | "Down";

export type Vector = number;

type Magnitude = number;

export interface AxisParams extends InputParams {
  direction?: Direction;
}

export class Axis extends Input<Vector> {
  public state: Vector = 0;

  public deadzone: Magnitude = 5;

  constructor(params: AxisParams) {
    super(params);
  }

  public get active(): boolean {
    return Math.abs(this.state) < this.deadzone;
  }

  public get vector(): Vector {
    return this.state;
  }

  public get magnitude(): Magnitude {
    return Math.abs(this.state);
  }

  public get direction(): Direction {
    return "Left";
  }

  public changes(state: Magnitude): boolean {
    if (this.state < this.deadzone && state < this.deadzone) return false;
    return this.state !== state;
  }
}
