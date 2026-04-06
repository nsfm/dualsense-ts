import { Dualsense } from "../src/dualsense";
import { DualsenseManager } from "../src/manager";
import { TriggerEffect } from "../src/elements/trigger_feedback";
import { ChargeStatus } from "../src/hid/battery_state";
import { formatFirmwareVersion } from "../src/hid/firmware_info";

/** Map a -1..1 stick value to 0..1 */
function norm(value: number): number {
  return (value + 1) / 2;
}

/** Tag log lines with the player number */
function log(player: number, ...args: unknown[]) {
  console.log(`[P${player + 1}]`, ...args);
}

/** Set up all debug bindings for a single controller */
function bindController(controller: Dualsense, player: number) {
  controller.connection.on("change", ({ state }) => {
    log(
      player,
      `Connected: ${state ? "yes" : "no"} - ${
        state ? (controller.wireless ? "bluetooth" : "usb") : ""
      }`,
    );
    if (state) {
      log(player, `Device: ${controller.deviceId ?? "unknown"}`);
      if (controller.serialNumber) {
        log(player, `Serial: ${controller.serialNumber}`);
      }
      // Log firmware and factory info once available
      setTimeout(() => {
        const fw = controller.firmwareInfo;
        if (fw) {
          log(player, `Firmware: v${formatFirmwareVersion(fw.mainFirmwareVersion)} | HW: ${fw.hardwareInfo} | DSP: ${fw.dspFirmwareVersion} | Built: ${fw.buildDate} ${fw.buildTime}`);
        }
        const fi = controller.factoryInfo;
        if (fi) {
          log(player, `Factory: ${fi.colorName ?? fi.colorCode} | ${fi.boardRevision ?? "unknown board"} | Serial: ${fi.serialNumber}`);
        }
      }, 2000);
    }
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
    log(player, `Battery: ${pct}% (${label})`);
  });

  controller.left.trigger.on("change", (trigger) => {
    controller.left.rumble(trigger.magnitude);
  });

  controller.right.trigger.on("change", (_trigger) => {
    // controller.right.rumble(trigger.magnitude);
  });

  // Cross: reset both triggers
  controller.cross.on("press", () => {
    controller.resetTriggerFeedback();
    log(player, "Triggers reset");
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
    log(
      player,
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
    log(
      player,
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
    log(
      player,
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
    log(
      player,
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
    log(
      player,
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
    log(
      player,
      `Galloping — start: ${start.toFixed(2)}, end: ${end.toFixed(2)}, feet: ${firstFoot.toFixed(2)}/${secondFoot.toFixed(2)}`,
    );
  });

  // Options: fade blue, Create: fade out
  controller.options.on("press", () => {
    controller.lightbar.fadeBlue();
    log(player, "Pulse: fade blue");
  });
  controller.create.on("press", () => {
    controller.lightbar.fadeOut();
    log(player, "Pulse: fade out");
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
    log(player, `Lightbar: rgb(${color.r}, ${color.g}, ${color.b})`);
  });

  // PS button: log player LED pattern (managed by DualsenseManager)
  controller.ps.on("press", () => {
    log(player, `Player LEDs: ${controller.playerLeds.bitmask.toString(2).padStart(5, "0")}`);
  });

  // Mute LED: reflect controller state
  controller.mute.status.on("change", ({ state }) => {
    log(player, `Mute LED: ${state ? "on" : "off"}`);
  });

  // Audio peripherals
  controller.microphone.on("change", ({ state }) => {
    log(player, `Microphone: ${state ? "connected" : "disconnected"}`);
  });
  controller.headphone.on("change", ({ state }) => {
    log(player, `Headphone: ${state ? "connected" : "disconnected"}`);
  });

  // Log stick positions for reference
  controller.left.analog.on("change", (analog) => {
    log(
      player,
      `Left — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
    );
  });

  controller.right.analog.on("change", (analog) => {
    log(
      player,
      `Right — x: ${analog.x.state.toFixed(2)}, y: ${analog.y.state.toFixed(2)}`,
    );
  });
}

function main() {
  const manager = new DualsenseManager();

  console.log("Waiting for controllers...");

  // Track which controllers we've already bound
  const bound = new Set<Dualsense>();

  manager.on("change", (mgr) => {
    const { active, players } = mgr.state;
    console.log(`\n=== ${active} controller(s) connected, ${players.size} slot(s) ===`);

    for (const [index, controller] of players) {
      if (bound.has(controller)) continue;
      bound.add(controller);
      log(index, "New controller discovered — binding inputs");
      bindController(controller, index);
    }
  });
}

main();
