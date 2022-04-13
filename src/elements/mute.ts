import { Momentary, MomentaryParams } from "./momentary";
import { Indicator } from "./indicator";

export class Mute extends Momentary {
  public readonly indicator = new Indicator();

  constructor(params: MomentaryParams) {
    super(params);
  }
}
