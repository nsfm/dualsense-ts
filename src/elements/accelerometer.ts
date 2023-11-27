import { Input, InputParams } from "../input";
import { Axis, AxisParams } from "./axis";

export interface AccelerometerParams extends InputParams {
  /** Configuration for the input's x axis */
  x?: AxisParams;

  /** Configuration for the input's y axis */
  y?: AxisParams;

  /** Configuration for the input's z axis */
  z?: AxisParams;
}

/** Tracks the linear acceleration of the controller. */
export class Accelerometer extends Input<Accelerometer> {
  public readonly state: this = this;

  public readonly x: Axis;
  public readonly y: Axis;
  public readonly z: Axis;

  constructor(params?: AccelerometerParams) {
    super(params);
    const { x, y, z } = params ?? {};

    this.x = new Axis({
      icon: "AX",
      name: "X",
      ...params,
      ...x,
    });
    this.y = new Axis({
      icon: "AY",
      name: "Y",
      ...params,
      ...y,
    });
    this.z = new Axis({
      icon: "AZ",
      name: "Z",
      ...params,
      ...z,
    });
  }

  public readonly active = false;
}
