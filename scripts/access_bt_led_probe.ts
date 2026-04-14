/**
 * BT LED diagnostic probe for DualSense Access.
 *
 * Tries multiple byte position strategies for lightbar and player indicator
 * over Bluetooth, cycling through them on a timer so you can observe which
 * (if any) configuration produces visible output.
 *
 * Usage: sudo tsx scripts/access_bt_led_probe.ts
 */

import type { HID, Device } from "node-hid";
import { computeBluetoothReportChecksum } from "../src/hid/bt_checksum";

const ACCESS_VID = 0x054c;
const ACCESS_PID = 0x0e5f;

function buildUsbReport(bytes: Record<number, number>): Uint8Array {
  const buf = new Uint8Array(32);
  buf[0] = 0x02;
  for (const [i, v] of Object.entries(bytes)) buf[Number(i)] = v;
  return buf;
}

function buildBtReport(
  offset: number,
  extraHeader: number | null,
  bytes: Record<number, number>
): Uint8Array {
  const buf = new Uint8Array(78);
  buf[0] = 0x31;
  buf[1] = 0x02;
  if (extraHeader !== null) buf[2] = extraHeader;
  for (const [usbByte, val] of Object.entries(bytes)) {
    buf[Number(usbByte) + offset] = val;
  }
  const crc = computeBluetoothReportChecksum(buf);
  buf[74] = crc & 0xff;
  buf[75] = (crc >>> 8) & 0xff;
  buf[76] = (crc >>> 16) & 0xff;
  buf[77] = (crc >>> 24) & 0xff;
  return buf;
}

// Common LED payload (all 4 systems, red lightbar, player 2)
const LED_PAYLOAD: Record<number, number> = {
  1: 0x15,  // mutator: status_led | led | player_indicator_led
  2: 0x04,  // scope B: lightbar enable
  5: 0x02,  // player indicator: 2
  6: 0xff,  // lightbar R
  7: 0x00,  // lightbar G
  8: 0x00,  // lightbar B
  12: 0x11, // LED flags 1: profile + status LED enable
  13: 0x01, // LED flags 2: profile mode ON
  23: 0x01, // status LED: on
};

// DualSense-position lightbar + player LED bytes
const DS_LED_BYTES: Record<number, number> = {
  39: 0x03,  // LedOptions.Both (enable lightbar)
  43: 0x00,  // Brightness.High
  44: 10,    // PlayerID.Player2 (DualSense pattern)
  45: 0xff,  // Lightbar R
  46: 0x00,  // Lightbar G
  47: 0x00,  // Lightbar B
};

interface Strategy {
  name: string;
  build: (wireless: boolean) => Uint8Array;
}

const strategies: Strategy[] = [
  {
    name: "A: Access +1 offset (current code)",
    build: (w) =>
      w
        ? buildBtReport(1, null, LED_PAYLOAD)
        : buildUsbReport(LED_PAYLOAD),
  },
  {
    name: "B: Access +2 offset, USB report ID at BT[2]",
    build: (w) =>
      w
        ? buildBtReport(2, 0x02, LED_PAYLOAD)
        : buildUsbReport(LED_PAYLOAD),
  },
  {
    name: "C: Access +1 offset + DualSense lightbar bytes",
    build: (w) => {
      if (!w) return buildUsbReport(LED_PAYLOAD);
      const combined = { ...LED_PAYLOAD, ...DS_LED_BYTES };
      return buildBtReport(1, null, combined);
    },
  },
  {
    name: "D: Access +2 offset + DualSense lightbar bytes",
    build: (w) => {
      if (!w) return buildUsbReport(LED_PAYLOAD);
      const combined = { ...LED_PAYLOAD, ...DS_LED_BYTES };
      return buildBtReport(2, 0x02, combined);
    },
  },
  {
    name: "E: DualSense-only byte positions (scope B = 0x14)",
    build: (w) => {
      // Use DualSense scope B flags for lightbar + player LEDs
      const dsPayload: Record<number, number> = {
        1: 0x00,  // scope A: none
        2: 0x14,  // scope B: TouchpadLeds(0x04) | PlayerLeds(0x10)
        12: 0x11, // LED flags (Access)
        13: 0x01, // profile mode ON
        23: 0x01, // status LED
        39: 0x03, // LedOptions.Both
        44: 10,   // PlayerID.Player2
        45: 0xff, // R
        46: 0x00, // G
        47: 0x00, // B
      };
      return w
        ? buildBtReport(1, null, dsPayload)
        : buildUsbReport(dsPayload);
    },
  },
  {
    name: "F: Both Access + DualSense mutator/scope (0x15 + 0x14)",
    build: (w) => {
      const combined: Record<number, number> = {
        1: 0x15,  // Access mutator
        2: 0x14,  // DualSense scope B
        5: 0x02,  // Access player indicator
        6: 0xff,  // Access lightbar R
        7: 0x00,  // Access lightbar G
        8: 0x00,  // Access lightbar B
        12: 0x11, // LED flags
        13: 0x01, // profile mode ON
        23: 0x01, // status LED
        39: 0x03, // DualSense LedOptions
        44: 10,   // DualSense PlayerID
        45: 0xff, // DualSense lightbar R
        46: 0x00, // G
        47: 0x00, // B
      };
      return w
        ? buildBtReport(1, null, combined)
        : buildUsbReport(combined);
    },
  },
];

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

  const wireless = target.interface === -1;
  console.log(
    `Found: ${target.path} (${wireless ? "Bluetooth" : "USB"})\n`
  );

  if (!wireless) {
    console.log("This probe is for BT diagnosis. USB lightbar works already.");
    console.log("Running single USB test to confirm...\n");
  }

  const device = new nodeHid.HID(target.path);

  if (wireless) {
    try {
      device.getFeatureReport(0x05, 64);
      console.log("Triggered BT full report mode.\n");
    } catch {
      console.log("Feature Report 0x05 failed (may already be in full mode).\n");
    }
  }

  let idx = 0;

  function sendCurrent() {
    const s = strategies[idx];
    const report = s.build(wireless);
    console.log(`\n>>> Strategy ${s.name}`);
    console.log(
      `    BT bytes 0-10: ${Array.from(report.slice(0, 11))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ")}`
    );
    console.log(
      `    BT bytes 39-48: ${Array.from(report.slice(39, 49))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ")}`
    );
    try {
      device.write(Array.from(report));
    } catch (e) {
      console.error("Write error:", e instanceof Error ? e.message : e);
    }
  }

  sendCurrent();

  console.log(
    "\nWatch for RED lightbar and Player 2 indicator."
  );
  console.log("Press Enter to cycle to next strategy, Ctrl+C to exit.\n");

  process.stdin.setRawMode?.(false);
  process.stdin.resume();
  process.stdin.on("data", () => {
    idx = (idx + 1) % strategies.length;
    sendCurrent();
  });

  process.on("SIGINT", () => {
    device.close();
    process.exit(0);
  });
}

main().catch(console.error);
