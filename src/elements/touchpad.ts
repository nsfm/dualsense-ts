import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../inputs";

export class Touchpad extends Input<Touchpad> {
  public readonly state: Touchpad = this;

  public get active(): boolean {
    return (
      this.x1.active ||
      this.y1.active ||
      this.x2.active ||
      this.y2.active ||
      this.button.active
    );
  }

  // TODO: Handling for child inputs within Input?

  public readonly x1;
  public readonly y1;
  public readonly x2;
  public readonly y2;
  public readonly button;

  constructor(params: InputParams) {
    super(params);

    this.button = new Momentary({ icon: "[__]" });

    this.x1 = new Axis({ icon: "[X1]" });

    this.y1 = new Axis({ icon: "[Y1]" });

    this.x2 = new Axis({ icon: "[X2]" });

    this.y2 = new Axis({ icon: "[Y2]" });
  }

  public readonly direction: number = 0;
}
