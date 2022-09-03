import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.left.analog.on("change", (analog) => {
      const { x, y } = analog;
      const state = {
        Analog: {
          Magnitude: analog.magnitude,
          Direction: analog.direction,
          Force: analog.force,
          X: {
            Magnitude: x.magnitude,
            Force: x.force,
          },
          Y: {
            Magnitude: y.magnitude,
            Force: y.force,
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
