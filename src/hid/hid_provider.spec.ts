import { mapAxis, mapTrigger } from "./hid_provider";

describe("Dualsense HID", () => {
  it("should map axis values betwen -1 and 1", () => {
    expect(mapAxis(255)).toBeCloseTo(1);
    expect(mapAxis(255 / 2)).toBeCloseTo(0);
    expect(mapAxis(255 / 4)).toBeCloseTo(-0.5);
    expect(mapAxis(255 / 8)).toBeCloseTo(-0.75);
    expect(mapAxis(0)).toBeCloseTo(-1);
  });

  it("should map trigger values betwen 0 and 1", () => {
    expect(mapTrigger(255)).toBeCloseTo(1);
    expect(mapTrigger(255 / 2)).toBeCloseTo(0.5);
    expect(mapTrigger(255 / 4)).toBeCloseTo(0.25);
    expect(mapTrigger(255 / 8)).toBeCloseTo(0.125);
    expect(mapTrigger(0)).toBeCloseTo(0);
  });
});
