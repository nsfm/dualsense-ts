import { AccessProfileLeds } from "./access_profile_leds";
import { AccessProfileLedMode } from "../hid/access/access_hid_state";

describe("AccessProfileLeds", () => {
  it("should default to On mode", () => {
    const leds = new AccessProfileLeds();
    expect(leds.mode).toEqual(AccessProfileLedMode.On);
  });

  it("should set mode", () => {
    const leds = new AccessProfileLeds();
    leds.set(AccessProfileLedMode.Sweep);
    expect(leds.mode).toEqual(AccessProfileLedMode.Sweep);
    leds.set(AccessProfileLedMode.Off);
    expect(leds.mode).toEqual(AccessProfileLedMode.Off);
  });

  it("should implement toKey", () => {
    const leds = new AccessProfileLeds();
    expect(leds.toKey()).toEqual(`${AccessProfileLedMode.On}`);
    leds.set(AccessProfileLedMode.Fade);
    expect(leds.toKey()).toEqual(`${AccessProfileLedMode.Fade}`);
  });
});
