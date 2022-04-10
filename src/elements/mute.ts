import { Momentary } from "./momentary";
import { Indicator } from "./indicator";

export class Mute {
  public readonly toggle = new Momentary(); // TODO Toggle
  public readonly indicator = new Indicator();
}
