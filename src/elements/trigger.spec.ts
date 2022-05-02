import { Trigger } from "./trigger";
import { InputSet } from "../input";

describe("Trigger", () => {
  it("should construct", () => {
    expect(new Trigger({})).toBeInstanceOf(Trigger);
  });

  it("should implement `active`", () => {
    const trigger = new Trigger({});
    expect(trigger.active).toEqual(false);
    trigger[InputSet](1);
    expect(trigger.active).toEqual(true);
    trigger[InputSet](0);
    expect(trigger.active).toEqual(false);
  });

  it("should implement `state`", () => {
    const trigger = new Trigger({});
    expect(trigger.state).toEqual(0);
    trigger[InputSet](1);
    expect(trigger.state).toEqual(1);
    trigger[InputSet](0);
    expect(trigger.state).toEqual(0);
  });

  it("should implement `pressure`", () => {
    const trigger = new Trigger({});
    expect(trigger.pressure).toEqual(0);
    expect(trigger.state).toEqual(0);
    trigger[InputSet](1);
    expect(trigger.pressure).toEqual(1);
    expect(trigger.state).toEqual(1);
    trigger[InputSet](0);
    expect(trigger.pressure).toEqual(0);
    expect(trigger.state).toEqual(0);
  });
});
