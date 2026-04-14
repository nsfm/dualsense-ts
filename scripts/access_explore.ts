/**
 * DualSense Access Controller HID Explorer
 *
 * Interactive tool for probing the Access controller's HID interface.
 * Reads input reports, sends output reports, reads feature reports,
 * and helps map physical controls to HID report bytes.
 *
 * Usage:
 *   tsx ./scripts/access_explore.ts
 *
 * Requires the Access controller to be plugged in via USB.
 * May need to be run with appropriate permissions (sudo or udev rules).
 */

import type { HID, Device } from "node-hid";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

// Known HID report byte labels from our investigation
const BYTE_LABELS: Record<number, string> = {
  0: "Report ID",
  1: "Stick X",
  2: "Stick Y",
  3: "Axis Z (RStick X?)",
  4: "Axis Rz (RStick Y?)",
  5: "L2 Trigger",
  6: "R2 Trigger",
  7: "Seq Counter",
  8: "Hat+Btn[0:3]",
  9: "Btn[4:11]",
  10: "Btn[12:14]+Vnd",
  11: "Vendor",
  12: "Counter 2",
  13: "Battery?",
  14: "Status?",
  15: "Status?",
  18: "Exp Axis A",
  19: "Exp Axis B",
  28: "Exp Axis C",
  32: "Exp Axis D",
  37: "Exp/Status",
  38: "Status",
  40: "Status",
  42: "Profile?",
  43: "Exp Axis E",
  44: "Exp Axis F",
  47: "Exp Axis G",
  48: "Exp Axis H",
};

// DualSense-compatible button names (bit positions in bytes 8-10)
const BUTTON_NAMES = [
  "Square/Btn1",
  "Cross/Btn2",
  "Circle/Btn3",
  "Triangle/Btn4",
  "L1",
  "R1",
  "L2 Digital",
  "R2 Digital",
  "Create",
  "Options",
  "L3 (Stick)",
  "R3",
  "PS",
  "TouchBtn/Btn14",
  "Btn15 (Mute/Profile?)",
];

const HAT_DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "None"];

// Feature reports declared in the HID descriptor
const FEATURE_REPORTS: Array<{ id: number; size: number; name: string }> = [
  { id: 0x08, size: 48, name: "Unknown (error expected)" },
  { id: 0x09, size: 20, name: "MAC / Pairing Info" },
  { id: 0x0a, size: 27, name: "Unknown (error expected)" },
  { id: 0x20, size: 64, name: "Firmware Info" },
  { id: 0x22, size: 64, name: "Device Info (Access-specific)" },
  { id: 0x60, size: 64, name: "Profile Config? (Access-specific)" },
  { id: 0x61, size: 64, name: "Profile Config? (Access-specific)" },
  { id: 0x80, size: 64, name: "Test Command TX" },
  { id: 0x81, size: 64, name: "Test Command RX" },
  { id: 0x82, size: 10, name: "Stick Cal Begin?" },
  { id: 0x83, size: 64, name: "Stick Cal Data?" },
  { id: 0x84, size: 64, name: "Unknown" },
  { id: 0x85, size: 3, name: "Profile/Battery?" },
  { id: 0xa0, size: 2, name: "NVS Lock?" },
  { id: 0xe0, size: 64, name: "Access-specific" },
  { id: 0xf0, size: 64, name: "Unknown" },
  { id: 0xf1, size: 64, name: "Unknown" },
  { id: 0xf2, size: 16, name: "Unknown" },
  { id: 0xf4, size: 64, name: "Unknown" },
  { id: 0xf5, size: 4, name: "Unknown" },
];

interface InputState {
  stickX: number;
  stickY: number;
  axisZ: number;
  axisRz: number;
  l2: number;
  r2: number;
  hat: string;
  buttons: string[];
  seq: number;
}

function parseInput(buf: Buffer): InputState {
  const hat = buf[8] & 0x0f;
  const btnBits =
    ((buf[8] >> 4) & 0x0f) | (buf[9] << 4) | ((buf[10] & 0x07) << 12);
  const buttons: string[] = [];
  for (let i = 0; i < 15; i++) {
    if (btnBits & (1 << i)) buttons.push(BUTTON_NAMES[i]);
  }

  return {
    stickX: buf[1],
    stickY: buf[2],
    axisZ: buf[3],
    axisRz: buf[4],
    l2: buf[5],
    r2: buf[6],
    hat: HAT_DIRECTIONS[hat] ?? `?(${hat})`,
    buttons,
    seq: buf[7],
  };
}

