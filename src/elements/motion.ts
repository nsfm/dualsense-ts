import { Gyroscope } from "./gyroscope";
import { Accelerometer } from "./accelerometer";

export class Motion {
  public readonly gyroscope = new Gyroscope();
  public readonly accelerometer = new Accelerometer();
}
