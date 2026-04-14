/**
 * Brute-force BT LED byte sweeper for DualSense Access.
 *
 * Systematically tests byte positions and flag values to discover what
 * enables lightbar RGB and player indicator over Bluetooth.
 *
 * How to use:
 *   1. Connect Access controller via Bluetooth
 *   2. Run: sudo tsx scripts/access_bt_led_sweep.ts
 *   3. Watch the controller — when the lightbar lights up, press SPACE
 *   4. The tool logs the winning configuration and continues
 *   5. Press Ctrl+C when done
 *
 * Status/profile LEDs are set ON as a "heartbeat" proof that reports are
 * being accepted. Between each test, a blank frame is sent so any lightbar
 * change is clearly visible.
 */

import type { HID, Device } from "node-hid";
import { computeBluetoothReportChecksum } from "../src/hid/bt_checksum";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

// ── Report builder ──

function buildBtReport(bytes: Record<number, number>): Uint8Array {
  const buf = new Uint8Array(78);
  // Caller provides ALL bytes including BT positions directly
  for (const [pos, val] of Object.entries(bytes)) {
    buf[Number(pos)] = val;
  }
  // Always set framing
  buf[0] = 0x31;
  buf[1] = 0x02;
  // CRC
  const crc = computeBluetoothReportChecksum(buf);
  buf[74] = crc & 0xff;
  buf[75] = (crc >>> 8) & 0xff;
  buf[76] = (crc >>> 16) & 0xff;
  buf[77] = (crc >>> 24) & 0xff;
  return buf;
}

// Known-good "heartbeat" bytes: status LED on + profile LEDs on
// These prove the report is being accepted by the controller.
// Using +1 offset (USB byte N → BT byte N+1).
const HEARTBEAT: Record<number, number> = {
  // BT[2] = mutator, BT[3] = scope B
  2: 0x01,  // mutator: STATUS_LED only (known to work)
  3: 0x00,  // scope B: none needed for status/profile
  // BT[13] = LED_FLAGS_1, BT[14] = LED_FLAGS_2
  13: 0x11, // profile LED enable + status LED command enable
  14: 0x01, // profile mode: on
  // BT[24] = status LED
  24: 0x01, // status LED: on
};

// Blank frame: turn off lightbar (send with heartbeat to prove report accepted)
function blankReport(): Uint8Array {
  return buildBtReport({ ...HEARTBEAT });
}

// ── Test phases ──

interface Test {
  phase: string;
  label: string;
  bytes: Record<number, number>;
}

