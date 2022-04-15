import { Momentary } from "./momentary";
import { Input } from "../inputs";

export class Dpad extends Input<Dpad> {
  public readonly state: Dpad = this;

  public get active(): boolean {
    return (
      this.up.active ||
      this.down.active ||
      this.left.active ||
      this.right.active
    );
  }

  public readonly up = new Momentary({ icon: "^" });
  public readonly down = new Momentary({ icon: "\\/" });
  public readonly left = new Momentary({ icon: "<-" });
  public readonly right = new Momentary({ icon: "->" });
}
