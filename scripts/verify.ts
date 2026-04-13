/**
 * Interactive hardware verification script for dualsense-ts.
 *
 * Walks through controller features in stages, asking the user to exercise
 * inputs and confirm outputs. Uses the controller itself for navigation —
 * no keyboard input needed after launch.
 *
 * Usage:
 *   yarn verify
 */

import { Dualsense } from "../src/dualsense";
import { TriggerEffect } from "../src/elements/trigger_feedback";
import { MuteLedMode } from "../src/hid/command";
import { formatFirmwareVersion } from "../src/hid/firmware_info";

// ── Terminal helpers ─────────────────────────────────────────────────

const CSI = "\x1b[";
const CLEAR = CSI + "2J" + CSI + "H";
const BOLD = CSI + "1m";
const DIM = CSI + "2m";
const RESET = CSI + "0m";
const GREEN = CSI + "32m";
const YELLOW = CSI + "33m";
const CYAN = CSI + "36m";
const RED = CSI + "31m";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Types ────────────────────────────────────────────────────────────

interface ChecklistItem {
  label: string;
  done: boolean;
}

type Stage =
  | { type: "checklist"; title: string; items: ChecklistItem[]; hint: string }
  | { type: "confirm"; title: string; prompt: string; setup: () => void; teardown: () => void };

// ── Display ──────────────────────────────────────────────────────────

function renderHeader(ds: Dualsense): string {
  const conn = ds.wireless ? "bluetooth" : "usb";
  const fw = ds.firmwareInfo;
  const fi = ds.factoryInfo;
  const ver = formatFirmwareVersion(fw.mainFirmwareVersion);
  const sbl = formatFirmwareVersion(fw.sblFirmwareVersion);
  const bat = Math.round(ds.battery.level.state * 100);
  const ts = ds.sensorTimestamp;
  return (
    `${BOLD}${CYAN}dualsense-ts verification${RESET}\n` +
    `${DIM}${conn} · fw v${ver} · SBL v${sbl} · DSP ${fw.dspFirmwareVersion} · built ${fw.buildDate} ${fw.buildTime}${RESET}\n` +
    `${DIM}${fi.colorName} · ${fi.boardRevision} · serial ${fi.serialNumber} · battery ${bat}% · sensor ${ts} µs${RESET}\n`
  );
}

function renderChecklist(stage: Extract<Stage, { type: "checklist" }>): string {
  const lines = [`${BOLD}${stage.title}${RESET}\n`];
  for (const item of stage.items) {
    const icon = item.done ? `${GREEN}✓${RESET}` : `${DIM}○${RESET}`;
    const label = item.done ? `${DIM}${item.label}${RESET}` : item.label;
    lines.push(`  ${icon} ${label}`);
  }
  const remaining = stage.items.filter((i) => !i.done).length;
  lines.push("");
  if (remaining > 0) {
    lines.push(`${DIM}${stage.hint}${RESET}`);
  } else {
    lines.push(`${GREEN}All done!${RESET} Moving on...`);
  }
  return lines.join("\n");
}

function renderConfirm(stage: Extract<Stage, { type: "confirm" }>): string {
  return (
    `${BOLD}${stage.title}${RESET}\n\n` +
    `${YELLOW}${stage.prompt}${RESET}\n\n` +
    `${DIM}Press ${RESET}${CYAN}Cross${RESET}${DIM} to confirm · ${RESET}${RED}Triangle${RESET}${DIM} to report failure${RESET}`
  );
}

let lastRender = "";
function draw(ds: Dualsense, content: string) {
  const full = CLEAR + renderHeader(ds) + "\n" + content;
  if (full !== lastRender) {
    process.stdout.write(full);
    lastRender = full;
  }
}

// ── Stage runners ────────────────────────────────────────────────────

function runChecklist(
  ds: Dualsense,
  stage: Extract<Stage, { type: "checklist" }>,
): Promise<void> {
  return new Promise((resolve) => {
    const redraw = () => draw(ds, renderChecklist(stage));
    redraw();

    const check = () => {
      redraw();
      if (stage.items.every((i) => i.done)) {
        ds.off("change", onChange);
        setTimeout(resolve, 400);
      }
    };

    const onChange = () => check();
    ds.on("change", onChange);
    check();
  });
}

async function runConfirm(
  ds: Dualsense,
  stage: Extract<Stage, { type: "confirm" }>,
): Promise<boolean> {
  stage.setup();
  // Yield to let the output loop flush the setup commands
  await sleep(100);
  draw(ds, renderConfirm(stage));

  return new Promise((resolve) => {
    const onCross = () => {
      cleanup();
      resolve(true);
    };
    const onTriangle = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      ds.cross.off("press", onCross);
      ds.triangle.off("press", onTriangle);
      stage.teardown();
    };

    ds.cross.on("press", onCross);
    ds.triangle.on("press", onTriangle);
  });
}

// ── Stage definitions ────────────────────────────────────────────────

