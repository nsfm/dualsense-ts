import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.left.analog.on("change", (analog) => {
      console.log(analog.magnitude, analog.direction)
    })
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