function* generateTests(): Generator<Test> {
  // ═══════════════════════════════════════════════════════════════
  // PHASE 0: Quick targeted hypotheses (most likely to succeed)
  // ═══════════════════════════════════════════════════════════════

  const quickTests: Array<{ label: string; bytes: Record<number, number> }> = [
    // Hypothesis: need "effect" byte (USB 3 → BT 4) as enable flag
    {
      label: "effect=0x01, brightness=0x00",
      bytes: { 2: 0x15, 3: 0x04, 4: 0x01, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "effect=0x02, brightness=0x00",
      bytes: { 2: 0x15, 3: 0x04, 4: 0x02, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "effect=0x03, brightness=0x00",
      bytes: { 2: 0x15, 3: 0x04, 4: 0x03, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "effect=0xff, brightness=0xff",
      bytes: { 2: 0x15, 3: 0x04, 4: 0xff, 5: 0xff, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    // Hypothesis: brightness byte (USB 4 → BT 5) must be non-zero
    {
      label: "brightness=0x01",
      bytes: { 2: 0x15, 3: 0x04, 5: 0x01, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "brightness=0x02 (High enum?)",
      bytes: { 2: 0x15, 3: 0x04, 5: 0x02, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "brightness=0xff",
      bytes: { 2: 0x15, 3: 0x04, 5: 0xff, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    // Hypothesis: mutator = 0xFF (all bits set)
    {
      label: "mutator=0xff, scopeB=0xff, all flags",
      bytes: { 2: 0xff, 3: 0xff, 4: 0xff, 5: 0xff, 6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    // Hypothesis: BT needs DualSense-style magic 0x10 at BT[2]
    {
      label: "BT[2]=0x10 (DS magic), mutator at BT[3]",
      bytes: { 2: 0x10, 3: 0x15, 4: 0x04, 8: 0xff, 9: 0x00, 10: 0x00 },
    },
    // Hypothesis: +2 offset with 0x10 magic
    {
      label: "BT[2]=0x10, +2 offset lightbar",
      bytes: { 2: 0x10, 3: 0x15, 4: 0x04, 5: 0x02, 8: 0xff, 9: 0x00, 10: 0x00 },
    },
    // Hypothesis: DualSense byte positions WITH DualSense scope flags
    {
      label: "DS positions: scopeB=0x14, LedOpts=3 @40, RGB @46-48",
      bytes: { 2: 0x15, 3: 0x14, 40: 0x03, 44: 0x00, 46: 0xff, 47: 0x00, 48: 0x00 },
    },
    // Hypothesis: DualSense positions at +2 offset
    {
      label: "DS positions +2: LedOpts @41, RGB @47-49",
      bytes: { 2: 0x10, 3: 0x15, 4: 0x14, 41: 0x03, 45: 0x00, 47: 0xff, 48: 0x00, 49: 0x00 },
    },
    // Hypothesis: controller expects Access LED bytes but with different mutator encoding
    {
      label: "mutator=0x04 only (LED bit), no other mut bits",
      bytes: { 2: 0x04, 3: 0x04, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "mutator=0x14 (LED+PLAYER), scopeB=0x14",
      bytes: { 2: 0x14, 3: 0x14, 6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    // Hypothesis: the controller needs scope A AND scope B bits differently over BT
    {
      label: "scopeA=0x00, scopeB=0x15 (mutator value in scope B)",
      bytes: { 2: 0x00, 3: 0x15, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
    {
      label: "swap: mutator at BT[3], scopeB at BT[2]",
      bytes: { 2: 0x04, 3: 0x15, 7: 0xff, 8: 0x00, 9: 0x00 },
    },
  ];

  for (const t of quickTests) {
    yield {
      phase: "0-quick",
      label: t.label,
      bytes: { ...HEARTBEAT, ...t.bytes },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: "Effect" byte sweep (USB byte 3 → BT byte 4)
  // Titania documents this as part of dualsense_led_output struct
  // ═══════════════════════════════════════════════════════════════
  for (let v = 0; v < 256; v++) {
    yield {
      phase: "1-effect",
      label: `BT[4] (effect) = 0x${v.toString(16).padStart(2, "0")}`,
      bytes: {
        ...HEARTBEAT,
        2: 0x15, 3: 0x04,
        4: v,          // effect byte
        7: 0xff, 8: 0x00, 9: 0x00,  // R=255, G=0, B=0
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: "Brightness" byte sweep (USB byte 4 → BT byte 5)
  // ═══════════════════════════════════════════════════════════════
  for (let v = 0; v < 256; v++) {
    yield {
      phase: "2-brightness",
      label: `BT[5] (brightness) = 0x${v.toString(16).padStart(2, "0")}`,
      bytes: {
        ...HEARTBEAT,
        2: 0x15, 3: 0x04,
        5: v,          // brightness byte
        7: 0xff, 8: 0x00, 9: 0x00,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: Mutator sweep (BT byte 2)
  // ═══════════════════════════════════════════════════════════════
  for (let v = 0; v < 256; v++) {
    yield {
      phase: "3-mutator",
      label: `BT[2] (mutator) = 0x${v.toString(16).padStart(2, "0")}`,
      bytes: {
        ...HEARTBEAT,
        2: v, 3: 0x04,
        7: 0xff, 8: 0x00, 9: 0x00,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: Scope B sweep (BT byte 3)
  // ═══════════════════════════════════════════════════════════════
  for (let v = 0; v < 256; v++) {
    yield {
      phase: "4-scopeB",
      label: `BT[3] (scopeB) = 0x${v.toString(16).padStart(2, "0")}`,
      bytes: {
        ...HEARTBEAT,
        2: 0x15, 3: v,
        7: 0xff, 8: 0x00, 9: 0x00,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: RGB position sweep
  // Move R=0xFF through BT byte positions 4–60
  // ═══════════════════════════════════════════════════════════════
  for (let pos = 4; pos <= 60; pos++) {
    yield {
      phase: "5-position",
      label: `R=0xFF at BT[${pos}]`,
      bytes: {
        ...HEARTBEAT,
        2: 0x15, 3: 0x04,
        [pos]: 0xff,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: Effect + brightness combos with lightbar
  // Try pairs of (effect, brightness) for common values
  // ═══════════════════════════════════════════════════════════════
  const candidates = [0x00, 0x01, 0x02, 0x03, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0xff];
  for (const eff of candidates) {
    for (const bri of candidates) {
      yield {
        phase: "6-eff+bri",
        label: `effect=0x${eff.toString(16).padStart(2, "0")}, bright=0x${bri.toString(16).padStart(2, "0")}`,
        bytes: {
          ...HEARTBEAT,
          2: 0x15, 3: 0x04,
          4: eff, 5: bri,
          7: 0xff, 8: 0x00, 9: 0x00,
        },
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 7: Full 3-byte header sweep (BT[2], BT[3], BT[4])
  // Only try the most promising bit combinations (powers of 2 + combos)
  // ═══════════════════════════════════════════════════════════════
  const flagCandidates = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x14, 0x15, 0x20, 0x40, 0x80, 0xff];
  for (const b2 of flagCandidates) {
    for (const b3 of flagCandidates) {
      for (const b4 of flagCandidates) {
        yield {
          phase: "7-header",
          label: `BT[2]=0x${b2.toString(16).padStart(2, "0")} [3]=0x${b3.toString(16).padStart(2, "0")} [4]=0x${b4.toString(16).padStart(2, "0")}`,
          bytes: {
            ...HEARTBEAT,
            2: b2, 3: b3, 4: b4,
            7: 0xff, 8: 0x00, 9: 0x00,
          },
        };
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 8: "Shotgun" — fill large byte ranges with 0xFF + lightbar
  // Maybe a wide enable mask is needed somewhere
  // ═══════════════════════════════════════════════════════════════
  // Fill bytes 2-20
  {
    const fill: Record<number, number> = { ...HEARTBEAT };
    for (let i = 2; i <= 20; i++) fill[i] = 0xff;
    fill[7] = 0xff; fill[8] = 0x00; fill[9] = 0x00; // RGB still readable
    yield { phase: "8-shotgun", label: "bytes 2-20 = 0xFF", bytes: fill };
  }
  // Fill bytes 2-40
  {
    const fill: Record<number, number> = { ...HEARTBEAT };
    for (let i = 2; i <= 40; i++) fill[i] = 0xff;
    fill[7] = 0xff; fill[8] = 0x00; fill[9] = 0x00;
    yield { phase: "8-shotgun", label: "bytes 2-40 = 0xFF", bytes: fill };
  }
  // Fill bytes 2-73 (everything except framing + CRC)
  {
    const fill: Record<number, number> = { ...HEARTBEAT };
    for (let i = 2; i <= 73; i++) fill[i] = 0xff;
    fill[7] = 0xff; fill[8] = 0x00; fill[9] = 0x00;
    yield { phase: "8-shotgun", label: "bytes 2-73 = 0xFF", bytes: fill };
  }
  // Same shotguns but with DualSense RGB positions
  {
    const fill: Record<number, number> = { ...HEARTBEAT };
    for (let i = 2; i <= 73; i++) fill[i] = 0xff;
    fill[46] = 0xff; fill[47] = 0x00; fill[48] = 0x00; // DS RGB positions
    yield { phase: "8-shotgun", label: "all 0xFF, DS RGB @46-48", bytes: fill };
  }
}

// ── Main ──

const DELAY_MS = 150;  // time per test
const BLANK_MS = 50;   // blank gap between tests

async function main() {
  const nodeHid = await import("node-hid");
  const devices = nodeHid.devices(ACCESS_VID, ACCESS_PID);
  const target = devices.find(
    (d: Device): d is Device & { path: string } => Boolean(d.path)
  );
  if (!target?.path) {
    console.error("No Access controller found.");
    process.exit(1);
  }

  if (target.interface !== -1) {
    console.error("Controller is connected via USB. This tool is for BT diagnosis.");
    console.error("Disconnect USB and pair via Bluetooth, then try again.");
    process.exit(1);
  }

  console.log(`Found: ${target.path} (Bluetooth)\n`);

  const device = new nodeHid.HID(target.path);

  // Trigger BT full report mode
  try {
    device.getFeatureReport(0x05, 64);
    console.log("Triggered BT full report mode.\n");
  } catch {
    console.log("Feature Report 0x05 failed (may already be in full mode).\n");
  }

  const hits: Array<{ phase: string; label: string }> = [];
  let testNum = 0;
  let totalTests = 0;

  // Count total tests
  for (const _ of generateTests()) totalTests++;

  console.log(`Total tests: ${totalTests}`);
  console.log(`Estimated time: ${Math.ceil((totalTests * (DELAY_MS + BLANK_MS)) / 1000 / 60)} minutes`);
  console.log();
  console.log("Watch the lightbar. Press SPACE if you see it light up.");
  console.log("Press Ctrl+C to stop.\n");

  // Listen for spacebar
  process.stdin.setRawMode?.(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf-8");
  let spacePressed = false;
  process.stdin.on("data", (key: string) => {
    if (key === " ") {
      spacePressed = true;
    }
    if (key === "\u0003") {
      // Ctrl+C
      printSummary();
      device.close();
      process.exit(0);
    }
  });

  function write(report: Uint8Array) {
    try {
      device.write(Array.from(report));
    } catch (e) {
      console.error("Write error:", e instanceof Error ? e.message : e);
    }
  }

  function sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  function printSummary() {
    console.log("\n\n════════════════════════════════");
    if (hits.length === 0) {
      console.log("No hits recorded.");
    } else {
      console.log(`${hits.length} hit(s) recorded:`);
      for (const h of hits) {
        console.log(`  [${h.phase}] ${h.label}`);
      }
    }
    console.log("════════════════════════════════\n");
  }

  let lastPhase = "";

  for (const test of generateTests()) {
    testNum++;

    if (test.phase !== lastPhase) {
      lastPhase = test.phase;
      console.log(`\n── Phase ${test.phase} ──`);
    }

    // Send test report
    const report = buildBtReport(test.bytes);
    write(report);

    process.stdout.write(
      `\r  [${testNum}/${totalTests}] ${test.label}                    `
    );

    await sleep(DELAY_MS);

    // Check for space press
    if (spacePressed) {
      spacePressed = false;
      hits.push({ phase: test.phase, label: test.label });
      console.log(`\n  ★ HIT RECORDED: [${test.phase}] ${test.label}`);
    }

    // Send blank between tests
    write(blankReport());
    await sleep(BLANK_MS);
  }

  console.log("\n\nSweep complete.");
  printSummary();

  device.close();
  process.exit(0);
}

main().catch(console.error);