function buildStages(ds: Dualsense): Stage[] {
  const stages: Stage[] = [];

  // ── Face buttons ───────────────────────────────────────────────
  {
    const items = [
      { label: "Cross", done: false },
      { label: "Circle", done: false },
      { label: "Square", done: false },
      { label: "Triangle", done: false },
    ];
    ds.cross.on("press", () => { items[0].done = true; });
    ds.circle.on("press", () => { items[1].done = true; });
    ds.square.on("press", () => { items[2].done = true; });
    ds.triangle.on("press", () => { items[3].done = true; });
    stages.push({
      type: "checklist",
      title: "Face Buttons",
      items,
      hint: "Press each face button",
    });
  }

  // ── D-pad ──────────────────────────────────────────────────────
  {
    const items = [
      { label: "Up", done: false },
      { label: "Down", done: false },
      { label: "Left", done: false },
      { label: "Right", done: false },
    ];
    ds.dpad.up.on("press", () => { items[0].done = true; });
    ds.dpad.down.on("press", () => { items[1].done = true; });
    ds.dpad.left.on("press", () => { items[2].done = true; });
    ds.dpad.right.on("press", () => { items[3].done = true; });
    stages.push({
      type: "checklist",
      title: "D-Pad",
      items,
      hint: "Press each direction",
    });
  }

  // ── Bumpers & system buttons ───────────────────────────────────
  {
    const items = [
      { label: "L1 (Left Bumper)", done: false },
      { label: "R1 (Right Bumper)", done: false },
      { label: "Options", done: false },
      { label: "Create", done: false },
      { label: "PS Button", done: false },
      { label: "Mute Button", done: false },
    ];
    ds.left.bumper.on("press", () => { items[0].done = true; });
    ds.right.bumper.on("press", () => { items[1].done = true; });
    ds.options.on("press", () => { items[2].done = true; });
    ds.create.on("press", () => { items[3].done = true; });
    ds.ps.on("press", () => { items[4].done = true; });
    ds.mute.on("press", () => { items[5].done = true; });
    stages.push({
      type: "checklist",
      title: "Bumpers & System Buttons",
      items,
      hint: "Press each button",
    });
  }

  // ── Triggers ───────────────────────────────────────────────────
  {
    const items = [
      { label: "L2 (Left Trigger > 50%)", done: false },
      { label: "R2 (Right Trigger > 50%)", done: false },
      { label: "L3 (Left Stick Click)", done: false },
      { label: "R3 (Right Stick Click)", done: false },
    ];
    ds.left.trigger.on("change", (t) => { if (t.magnitude > 0.5) items[0].done = true; });
    ds.right.trigger.on("change", (t) => { if (t.magnitude > 0.5) items[1].done = true; });
    ds.left.analog.button.on("press", () => { items[2].done = true; });
    ds.right.analog.button.on("press", () => { items[3].done = true; });
    stages.push({
      type: "checklist",
      title: "Triggers & Stick Clicks",
      items,
      hint: "Pull each trigger past 50%, click each stick",
    });
  }

  // ── Analog sticks ──────────────────────────────────────────────
  {
    const THRESH = 0.7;
    const items = [
      { label: "Left Stick → Up", done: false },
      { label: "Left Stick → Down", done: false },
      { label: "Left Stick → Left", done: false },
      { label: "Left Stick → Right", done: false },
      { label: "Right Stick → Up", done: false },
      { label: "Right Stick → Down", done: false },
      { label: "Right Stick → Left", done: false },
      { label: "Right Stick → Right", done: false },
    ];
    ds.left.analog.on("change", (a) => {
      if (a.y.state > THRESH) items[0].done = true;
      if (a.y.state < -THRESH) items[1].done = true;
      if (a.x.state < -THRESH) items[2].done = true;
      if (a.x.state > THRESH) items[3].done = true;
    });
    ds.right.analog.on("change", (a) => {
      if (a.y.state > THRESH) items[4].done = true;
      if (a.y.state < -THRESH) items[5].done = true;
      if (a.x.state < -THRESH) items[6].done = true;
      if (a.x.state > THRESH) items[7].done = true;
    });
    stages.push({
      type: "checklist",
      title: "Analog Sticks",
      items,
      hint: "Push each stick fully in each direction",
    });
  }

  // ── Touchpad ───────────────────────────────────────────────────
  {
    const items = [
      { label: "Touch (left half)", done: false },
      { label: "Touch (right half)", done: false },
      { label: "Touchpad Button (click)", done: false },
    ];
    ds.touchpad.left.on("change", (t) => {
      if (t.contact.active) items[0].done = true;
    });
    ds.touchpad.right.on("change", (t) => {
      if (t.contact.active) items[1].done = true;
    });
    ds.touchpad.button.on("press", () => { items[2].done = true; });
    stages.push({
      type: "checklist",
      title: "Touchpad",
      items,
      hint: "Touch each half of the pad, then click it",
    });
  }

  // ── Gyroscope / Accelerometer ──────────────────────────────────
  {
    const items = [
      { label: "Gyroscope (rotate controller)", done: false },
      { label: "Accelerometer (shake controller)", done: false },
    ];
    ds.gyroscope.on("change", (g) => {
      const mag = Math.abs(g.x.state) + Math.abs(g.y.state) + Math.abs(g.z.state);
      if (mag > 0.3) items[0].done = true;
    });
    ds.accelerometer.on("change", (a) => {
      const mag = Math.abs(a.x.state) + Math.abs(a.y.state) + Math.abs(a.z.state);
      if (mag > 0.5) items[1].done = true;
    });
    stages.push({
      type: "checklist",
      title: "Motion Sensors",
      items,
      hint: "Rotate and shake the controller",
    });
  }

  // ── Lightbar ───────────────────────────────────────────────────
  {
    const colors = [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 },
    ];
    let interval: ReturnType<typeof setInterval> | null = null;
    stages.push({
      type: "confirm",
      title: "Lightbar",
      prompt: "The lightbar should be cycling through colors.\nDoes it look correct?",
      setup: () => {
        let i = 0;
        ds.lightbar.set(colors[0]);
        interval = setInterval(() => {
          i = (i + 1) % colors.length;
          ds.lightbar.set(colors[i]);
        }, 500);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        ds.lightbar.set({ r: 0, g: 0, b: 255 });
      },
    });
  }

  // ── Rumble (left) ───────────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Rumble — Left Motor",
    prompt: "The left motor should be rumbling.\nDo you feel it on the left side?",
    setup: () => {
      ds.left.rumble(1);
      ds.right.rumble(0);
    },
    teardown: () => {
      ds.left.rumble(0);
    },
  });

  // ── Rumble (right) ──────────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Rumble — Right Motor",
    prompt: "The right motor should be vibrating.\nDo you feel it on the right side?",
    setup: () => {
      ds.right.rumble(1);
      ds.left.rumble(0);
    },
    teardown: () => {
      ds.right.rumble(0);
    },
  });

  // ── Trigger feedback ───────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Trigger Feedback",
    prompt: "The right trigger (R2) should feel resistant.\nDoes it have a stiff feedback effect?",
    setup: () => {
      ds.right.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position: 0,
        strength: 1,
      });
    },
    teardown: () => {
      ds.resetTriggerFeedback();
    },
  });

  // ── Mute LED ───────────────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Mute LED",
    prompt: "The mute button LED should be pulsing.\nDo you see it?",
    setup: () => {
      ds.mute.setLed(MuteLedMode.Pulse);
    },
    teardown: () => {
      ds.mute.resetLed();
    },
  });

  // ── Test tone 1kHz ─────────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Test Tone — 1kHz",
    prompt: "A ~1kHz sine wave should be playing from the speaker.\nDo you hear it?",
    setup: () => {
      ds.startTestTone("speaker", "1khz");
    },
    teardown: () => {
      ds.stopTestTone();
    },
  });

  // ── Test tone 100Hz ────────────────────────────────────────────
  stages.push({
    type: "confirm",
    title: "Test Tone — ~100Hz",
    prompt: "A lower-frequency tone should be playing from the speaker.\nDo you hear it?",
    setup: () => {
      ds.startTestTone("speaker", "100hz");
    },
    teardown: () => {
      ds.stopTestTone();
    },
  });

  return stages;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const ds = new Dualsense();

  process.stdout.write(CLEAR + `${BOLD}${CYAN}dualsense-ts verification${RESET}\n\nWaiting for controller...\n`);

  await new Promise<void>((resolve) => {
    ds.connection.on("change", () => {
      if (ds.connection.active) resolve();
    });
  });

  // Brief pause for firmware info to arrive
  await sleep(500);

  const stages = buildStages(ds);
  const results: Array<{ title: string; passed: boolean | "auto" }> = [];

  for (const stage of stages) {
    if (stage.type === "checklist") {
      // Reset items for this stage
      for (const item of stage.items) item.done = false;
      await runChecklist(ds, stage);
      results.push({ title: stage.title, passed: "auto" });
    } else {
      const passed = await runConfirm(ds, stage);
      results.push({ title: stage.title, passed });
      await sleep(300);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────

  const lines = [
    CLEAR,
    renderHeader(ds),
    "",
    `${BOLD}Verification Summary${RESET}\n`,
  ];

  let failures = 0;
  for (const r of results) {
    if (r.passed === "auto") {
      lines.push(`  ${GREEN}✓${RESET} ${r.title}`);
    } else if (r.passed) {
      lines.push(`  ${GREEN}✓${RESET} ${r.title}`);
    } else {
      lines.push(`  ${RED}✗${RESET} ${r.title} ${RED}— reported as failed${RESET}`);
      failures++;
    }
  }

  lines.push("");
  if (failures === 0) {
    lines.push(`${GREEN}${BOLD}All ${results.length} tests passed!${RESET}\n`);
  } else {
    lines.push(`${RED}${BOLD}${failures} test(s) reported as failed.${RESET}\n`);
  }

  process.stdout.write(lines.join("\n"));
  ds.hid.provider.disconnect();
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
