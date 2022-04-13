import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { InputId } from "./input_ids";
import { Input, InputParams } from "./input";

export class Touchpad extends Input<Touchpad> {
  public readonly state: Touchpad = this;
  public readonly defaultState: Touchpad = this;

  // TODO: the Input.active function needs to be tied to the child inputs
  // TODO: Handling for child inputs within Input?

  public readonly x1;
  public readonly y1;
  public readonly x2;
  public readonly y2;
  public readonly button;

  constructor(params: InputParams) {
    super(params);

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
