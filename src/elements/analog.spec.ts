import { Analog } from "./analog";
import { InputSet } from "../input";

describe("Analog", () => {
  it("should construct", () => {
    expect(new Analog()).toBeInstanceOf(Analog);
  });

  it("should use params", () => {
    const analog = new Analog({
      threshold: 5,
      x: { icon: "?" },
      y: { name: "?" },
      button: { icon: "!" },
    });
    expect(analog.threshold).toEqual(5);
  });

  it("should implement `active`", () => {
    const analog = new Analog();
    expect(analog.active).toEqual(false);
    analog.x[InputSet](1);
    expect(analog.active).toEqual(true);
    analog.x[InputSet](0);
    expect(analog.active).toEqual(false);
  });

  it("should utilize `deadzone`", () => {
    const analog = new Analog({ deadzone: 0.5 });
    expect(analog.active).toEqual(false);
    analog.x[InputSet](0.4);
    expect(analog.active).toEqual(false);
    analog.x[InputSet](0.5);
    expect(analog.active).toEqual(false);
    analog.x[InputSet](0.6);
    expect(analog.active).toEqual(true);
    analog.x[InputSet](0);
    expect(analog.active).toEqual(false);
    analog.x[InputSet](-0.6);
    expect(analog.active).toEqual(true);
    analog.x[InputSet](-0.4);
    expect(analog.active).toEqual(false);
  });

  it("should return good directions", () => {
    const analog = new Analog();
    expect(analog.radians).toBeCloseTo(0);
    expect(analog.degrees).toBeCloseTo(0);
    analog.x[InputSet](1);
    analog.y[InputSet](0);
    expect(analog.radians).toBeCloseTo(0);
    expect(analog.degrees).toBeCloseTo(0);
    analog.x[InputSet](0);
    analog.y[InputSet](1);
    expect(analog.radians).toBeCloseTo(Math.PI / 2);
    expect(analog.degrees).toBeCloseTo(90);
    analog.x[InputSet](-1);
    analog.y[InputSet](0);
    expect(analog.radians).toBeCloseTo(Math.PI);
    expect(analog.degrees).toBeCloseTo(180);
    analog.x[InputSet](0);
    analog.y[InputSet](-1);
    expect(analog.radians).toBeCloseTo((-1 * Math.PI) / 2);
    expect(analog.vector.direction).toBeCloseTo((-1 * Math.PI) / 2);
    expect(analog.direction).toBeCloseTo((-1 * Math.PI) / 2);
    expect(analog.angle).toBeCloseTo((-1 * Math.PI) / 2);
    expect(analog.degrees).toBeCloseTo(-90);
    expect(analog.directionDegrees).toBeCloseTo(-90);
    expect(analog.angleDegrees).toBeCloseTo(-90);
  });

  it("should return good magnitudes", () => {
    const analog = new Analog();
    expect(analog.magnitude).toBeCloseTo(0);
    analog.x[InputSet](1);
    analog.y[InputSet](0);
    expect(analog.magnitude).toBeCloseTo(1);
    analog.x[InputSet](0);
    analog.y[InputSet](1);
    expect(analog.magnitude).toBeCloseTo(1);
    analog.x[InputSet](-1);
    analog.y[InputSet](0);
    expect(analog.magnitude).toBeCloseTo(1);
    analog.x[InputSet](0);
    analog.y[InputSet](-1);
    expect(analog.magnitude).toBeCloseTo(1);
    expect(analog.vector.magnitude).toBeCloseTo(1);
  });
});
