import { AccessPlayerIndicatorLed } from "./access_player_indicator";
import { AccessPlayerIndicator } from "../hid/access/access_hid_state";

describe("AccessPlayerIndicatorLed", () => {
  it("should default to Off", () => {
    const led = new AccessPlayerIndicatorLed();
    expect(led.pattern).toEqual(AccessPlayerIndicator.Off);
  });

  it("should set player patterns", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(AccessPlayerIndicator.Player3);
    expect(led.pattern).toEqual(AccessPlayerIndicator.Player3);
    led.set(AccessPlayerIndicator.Player1);
    expect(led.pattern).toEqual(AccessPlayerIndicator.Player1);
  });

  it("should clear", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(AccessPlayerIndicator.Player4);
    led.clear();
    expect(led.pattern).toEqual(AccessPlayerIndicator.Off);
  });

  it("should implement toKey", () => {
    const led = new AccessPlayerIndicatorLed();
    expect(led.toKey()).toEqual("0");
    led.set(AccessPlayerIndicator.Player2);
    expect(led.toKey()).toEqual("2");
  });
});
