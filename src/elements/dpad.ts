import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";

export interface DpadParams extends InputParams {
  up?: InputParams;
  down?: InputParams;
  left?: InputParams;
  right?: InputParams;
}

export class Dpad extends Input<Dpad> {
  public readonly state: this = this;

  public readonly up: Momentary;
  public readonly down: Momentary;
  public readonly left: Momentary;
  public readonly right: Momentary;

  constructor(params: DpadParams = {}) {
    super(params);
    const { up, down, left, right } = params;
    this.up = new Momentary({ icon: "⮉", name: "Up", ...(up ?? {}) });
    this.down = new Momentary({ icon: "⮋", name: "Down", ...(down ?? {}) });
    this.left = new Momentary({ icon: "⮈", name: "Left", ...(left ?? {}) });
    this.right = new Momentary({ icon: "⮊", name: "Right", ...(right ?? {}) });
  }

  public get active(): boolean {
    return (
      this.up.active ||
      this.down.active ||
      this.left.active ||
      this.right.active
    );
  }
}
