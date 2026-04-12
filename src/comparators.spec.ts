import {
  VirtualComparator,
  ThresholdComparator,
  BasicComparator,
} from "./comparators";

describe("VirtualComparator", () => {
  it("always returns true", () => {
    expect(VirtualComparator()).toBe(true);
  });
});

describe("BasicComparator", () => {
  it("returns true when values differ", () => {
    expect(BasicComparator(1, 2)).toBe(true);
    expect(BasicComparator(false, true)).toBe(true);
    expect(BasicComparator("a", "b")).toBe(true);
  });

  it("returns false when values are the same", () => {
    expect(BasicComparator(1, 1)).toBe(false);
    expect(BasicComparator(true, true)).toBe(false);
    expect(BasicComparator("x", "x")).toBe(false);
  });

  it("uses strict equality", () => {
    expect(BasicComparator(0, false)).toBe(true);
    expect(BasicComparator("", 0)).toBe(true);
  });
});

describe("ThresholdComparator", () => {
  it("returns false when change is within threshold", () => {
    expect(ThresholdComparator(0.1, 0, 0.5, 0.55)).toBe(false);
  });

  it("returns true when change exceeds threshold", () => {
    expect(ThresholdComparator(0.1, 0, 0.5, 0.7)).toBe(true);
  });

  it("returns false when both values are within deadzone", () => {
    expect(ThresholdComparator(0, 0.1, 0.05, 0.08)).toBe(false);
  });

  it("returns true when leaving deadzone", () => {
    expect(ThresholdComparator(0, 0.1, 0.0, 0.5)).toBe(true);
  });

  it("returns true when entering deadzone from outside", () => {
    expect(ThresholdComparator(0, 0.1, 0.5, 0.0)).toBe(true);
  });

  it("throws on non-numeric input", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ThresholdComparator(0.1, 0, "a" as any, 0.5)).toThrow(
      "Bad threshold comparison"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ThresholdComparator(0.1, 0, 0.5, true as any)).toThrow(
      "Bad threshold comparison"
    );
  });
});
