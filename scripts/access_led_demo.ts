/**
 * DualSense Access Controller — Interactive LED Demo
 *
 * Exercises all 4 LED systems over USB or Bluetooth using node-hid.
 * Uses raw Access buttons (bytes 16-17) to avoid profile remapping issues.
 *
 * Usage:
 *   sudo tsx ./scripts/access_led_demo.ts
 *
 * Controls (raw Access buttons, not profile-remapped):
 *   Stick        → lightbar color (X = hue, Y = brightness)
 *   B1           → profile LED sweep animation
 *   B2           → profile LED fade animation
 *   B3           → cycle lightbar R/G/B/W (overrides stick)
 *   B4           → toggle status LED
 *   B5/B6/B7/B8  → player indicator 1/2/3/4 (0 when released)
 *   Center       → reset all LEDs to default
 *   Stick click  → toggle stick→lightbar mapping on/off
 *   PS           → exit
 */

import type { HID, Device } from "node-hid";
import { computeBluetoothReportChecksum } from "../src/hid/bt_checksum";
import {
  AccessInput,
  AccessButton1,
  AccessButton2,
  AccessPortType,
} from "../src/hid/access_hid";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

const STICK_DEADZONE = 12;

// ── Output report builders ──

function buildUsbReport(mutator: number, scopeB: number, data: Record<number, number>): Uint8Array {
  const buf = new Uint8Array(32);
  buf[0] = 0x02;
  buf[1] = mutator;
  buf[2] = scopeB;
  for (const [usbByte, val] of Object.entries(data)) {
    buf[Number(usbByte)] = val;
  }
  return buf;
}

function buildBtReport(mutator: number, scopeB: number, data: Record<number, number>): Uint8Array {
  const buf = new Uint8Array(78);
  buf[0] = 0x31;
  buf[1] = 0x02;
  buf[2] = mutator;
  buf[3] = scopeB;
  for (const [usbByte, val] of Object.entries(data)) {
    buf[Number(usbByte) + 1] = val; // USB byte N → BT byte N+1
  }
  const crc = computeBluetoothReportChecksum(buf);
  buf[74] = crc & 0xff;
  buf[75] = (crc >>> 8) & 0xff;
  buf[76] = (crc >>> 16) & 0xff;
  buf[77] = (crc >>> 24) & 0xff;
  return buf;
}

// ── LED state ──

interface LedState {
  r: number;
  g: number;
  b: number;
  playerIndicator: number;
  profileMode: number; // 0=off, 1=on, 2=fade, 3=sweep
  statusLed: boolean;
}

function buildLedReport(state: LedState, wireless: boolean): Uint8Array {
  const mutator = 0x15; // bit 0 (status/profile) | bit 2 (lightbar) | bit 4 (player indicator)
  const scopeB = 0x04;  // required for lightbar over BT, harmless over USB

  const data: Record<number, number> = {
    5: state.playerIndicator,
    6: state.r,
    7: state.g,
    8: state.b,
    12: 0x11, // profile LED enable (bit 0) + status LED command enable (bit 4) — always set both
    13: state.profileMode,
    23: state.statusLed ? 0x01 : 0x00, // status LED value: 1=on, 0=off
  };

  return wireless ? buildBtReport(mutator, scopeB, data) : buildUsbReport(mutator, scopeB, data);
}

// ── Input parsing (raw Access buttons) ──

interface InputState {
  stickX: number;
  stickY: number;
  // Raw Access buttons (bytes 16-17, not profile-remapped)
  b1: boolean; b2: boolean; b3: boolean; b4: boolean;
  b5: boolean; b6: boolean; b7: boolean; b8: boolean;
  center: boolean;
  stickBtn: boolean;
  ps: boolean;
  profile: boolean;
  // Status fields
  batteryLevel: number;
  batteryCharging: boolean;
  profileId: number;
  profileSwitchDisabled: boolean;
  // Expansion ports
  e1Type: AccessPortType;
  e2Type: AccessPortType;
  e3Type: AccessPortType;
  e4Type: AccessPortType;
  e1X: number; e1Y: number;
  e2X: number; e2Y: number;
  e3X: number; e3Y: number;
  e4X: number; e4Y: number;
}

