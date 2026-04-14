/**
 * Interactive hardware verification script for DualSense Access.
 *
 * Walks through controller features in stages, asking the user to exercise
 * inputs and confirm outputs. Uses the controller itself for navigation —
 * no keyboard input needed after launch.
 *
 * Navigation: B1 = confirm (pass), B2 = report failure
 *
 * Usage:
 *   sudo tsx scripts/verify_access.ts
 */

import { DualsenseAccess } from "../src/dualsense_access";
import { AccessProfileLedMode } from "../src/hid/access/access_hid_state";
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
  | {
      type: "confirm";
      title: string;
      prompt: string;
      setup: () => void;
      teardown: () => void;
    };

// ── Display ──────────────────────────────────────────────────────────

function renderHeader(access: DualsenseAccess): string {
  const conn = access.wireless ? "bluetooth" : "usb";
  const fw = access.firmwareInfo;
  const ver = formatFirmwareVersion(fw.mainFirmwareVersion);
  const bat = Math.round(access.battery.level.state * 100);
  const profile = access.profileId.state;
  return (
    `${BOLD}${CYAN}dualsense-ts Access verification${RESET}\n` +
    `${DIM}${conn} · fw v${ver} · built ${fw.buildDate} ${fw.buildTime}${RESET}\n` +
    `${DIM}battery ${bat}% · profile ${profile}${RESET}\n`
  );
}

function renderChecklist(
  stage: Extract<Stage, { type: "checklist" }>
): string {
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
    `${DIM}Press ${RESET}${CYAN}B1${RESET}${DIM} to confirm · ${RESET}${RED}B2${RESET}${DIM} to report failure${RESET}`
  );
}

let lastRender = "";
function draw(access: DualsenseAccess, content: string) {
  const full = CLEAR + renderHeader(access) + "\n" + content;
  if (full !== lastRender) {
    process.stdout.write(full);
    lastRender = full;
  }
}

// ── Stage runners ────────────────────────────────────────────────────

function runChecklist(
  access: DualsenseAccess,
  stage: Extract<Stage, { type: "checklist" }>
): Promise<void> {
  return new Promise((resolve) => {
    const redraw = () => draw(access, renderChecklist(stage));
    redraw();

    const check = () => {
      redraw();
      if (stage.items.every((i) => i.done)) {
        access.off("change", onChange);
        setTimeout(resolve, 400);
      }
    };

    const onChange = () => check();
    access.on("change", onChange);
    check();
  });
}

async function runConfirm(
  access: DualsenseAccess,
  stage: Extract<Stage, { type: "confirm" }>
): Promise<boolean> {
  stage.setup();
  await sleep(100);
  draw(access, renderConfirm(stage));

  return new Promise((resolve) => {
    const onB1 = () => {
      cleanup();
      resolve(true);
    };
    const onB2 = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      access.b1.off("press", onB1);
      access.b2.off("press", onB2);
      stage.teardown();
    };

    access.b1.on("press", onB1);
    access.b2.on("press", onB2);
  });
}

// ── Stage definitions ────────────────────────────────────────────────

