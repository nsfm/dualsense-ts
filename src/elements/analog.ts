import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "./input";
import { Chirality } from "./chirality";

export interface AnalogParams extends InputParams {
  chirality: Chirality;
}

export class Analog extends Input<Analog> {
  public readonly state: Analog = this;

  public readonly x;
  public readonly y;
  public readonly button;

  constructor(params: AnalogParams) {
    super(params);

    const { chirality } = params;
    this.button = new Momentary({
      icon: chirality === "left" ? "(L)" : "(R)",
    });

    this.x = new Axis({
      icon: chirality === "left" ? "LX" : "RX",
    });

    this.y = new Axis({
      icon: chirality === "left" ? "LX" : "RX",
    });
  }

  public get active(): boolean {
    return this.x.active || this.y.active || this.button.active;
  }

  public readonly direction: number = 0;
}
