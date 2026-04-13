/**
 * DSP exploration script — dumps ALC5524 codec registers and probes
 * unknown Audio action IDs via Feature Report 0x80/0x81.
 *
 * I was using this to try to uncover undocumented audio functionality,
 * unfortunately I didn't make any useful discoveries.
 *
 * Usage:
 *   yarn debug:dsp              (runs all probes)
 *   yarn debug:dsp registers    (codec register dump only)
 *   yarn debug:dsp actions      (sweep all Audio action IDs)
 *   yarn debug:dsp devices      (sweep all DspDevice IDs with action 0)
 */

import { Dualsense } from "../src/dualsense";
import { DspDevice, AudioAction, DspStatus } from "../src/hid/dsp";

const DELAY = 30; // ms between commands

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout: ${label} after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
}

function hex(n: number, width = 2): string {
  return "0x" + n.toString(16).toUpperCase().padStart(width, "0");
}

function hexDump(data: Uint8Array, maxLen = 32): string {
  const bytes = Array.from(data.slice(0, maxLen));
  const suffix =
    data.length > maxLen ? ` ... (${data.length} bytes total)` : "";
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ") + suffix;
}

/**
 * Send a DSP command and read the 0x81 response.
 * Retries up to 3 times waiting for DspStatus.Complete.
 */
async function dspCommand(
  ds: Dualsense,
  deviceId: number,
  actionId: number,
  params?: Uint8Array,
): Promise<{ status: number; data: Uint8Array } | undefined> {
  await ds.hid.sendTestCommand(deviceId, actionId, params);
  await sleep(DELAY);

  for (let attempt = 0; attempt < 3; attempt++) {
    const resp = await ds.hid.readTestResponse();
    if (!resp) {
      await sleep(DELAY);
      continue;
    }

    // Response format: [0x81, deviceId, actionId, status, ...data]
    const status = resp[3];
    if (status === DspStatus.Running) {
      await sleep(DELAY);
      continue;
    }

    return { status, data: resp.slice(4) };
  }

  return undefined;
}

// ── Codec register dump ──────────────────────────────────────────────

/**
 * Read ALC5524 codec registers via CodecRegRead (action 129).
 * The register address is a 16-bit value passed in params.
 * Known ALC5524 register ranges (from Realtek datasheets):
 *   0x0000–0x00FF  General / power / clock
 *   0x0100–0x01FF  DAC / ADC digital
 *   0x0200–0x02FF  Mixer / routing
 *   0x0300–0x03FF  I/O control
 *   0xFA00–0xFAFF  Vendor-specific
 */
async function dumpCodecRegisters(ds: Dualsense) {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║          ALC5524 Codec Register Dump         ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // Scan known register ranges. Most Realtek codecs use even addresses only.
  const ranges: Array<[number, number, string]> = [
    [0x0000, 0x00ff, "General/Power/Clock"],
    [0x0100, 0x01ff, "DAC/ADC Digital"],
    [0x0200, 0x02ff, "Mixer/Routing"],
    [0x0300, 0x03ff, "I/O Control"],
    [0xfa00, 0xfaff, "Vendor-specific"],
  ];

  const results: Array<{ addr: number; value: Uint8Array; status: number }> =
    [];

  for (const [start, end, label] of ranges) {
    console.log(`\n── ${label} (${hex(start, 4)}–${hex(end, 4)}) ──`);
    let found = 0;

    for (let addr = start; addr <= end; addr += 2) {
      // Param layout: 2 bytes for register address (big-endian, per Realtek convention)
      const params = new Uint8Array([addr >> 8, addr & 0xff]);
      const resp = await dspCommand(
        ds,
        DspDevice.Audio,
        AudioAction.CodecRegRead,
        params,
      );

      if (resp && resp.status === DspStatus.Complete && !isAllZero(resp.data)) {
        console.log(`  ${hex(addr, 4)}: ${hexDump(resp.data)}`);
        results.push({ addr, value: resp.data, status: resp.status });
        found++;
      }
    }

    if (found === 0) {
      console.log("  (no non-zero responses)");
    }
  }

  console.log(
    `\n── Summary: ${results.length} registers with non-zero data ──`,
  );
  return results;
}

