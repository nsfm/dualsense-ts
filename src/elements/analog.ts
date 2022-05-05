import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";

export interface AnalogParams extends InputParams {
  button?: InputParams;
  x?: InputParams;
  y?: InputParams;
}

export class Analog extends Input<Analog> {
  public readonly state: Analog = this;

  public readonly x;
  public readonly y;
  public readonly button;

  constructor(params?: AnalogParams) {
    super(params);

    this.button = new Momentary(
      params?.button || { icon: "3", name: "Button" }
    );
    this.x = new Axis(params?.x || { icon: "↔", name: "X" });
    this.y = new Axis(params?.y || { icon: "↕", name: "Y" });
  }

  public get active(): boolean {
    return this.x.active || this.y.active || this.button.active;
  }

  public readonly direction: number = 0;
}
