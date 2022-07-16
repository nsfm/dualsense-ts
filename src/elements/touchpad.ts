import { Momentary } from "./momentary";
import { Touch } from "./touch";
import { Input, InputParams } from "../input";

export class Touchpad extends Input<Touchpad> {
  public readonly state: this = this;

  public get active(): boolean {
    return this.left.contact.active;
  }

  public readonly button: Momentary;

  // Left is the default touch, outside multi-touch
  public readonly left: Touch;
  public readonly right: Touch;

  constructor(params: InputParams) {
    super(params);

    this.button = new Momentary({ icon: "[__]" });
    this.left = new Touch();
    this.right = new Touch();
  }
}
