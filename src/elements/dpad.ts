import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";

export interface DpadParams extends InputParams {
  up?: InputParams;
  down?: InputParams;
  left?: InputParams;
  right?: InputParams;
}

export class Dpad extends Input<Dpad> {
  public readonly state: Dpad = this;

  public readonly up: Momentary;
  public readonly down: Momentary;
  public readonly left: Momentary;
  public readonly right: Momentary;

  constructor(params: DpadParams = {}) {
    super(params);
    const { up, down, left, right } = params

    this.up = new Momentary(params?.up || { icon: "⮉", name: "Up", ...up});
    this.down = new Momentary(params?.down || { icon: "⮋", name: "Down", ...down});
    this.left = new Momentary(params?.left || { icon: "⮈", name: "Left", ...left });
    this.right = new Momentary(params?.right || { icon: "⮊", name: "Right", ...right });
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