function isAllZero(data: Uint8Array): boolean {
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== 0) return false;
  }
  return true;
}

// ── Audio action sweep ───────────────────────────────────────────────

async function sweepAudioActions(ds: Dualsense) {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║          Audio Action ID Sweep (0–255)       ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  const known = new Set(
    Object.values(AudioAction).filter((v) => typeof v === "number"),
  );

  for (let actionId = 0; actionId <= 255; actionId++) {
    const params = new Uint8Array(4); // minimal params
    const resp = await dspCommand(ds, DspDevice.Audio, actionId, params);

    const tag = known.has(actionId) ? ` (${AudioAction[actionId]})` : "";
    if (!resp) {
      // Only log unknown actions that fail — known ones we expect to work
      if (!known.has(actionId)) continue;
      console.log(`  Action ${hex(actionId)}${tag}: no response`);
    } else if (
      resp.status === DspStatus.Complete ||
      resp.status === DspStatus.CompleteMulti
    ) {
      const dataStr = isAllZero(resp.data) ? "(empty)" : hexDump(resp.data);
      console.log(
        `  Action ${hex(actionId)}${tag}: status=${resp.status} data=[${dataStr}]`,
      );
    } else if (resp.status !== DspStatus.Idle) {
      console.log(`  Action ${hex(actionId)}${tag}: status=${resp.status}`);
    }
  }
}

// ── Device ID sweep ──────────────────────────────────────────────────

async function sweepDevices(ds: Dualsense) {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║         DspDevice ID Sweep (0–31)            ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  const known = new Set(
    Object.values(DspDevice).filter((v) => typeof v === "number"),
  );

  for (let deviceId = 0; deviceId <= 31; deviceId++) {
    // Action 0 is commonly "get info" or "get version"
    const resp = await dspCommand(ds, deviceId, 0, new Uint8Array(4));
    const tag = known.has(deviceId) ? ` (${DspDevice[deviceId]})` : "";

    if (resp && resp.status !== DspStatus.Idle) {
      const dataStr = isAllZero(resp.data) ? "(empty)" : hexDump(resp.data);
      console.log(
        `  Device ${hex(deviceId)}${tag}: status=${resp.status} data=[${dataStr}]`,
      );
    }
  }
}

// ── Read codec firmware info ─────────────────────────────────────────

async function readCodecFwInfo(ds: Dualsense) {
  console.log("\n── Codec Firmware Info (Action 3) ──");
  const resp = await dspCommand(
    ds,
    DspDevice.Audio,
    AudioAction.ReadCodecFwInfo,
  );
  if (resp) {
    console.log(`  Status: ${resp.status}`);
    console.log(`  Data: ${hexDump(resp.data, 64)}`);
  } else {
    console.log("  No response");
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  // Hard kill after 2 minutes no matter what
  setTimeout(() => {
    console.error("\nGlobal timeout (2 min) — exiting.");
    process.exit(1);
  }, 120_000).unref();

  const mode = process.argv[2] ?? "all";

  const ds = new Dualsense();

  console.log("Connecting to controller...");

  await withTimeout(
    new Promise<void>((resolve) => {
      ds.connection.on("change", () => {
        if (ds.connection.active) resolve();
      });
    }),
    5000,
    "waiting for controller",
  );

  console.log(`Connected (${ds.wireless ? "bluetooth" : "usb"})`);

  // Wait for firmware info to be available
  await withTimeout(
    new Promise<void>((resolve) => {
      ds.hid.onReady(() => resolve());
    }),
    5000,
    "waiting for firmware info",
  );

  console.log(`Firmware: ${ds.firmwareInfo.dspFirmwareVersion}`);

  await readCodecFwInfo(ds);

  if (mode === "all" || mode === "registers") {
    await dumpCodecRegisters(ds);
  }

  if (mode === "all" || mode === "actions") {
    await sweepAudioActions(ds);
  }

  if (mode === "all" || mode === "devices") {
    await sweepDevices(ds);
  }

  console.log("\nDone. Disconnecting...");
  ds.hid.provider.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
