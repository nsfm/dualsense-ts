import { Dualsense } from "../src/dualsense";
import { TriggerMode } from "../src/hid";

function main() {
  try {
    const controller = new Dualsense();

    controller.connection.on("change", ({ state }) => {
      console.log(
        `Connected: ${state} ${
          state ? (controller.hid.provider.wireless ? "bluetooth" : "usb") : ""
        }`
      );
    });

    controller.left.trigger.on("change", (trigger) => {
      controller.left.rumble(trigger.magnitude);
    });

    controller.right.trigger.on("change", (trigger) => {
      controller.right.rumble(trigger.magnitude);
    });

    controller.triangle.on("press", () => {
      controller.rumble(0.5);
    });

    controller.triangle.on("release", () => {
      controller.rumble(0);
    });

    controller.left.analog.on("change", (analog) => {
      const { x, y } = analog;
      const state = {
        Analog: {
          Magnitude: analog.magnitude,
          Direction: analog.direction,
          Force: analog.force,
          Threshold: analog.threshold,
          Deadzone: analog.deadzone,
          X: {
            State: x.state,
            Magnitude: x.magnitude,
            Force: x.force,
            Threshold: x.threshold,
            Deadzone: x.deadzone,
          },
          Y: {
            State: y.state,
            Magnitude: y.magnitude,
            Force: y.force,
            Threshold: y.threshold,
            Deadzone: y.deadzone,
          },
        },
      };
      console.log(state);
    });

    controller.cross.on("change", (input) => {
      controller.hid.setRightTriggerFeedback(TriggerMode.Pulse, [
        controller.left.analog.direction * 40.5,
        128,
        controller.right.analog.direction * 40.5,
      ]);
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 100);
  }
}

main();
