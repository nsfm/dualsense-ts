import { Axis } from "./axis";
import { Momentary } from "./momentary";
import { Input, InputParams } from "../input";
import { Radians, Degrees, Magnitude } from "../math";

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

  public readonly x: Axis;
  public readonly y: Axis;
  public readonly button: Momentary;

  constructor(params?: AnalogParams) {
    super(params);

    this.button = new Momentary(
      params?.button || { icon: "3", name: "Button" }
    );
    this.x = new Axis(params?.x || { icon: "↔", name: "X" });
    this.y = new Axis(params?.y || { icon: "↕", name: "Y" });
  }

  // Returns true if the stick is away from the idle position, or the button is pressed.
  public get active(): boolean {
    return this.magnitude > this.threshold || this.button.active;
  }

  // Returns a direction and magnitude representing the stick's position.
  public get vector(): { direction: number; magnitude: number } {
    return { direction: this.direction, magnitude: this.magnitude };
  }

  // Returns the magnitude of the stick's position.
  public get magnitude(): Magnitude {
    return Math.min(Math.abs(Math.hypot(this.x.state, this.y.state)), 1);
  }

  // Returns the angle related to the stick's position in radians.
  public get direction(): Radians {
    return Math.atan2(this.y.state, this.x.state);
  }

  // Alias for `.direction`
  public get radians(): Radians {
    return this.direction;
  }

  // Alias for `.direction`
  public get angle(): Radians {
    return this.direction;
  }

  // Alias for `.direction` converted to degrees.
  public get directionDegrees(): Degrees {
    return (this.direction * 180) / Math.PI;
  }

  // Alias for `.directionDegrees`.
  public get degrees(): Degrees {
    return this.directionDegrees;
  }

  // Alias for `.directionDegrees`.
  public get angleDegrees(): Degrees {
    return this.directionDegrees;
  }
}
