import { Momentary } from "./momentary";
import { MuteLedMode } from "../hid/command";

export class Mute extends Momentary {
  /** Whether the mute indicator LED is currently lit (managed by controller firmware) */
  public readonly status = new Momentary({ icon: "🔇", name: "MuteStatus" });

  /** Current software-controlled LED mode, or undefined if firmware-managed */
  public ledMode?: MuteLedMode;

  /** Set the mute LED mode. Overrides the firmware-managed state. */
  public setLed(mode: MuteLedMode): void {
    this.ledMode = mode;
  }

  /** Release software control, returning the LED to firmware management */
  public resetLed(): void {
    this.ledMode = undefined;
  }
}
