import { Input, InputParams } from "../input";
import { Force, Magnitude } from "../math";

/**
 * Configuration for an Axis input.
 */
export interface AxisParams extends InputParams {
  // Ignore input of magnitude less than or equal to this value
  deadzone?: Magnitude;
}

/**
 * Represents a simple ranged input. For example, one axis of an analog
 * joystick or touchpad, the pull of a trigger, or the movement of a gyroscope.
 */
export class Axis extends Input<Force> {
  public state: Force = 0;

  /**
   * Ignores inputs of magnitude less than this value (0 to 1).
   */
  public deadzone: Magnitude = 0.05;

  constructor(params?: AxisParams) {
    super(params);
    const { deadzone } = params ?? {};

    if (deadzone) this.deadzone = deadzone;
  }

  public get active(): boolean {
    return Math.abs(this.state) > this.deadzone;
  }

  /**
   * Returns the axis position, ignoring the deadzone value.
   */
  public get force(): Force {
    return this.active ? this.state : 0;
  }

  /**
   * Returns an absolute axis position.
   */
  public get magnitude(): Magnitude {
    const magnitude = Math.abs(this.force);
    if (magnitude < this.deadzone) return 0;
    return (magnitude - this.deadzone) / (1 - this.deadzone);
  }
}
