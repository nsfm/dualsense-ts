import { Analog } from "./analog";
import { Increment } from "./increment";

/**
 * Represents a touchpad touch, treated like an analog joystick input
 * with [0,0] representing the center of the touchpad.
 */
export class Touch extends Analog {
  public readonly state: this = this;
  public readonly contact = this.button;
  public readonly tracker: Increment = new Increment();
  public deadzone = 0;

  public get active(): boolean {
    return this.contact.active;
  }
}