const portTypeName = (t: AccessPortType): string =>
  ({ [AccessPortType.Disconnected]: "---", [AccessPortType.Button]: "btn", [AccessPortType.Trigger]: "trg", [AccessPortType.Stick]: "stk" })[t];

function parseInput(buf: Buffer, wireless: boolean, offset: number): InputState | null {
  const reportId = buf[0];

  // BT compact report 0x01 — can't read raw buttons, skip
  if (wireless && reportId === 0x01) return null;

  const o = offset;

  // Raw stick from virtual stick 2 (USB bytes 47/48) — always reflects
  // the physical stick regardless of which profile mapping is active
  const stickX = buf[AccessInput.VIRTUAL_STICK_2_X + o];
  const stickY = buf[AccessInput.VIRTUAL_STICK_2_Y + o];

  // Raw Access buttons at bytes 16-17 (Access-specific section)
  const rawBtn1 = buf[AccessInput.RAW_BUTTONS_1 + o];
  const rawBtn2 = buf[AccessInput.RAW_BUTTONS_2 + o];

  // Battery: lower nibble = level (0-10), upper nibble = charge status
  const batteryByte = buf[AccessInput.BATTERY + o];
  const batteryLevel = batteryByte & 0x0f;
  const batteryCharging = (batteryByte & 0xf0) !== 0;

  // Profile: bits 0-2 = ID (1-3), bit 3 = switching disabled
  const profileByte = buf[AccessInput.PROFILE + o];
  const profileId = profileByte & 0x07;
  const profileSwitchDisabled = Boolean(profileByte & 0x08);

  // Expansion port types: nibble-encoded
  const portE3E4 = buf[AccessInput.PORT_TYPES_E3_E4 + o];
  const portE1E2 = buf[AccessInput.PORT_TYPES_E1_E2 + o];

  return {
    stickX,
    stickY,
    b1: Boolean(rawBtn1 & AccessButton1.B1),
    b2: Boolean(rawBtn1 & AccessButton1.B2),
    b3: Boolean(rawBtn1 & AccessButton1.B3),
    b4: Boolean(rawBtn1 & AccessButton1.B4),
    b5: Boolean(rawBtn1 & AccessButton1.B5),
    b6: Boolean(rawBtn1 & AccessButton1.B6),
    b7: Boolean(rawBtn1 & AccessButton1.B7),
    b8: Boolean(rawBtn1 & AccessButton1.B8),
    center: Boolean(rawBtn2 & AccessButton2.CENTER),
    stickBtn: Boolean(rawBtn2 & AccessButton2.STICK),
    ps: Boolean(rawBtn2 & AccessButton2.PS),
    profile: Boolean(rawBtn2 & AccessButton2.PROFILE),
    batteryLevel,
    batteryCharging,
    profileId,
    profileSwitchDisabled,
    e1Type: (portE1E2 & 0x0f) as AccessPortType,
    e2Type: ((portE1E2 >>> 4) & 0x0f) as AccessPortType,
    e3Type: (portE3E4 & 0x0f) as AccessPortType,
    e4Type: ((portE3E4 >>> 4) & 0x0f) as AccessPortType,
    e1X: buf[AccessInput.E1_X + o], e1Y: buf[AccessInput.E1_Y + o],
    e2X: buf[AccessInput.E2_X + o], e2Y: buf[AccessInput.E2_Y + o],
    e3X: buf[AccessInput.E3_X + o], e3Y: buf[AccessInput.E3_Y + o],
    e4X: buf[AccessInput.E4_X + o], e4Y: buf[AccessInput.E4_Y + o],
  };
}

// ── Color helpers ──

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r: number, g: number, b: number;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    default: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function stickOutsideDeadzone(x: number, y: number): boolean {
  return Math.abs(x - 128) > STICK_DEADZONE || Math.abs(y - 128) > STICK_DEADZONE;
}

// ── Main ──

