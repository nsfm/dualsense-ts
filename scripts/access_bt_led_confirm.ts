/**
 * Focused BT LED confirmation tests for DualSense Access.
 *
 * Each test holds for 4 seconds with a 2-second OFF gap between tests.
 * Watch the lightbar and note which tests produce visible RED output.
 *
 * Usage: sudo tsx scripts/access_bt_led_confirm.ts
 */

import type { HID, Device } from "node-hid";
import { computeBluetoothReportChecksum } from "../src/hid/bt_checksum";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

function buildBtReport(bytes: Record<number, number>): Uint8Array {
  const buf = new Uint8Array(78);
  for (const [pos, val] of Object.entries(bytes)) {
    buf[Number(pos)] = val;
  }
  buf[0] = 0x31;
  buf[1] = 0x02;
  const crc = computeBluetoothReportChecksum(buf);
  buf[74] = crc & 0xff;
  buf[75] = (crc >>> 8) & 0xff;
  buf[76] = (crc >>> 16) & 0xff;
  buf[77] = (crc >>> 24) & 0xff;
  return buf;
}

// Heartbeat: status/profile LEDs ON at +1 offset (proven to work)
const HEARTBEAT: Record<number, number> = {
  2: 0x01, 3: 0x00,
  13: 0x11, 14: 0x01, 24: 0x01,
};

// OFF report: explicitly try to disable lightbar
function offReport(): Uint8Array {
  return buildBtReport({
    ...HEARTBEAT,
    2: 0x15, 3: 0x04,     // mutator: all LEDs, scope B: lightbar
    7: 0x00, 8: 0x00, 9: 0x00,  // RGB = 0,0,0 at +1 positions
    8: 0x00, 9: 0x00, 10: 0x00, // RGB = 0,0,0 at +2 positions
    6: 0x00,  // player indicator = 0 at +1
    7: 0x00,  // player indicator = 0 at +2
  });
}

// ── Tests ──
// Each test: name + BT byte map for RED lightbar (R=255,G=0,B=0) + player 2

interface Test {
  name: string;
  description: string;
  bytes: Record<number, number>;
}

