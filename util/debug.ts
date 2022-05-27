import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.on("change", (cntrl, input) => {
      console.log(input);
      console.log(controller.hid.state);
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
