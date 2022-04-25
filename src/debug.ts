import { Dualsense } from "./dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.triangle.on("change", console.log);
    if (controller.hid) controller.hid.on("input", console.log);
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
