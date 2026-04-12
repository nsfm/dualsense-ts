import { PlayerLeds } from "./player_leds";
import { Brightness } from "../hid/command";

describe("PlayerLeds", () => {
  it("should default bitmask to 0", () => {
    const leds = new PlayerLeds();
    expect(leds.bitmask).toEqual(0);
  });

  it("should mask to 5 bits on set", () => {
    const leds = new PlayerLeds();
    leds.set(0xff);
    expect(leds.bitmask).toEqual(0x1f);
  });

  it("should set individual LEDs", () => {
    const leds = new PlayerLeds();
    leds.setLed(0, true);
    expect(leds.getLed(0)).toEqual(true);
    expect(leds.getLed(1)).toEqual(false);
    leds.setLed(0, false);
    expect(leds.getLed(0)).toEqual(false);
  });

  it("should ignore out-of-range indices", () => {
    const leds = new PlayerLeds();
    leds.setLed(-1, true);
    leds.setLed(5, true);
    expect(leds.bitmask).toEqual(0);
  });

  it("should clear all LEDs", () => {
    const leds = new PlayerLeds();
    leds.set(0x1f);
    leds.clear();
    expect(leds.bitmask).toEqual(0);
  });

  it("should set and get brightness", () => {
    const leds = new PlayerLeds();
    expect(leds.brightness).toEqual(Brightness.High);
    leds.setBrightness(Brightness.Low);
    expect(leds.brightness).toEqual(Brightness.Low);
  });

  it("should implement toKey", () => {
    const leds = new PlayerLeds();
    expect(leds.toKey()).toEqual(`0,${Brightness.High}`);
    leds.set(5);
    leds.setBrightness(Brightness.Medium);
    expect(leds.toKey()).toEqual(`5,${Brightness.Medium}`);
  });
});
