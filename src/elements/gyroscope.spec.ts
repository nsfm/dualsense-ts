import { Gyroscope } from "./gyroscope";
import { Axis } from "./axis";

describe("Gyroscope", () => {
  it("should construct", () => {
    expect(new Gyroscope()).toBeInstanceOf(Gyroscope);
  });

  it("should have x, y, z Axis children", () => {
    const gyro = new Gyroscope();
    expect(gyro.x).toBeInstanceOf(Axis);
    expect(gyro.y).toBeInstanceOf(Axis);
    expect(gyro.z).toBeInstanceOf(Axis);
  });

  it("should always be inactive", () => {
    const gyro = new Gyroscope();
    expect(gyro.active).toEqual(false);
  });
});
