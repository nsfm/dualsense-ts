import { Dualsense } from "../src/dualsense";
import { TriggerEffect } from "../src/elements/trigger_feedback";
import { ChargeStatus } from "../src/hid/battery_state";

/** Map a -1..1 stick value to 0..1 */
function norm(value: number): number {
  return (value + 1) / 2;
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

    // Log battery level on connect and when it changes
    controller.battery.level.on("change", ({ state }) => {
      const pct = Math.round(state * 100);
      const status = controller.battery.status.state;
      const label =
        status === ChargeStatus.Charging
          ? "charging"
          : status === ChargeStatus.Full
            ? "full"
            : "discharging";
      console.log(`Battery: ${pct}% (${label})`);
    });

    controller.left.trigger.on("change", (trigger) => {
      controller.left.rumble(trigger.magnitude);
    });

    controller.right.trigger.on("change", (trigger) => {
      // controller.right.rumble(trigger.magnitude);
    });

    // Cross: reset both triggers
    controller.cross.on("press", () => {
      controller.resetTriggerFeedback();
      console.log("Triggers reset");
    });

    // Square: Feedback — right stick Y = position, right stick X = strength
    controller.square.on("press", () => {
      const position = norm(controller.right.analog.y.state);
      const strength = norm(controller.right.analog.x.state);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position,
        strength,
      });
      console.log(
        `Feedback — position: ${position.toFixed(2)}, strength: ${strength.toFixed(2)}`,
      );
    });

    // Circle: Weapon — right stick Y = start, right stick X = end, left stick Y = strength
    controller.circle.on("press", () => {
      const start = norm(controller.right.analog.y.state);
      const end = norm(controller.right.analog.x.state);
      const strength = norm(controller.left.analog.y.state);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Weapon,
        start,
        end,
        strength,
      });
      console.log(
        `Weapon — start: ${start.toFixed(2)}, end: ${end.toFixed(2)}, strength: ${strength.toFixed(2)}`,
      );
    });

    // Triangle: Vibration — right stick Y = position, right stick X = amplitude, left stick Y = frequency
    controller.triangle.on("press", () => {
      const position = norm(controller.right.analog.y.state);
      const amplitude = norm(controller.right.analog.x.state);
      const frequency = Math.round(norm(controller.left.analog.y.state) * 60);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Vibration,
        position,
        amplitude,
        frequency,
      });
      console.log(
        `Vibration — position: ${position.toFixed(2)}, amplitude: ${amplitude.toFixed(2)}, freq: ${frequency}Hz`,
      );
    });

    // Dpad up: Bow — right stick Y = start, right stick X = end, left stick Y = strength, left stick X = snap
    controller.dpad.up.on("press", () => {
      const start = norm(controller.right.analog.y.state);
      const end = norm(controller.right.analog.x.state);
      const strength = norm(controller.left.analog.y.state);
      const snapForce = norm(controller.left.analog.x.state);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Bow,
        start,
        end,
        strength,
        snapForce,
      });
      console.log(
        `Bow — start: ${start.toFixed(2)}, end: ${end.toFixed(2)}, strength: ${strength.toFixed(2)}, snap: ${snapForce.toFixed(2)}`,
      );
    });

    // Dpad right: Machine — right stick = start/end, left stick Y = amplitudeA, left stick X = amplitudeB
    controller.dpad.right.on("press", () => {
      const start = norm(controller.right.analog.y.state);
      const end = norm(controller.right.analog.x.state);
      const amplitudeA = norm(controller.left.analog.y.state);
      const amplitudeB = norm(controller.left.analog.x.state);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Machine,
        start,
        end,
        amplitudeA,
        amplitudeB,
        frequency: 30,
        period: 5,
      });
      console.log(
        `Machine — start: ${start.toFixed(2)}, end: ${end.toFixed(2)}, ampA: ${amplitudeA.toFixed(2)}, ampB: ${amplitudeB.toFixed(2)}`,
      );
    });

    // Dpad down: Galloping — right stick = start/end, left stick = foot timing
    controller.dpad.down.on("press", () => {
      const start = norm(controller.right.analog.y.state);
      const end = norm(controller.right.analog.x.state);
      const firstFoot = norm(controller.left.analog.y.state);
      const secondFoot = norm(controller.left.analog.x.state);
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Galloping,
        start,
        end,
        firstFoot,
        secondFoot,
        frequency: 20,
      });
      console.log(
        `Galloping — start: ${start.toFixed(2)}, end: ${end.toFixed(2)}, feet: ${firstFoot.toFixed(2)}/${secondFoot.toFixed(2)}`,
      );
    });

    // Log stick positions for reference
    controller.left.analog.on("change", (analog) => {
      console.log(
        `Left — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
      );
    });

    controller.right.analog.on("change", (analog) => {
      console.log(
        `Right — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
      );
    });
  } catch (err) {
    console.log(err);
    setTimeout(main, 100);
  }
}

main();
