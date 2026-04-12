import { InputSet } from "../input";
import { Increment } from "./increment";

describe("Increment", () => {
  it("should construct", () => {
    expect(new Increment()).toBeInstanceOf(Increment);
  });

  it("should default to state 0 and inactive", () => {
    const inc = new Increment();
    expect(inc.state).toEqual(0);
    expect(inc.active).toEqual(false);
  });

  it("should accept state via InputSet", () => {
    const inc = new Increment();
    inc[InputSet](5);
    expect(inc.state).toEqual(5);
  });
});