const tests: Test[] = [
  // ── Baseline: our current code (known broken) ──
  {
    name: "A: Current +1 offset (baseline, should FAIL)",
    description: "mutator=0x15 @BT[2], scopeB=0x04 @BT[3], RGB @BT[7-9], player @BT[6]",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      6: 0x02,                   // player indicator = 2
      7: 0xff, 8: 0x00, 9: 0x00, // RGB
    },
  },

  // ── Hypothesis 1: need "effect" byte (USB 3 → BT 4) ──
  {
    name: "B: +1 offset + effect=0x02 (LedOptions.Both?)",
    description: "Same as A but BT[4]=0x02",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0x02,                   // effect byte
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "C: +1 offset + effect=0x03",
    description: "Same as A but BT[4]=0x03",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0x03,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "D: +1 offset + effect=0xFF",
    description: "Same as A but BT[4]=0xFF",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0xff,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 2: need "brightness" byte (USB 4 → BT 5) ──
  {
    name: "E: +1 offset + brightness=0xFF",
    description: "Same as A but BT[5]=0xFF",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      5: 0xff,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 3: need BOTH effect AND brightness ──
  {
    name: "F: +1 offset + effect=0xFF + brightness=0xFF",
    description: "Same as A but BT[4]=0xFF, BT[5]=0xFF",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0xff, 5: 0xff,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "G: +1 offset + effect=0x02 + brightness=0x02",
    description: "Conservative values for both",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0x02, 5: 0x02,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 4: +2 offset with 0x10 enable byte ──
  {
    name: "H: +2 offset + 0x10 enable (sweep test 9)",
    description: "BT[2]=0x10, mutator @BT[3], scopeB @BT[4], RGB @BT[8-10]",
    bytes: {
      ...HEARTBEAT,
      2: 0x10, 3: 0x15, 4: 0x04,
      7: 0x02,                     // player indicator at +2
      8: 0xff, 9: 0x00, 10: 0x00, // RGB at +2
    },
  },

  // ── Hypothesis 5: "shotgun" — known to work from sweep ──
  {
    name: "I: Shotgun (sweep test 8, known working)",
    description: "BT[2-5]=0xFF, player=4 @BT[6], RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0xff, 3: 0xff, 4: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 6: scope B in BT[2], mutator in BT[3] (swapped) ──
  {
    name: "J: Swapped — scopeB @BT[2], mutator @BT[3]",
    description: "BT[2]=0x04, BT[3]=0x15",
    bytes: {
      ...HEARTBEAT,
      2: 0x04, 3: 0x15,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 7: narrowing down from shotgun ──
  // Start from shotgun and remove one byte at a time
  {
    name: "K: Shotgun minus BT[4] (no effect byte)",
    description: "BT[2]=0xFF, BT[3]=0xFF, BT[5]=0xFF, RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0xff, 3: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "L: Shotgun minus BT[5] (no brightness byte)",
    description: "BT[2]=0xFF, BT[3]=0xFF, BT[4]=0xFF, RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0xff, 3: 0xff, 4: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "M: Shotgun with BT[2]=0x15 (Access mutator instead of 0xFF)",
    description: "BT[2]=0x15, BT[3]=0xFF, BT[4]=0xFF, BT[5]=0xFF, RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0xff, 4: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "N: Shotgun with BT[3]=0x04 (Access scope B instead of 0xFF)",
    description: "BT[2]=0xFF, BT[3]=0x04, BT[4]=0xFF, BT[5]=0xFF, RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0xff, 3: 0x04, 4: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
  {
    name: "O: Shotgun with BT[2]=0x15, BT[3]=0x04 (both Access values)",
    description: "BT[2]=0x15, BT[3]=0x04, BT[4]=0xFF, BT[5]=0xFF, RGB @BT[7-9]",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04, 4: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },

  // ── Hypothesis 8: maybe it's really simple — just need effect=0x02 ──
  {
    name: "P: +1 offset, effect=0x01 only",
    description: "Minimal: BT[4]=0x01",
    bytes: {
      ...HEARTBEAT,
      2: 0x15, 3: 0x04,
      4: 0x01,
      6: 0x02, 7: 0xff, 8: 0x00, 9: 0x00,
    },
  },
];

// ── Main ──

const HOLD_MS = 4000;   // show each test for 4 seconds
const GAP_MS = 2000;    // 2-second off gap

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
    console.error("USB detected. This tool is for BT. Disconnect USB first.");
    process.exit(1);
  }

  console.log(`Found: ${target.path} (Bluetooth)\n`);
  const device = new nodeHid.HID(target.path);

  try {
    device.getFeatureReport(0x05, 64);
    console.log("Triggered BT full report mode.\n");
  } catch {
    console.log("Feature Report 0x05 failed.\n");
  }

  function write(report: Uint8Array) {
    try { device.write(Array.from(report)); } catch (e) {
      console.error("Write error:", e instanceof Error ? e.message : e);
    }
  }

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  console.log(`Running ${tests.length} tests (${HOLD_MS / 1000}s each, ${GAP_MS / 1000}s gap)`);
  console.log(`Total time: ~${Math.ceil(tests.length * (HOLD_MS + GAP_MS) / 1000 / 60)} minutes`);
  console.log("\nWatch the lightbar. Note which letter(s) produce RED light.\n");
  console.log("═".repeat(70));

  const results: string[] = [];

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];

    // OFF gap
    write(offReport());
    console.log(`\n  ... OFF (${GAP_MS / 1000}s) ...`);
    // Resend OFF multiple times during gap to ensure lightbar clears
    for (let g = 0; g < GAP_MS / 200; g++) {
      await sleep(200);
      write(offReport());
    }

    // Send test
    console.log(`\n  [${i + 1}/${tests.length}] ${t.name}`);
    console.log(`  ${t.description}`);
    const bytes = Array.from(buildBtReport(t.bytes));
    console.log(`  BT[2-10]: ${bytes.slice(2, 11).map(b => b.toString(16).padStart(2, "0")).join(" ")}`);

    // Hold the test for HOLD_MS, resending periodically
    for (let h = 0; h < HOLD_MS / 200; h++) {
      write(buildBtReport(t.bytes));
      await sleep(200);
    }

    results.push(t.name);
  }

  // Final OFF
  write(offReport());

  console.log("\n" + "═".repeat(70));
  console.log("\nDone! Which tests lit up the lightbar? (report the letters)");
  console.log("Tests run:");
  for (const r of results) {
    console.log(`  ${r}`);
  }

  device.close();
  process.exit(0);
}

main().catch(console.error);
