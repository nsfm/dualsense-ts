import { Accelerometer } from "./accelerometer";
import { Axis } from "./axis";

describe("Accelerometer", () => {
  it("should construct", () => {
    expect(new Accelerometer()).toBeInstanceOf(Accelerometer);
  });

  it("should have x, y, z Axis children", () => {
    const accel = new Accelerometer();
    expect(accel.x).toBeInstanceOf(Axis);
    expect(accel.y).toBeInstanceOf(Axis);
    expect(accel.z).toBeInstanceOf(Axis);
  });

  it("should always be inactive", () => {
    const accel = new Accelerometer();
    expect(accel.active).toEqual(false);
  });
});