function buildStages(access: DualsenseAccess): Stage[] {
  const stages: Stage[] = [];

  // ── Raw Buttons (B1–B8) ───────────────────────────────────────
  {
    const items = [
      { label: "B1", done: false },
      { label: "B2", done: false },
      { label: "B3", done: false },
      { label: "B4", done: false },
      { label: "B5", done: false },
      { label: "B6", done: false },
      { label: "B7", done: false },
      { label: "B8", done: false },
    ];
    access.b1.on("press", () => { items[0].done = true; });
    access.b2.on("press", () => { items[1].done = true; });
    access.b3.on("press", () => { items[2].done = true; });
    access.b4.on("press", () => { items[3].done = true; });
    access.b5.on("press", () => { items[4].done = true; });
    access.b6.on("press", () => { items[5].done = true; });
    access.b7.on("press", () => { items[6].done = true; });
    access.b8.on("press", () => { items[7].done = true; });
    stages.push({
      type: "checklist",
      title: "Raw Buttons",
      items,
      hint: "Press each button (B1–B8)",
    });
  }

  // ── System Buttons ────────────────────────────────────────────
  {
    const items = [
      { label: "Center", done: false },
      { label: "PS", done: false },
      { label: "Profile", done: false },
      { label: "Stick Click", done: false },
    ];
    access.center.on("press", () => { items[0].done = true; });
    access.ps.on("press", () => { items[1].done = true; });
    access.profile.on("press", () => { items[2].done = true; });
    access.stick.button.on("press", () => { items[3].done = true; });
    stages.push({
      type: "checklist",
      title: "System Buttons",
      items,
      hint: "Press Center, PS, Profile, and click the stick",
    });
  }

  // ── Analog Stick ──────────────────────────────────────────────
  {
    const THRESH = 0.7;
    const items = [
      { label: "Stick → Up", done: false },
      { label: "Stick → Down", done: false },
      { label: "Stick → Left", done: false },
      { label: "Stick → Right", done: false },
    ];
    access.stick.on("change", (a) => {
      if (a.y.state > THRESH) items[0].done = true;
      if (a.y.state < -THRESH) items[1].done = true;
      if (a.x.state < -THRESH) items[2].done = true;
      if (a.x.state > THRESH) items[3].done = true;
    });
    stages.push({
      type: "checklist",
      title: "Analog Stick",
      items,
      hint: "Push the stick fully in each direction",
    });
  }

  // Battery level is shown in the header bar — no explicit check needed.

  // ── Lightbar ──────────────────────────────────────────────────
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
      prompt:
        "The lightbar should be cycling through colors.\nDoes it look correct?",
      setup: () => {
        let i = 0;
        access.lightbar.set(colors[0]);
        interval = setInterval(() => {
          i = (i + 1) % colors.length;
          access.lightbar.set(colors[i]);
        }, 500);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        access.lightbar.set({ r: 0, g: 0, b: 255 });
      },
    });
  }

  // ── Profile LEDs — Sweep ──────────────────────────────────────
  {
    let interval: ReturnType<typeof setInterval> | null = null;
    stages.push({
      type: "confirm",
      title: "Profile LEDs — Sweep",
      prompt: "The profile LEDs should be sweeping.\nDo you see the animation?",
      setup: () => {
        access.profileLeds.set(AccessProfileLedMode.Sweep);
        // Re-trigger so the animation repeats — firmware plays it once
        interval = setInterval(() => {
          access.profileLeds.set(AccessProfileLedMode.On);
          setTimeout(() => access.profileLeds.set(AccessProfileLedMode.Sweep), 100);
        }, 1500);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        access.profileLeds.set(AccessProfileLedMode.On);
      },
    });
  }

  // ── Profile LEDs — Fade ───────────────────────────────────────
  {
    let interval: ReturnType<typeof setInterval> | null = null;
    stages.push({
      type: "confirm",
      title: "Profile LEDs — Fade",
      prompt: "The profile LEDs should be fading in and out.\nDo you see it?",
      setup: () => {
        access.profileLeds.set(AccessProfileLedMode.Fade);
        // Re-trigger to cycle fade in/out — firmware only fades in once
        interval = setInterval(() => {
          access.profileLeds.set(AccessProfileLedMode.On);
          setTimeout(() => access.profileLeds.set(AccessProfileLedMode.Fade), 100);
        }, 2000);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        access.profileLeds.set(AccessProfileLedMode.On);
      },
    });
  }

  // ── Player Indicator ──────────────────────────────────────────
  {
    let interval: ReturnType<typeof setInterval> | null = null;
    stages.push({
      type: "confirm",
      title: "Player Indicator",
      prompt:
        "The player indicator should be cycling 1→2→3→4.\nDo you see it changing?",
      setup: () => {
        let p = 1;
        access.playerIndicator.set(p);
        interval = setInterval(() => {
          p = (p % 4) + 1;
          access.playerIndicator.set(p);
        }, 700);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        access.playerIndicator.clear();
      },
    });
  }

  // ── Status LED ────────────────────────────────────────────────
  {
    let interval: ReturnType<typeof setInterval> | null = null;
    stages.push({
      type: "confirm",
      title: "Status LED",
      prompt:
        "The status LED should be toggling on and off.\nIs it working?",
      setup: () => {
        interval = setInterval(() => {
          access.statusLed.toggle();
        }, 500);
      },
      teardown: () => {
        if (interval) clearInterval(interval);
        access.statusLed.set(true);
      },
    });
  }

  return stages;
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const access = new DualsenseAccess();

  process.stdout.write(
    CLEAR +
      `${BOLD}${CYAN}dualsense-ts Access verification${RESET}\n\nWaiting for Access controller...\n`
  );

  await new Promise<void>((resolve) => {
    access.connection.on("change", () => {
      if (access.connection.active) resolve();
    });
  });

  // Brief pause for firmware info to arrive
  await sleep(500);

  const stages = buildStages(access);
  const results: Array<{ title: string; passed: boolean | "auto" }> = [];

  for (const stage of stages) {
    if (stage.type === "checklist") {
      for (const item of stage.items) item.done = false;
      await runChecklist(access, stage);
      results.push({ title: stage.title, passed: "auto" });
    } else {
      const passed = await runConfirm(access, stage);
      results.push({ title: stage.title, passed });
      await sleep(300);
    }
  }

  // ── Summary ──────────────────────────────────────────────────────

  const lines = [
    CLEAR,
    renderHeader(access),
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
      lines.push(
        `  ${RED}✗${RESET} ${r.title} ${RED}— reported as failed${RESET}`
      );
      failures++;
    }
  }

  lines.push("");
  if (failures === 0) {
    lines.push(
      `${GREEN}${BOLD}All ${results.length} tests passed!${RESET}\n`
    );
  } else {
    lines.push(
      `${RED}${BOLD}${failures} test(s) reported as failed.${RESET}\n`
    );
  }

  process.stdout.write(lines.join("\n"));
  access.hid.provider.disconnect();
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
