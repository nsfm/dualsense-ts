import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../inputs";

export class Analog extends Input<Analog> {
  public readonly state: Analog = this;

  public readonly x;
  public readonly y;
  public readonly button;

  constructor(params: InputParams) {
    super(params);

    this.button = new Momentary({});
    this.x = new Axis({});
    this.y = new Axis({});
  }

  public get active(): boolean {
    return this.x.active || this.y.active || this.button.active;
  }

  public readonly direction: number = 0;
}
