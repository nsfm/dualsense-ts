import { InputSet } from "../input";
import { Unisense } from "./unisense";
import { Trigger } from "./trigger";
import { Momentary } from "./momentary";
import { Analog } from "./analog";

describe("Unisense", () => {
  it("should construct", () => {
    expect(new Unisense()).toBeInstanceOf(Unisense);
  });

  it("should construct with params", () => {
    expect(new Unisense({ icon: "L" })).toBeInstanceOf(Unisense);
  });

  it("should have trigger, bumper, and analog children", () => {
    const uni = new Unisense();
    expect(uni.trigger).toBeInstanceOf(Trigger);
    expect(uni.bumper).toBeInstanceOf(Momentary);
    expect(uni.analog).toBeInstanceOf(Analog);
  });

  it("should return current intensity with no args", () => {
    const uni = new Unisense();
    expect(uni.rumble()).toEqual(0);
  });

  it("should set rumble with a number", () => {
    const uni = new Unisense();
    expect(uni.rumble(0.5)).toEqual(0.5);
    expect(uni.rumble()).toEqual(0.5);
  });

  it("should set rumble with boolean", () => {
    const uni = new Unisense();
    expect(uni.rumble(true)).toEqual(1);
    expect(uni.rumble(false)).toEqual(0);
  });

  it("should clamp rumble to 0-1", () => {
    const uni = new Unisense();
    uni.rumble(2);
    expect(uni.rumble()).toEqual(1);
    uni.rumble(-1);
    expect(uni.rumble()).toEqual(0);
  });

  it("should implement active", () => {
    const uni = new Unisense();
    expect(uni.active).toEqual(false);
    uni.bumper[InputSet](true);
    expect(uni.active).toEqual(true);
    uni.bumper[InputSet](false);
    expect(uni.active).toEqual(false);
  });
});
