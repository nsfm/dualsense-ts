import { Dualsense } from "../src/dualsense";
import { TriggerEffect } from "../src/elements/trigger_feedback";
import { ChargeStatus } from "../src/hid/battery_state";
import { formatFirmwareVersion } from "../src/hid/firmware_info";

/** Map a -1..1 stick value to 0..1 */
function norm(value: number): number {
  return (value + 1) / 2;
}

function main() {
  const controller = new Dualsense();

  console.log("Waiting for controller...");

  controller.connection.on("change", ({ state }) => {
    console.log(
      `Connected: ${state ? "yes" : "no"} - ${
        state ? (controller.wireless ? "bluetooth" : "usb") : ""
      }`,
    );
    if (state) {
      const fw = controller.firmwareInfo;
      console.log(
        `Firmware: v${formatFirmwareVersion(fw.mainFirmwareVersion)} | HW: ${fw.hardwareInfo} | DSP: ${fw.dspFirmwareVersion} | Built: ${fw.buildDate} ${fw.buildTime}`,
      );
      const fi = controller.factoryInfo;
      console.log(
        `Factory: ${fi.colorName} | ${fi.boardRevision} | Serial: ${fi.serialNumber}`,
      );
    }
  });

  // Battery
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

  // Rumble left trigger pressure through left motor
  controller.left.trigger.on("change", (trigger) => {
    controller.left.rumble(trigger.magnitude);
  });

  // Cross: reset both triggers
  controller.cross.on("press", () => {
    controller.resetTriggerFeedback();
    console.log("Triggers reset");
  });

  // Square: Feedback
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

  // Circle: Weapon
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

  // Triangle: Vibration
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

  // Dpad up: Bow
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

  // Dpad right: Machine
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

  // Dpad down: Galloping
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

  // Options: fade blue, Create: fade out
  controller.options.on("press", () => {
    controller.lightbar.fadeBlue();
    console.log("Pulse: fade blue");
  });
  controller.create.on("press", () => {
    controller.lightbar.fadeOut();
    console.log("Pulse: fade out");
  });

  // Dpad left: cycle light bar colors
  const colors = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
  ];
  let colorIndex = 0;
  controller.dpad.left.on("press", () => {
    const color = colors[colorIndex % colors.length];
    controller.lightbar.set(color);
    colorIndex++;
    console.log(`Lightbar: rgb(${color.r}, ${color.g}, ${color.b})`);
  });

  // Mute LED
  controller.mute.status.on("change", ({ state }) => {
    console.log(`Mute LED: ${state ? "on" : "off"}`);
  });

  // Audio peripherals
  controller.microphone.on("change", ({ state }) => {
    console.log(`Microphone: ${state ? "connected" : "disconnected"}`);
  });
  controller.headphone.on("change", ({ state }) => {
    console.log(`Headphone: ${state ? "connected" : "disconnected"}`);
  });

  // Demonstrate listener removal: PS button toggles stick logging
  const leftStickHandler = (analog: typeof controller.left.analog) => {
    console.log(
      `Left — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
    );
  };
  const rightStickHandler = (analog: typeof controller.right.analog) => {
    console.log(
      `Right — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
    );
  };

  let stickLogging = true;
  controller.left.analog.on("change", leftStickHandler);
  controller.right.analog.on("change", rightStickHandler);

  controller.ps.on("press", () => {
    stickLogging = !stickLogging;
    if (stickLogging) {
      controller.left.analog.on("change", leftStickHandler);
      controller.right.analog.on("change", rightStickHandler);
      console.log("Stick logging: on");
    } else {
      controller.left.analog.off("change", leftStickHandler);
      controller.right.analog.off("change", rightStickHandler);
      console.log("Stick logging: off");
    }
  });
}

main();
