import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";
import { Radians, Degrees, Magnitude, Force } from "../math";

/**
 * Configuration for an analog joystick and its basic inputs.
 */
export interface AnalogParams extends InputParams {
  button?: InputParams;
  x?: InputParams;
  y?: InputParams;
  threshold?: Magnitude;
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
  public readonly state: Analog = this;

  /**
   * The left/right position of the input.
   */
  public readonly x: Axis;
  /**
   * The up/down position of the input.
   */
  public readonly y: Axis;
  /**
   * Button triggered by pressing the stick.
   */
  public readonly button: Momentary;

  constructor(params?: AnalogParams) {
    super(params);
    const { button, x, y, threshold } = params || {};

    this.button = new Momentary({ icon: "3", name: "Button", ...button });
    this.x = new Axis({
      icon: "↔",
      name: "X",
      threshold: threshold || 0.01,
      ...x,
    });
    this.y = new Axis({
      icon: "↕",
      name: "Y",
      threshold: threshold || 0.01,
      ...y,
    });
  }

  /**
   * Returns true if the stick is away from the idle position, or the button is pressed.
   */
  public get active(): boolean {
    return this.x.active || this.y.active || this.button.active;
  }

  /**
   * Returns a direction and magnitude representing the stick's position.
   */
  public get vector(): { direction: Radians; magnitude: Magnitude } {
    return { direction: this.direction, magnitude: this.magnitude };
  }

  /**
   * Returns an force from the stick's position.
   */
  public get force(): Force {
    return this.active
      ? Math.max(Math.min(Math.hypot(this.x.state, this.y.state), 1), -1)
      : 0;
  }

  /**
   * Returns a magnitude from the stick's position.
   */
  public get magnitude(): Magnitude {
    return Math.abs(this.force);
  }

  /**
   * Returns the stick's angle in radians.
   */
  public get direction(): Radians {
    return Math.atan2(this.y.state, this.x.state);
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
