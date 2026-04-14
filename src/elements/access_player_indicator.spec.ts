import { AccessPlayerIndicatorLed } from "./access_player_indicator";

describe("AccessPlayerIndicatorLed", () => {
  it("should default to pattern 0 (off)", () => {
    const led = new AccessPlayerIndicatorLed();
    expect(led.pattern).toEqual(0);
  });

  it("should set pattern 1-4", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(3);
    expect(led.pattern).toEqual(3);
    led.set(1);
    expect(led.pattern).toEqual(1);
  });

  it("should clamp pattern to 0-4", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(-1);
    expect(led.pattern).toEqual(0);
    led.set(10);
    expect(led.pattern).toEqual(4);
  });

  it("should round fractional values", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(2.7);
    expect(led.pattern).toEqual(3);
  });

  it("should clear", () => {
    const led = new AccessPlayerIndicatorLed();
    led.set(4);
    led.clear();
    expect(led.pattern).toEqual(0);
  });

  it("should implement toKey", () => {
    const led = new AccessPlayerIndicatorLed();
    expect(led.toKey()).toEqual("0");
    led.set(2);
    expect(led.toKey()).toEqual("2");
  });
});
