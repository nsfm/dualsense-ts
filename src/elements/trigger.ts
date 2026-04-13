import { Input } from "../input";
import { Magnitude } from "../math";
import { Momentary } from "./momentary";
import { TriggerFeedback } from "./trigger_feedback";

export class Trigger extends Input<Magnitude> {
  public state: Magnitude = 0;

  /** Independent digital button that actuates at the top of the trigger pull */
  public button: Momentary = new Momentary();

  /** Desired adaptive trigger feedback state */
  public readonly feedback = new TriggerFeedback();

  public get active(): boolean {
    return this.state > 0;
  }

  public get pressure(): Magnitude {
    return this.state;
  }

  public get magnitude(): Magnitude {
    return this.state;
  }

  public changes(state: Magnitude): boolean {
    return this.state !== state;
  }
}
