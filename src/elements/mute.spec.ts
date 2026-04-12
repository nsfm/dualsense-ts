import { InputSet } from "../input";
import { Mute } from "./mute";
import { Momentary } from "./momentary";
import { MuteLedMode } from "../hid/command";

describe("Mute", () => {
  it("should construct", () => {
    expect(new Mute({})).toBeInstanceOf(Mute);
  });

  it("should extend Momentary", () => {
    expect(new Mute({})).toBeInstanceOf(Momentary);
  });

  it("should have a status sub-input", () => {
    const mute = new Mute({});
    expect(mute.status).toBeInstanceOf(Momentary);
  });

  it("should support press and release", (done) => {
    const mute = new Mute({});
    mute[InputSet](false);
    mute.on("press", () => {
      done();
    });
    mute[InputSet](true);
  });

  it("should set ledMode via setLed", () => {
    const mute = new Mute({});
    expect(mute.ledMode).toBeUndefined();
    mute.setLed(MuteLedMode.On);
    expect(mute.ledMode).toEqual(MuteLedMode.On);
  });

  it("should reset ledMode via resetLed", () => {
    const mute = new Mute({});
    mute.setLed(MuteLedMode.Pulse);
    mute.resetLed();
    expect(mute.ledMode).toBeUndefined();
  });
});
