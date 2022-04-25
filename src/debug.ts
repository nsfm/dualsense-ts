import { Dualsense } from "./dualsense";
import { Input } from "./inputs";

function main() {
  try {
    const controller = new Dualsense();
    console.log(`Connected: ${controller.toString()}`);
    controller.triangle.on("change", console.log);
    if (controller.hid)
      controller.hid.on("input", () => {
        console.clear();
        Object.entries(controller.byId).forEach(([key, input]) => {
          console.log(`${key}: ${(input as Input<unknown>).toString()}`);
        });
      });
  } catch (err) {
    console.log(err);
    setTimeout(main, 500);
  }
}

main();
