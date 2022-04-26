import { Dualsense } from "./dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.on("change", console.log);
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
