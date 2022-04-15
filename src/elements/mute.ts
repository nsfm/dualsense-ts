import { Momentary } from "./momentary";
import { Indicator } from "../indicators";

export class Mute extends Momentary {
  public readonly indicator = new Indicator();
}
