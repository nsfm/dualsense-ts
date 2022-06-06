import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Increment } from "./increment";
import { Input, InputParams } from "../input";

export class Touchpad extends Input<Touchpad> {
  public readonly state: Touchpad = this;

  public get active(): boolean {
    return this.contact0.active;
  }

  // Left hand - default for single touch
  public readonly x0;
  public readonly y0;
  public readonly id0;
  public readonly contact0;

  // Right hand - only multitouch
  public readonly x1;
  public readonly y1;
  public readonly id1;
  public readonly contact1;

  public readonly button;

  constructor(params: InputParams) {
    super(params);

    this.button = new Momentary({ icon: "[__]" });

    this.x0 = new Axis({ icon: "[X0]" });
    this.y0 = new Axis({ icon: "[Y0]" });
    this.id0 = new Increment({ icon: "[#0]" });
    this.contact0 = new Momentary({ icon: "[_0]" });

    this.x1 = new Axis({ icon: "[X1]" });
    this.y1 = new Axis({ icon: "[Y1]" });
    this.id1 = new Increment({ icon: "[#1]" });
    this.contact1 = new Momentary({ icon: "[_1]" });
  }
}
