import { Momentary, Dpad, Mute, Unisense } from "elements";
import { Input } from "inputs";

export class Dualsense extends Input<Dualsense> {
  public readonly state: Dualsense = this;

  public readonly ps = new Momentary({ icon: "ℙ𝕊" });
  public readonly mute = new Mute({ icon: "🎙" });

  public readonly options = new Momentary({ icon: "☰" });
  public readonly create = new Momentary({ icon: "🖉" });

  public readonly triangle = new Momentary({ icon: "▲" });
  public readonly circle = new Momentary({ icon: "o" });
  public readonly cross = new Momentary({ icon: "x" });
  public readonly square = new Momentary({ icon: "■" });

  public readonly dpad = new Dpad({ icon: "+" });

  public readonly left = new Unisense({ chirality: "left" });
  public readonly right = new Unisense({ chirality: "right" });

  public get active(): boolean {
    return (
      this.ps.active ||
      this.mute.active ||
      this.options.active ||
      this.create.active ||
      this.triangle.active ||
      this.circle.active ||
      this.cross.active ||
      this.square.active ||
      this.dpad.active ||
      this.left.active ||
      this.right.active
    );
  }

  constructor() {
    super({});
  }
}
