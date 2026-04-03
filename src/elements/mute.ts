import { Momentary } from "./momentary";

export class Mute extends Momentary {
  /** Whether the mute indicator LED is currently lit (managed by controller firmware) */
  public readonly status = new Momentary({ icon: "🔇", name: "MuteStatus" });
}
