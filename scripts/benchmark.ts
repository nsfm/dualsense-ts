/**
 * Performance benchmark for dualsense-ts.
 *
 * Measures throughput, per-report cost, and GC pressure for the full
 * input pipeline (HID report → DualsenseHID → processHID → InputSet
 * cascade → comparators → event emission).
 *
 * Usage:
 *   yarn benchmark              # default: 1, 4, 16, 31 controllers
 *   yarn benchmark 8            # single run with 8 controllers
 *   yarn benchmark 1 4 16 31    # custom scale list
 *
 * For GC metrics, run with --expose-gc:
 *   node --expose-gc --import tsx node_scripts/benchmark.ts
 */

import { Dualsense } from "../src/dualsense";
import { DualsenseHID } from "../src/hid/dualsense_hid";
import {
  HIDProvider,
  DualsenseHIDState,
  DefaultDualsenseHIDState,
} from "../src/hid/hid_provider";
import { ChargeStatus } from "../src/hid/battery_state";

// ── Bench provider ──────────────────────────────────────────────────

/** Minimal HID provider that lets us push states directly */
class BenchProvider extends HIDProvider {
  device = undefined;
  wireless: boolean | undefined = false;
  buffer = undefined;

  connect() {}
  disconnect() {}
  get connected() { return true; }
  process() { return { ...DefaultDualsenseHIDState }; }
  async write() {}
  readFeatureReport() { return Promise.resolve(new Uint8Array(0)); }
  async sendFeatureReport() {}

  /** Inject a state directly into the pipeline */
  push(state: DualsenseHIDState) {
    this.onData(state);
  }
}

// ── Report generation ───────────────────────────────────────────────

/**
 * Build a realistic HID state for a given frame.
 *
 * Simulates what a real session looks like:
 * - Gyro/accel change continuously (small oscillation)
 * - Analog sticks drift slowly
 * - Buttons toggle infrequently
 * - Battery/peripherals are static
 */
function buildReport(frame: number): DualsenseHIDState {
  return {
    LX: Math.sin(frame * 0.01) * 0.3,
    LY: Math.cos(frame * 0.01) * 0.3,
    RX: Math.sin(frame * 0.007) * 0.1,
    RY: Math.cos(frame * 0.007) * 0.1,
    L2: Math.max(0, Math.sin(frame * 0.005)) * 0.8,
    R2: 0,
    Triangle: frame % 1000 > 500,
    Circle: false,
    Cross: false,
    Square: false,
    Dpad: 0,
    Up: false,
    Down: false,
    Left: false,
    Right: false,
    R3: false,
    L3: false,
    Options: false,
    Create: false,
    R2Button: false,
    L2Button: frame % 1000 > 500,
    R1: false,
    L1: false,
    Playstation: false,
    TouchButton: false,
    Mute: false,
    Status: false,
    TouchX0: 0,
    TouchY0: 0,
    TouchContact0: false,
    TouchId0: 0,
    TouchX1: 0,
    TouchY1: 0,
    TouchContact1: false,
    TouchId1: 0,
    GyroX: Math.sin(frame * 0.1) * 0.5,
    GyroY: Math.cos(frame * 0.1) * 0.5,
    GyroZ: Math.sin(frame * 0.05) * 0.2,
    AccelX: 0.01 * Math.sin(frame),
    AccelY: 0.01 * Math.cos(frame),
    AccelZ: 0.98,
    BatteryLevel: 0.8,
    BatteryStatus: ChargeStatus.Discharging,
    MuteLed: false,
    Microphone: false,
    Headphone: false,
  };
}

/** Build an idle report (all neutral). Same shape, no variation. */
function buildIdleReport(): DualsenseHIDState {
  return { ...DefaultDualsenseHIDState };
}

// ── Setup / teardown ────────────────────────────────────────────────

interface BenchController {
  ds: Dualsense;
  provider: BenchProvider;
}

function createControllers(count: number): BenchController[] {
  const controllers: BenchController[] = [];
  for (let i = 0; i < count; i++) {
    const provider = new BenchProvider();
    const hid = new DualsenseHID(provider, 30);
    const ds = new Dualsense({ hid });
    controllers.push({ ds, provider });
  }
  return controllers;
}

function destroyControllers(controllers: BenchController[]) {
  for (const { ds } of controllers) ds.dispose();
  controllers.length = 0;
}

// ── Benchmark scenarios ─────────────────────────────────────────────

const REPORTS_PER_CONTROLLER = 10_000;
const gc: (() => void) | undefined = (globalThis as Record<string, unknown>).gc as (() => void) | undefined;

interface BenchResult {
  label: string;
  controllerCount: number;
  totalReports: number;
  elapsedMs: number;
  reportsPerSec: number;
  perReportUs: number;
  heapDeltaMB: number;
  gcMs: number | null;
}

