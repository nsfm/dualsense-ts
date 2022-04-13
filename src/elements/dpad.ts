import { Momentary } from "./momentary";
import { InputId } from "./input_ids";

export class Dpad {
  // TODO Icons
  public readonly up = new Momentary({ id: InputId.Up, icon: "^" });
  public readonly down = new Momentary({ id: InputId.Down, icon: "/" });
  public readonly left = new Momentary({ id: InputId.Left, icon: "<-" });
  public readonly right = new Momentary({ id: InputId.Right, icon: "->" });
}
