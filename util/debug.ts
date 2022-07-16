import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.left.analog.on("change", (analog) => {
      console.log(analog.magnitude, analog.direction);
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
