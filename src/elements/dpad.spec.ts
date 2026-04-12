import { InputSet } from "../input";
import { Dpad } from "./dpad";
import { Momentary } from "./momentary";

describe("Dpad", () => {
  it("should construct", () => {
    expect(new Dpad()).toBeInstanceOf(Dpad);
  });

  it("should construct with params", () => {
    expect(new Dpad({ icon: "+" })).toBeInstanceOf(Dpad);
  });

  it("should have Momentary children", () => {
    const dpad = new Dpad();
    expect(dpad.up).toBeInstanceOf(Momentary);
    expect(dpad.down).toBeInstanceOf(Momentary);
    expect(dpad.left).toBeInstanceOf(Momentary);
    expect(dpad.right).toBeInstanceOf(Momentary);
  });

  it("should implement `active`", () => {
    const dpad = new Dpad();
    expect(dpad.active).toEqual(false);
    dpad.up[InputSet](true);
    expect(dpad.active).toEqual(true);
    dpad.up[InputSet](false);
    expect(dpad.active).toEqual(false);
    dpad.left[InputSet](true);
    expect(dpad.active).toEqual(true);
    dpad.left[InputSet](false);
    expect(dpad.active).toEqual(false);
  });

  it("should bubble change events", (done) => {
    const dpad = new Dpad();
    setTimeout(() => {
      dpad.on("change", () => {
        done();
      });
      dpad.up[InputSet](true);
    });
  });
});
