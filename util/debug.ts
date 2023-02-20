import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.left.analog.on("change", (analog) => {
      const { x, y } = analog;
      controller.hid.setRumble(
        -x.state * (y.magnitude * 255),
        x.state * (y.magnitude * 255)
      );
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
      console.log(input);
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 100);
  }
}

main();
