import { Dualsense } from "../src/dualsense";
import { TriggerMode } from "../src/hid";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);

    controller.left.trigger.on("change", (trigger) => {
      controller.hid.setRumble(
        trigger.magnitude * 255,
        trigger.magnitude * 255
      );
    });

    controller.right.trigger.on("change", () => {
      controller.hid.setRightTriggerFeedback(TriggerMode.Pulse, [
        controller.left.analog.direction * 40.5,
        128,
        controller.right.analog.direction * 40.5,
      ]);
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
      //console.log(state);
    });

    controller.cross.on("change", (input) => {
      console.log(input);
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 100);
  }
}

main();
