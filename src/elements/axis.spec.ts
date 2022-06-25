import { Axis } from "./axis";
import { InputSet } from "../input";

describe("Axis", () => {
  it("should construct", () => {
    expect(new Axis()).toBeInstanceOf(Axis);
  });

  it("should implement `active`", () => {
    const axis = new Axis({ threshold: (1 / 128) * 10 });
    expect(axis.active).toEqual(false);
    axis[InputSet](1);
    expect(axis.active).toEqual(true);
    axis[InputSet](0);
    expect(axis.active).toEqual(false);
    axis[InputSet](-1);
    expect(axis.active).toEqual(true);
    axis[InputSet](0);
    expect(axis.active).toEqual(false);
    axis[InputSet]((1 / 128) * 2);
    expect(axis.active).toEqual(false);
  });

  it("should implement `force`", () => {
    const axis = new Axis({ threshold: (1 / 128) * 10 });
    expect(axis.force).toEqual(0);
    axis[InputSet](1);
    expect(axis.force).toEqual(1);
    axis[InputSet](0);
    expect(axis.force).toEqual(0);
    axis[InputSet](-1);
    expect(axis.force).toEqual(-1);
    axis[InputSet](0);
    expect(axis.force).toEqual(0);
    axis[InputSet]((1 / 128) * 2);
    expect(axis.force).toEqual(0);
  });
});
