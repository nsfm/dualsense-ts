import { Dualsense, InputSet, Momentary } from "./index";

describe("README.md example snippets", () => {
  let controller = new Dualsense({ hid: null });

  beforeEach(() => {
    controller = new Dualsense({ hid: null });
  });

  it("should allow synchronous reads", () => {
    expect(controller.circle.active).toEqual(false);
    expect(controller.cross.active).toEqual(false);
    expect(controller.left.bumper.active).toEqual(false);

    expect(controller.right.trigger.active).toEqual(false);
    expect(controller.right.trigger.pressure).toEqual(0);

    expect(+controller.left.analog.x).toEqual(0);
    expect(controller.left.analog.y.magnitude).toEqual(0);
  });

  it("should support callbacks", (done) => {
    expect(controller.triangle.active).toEqual(false);
    setTimeout(() => {
      controller.triangle[InputSet](true);
    });

    controller.triangle.on("change", (input) => {
      expect(input.active).toEqual(true);
    });

    expect(controller.dpad.up.active).toEqual(false);
    setTimeout(() => {
      controller.dpad.up[InputSet](true);
    });

    controller.dpad.on("change", (input, direction) => {
      expect(input.active).toEqual(true);
      expect(direction.active).toEqual(true);
      done();
    });
  });

  it("should provide promises", async () => {
    setTimeout(() => {
      controller.dpad.up[InputSet](true);
    });
    const { active } = await controller.dpad.up.promise();
    expect(active).toEqual(true);

    setTimeout(() => {
      controller.dpad.up[InputSet](false);
    });
    const { left, up, down, right } = await controller.dpad.promise();
    expect(left).toBeInstanceOf(Momentary);
    expect(down).toBeInstanceOf(Momentary);
    expect(up).toBeInstanceOf(Momentary);
    expect(right).toBeInstanceOf(Momentary);
  });

  it("should work as an async iterator", async () => {
    let state = true;
    let iterations = 5;

    setTimeout(() => {
      controller.dpad.up[InputSet](state);
    });
    for await (const { left, right, up, down } of controller.dpad) {
      expect(left).toBeInstanceOf(Momentary);
      expect(down).toBeInstanceOf(Momentary);
      expect(up).toBeInstanceOf(Momentary);
      expect(right).toBeInstanceOf(Momentary);
      iterations--;
      state = !state;
      if (iterations === 0) break;
      setTimeout(() => {
        controller.dpad.up[InputSet](state);
      });
    }
  });
});
