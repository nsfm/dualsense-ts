import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { InputId } from "./input_ids";

export class Touchpad {
  public readonly x1;
  public readonly y1;
  public readonly x2;
  public readonly y2;
  public readonly button;

  constructor() {
    this.button = new Momentary({
      id: InputId.TouchpadButton,
      icon: "[__]",
    });

    this.x1 = new Axis({
      id: InputId.TouchpadX1,
      icon: "[X1]",
    });

    this.y1 = new Axis({
      id: InputId.TouchpadY1,
      icon: "[Y1]",
    });

    this.x2 = new Axis({
      id: InputId.TouchpadX2,
      icon: "[X2]",
    });

    this.y2 = new Axis({
      id: InputId.TouchpadY2,
      icon: "[Y2]",
    });
  }

  public readonly direction: number = 0;
}