function hexDump(buf: Buffer | Uint8Array, label?: string): void {
  if (label) console.log(`\n=== ${label} ===`);
  const bytes = Buffer.from(buf);
  for (let i = 0; i < bytes.length; i += 16) {
    const hex = Array.from(bytes.subarray(i, Math.min(i + 16, bytes.length)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    const ascii = Array.from(bytes.subarray(i, Math.min(i + 16, bytes.length)))
      .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
      .join("");
    console.log(`  ${i.toString(16).padStart(4, "0")}: ${hex.padEnd(48)}  ${ascii}`);
  }
}

async function findDevice(): Promise<{ HID: typeof HID; path: string; wireless: boolean }> {
  const nodeHid = await import("node-hid");
  const devices = nodeHid.devices(ACCESS_VID, ACCESS_PID);
  const target = devices.find(
    (d: Device): d is Device & { path: string } => Boolean(d.path),
  );
  if (!target?.path) {
    console.error("No Access controller found. Is it plugged in?");
    console.error(`Looking for VID:${ACCESS_VID.toString(16)} PID:${ACCESS_PID.toString(16)}`);
    const all = nodeHid.devices();
    const sony = all.filter((d: Device) => d.vendorId === ACCESS_VID);
    if (sony.length > 0) {
      console.error("\nSony devices found:");
      sony.forEach((d: Device) =>
        console.error(`  PID:${d.productId?.toString(16)} path:${d.path}`),
      );
    }
    process.exit(1);
  }
  return {
    HID: nodeHid.HID,
    path: target.path,
    wireless: target.interface === -1,
  };
}

async function readFeatureReports(device: HID) {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║     Feature Report Dump              ║");
  console.log("╚══════════════════════════════════════╝");

  for (const fr of FEATURE_REPORTS) {
    try {
      const buf = device.getFeatureReport(fr.id, fr.size);
      const data = Buffer.from(buf);
      const allZero = data.subarray(1).every((b) => b === 0);
      if (allZero) {
        console.log(
          `\nReport 0x${fr.id.toString(16).padStart(2, "0")} (${fr.name}): all zeros (${data.length} bytes)`,
        );
      } else {
        hexDump(data, `Report 0x${fr.id.toString(16).padStart(2, "0")} — ${fr.name} (${data.length} bytes)`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(
        `\nReport 0x${fr.id.toString(16).padStart(2, "0")} (${fr.name}): ERROR — ${msg}`,
      );
    }
  }
}

/** Try sending output report bytes to find what controls the LED */
async function probeLEDs(device: HID) {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║     LED / Output Probe               ║");
  console.log("╚══════════════════════════════════════╝");

  // The Access output report is 32 bytes (Report ID 0x02 + 31 data bytes).
  // On DualSense, the lightbar/player LED bytes are at 39-47, which are OUT
  // OF RANGE for the Access controller's shorter output report. But the Access
  // has a center button LED. Let's try various approaches to control it.

  const send = (label: string, report: number[]) => {
    const buf = new Uint8Array(32);
    buf[0] = 0x02; // Report ID
    for (let i = 0; i < report.length && i < 31; i++) {
      buf[i + 1] = report[i];
    }
    try {
      device.write(Array.from(buf));
      console.log(`  ✓ ${label}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ✗ ${label}: ${msg}`);
    }
  };

  // Strategy 1: Try standard DualSense LED bytes within the 32-byte range
  // On DualSense: byte 9 = mute LED mode (0=off, 1=on, 2=pulse)
  console.log("\n--- Mute LED byte (index 9) ---");
  send("Mute LED ON (scope B=0x01)", [0x00, 0x01, ...Array(6).fill(0), 0x01]);
  await sleep(1000);
  send("Mute LED PULSE (scope B=0x01)", [0x00, 0x01, ...Array(6).fill(0), 0x02]);
  await sleep(1000);
  send("Mute LED OFF", [0x00, 0x01, ...Array(6).fill(0), 0x00]);
  await sleep(500);

  // Strategy 2: Try various scope B flags
  console.log("\n--- Scope flags exploration ---");
  for (let scopeB = 1; scopeB <= 0x40; scopeB <<= 1) {
    send(`Scope A=0x00 B=0x${scopeB.toString(16).padStart(2, "0")}`, [
      0x00,
      scopeB,
    ]);
    await sleep(200);
  }

  // Strategy 3: Sweep each byte in the output report
  console.log("\n--- Byte sweep (one byte at a time to 0xFF) ---");
  for (let byteIdx = 0; byteIdx < 31; byteIdx++) {
    const report = Array(31).fill(0);
    report[byteIdx] = 0xff;
    send(`Byte ${byteIdx} = 0xFF`, report);
    await sleep(150);
    // Reset
    send(`Byte ${byteIdx} = 0x00 (reset)`, Array(31).fill(0));
    await sleep(50);
  }

  // Reset everything
  send("Full reset", Array(31).fill(0));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Monitor input reports, highlighting changes */
async function monitorInput(device: HID, durationMs: number = 30000) {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║     Input Report Monitor             ║");
  console.log("╚══════════════════════════════════════╝");
  console.log(`Monitoring for ${durationMs / 1000}s. Press buttons on the controller.\n`);

  let prevBuf: Buffer | null = null;
  let frameCount = 0;
  const changedBytes = new Map<number, Set<number>>();

  return new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      device.removeAllListeners("data");
      printSummary();
      resolve();
    }, durationMs);

    device.on("data", (buf: Buffer) => {
      frameCount++;

      // Track all seen values per byte
      for (let i = 0; i < buf.length; i++) {
        if (!changedBytes.has(i)) changedBytes.set(i, new Set());
        changedBytes.get(i)!.add(buf[i]);
      }

      // Only log when something interesting changes (skip counters and CRC)
      if (prevBuf) {
        const changes: Array<{ byte: number; from: number; to: number }> = [];
        for (let i = 0; i < buf.length; i++) {
          // Skip known counters (7, 12) and CRC (56-63)
          if (i === 7 || i === 12 || i >= 56) continue;
          if (buf[i] !== prevBuf[i]) {
            changes.push({ byte: i, from: prevBuf[i], to: buf[i] });
          }
        }
        if (changes.length > 0) {
          const state = parseInput(buf);
          const changeStr = changes
            .map((c) => {
              const label = BYTE_LABELS[c.byte] ?? `byte ${c.byte}`;
              return `${label}: 0x${c.from.toString(16).padStart(2, "0")}→0x${c.to.toString(16).padStart(2, "0")}`;
            })
            .join(", ");
          console.log(
            `[${frameCount}] ${changeStr}` +
              (state.buttons.length > 0
                ? ` | Buttons: ${state.buttons.join(", ")}`
                : "") +
              (state.hat !== "None" ? ` | Hat: ${state.hat}` : "") +
              (state.stickX !== 128 || state.stickY !== 128
                ? ` | Stick: ${state.stickX},${state.stickY}`
                : ""),
          );
        }
      }

      prevBuf = Buffer.from(buf);
    });

    // Allow Ctrl+C to stop early
    process.on("SIGINT", () => {
      clearTimeout(timeout);
      device.removeAllListeners("data");
      printSummary();
      resolve();
    });

    function printSummary() {
      console.log(`\n\n=== Input Summary (${frameCount} frames) ===`);
      console.log("Bytes that changed during session:");
      console.log(
        `${"Byte".padEnd(6)} ${"Label".padEnd(20)} ${"Unique".padEnd(8)} ${"Min".padEnd(6)} ${"Max".padEnd(6)} Range`,
      );
      console.log("-".repeat(60));
      for (const [byte, values] of [...changedBytes.entries()].sort(
        (a, b) => a[0] - b[0],
      )) {
        if (values.size <= 1) continue;
        const label = BYTE_LABELS[byte] ?? "";
        const sorted = [...values].sort((a, b) => a - b);
        console.log(
          `${byte.toString().padEnd(6)} ${label.padEnd(20)} ${values.size.toString().padEnd(8)} 0x${sorted[0].toString(16).padStart(2, "0").padEnd(4)} 0x${sorted[sorted.length - 1].toString(16).padStart(2, "0").padEnd(4)} ${sorted.length > 10 ? "continuous" : sorted.map((v) => v.toString(16)).join(",")}`,
        );
      }
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] ?? "all";

  console.log("DualSense Access Controller Explorer");
  console.log("====================================\n");

  const { HID: HIDClass, path, wireless } = await findDevice();
  console.log(`Found Access controller at ${path} (${wireless ? "wireless" : "USB"})`);

  const device = new HIDClass(path);

  try {
    switch (mode) {
      case "feature":
        await readFeatureReports(device);
        break;

      case "led":
        await probeLEDs(device);
        break;

      case "monitor":
        await monitorInput(device, 60000);
        break;

      case "all":
      default:
        await readFeatureReports(device);
        await probeLEDs(device);
        console.log("\nStarting input monitor (30s)...");
        console.log("Press buttons, move stick, plug in expansion modules.");
        await monitorInput(device, 30000);
        break;
    }
  } finally {
    device.close();
  }

  console.log("\nDone.");
}

main().catch(console.error);
