import { Dualsense } from "../src/dualsense";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.on("input", () => {
      if (Math.random() > 0.05) return;
      console.clear();
      console.log(controller.hid?.state);
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
