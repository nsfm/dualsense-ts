/**
 * Isolates the BT lightbar initialization trigger.
 *
 * Each test holds for 5 seconds with RED lightbar. Between tests, sends
 * a "neutral" report (status/profile only, no lightbar mutator) for 3 seconds.
 *
 * Power-cycle controller before running.
 * Usage: sudo tsx scripts/access_bt_init_find.ts
 */

import type { Device } from "node-hid";
import { computeBluetoothReportChecksum } from "../src/hid/bt_checksum";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

function send(device: import("node-hid").HID, btBytes: Record<number, number>) {
  const buf = new Uint8Array(78);
  buf[0] = 0x31;
  buf[1] = 0x02;
  for (const [pos, val] of Object.entries(btBytes)) buf[Number(pos)] = val;
  const crc = computeBluetoothReportChecksum(buf);
  buf[74] = crc & 0xff;
  buf[75] = (crc >>> 8) & 0xff;
  buf[76] = (crc >>> 16) & 0xff;
  buf[77] = (crc >>> 24) & 0xff;
  device.write(Array.from(buf));
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Neutral report: only status/profile LEDs (no lightbar mutator)
const NEUTRAL: Record<number, number> = {
  2: 0x01,  // mutator: STATUS_LED only
  13: 0x11, // LED_FLAGS_1
  14: 0x01, // profile on
  24: 0x01, // status LED on
};

// Each test: a single change from our standard lightbar report
// Standard: BT[2]=0x15, BT[3]=0x04, BT[7]=0xFF(R), BT[8]=0x00(G), BT[9]=0x00(B)
// Plus heartbeat: BT[13]=0x11, BT[14]=0x01, BT[24]=0x01

interface Test {
  name: string;
  bytes: Record<number, number>;
}

const tests: Test[] = [
  {
    name: "1: Standard (no effect byte) — our current broken code",
    bytes: {
      2: 0x15, 3: 0x04,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "2: effect=0x01",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0x01,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "3: effect=0x02",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0x02,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "4: effect=0x03",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0x03,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "5: effect=0xFF",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0xff,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "6: brightness=0x01",
    bytes: {
      2: 0x15, 3: 0x04, 5: 0x01,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "7: brightness=0xFF",
    bytes: {
      2: 0x15, 3: 0x04, 5: 0xff,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "8: effect=0xFF + brightness=0xFF",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0xff, 5: 0xff,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "9: effect=0x01 + brightness=0x01",
    bytes: {
      2: 0x15, 3: 0x04, 4: 0x01, 5: 0x01,
      7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
  {
    name: "10: shotgun (all header 0xFF)",
    bytes: {
      2: 0xff, 3: 0xff, 4: 0xff, 5: 0xff,
      6: 0x04, 7: 0xff, 8: 0x00, 9: 0x00,
      13: 0x11, 14: 0x01, 24: 0x01,
    },
  },
];

async function main() {
  const nodeHid = await import("node-hid");
  const target = nodeHid
    .devices(ACCESS_VID, ACCESS_PID)
    .find((d: Device): d is Device & { path: string } => Boolean(d.path));
  if (!target?.path) { console.error("No controller found."); process.exit(1); }
  if (target.interface !== -1) { console.error("USB detected — need BT."); process.exit(1); }

  const device = new nodeHid.HID(target.path);
  try { device.getFeatureReport(0x05, 64); } catch {}
  console.log("Connected. Starting tests in 1 second...\n");
  await sleep(1000);

  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    console.log(`>>> ${t.name}`);
    console.log(`    Sending for 5s — watch for RED lightbar...`);

    // Send test report repeatedly for 5 seconds
    for (let j = 0; j < 25; j++) {
      send(device, t.bytes);
      await sleep(200);
    }

    console.log(`    (3s neutral gap — lightbar should go away if not persistent)\n`);
    // Neutral gap: send status/profile only, no lightbar mutator
    for (let j = 0; j < 15; j++) {
      send(device, NEUTRAL);
      await sleep(200);
    }
  }

  console.log("Done. Which test number first showed RED lightbar?");
  device.close();
}

main().catch(console.error);
