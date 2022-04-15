import { Momentary } from "./momentary";

describe("Momentary", () => {
  it("should construct", () => {
    expect(new Momentary({})).toBeInstanceOf(Momentary);
  });

  it("should implement `active`", () => {
    const button = new Momentary({});
    expect(button.active).toEqual(false);
    button.set(true);
    expect(button.active).toEqual(true);
    button.set(false);
    expect(button.active).toEqual(false);
  });

  it("should implement `state`", () => {
    const button = new Momentary({});
    expect(button.state).toEqual(false);
    button.set(true);
    expect(button.state).toEqual(true);
    button.set(false);
    expect(button.state).toEqual(false);
  });
});
