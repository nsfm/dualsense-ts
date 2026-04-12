import { InputSet } from "../input";
import { Touchpad } from "./touchpad";
import { Touch } from "./touch";
import { Momentary } from "./momentary";

describe("Touchpad", () => {
  it("should construct", () => {
    expect(new Touchpad({})).toBeInstanceOf(Touchpad);
  });

  it("should have left and right Touch instances", () => {
    const tp = new Touchpad({});
    expect(tp.left).toBeInstanceOf(Touch);
    expect(tp.right).toBeInstanceOf(Touch);
  });

  it("should have a button", () => {
    const tp = new Touchpad({});
    expect(tp.button).toBeInstanceOf(Momentary);
  });

  it("should base active on left contact", () => {
    const tp = new Touchpad({});
    expect(tp.active).toEqual(false);
    tp.left.contact[InputSet](true);
    expect(tp.active).toEqual(true);
    tp.left.contact[InputSet](false);
    expect(tp.active).toEqual(false);
  });
});
