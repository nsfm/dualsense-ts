import { Momentary } from "./momentary";

export class Mute extends Momentary {
  public readonly indicator = {};
  public readonly status = new Momentary({ icon: "!", name: "Status" });
}
