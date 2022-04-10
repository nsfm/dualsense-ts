import { Momentary } from "./momentary";

export class Dpad {
  public readonly up = new Momentary();
  public readonly down = new Momentary();
  public readonly left = new Momentary();
  public readonly right = new Momentary();
}
