import { Axis } from "./axis";
import { Momentary } from "./momentary";

export class Analog {
  public readonly x = new Axis();
  public readonly y = new Axis();
  public readonly button = new Momentary();

  public readonly direction: number = 0;
}