function runScenario(
  label: string,
  controllers: BenchController[],
  reportFn: (frame: number) => DualsenseHIDState,
  reports: number = REPORTS_PER_CONTROLLER,
): BenchResult {
  const count = controllers.length;
  const total = count * reports;

  // Force GC before measurement to start from a clean state
  if (gc) gc();
  const heapBefore = process.memoryUsage().heapUsed;

  const start = performance.now();
  for (let frame = 0; frame < reports; frame++) {
    const report = reportFn(frame);
    for (let c = 0; c < count; c++) {
      controllers[c].provider.push(report);
    }
  }
  const elapsed = performance.now() - start;

  const heapAfter = process.memoryUsage().heapUsed;

  let gcMs: number | null = null;
  if (gc) {
    const gcStart = performance.now();
    gc();
    gcMs = performance.now() - gcStart;
  }

  return {
    label,
    controllerCount: count,
    totalReports: total,
    elapsedMs: elapsed,
    reportsPerSec: total / (elapsed / 1000),
    perReportUs: (elapsed * 1000) / total,
    heapDeltaMB: (heapAfter - heapBefore) / 1024 / 1024,
    gcMs,
  };
}

// ── Display ─────────────────────────────────────────────────────────

const COL = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

function printResult(r: BenchResult) {
  const rps = r.reportsPerSec >= 1_000_000
    ? `${(r.reportsPerSec / 1_000_000).toFixed(2)}M`
    : `${(r.reportsPerSec / 1000).toFixed(1)}K`;

  const label = `${COL.cyan}${r.label.padEnd(28)}${COL.reset}`;
  const gcInfo = r.gcMs !== null
    ? `${r.gcMs.toFixed(1)} ms gc`
    : `${COL.dim}(no --expose-gc)${COL.reset}`;

  console.log(
    `  ${label}  ${rps.padStart(8)} reports/s  ${r.perReportUs.toFixed(2).padStart(7)} µs/report  ${r.heapDeltaMB.toFixed(1).padStart(6)} MB heap  ${gcInfo}`,
  );
}

function printHeader(controllerCount: number) {
  console.log();
  console.log(
    `${COL.bold}── ${controllerCount} controller(s) × ${REPORTS_PER_CONTROLLER.toLocaleString()} reports ──${COL.reset}`,
  );
}

// ── Main ────────────────────────────────────────────────────────────

async function runSuite(controllerCount: number) {
  printHeader(controllerCount);

  // Scenario 1: realistic input, no listeners
  const controllers = createControllers(controllerCount);
  await new Promise((r) => setTimeout(r, 100)); // let Input constructors settle
  printResult(runScenario("active, no listeners", controllers, buildReport));
  destroyControllers(controllers);

  // Scenario 2: idle input, no listeners
  const idle = createControllers(controllerCount);
  await new Promise((r) => setTimeout(r, 100));
  printResult(runScenario("idle, no listeners", idle, buildIdleReport));
  destroyControllers(idle);

  // Scenario 3: realistic input, with change listeners on every input
  const listened = createControllers(controllerCount);
  await new Promise((r) => setTimeout(r, 100));
  let listenerCallCount = 0;
  const noop = () => { listenerCallCount++; };
  for (const { ds } of listened) {
    ds.triangle.on("change", noop);
    ds.circle.on("change", noop);
    ds.cross.on("change", noop);
    ds.square.on("change", noop);
    ds.left.analog.x.on("change", noop);
    ds.left.analog.y.on("change", noop);
    ds.right.analog.x.on("change", noop);
    ds.right.analog.y.on("change", noop);
    ds.left.trigger.on("change", noop);
    ds.right.trigger.on("change", noop);
    ds.gyroscope.x.on("change", noop);
    ds.gyroscope.y.on("change", noop);
    ds.gyroscope.z.on("change", noop);
    ds.accelerometer.x.on("change", noop);
    ds.accelerometer.y.on("change", noop);
    ds.accelerometer.z.on("change", noop);
  }
  const result = runScenario("active, 16 listeners/ctrl", listened, buildReport);
  printResult(result);
  console.log(
    `  ${COL.dim}  └─ ${listenerCallCount.toLocaleString()} listener callbacks fired${COL.reset}`,
  );
  destroyControllers(listened);

  // Scenario 4: realistic input, with "input" event listeners (high-frequency)
  const inputListened = createControllers(controllerCount);
  await new Promise((r) => setTimeout(r, 100));
  let inputCallCount = 0;
  const inputNoop = () => { inputCallCount++; };
  for (const { ds } of inputListened) {
    ds.left.analog.x.on("input", inputNoop);
    ds.left.analog.y.on("input", inputNoop);
    ds.gyroscope.x.on("input", inputNoop);
  }
  const inputResult = runScenario("active, 3 input listeners/ctrl", inputListened, buildReport);
  printResult(inputResult);
  console.log(
    `  ${COL.dim}  └─ ${inputCallCount.toLocaleString()} input callbacks fired${COL.reset}`,
  );
  destroyControllers(inputListened);
}

async function main() {
  console.log(`${COL.bold}dualsense-ts pipeline benchmark${COL.reset}`);
  console.log(`${COL.dim}Reports per controller: ${REPORTS_PER_CONTROLLER.toLocaleString()}${COL.reset}`);

  if (!gc) {
    console.log(
      `${COL.yellow}Tip: run with --expose-gc for GC metrics:${COL.reset}`,
    );
    console.log(
      `  node --expose-gc --import tsx node_scripts/benchmark.ts`,
    );
  }

  // Parse controller counts from CLI args, defaulting to a useful spread
  const args = process.argv.slice(2).map(Number).filter((n) => n > 0);
  const scales = args.length > 0 ? args : [1, 4, 16, 31];

  for (const n of scales) {
    await runSuite(n);
  }

  console.log();
}

main().catch(console.error);
