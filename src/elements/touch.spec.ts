import { InputSet } from "../input";
import { Touch } from "./touch";
import { Analog } from "./analog";
import { Increment } from "./increment";

describe("Touch", () => {
  it("should construct", () => {
    expect(new Touch()).toBeInstanceOf(Touch);
  });

  it("should extend Analog", () => {
    expect(new Touch()).toBeInstanceOf(Analog);
  });

  it("should have contact as alias for button", () => {
    const touch = new Touch();
    expect(touch.contact).toBe(touch.button);
  });

  it("should have a tracker", () => {
    const touch = new Touch();
    expect(touch.tracker).toBeInstanceOf(Increment);
  });

  it("should default deadzone to 0", () => {
    const touch = new Touch();
    expect(touch.deadzone).toEqual(0);
  });

  it("should base active on contact", () => {
    const touch = new Touch();
    expect(touch.active).toEqual(false);
    touch.x[InputSet](1);
    expect(touch.active).toEqual(false);
    touch.contact[InputSet](true);
    expect(touch.active).toEqual(true);
    touch.contact[InputSet](false);
    expect(touch.active).toEqual(false);
  });
});
