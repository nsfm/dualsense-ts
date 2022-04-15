import { Trigger } from "./trigger";
import { Intensity } from "../inputs";

describe("Trigger", () => {
  it("should construct", () => {
    expect(new Trigger({})).toBeInstanceOf(Trigger);
  });

  it("should implement `active`", () => {
    const trigger = new Trigger({});
    expect(trigger.active).toEqual(false);
    trigger.set(new Intensity(1));
    expect(trigger.active).toEqual(true);
    trigger.set(new Intensity(0));
    expect(trigger.active).toEqual(false);
  });

  it("should implement `state`", () => {
    const trigger = new Trigger({});
    expect(trigger.state.value).toEqual(0);
    trigger.set(new Intensity(1));
    expect(trigger.state.value).toEqual(1);
    trigger.set(new Intensity(0));
    expect(trigger.state.value).toEqual(0);
  });

  it("should implement `pressure`", () => {
    const trigger = new Trigger({});
    expect(trigger.pressure).toEqual(0);
    expect(trigger.state.value).toEqual(0);
    trigger.set(new Intensity(1));
    expect(trigger.pressure).toEqual(1);
    expect(trigger.state.value).toEqual(1);
    trigger.set(new Intensity(0));
    expect(trigger.pressure).toEqual(0);
    expect(trigger.state.value).toEqual(0);
  });
});
