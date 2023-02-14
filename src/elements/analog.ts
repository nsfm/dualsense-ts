import { Axis, AxisParams } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";
import { Radians, Degrees, Magnitude, Force } from "../math";

/** Configuration for an analog joystick and nested inputs */
export interface AnalogParams extends InputParams {
  /** Configuration for the input's button */
  button?: InputParams;

  /** Configuration for the input's x axis */
  x?: AxisParams;

  /** Configuration for the input's y axis */
  y?: AxisParams;

  /** Ignore input of magnitude less than or equal to this value */
  deadzone?: Magnitude;
}

/**
 * Represents an analog joystick.
 *
 * The joystick is abstracted to a unit circle.
 * - At rest, the stick's coordinates are [0,0]
 * - Pushed all the way to the right, the stick's coordinates are [1,0]
 * - Pushed all the way down and to the left, the stick's coordinates are [-1, -1]
 */
export class Analog extends Input<Analog> {
  public readonly state: this = this;

  /** The left/right position of the input */
  public readonly x: Axis;
  /** The up/down position of the input */
  public readonly y: Axis;
  /** Button triggered by pressing the stick */
  public readonly button: Momentary;
  /** Ignores stick movement below this value (0 to 1) */
  public deadzone: Magnitude = 0.05;

  constructor(params?: AnalogParams) {
    super(params);
    const { button, x, y, deadzone } = params ?? {};

    if (deadzone) this.deadzone = deadzone;
    this.button = new Momentary({ icon: "3", name: "Button", ...button });
    this.x = new Axis({
      icon: "↔",
      name: "X",
      ...params,
      ...x,
    });
    this.y = new Axis({
      icon: "↕",
      name: "Y",
      ...params,
      ...y,
    });
  }

  /**
   * Returns true if the stick is away from the idle position, or the button is pressed.
   */
  public get active(): boolean {
    return this.magnitude > 0 || this.button.active;
  }

  /**
   * Returns a direction and magnitude representing the stick's position.
   */
  public get vector(): { direction: Radians; magnitude: Magnitude } {
    return { direction: this.direction, magnitude: this.magnitude };
  }

  /**
   * Returns a force from the stick's position.
   * This ignores the deadzone value.
   */
  public get force(): Force {
    return Math.max(Math.min(Math.hypot(this.x.force, this.y.force), 1), -1);
  }

  /**
   * Returns a magnitude from the stick's position.
   */
  public get magnitude(): Magnitude {
    const magnitude = Math.abs(this.force);
    if (magnitude < this.deadzone) return 0;
    return (magnitude - this.deadzone) / (1 - this.deadzone);
  }

  /**
   * Returns the stick's angle in radians.
   */
  public get direction(): Radians {
    return Math.atan2(this.y.force, this.x.force);
  }

  /**
   * Alias for `.direction`
   */
  public get radians(): Radians {
    return this.direction;
  }

  /**
   * Alias for `.direction`
   */
  public get angle(): Radians {
    return this.direction;
  }

  /**
   * Alias for `.direction` converted to degrees.
   */
  public get directionDegrees(): Degrees {
    return (this.direction * 180) / Math.PI;
  }

  /**
   * Alias for `.directionDegrees`.
   */
  public get degrees(): Degrees {
    return this.directionDegrees;
  }

  /**
   * Alias for `.directionDegrees`.
   */
  public get angleDegrees(): Degrees {
    return this.directionDegrees;
  }
}