async function main() {
  const nodeHid = await import("node-hid");
  const devices = nodeHid.devices(ACCESS_VID, ACCESS_PID);
  const target = devices.find(
    (d: Device): d is Device & { path: string } => Boolean(d.path),
  );
  if (!target?.path) {
    console.error("No Access controller found.");
    console.error(`Looking for VID:${ACCESS_VID.toString(16)} PID:${ACCESS_PID.toString(16)}`);
    process.exit(1);
  }

  const wireless = target.interface === -1;
  console.log(`Found Access controller at ${target.path} (${wireless ? "Bluetooth" : "USB"})`);

  const device = new nodeHid.HID(target.path);

  // For BT: read Feature Report 0x05 to trigger full 0x31 reports
  if (wireless) {
    try {
      device.getFeatureReport(0x05, 64);
      console.log("Triggered BT full report mode (0x31)");
    } catch {
      console.log("Feature Report 0x05 read failed (may already be in full mode)");
    }
  }

  // BT Report 0x31 has 1 header byte after report ID (not 2 like DualSense)
  // USB byte N → BT buf[N + 1]
  const inputOffset = wireless ? 1 : 0;

  const led: LedState = {
    r: 0, g: 0, b: 100,
    playerIndicator: 0,
    profileMode: 1,
    statusLed: true,
  };

  let colorCycle = 0;
  const cycleColors: Array<[number, number, number, string]> = [
    [255, 0, 0, "RED"],
    [0, 255, 0, "GREEN"],
    [0, 0, 255, "BLUE"],
    [255, 255, 255, "WHITE"],
    [255, 0, 255, "MAGENTA"],
    [255, 255, 0, "YELLOW"],
    [0, 255, 255, "CYAN"],
  ];

  let stickColorMode = true; // stick controls lightbar color
  let prevInput: InputState | null = null;
  let dirty = true;
  let running = true;
  let statusPrinted = false;

  function printStatus(input: InputState) {
    const bat = `${Math.round(input.batteryLevel / 10 * 100)}%${input.batteryCharging ? "⚡" : ""}`;
    const prof = `P${input.profileId}${input.profileSwitchDisabled ? " (locked)" : ""}`;
    const ports = [
      `E1:${portTypeName(input.e1Type)}`,
      `E2:${portTypeName(input.e2Type)}`,
      `E3:${portTypeName(input.e3Type)}`,
      `E4:${portTypeName(input.e4Type)}`,
    ].join(" ");
    const stk = `Stick(${input.stickX},${input.stickY})`;
    process.stdout.write(`\r  🔋${bat}  📋${prof}  🔌${ports}  🕹️${stk}   `);
  }

  function sendLeds() {
    const report = buildLedReport(led, wireless);
    try {
      device.write(Array.from(report));
    } catch (e) {
      console.error("Write error:", e instanceof Error ? e.message : e);
    }
  }

  // Initial LED state
  sendLeds();

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║  Access Controller LED Demo                          ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log("║  Stick         → lightbar hue/brightness             ║");
  console.log("║  Stick click   → toggle stick→lightbar mapping       ║");
  console.log("║  B1            → profile LED sweep                   ║");
  console.log("║  B2            → profile LED fade                    ║");
  console.log("║  B3            → cycle lightbar color (R/G/B/W/M/Y/C)║");
  console.log("║  B4            → toggle status LED                   ║");
  console.log("║  B5/B6/B7/B8   → player indicator 1/2/3/4            ║");
  console.log("║  Center        → reset all LEDs                      ║");
  console.log("║  PS            → exit                                ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");
  console.log("  Using raw Access buttons (bytes 16-17), not profile-remapped.\n");

  device.on("data", (buf: Buffer) => {
    const input = parseInput(buf, wireless, inputOffset);
    if (!input) return; // skip compact BT reports

    const justPressed = (curr: boolean, prev: boolean) => curr && !prev;

    // ── Stick → lightbar color ──
    if (stickOutsideDeadzone(input.stickX, input.stickY)) {
      if (stickColorMode) {
        const hue = input.stickX / 255;
        const value = 1.0 - (input.stickY / 255); // up = bright
        const [r, g, b] = hsvToRgb(hue, 1.0, Math.max(0.05, value));
        if (r !== led.r || g !== led.g || b !== led.b) {
          led.r = r; led.g = g; led.b = b;
          dirty = true;
        }
      }
    }

    // ── Stick click → toggle stick color mapping ──
    if (justPressed(input.stickBtn, prevInput?.stickBtn ?? false)) {
      stickColorMode = !stickColorMode;
      console.log(`  Stick→lightbar: ${stickColorMode ? "ON" : "OFF"}`);
    }

    // ── B1 → sweep (reset to off first to allow re-trigger) ──
    if (justPressed(input.b1, prevInput?.b1 ?? false)) {
      led.profileMode = 0;
      sendLeds();
      led.profileMode = 3;
      dirty = true;
      console.log("  Profile LEDs: SWEEP");
    }

    // ── B2 → fade ──
    if (justPressed(input.b2, prevInput?.b2 ?? false)) {
      led.profileMode = 0;
      sendLeds();
      led.profileMode = 2;
      dirty = true;
      console.log("  Profile LEDs: FADE");
    }

    // ── B3 → cycle lightbar color (disables stick mode) ──
    if (justPressed(input.b3, prevInput?.b3 ?? false)) {
      stickColorMode = false;
      const [r, g, b, name] = cycleColors[colorCycle % cycleColors.length];
      led.r = r; led.g = g; led.b = b;
      colorCycle++;
      dirty = true;
      console.log(`  Lightbar: ${name} (stick mapping off)`);
    }

    // ── B4 → toggle status LED ──
    if (justPressed(input.b4, prevInput?.b4 ?? false)) {
      led.statusLed = !led.statusLed;
      dirty = true;
      console.log(`  Status LED: ${led.statusLed ? "ON" : "OFF"}`);
    }

    // ── B5-B8 → player indicator (hold = on, release = off) ──
    let pi = 0;
    if (input.b8) pi = 4;
    else if (input.b7) pi = 3;
    else if (input.b6) pi = 2;
    else if (input.b5) pi = 1;
    if (pi !== led.playerIndicator) {
      led.playerIndicator = pi;
      dirty = true;
    }

    // ── Center → reset all LEDs ──
    if (justPressed(input.center, prevInput?.center ?? false)) {
      led.r = 0; led.g = 0; led.b = 100;
      led.playerIndicator = 0;
      led.profileMode = 1;
      led.statusLed = true;
      stickColorMode = true;
      dirty = true;
      console.log("  Reset all LEDs to default");
    }

    // ── Profile button → announce profile change ──
    if (justPressed(input.profile, prevInput?.profile ?? false)) {
      console.log(`\n  Profile button pressed (current: P${input.profileId})`);
    }

    // ── PS → exit ──
    if (justPressed(input.ps, prevInput?.ps ?? false)) {
      console.log("\n  PS pressed — exiting.");
      running = false;
      led.r = 0; led.g = 0; led.b = 0;
      led.playerIndicator = 0;
      led.profileMode = 0;
      led.statusLed = false;
      sendLeds();
      setTimeout(() => {
        device.close();
        process.exit(0);
      }, 200);
    }

    if (dirty && running) {
      sendLeds();
      dirty = false;
    }

    // Print status line (continuous update)
    if (running) printStatus(input);

    // Print initial snapshot once
    if (!statusPrinted) {
      statusPrinted = true;
      console.log();
      console.log(`  Battery: ${input.batteryLevel}/10 (${Math.round(input.batteryLevel / 10 * 100)}%)${input.batteryCharging ? " [charging]" : ""}`);
      console.log(`  Profile: ${input.profileId}${input.profileSwitchDisabled ? " (switching disabled)" : ""}`);
      console.log(`  Ports: E1=${portTypeName(input.e1Type)} E2=${portTypeName(input.e2Type)} E3=${portTypeName(input.e3Type)} E4=${portTypeName(input.e4Type)}`);
      if (input.e1Type !== AccessPortType.Disconnected) console.log(`    E1 axis: (${input.e1X}, ${input.e1Y})`);
      if (input.e2Type !== AccessPortType.Disconnected) console.log(`    E2 axis: (${input.e2X}, ${input.e2Y})`);
      if (input.e3Type !== AccessPortType.Disconnected) console.log(`    E3 axis: (${input.e3X}, ${input.e3Y})`);
      if (input.e4Type !== AccessPortType.Disconnected) console.log(`    E4 axis: (${input.e4X}, ${input.e4Y})`);
      console.log();
    }

    prevInput = input;
  });

  device.on("error", (err: Error) => {
    console.error("Device error:", err.message);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    console.log("\n  Ctrl+C — cleaning up.");
    led.r = 0; led.g = 0; led.b = 0;
    led.playerIndicator = 0;
    led.profileMode = 0;
    led.statusLed = false;
    sendLeds();
    setTimeout(() => {
      device.close();
      process.exit(0);
    }, 200);
  });
}

main().catch(console.error);
