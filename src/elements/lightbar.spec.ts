import { Lightbar } from "./lightbar";
import { PulseOptions } from "../hid/command";

describe("Lightbar", () => {
  it("should default to blue", () => {
    const bar = new Lightbar();
    expect(bar.color).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("should clamp and round values on set", () => {
    const bar = new Lightbar();
    bar.set({ r: -10, g: 300, b: 128.7 });
    expect(bar.color).toEqual({ r: 0, g: 255, b: 129 });
  });

  it("should return a copy from color", () => {
    const bar = new Lightbar();
    const c = bar.color;
    c.r = 255;
    expect(bar.color.r).toEqual(0);
  });

  it("should support fadeBlue", () => {
    const bar = new Lightbar();
    bar.fadeBlue();
    expect(bar.consumePulse()).toEqual(PulseOptions.FadeBlue);
  });

  it("should support fadeOut", () => {
    const bar = new Lightbar();
    bar.fadeOut();
    expect(bar.consumePulse()).toEqual(PulseOptions.FadeOut);
  });

  it("should clear pulse after consume", () => {
    const bar = new Lightbar();
    bar.fadeBlue();
    bar.consumePulse();
    expect(bar.consumePulse()).toEqual(PulseOptions.Off);
  });

  it("should implement toKey", () => {
    const bar = new Lightbar();
    expect(bar.toKey()).toEqual("0,0,255");
    bar.set({ r: 100, g: 200, b: 50 });
    expect(bar.toKey()).toEqual("100,200,50");
  });
});
