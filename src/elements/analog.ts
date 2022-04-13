import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { InputId } from "./input_ids";
import { Chirality } from "./chirality";

export class Analog {
  public readonly x;
  public readonly y;
  public readonly button;

  constructor(chirality: Chirality) {
    this.button = new Momentary({
      id:
        chirality === "left"
          ? InputId.LeftAnalogButton
          : InputId.RightAnalogButton,
      icon: chirality === "left" ? "(L)" : "(R)",
    });

    this.x = new Axis({
      id: chirality === "left" ? InputId.LeftAnalogX : InputId.RightAnalogX,
      icon: chirality === "left" ? "LX" : "RX",
    });

    this.y = new Axis({
      id: chirality === "left" ? InputId.LeftAnalogY : InputId.RightAnalogY,
      icon: chirality === "left" ? "LX" : "RX",
    });
  }

  public readonly direction: number = 0;
}
