import { AccessStatusLed } from "./access_status_led";

describe("AccessStatusLed", () => {
  it("should default to on", () => {
    const led = new AccessStatusLed();
    expect(led.on).toBe(true);
  });

  it("should set on/off", () => {
    const led = new AccessStatusLed();
    led.set(false);
    expect(led.on).toBe(false);
    led.set(true);
    expect(led.on).toBe(true);
  });

  it("should toggle", () => {
    const led = new AccessStatusLed();
    expect(led.on).toBe(true);
    led.toggle();
    expect(led.on).toBe(false);
    led.toggle();
    expect(led.on).toBe(true);
  });

  it("should implement toKey", () => {
    const led = new AccessStatusLed();
    expect(led.toKey()).toEqual("1");
    led.set(false);
    expect(led.toKey()).toEqual("0");
  });
});
