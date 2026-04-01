import { Dualsense } from "../src/dualsense";
import { TriggerMode } from "../src/hid";

function scale(value: number): number {
  return Math.round(((value + 1) / 2) * 255);
}

function main() {
  try {
    const controller = new Dualsense();

    controller.connection.on("change", ({ state }) => {
      console.log(
        `Connected: ${state ? "yes" : "no"} - ${
          state ? (controller.wireless ? "bluetooth" : "usb") : ""
        }`,
      );
    });

    controller.left.trigger.on("change", (trigger) => {
      controller.left.rumble(trigger.magnitude);
    });

    controller.right.trigger.on("change", (trigger) => {
      controller.right.rumble(trigger.magnitude);
    });

    // Cross: reset both triggers
    controller.cross.on("press", () => {
      controller.resetTriggerFeedback();
      console.log("Triggers reset");
    });

    // Square: Rigid - right stick Y = start position, right stick X = strength
    controller.square.on("press", () => {
      const start = scale(controller.right.analog.y.state);
      const strength = scale(controller.right.analog.x.state);
      controller.right.trigger.feedback.set(TriggerMode.Rigid, [
        start,
        strength,
      ]);
      console.log(`Rigid — start: ${start}, strength: ${strength}`);
    });

    // Circle: Pulse - right stick Y = start, right stick X = end, left stick Y = strength
    controller.circle.on("press", () => {
      const start = scale(controller.right.analog.y.state);
      const end = scale(controller.right.analog.x.state);
      const strength = scale(controller.left.analog.y.state);
      controller.right.trigger.feedback.set(TriggerMode.Pulse, [
        start,
        end,
        strength,
      ]);
      console.log(
        `Pulse — start: ${start}, end: ${end}, strength: ${strength}`,
      );
    });

    // Triangle: PulseFull - right stick Y = start, sticks = strength curve, left stick X = frequency
    controller.triangle.on("press", () => {
      const start = scale(controller.right.analog.y.state);
      const strengthStart = scale(controller.left.analog.y.state);
      const strengthMid = scale(controller.left.analog.x.state);
      const strengthEnd = scale(controller.right.analog.x.state);
      const frequency = Math.round(
        ((controller.right.analog.y.state + 1) / 2) * 60,
      );
      controller.right.trigger.feedback.set(TriggerMode.PulseFull, [
        start,
        0,
        0,
        strengthStart,
        strengthMid,
        strengthEnd,
        frequency,
      ]);
      console.log(
        `PulseFull — start: ${start}, strength: ${strengthStart}/${strengthMid}/${strengthEnd}, freq: ${frequency}Hz`,
      );
    });

    // Left analog: log state for reference while dialing in values
    controller.left.analog.on("change", (analog) => {
      console.log(
        `Left analog — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
      );
    });

    // Right analog: log scaled values so you can see what will be sent
    controller.right.analog.on("change", (analog) => {
      console.log(
        `Right analog — x: ${analog.x.state.toFixed(2)} (${scale(analog.x.state)}),` +
          ` y: ${analog.y.state.toFixed(2)} (${scale(analog.y.state)})`,
      );
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 100);
  }
}

main();
