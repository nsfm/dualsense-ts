import { Momentary } from "./momentary";

export class Touchpad {
  // TODO model 2-point touch panel
  public readonly x1 = 0;
  public readonly y1 = 0;
  public readonly button = new Momentary();
}
