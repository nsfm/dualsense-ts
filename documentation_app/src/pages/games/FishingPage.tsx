import React, {
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styled, { keyframes, css } from "styled-components";
import { TriggerEffect, MuteLedMode } from "dualsense-ts";
import type { TriggerFeedbackConfig, Dualsense } from "dualsense-ts";
import { ControllerContext, hasWebHID } from "../../controller";
import { CodeBlock } from "../../components/ui/CodeBlock";

/* ── Types ──────────────────────────────────────────────────────── */

type GamePhase =
  | "IDLE"
  | "CAST"
  | "WAIT"
  | "BITE"
  | "FIGHT"
  | "CATCH"
  | "ESCAPE"
  | "SNAP";

interface FishSpecies {
  name: string;
  strength: number;
  thrashSpeed: number;
  thrashChance: number;
  hookWindow: number;
  minWeight: number;
  maxWeight: number;
  points: number;
}

interface Fish {
  species: FishSpecies;
  weight: number;
}

interface PondFish {
  id: number;
  x: number; // 0..1 across pond width
  y: number; // 0..1 depth (0 = just below surface, 1 = pond floor)
  vx: number; // per-second velocity
  size: number; // visual scale
  facing: 1 | -1; // sprite direction
  interested: boolean;
  bobX: number; // wobble seed
  hidden: boolean; // despawned (e.g. after biting)
  respawnAt: number; // 0 = alive, >0 = timestamp to respawn
}

interface TiltSample {
  time: number;
  value: number; // normalized -1..1
}

interface FightState {
  fishPos: number;
  fishVel: number;
  fishTarget: number;
  catchProgress: number;
  tension: number;
  isThrashing: boolean;
  thrashTimer: number;
  elapsed: number;
}

interface GameState {
  phase: GamePhase;
  fish: Fish | null;
  fightState: FightState;
  score: number;
  caught: number;
  speciesCaught: Set<string>;
  biggestWeight: number;
  linesSnapped: number;
  escaped: number;
  streak: number;
  bestStreak: number;
  r2Position: number;
  rodTilt: number;
  bobberX: number;
}

type GameAction =
  | { type: "CAST"; bobberX: number }
  | { type: "START_WAIT" }
  | { type: "BITE"; fish: Fish }
  | { type: "HOOK" }
  | { type: "ESCAPE" }
  | { type: "FIGHT_TICK"; dt: number }
  | { type: "RETURN_TO_IDLE" }
  | { type: "UPDATE_R2"; pos: number }
  | { type: "UPDATE_TILT"; pitch: number };

/* ── Fish data ─────────────────────────────────────────────────── */

const SPECIES: Record<string, FishSpecies> = {
  bluegill: {
    name: "Bluegill",
    strength: 0.3,
    thrashSpeed: 2.5,
    thrashChance: 0.3,
    hookWindow: 1200,
    minWeight: 0.2,
    maxWeight: 0.5,
    points: 10,
  },
  bass: {
    name: "Bass",
    strength: 0.45,
    thrashSpeed: 3.5,
    thrashChance: 0.5,
    hookWindow: 900,
    minWeight: 1,
    maxWeight: 3,
    points: 25,
  },
  catfish: {
    name: "Catfish",
    strength: 0.55,
    thrashSpeed: 2,
    thrashChance: 0.4,
    hookWindow: 1000,
    minWeight: 2,
    maxWeight: 8,
    points: 40,
  },
  pike: {
    name: "Pike",
    strength: 0.7,
    thrashSpeed: 5,
    thrashChance: 0.7,
    hookWindow: 600,
    minWeight: 3,
    maxWeight: 10,
    points: 60,
  },
  marlin: {
    name: "Marlin",
    strength: 0.9,
    thrashSpeed: 4,
    thrashChance: 0.8,
    hookWindow: 400,
    minWeight: 50,
    maxWeight: 200,
    points: 100,
  },
};

const SPECIES_KEYS = ["bluegill", "bass", "catfish", "pike", "marlin"] as const;
const SPECIES_LED_MAP: Record<string, number> = {
  bluegill: 0,
  bass: 1,
  catfish: 2,
  pike: 3,
  marlin: 4,
};

const CATCH_ZONE_HALF = 0.12;

const SPECIES_SHADOW_SCALE: Record<string, number> = {
  bluegill: 0.6,
  bass: 0.85,
  catfish: 1.1,
  pike: 1.3,
  marlin: 1.8,
};

/* ── Pure functions ────────────────────────────────────────────── */

function pickFish(caughtCount: number, bobberX = 0.5): Fish {
  // depth 0..1 — further right = deeper water = rarer species
  const depth = clamp((bobberX - 0.35) / 0.55);
  const weights: [string, number][] = [
    ["bluegill", 35 * (1 - depth * 0.5)],
    ["bass", 28],
    ["catfish", caughtCount >= 2 ? 12 + depth * 12 : 0],
    ["pike", caughtCount >= 4 ? 6 + depth * 14 : 0],
    ["marlin", caughtCount >= 6 ? 2 + depth * 18 : 0],
  ];
  const total = weights.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [key, w] of weights) {
    r -= w;
    if (r <= 0) {
      const sp = SPECIES[key];
      const weight =
        sp.minWeight + Math.random() * (sp.maxWeight - sp.minWeight);
      return { species: sp, weight: Math.round(weight * 10) / 10 };
    }
  }
  const fallback = SPECIES.bluegill;
  return {
    species: fallback,
    weight:
      fallback.minWeight +
      Math.random() * (fallback.maxWeight - fallback.minWeight),
  };
}

function getWaitDuration(rodTilt: number): number {
  const base = 3000 + Math.random() * 5000;
  const tiltMod = 1 - rodTilt * 0.2;
  return base * Math.max(0.8, Math.min(1.2, tiltMod));
}

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

function getTensionColor(tension: number): { r: number; g: number; b: number } {
  if (tension < 0.3) return { r: 0, g: 150, b: 30 };
  if (tension < 0.5) return { r: 180, g: 180, b: 0 };
  if (tension < 0.7) return { r: 220, g: 120, b: 0 };
  if (tension < 0.85) return { r: 220, g: 30, b: 0 };
  return { r: 255, g: 0, b: 0 };
}

function getTensionCssColor(tension: number): string {
  const c = getTensionColor(tension);
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

function getFightTriggerEffect(
  fish: FishSpecies,
  isThrashing: boolean,
  playerPos: number,
  elapsed: number,
): TriggerFeedbackConfig {
  if (isThrashing) {
    // During thrash, bias the Bow zone *across* the player's current position
    // and add jitter so it actively yanks them off-target.
    const t = elapsed * 6 + Math.sin(elapsed * 11) * 0.5;
    const drift = Math.sin(t) * 0.15;
    const center = clamp(playerPos + drift, 0.1, 0.9);
    const halfWidth = 0.1 + Math.abs(Math.sin(t * 0.7)) * 0.12;
    const start = clamp(center - halfWidth, 0.05);
    const end = clamp(center + halfWidth, start + 0.1);
    return {
      effect: TriggerEffect.Bow,
      start,
      end,
      strength: clamp(
        0.6 + fish.strength * 0.5 + Math.sin(t * 1.3) * 0.15,
        0.3,
        1,
      ),
      snapForce: clamp(
        0.4 + fish.strength * 0.6 + Math.sin(t * 0.9) * 0.15,
        0.3,
        1,
      ),
    };
  }
  // Steady pull: pulse strength and position so the fish "breathes"
  const pulse = Math.sin(elapsed * 2.5);
  const strength = clamp(0.25 + fish.strength * 0.5 + pulse * 0.18, 0.1, 1);
  const position = clamp(0.08 + Math.abs(pulse) * 0.12, 0.05, 0.5);
  return {
    effect: TriggerEffect.Feedback,
    position,
    strength,
  };
}

function getBobberXFromTilt(tilt: number): number {
  const base = 0.6 + tilt * 0.5;
  const jitter = (Math.random() - 0.5) * 0.15;
  return clamp(base + jitter, 0.35, 0.9);
}

function getCastTargetX(tilt: number): number {
  return clamp(0.6 + tilt * 0.5, 0.35, 0.9);
}

function getBufferedTilt(buf: TiltSample[], msAgo: number): number {
  if (buf.length === 0) return 0;
  const target = performance.now() - msAgo;
  for (let i = buf.length - 1; i >= 0; i--) {
    if (buf[i].time <= target) return buf[i].value;
  }
  return buf[0].value;
}

function speciesKeyOf(sp: FishSpecies): string {
  for (const [k, v] of Object.entries(SPECIES)) {
    if (v === sp) return k;
  }
  return "bluegill";
}

/* ── Audio (controller speaker via DSP test tones) ──────────────── */

function playBiteSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 30);
}

function playCatchSound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 40);
    }, 20);
  }, 50);
}

function playSnapSound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 40);
}

function playEscapeSound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 20);
}

/* ── Reducer ───────────────────────────────────────────────────── */

const INITIAL_FIGHT: FightState = {
  fishPos: 0.5,
  fishVel: 0,
  fishTarget: 0.5,
  catchProgress: 0,
  tension: 0,
  isThrashing: false,
  thrashTimer: 0,
  elapsed: 0,
};

const initialState: GameState = {
  phase: "IDLE",
  fish: null,
  fightState: INITIAL_FIGHT,
  score: 0,
  caught: 0,
  speciesCaught: new Set(),
  biggestWeight: 0,
  linesSnapped: 0,
  escaped: 0,
  streak: 0,
  bestStreak: 0,
  r2Position: 0,
  rodTilt: 0,
  bobberX: 0.5,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "CAST":
      if (state.phase !== "IDLE") return state;
      return {
        ...state,
        phase: "CAST",
        fish: null,
        fightState: INITIAL_FIGHT,
        bobberX: action.bobberX,
      };

    case "START_WAIT":
      if (state.phase !== "CAST") return state;
      return { ...state, phase: "WAIT" };

    case "BITE":
      if (state.phase !== "WAIT") return state;
      return { ...state, phase: "BITE", fish: action.fish };

    case "HOOK":
      if (state.phase !== "BITE" || !state.fish) return state;
      return {
        ...state,
        phase: "FIGHT",
        fightState: {
          fishPos: 0.3 + Math.random() * 0.4,
          fishVel: 0,
          fishTarget: Math.random(),
          catchProgress: 0,
          tension: 0,
          isThrashing: false,
          thrashTimer: 0,
          elapsed: 0,
        },
      };

    case "FIGHT_TICK": {
      if (state.phase !== "FIGHT" || !state.fish) return state;
      const { dt } = action;
      const fish = state.fish.species;
      const prev = state.fightState;
      const elapsed = prev.elapsed + dt;

      let { fishPos, fishVel, fishTarget, isThrashing, thrashTimer } = prev;

      if (isThrashing) {
        thrashTimer -= dt;
        if (thrashTimer <= 0) {
          isThrashing = false;
          thrashTimer = 0;
        }
      } else if (Math.random() < fish.thrashChance * 1.6 * dt) {
        isThrashing = true;
        thrashTimer = 0.35 + Math.random() * 0.5;
        fishTarget = clamp(fishPos + (Math.random() - 0.5) * 0.85, 0.05, 0.95);
      }

      if (!isThrashing && Math.random() < 3.0 * dt) {
        fishTarget = clamp(
          fishTarget + (Math.random() - 0.5) * 0.55,
          0.05,
          0.95,
        );
      }

      const speed = isThrashing
        ? fish.thrashSpeed * 3.0
        : fish.thrashSpeed * 1.0;
      const accel = (fishTarget - fishPos) * speed;
      fishVel = fishVel * 0.85 + accel * dt;
      fishVel = clamp(fishVel, -2, 2);
      fishPos = clamp(fishPos + fishVel * dt);

      const playerPos = state.r2Position;
      const dist = Math.abs(fishPos - playerPos);
      const inZone = dist <= CATCH_ZONE_HALF;

      const fillRate = inZone ? 0.12 : 0;
      const drainRate = inZone ? 0 : 0.1 * fish.strength;
      const catchProgress = clamp(
        prev.catchProgress + (fillRate - drainRate) * dt,
      );

      const tensionRise = inZone ? 0 : 0.3 * (dist / 0.5) * (1 + fish.strength);
      const tensionDrop = inZone ? 0.08 : 0;
      const thrashTension = isThrashing ? 0.16 * fish.strength : 0;
      const tension = clamp(
        prev.tension + (tensionRise + thrashTension - tensionDrop) * dt,
      );

      const newFight: FightState = {
        fishPos,
        fishVel,
        fishTarget,
        catchProgress,
        tension,
        isThrashing,
        thrashTimer,
        elapsed,
      };

      if (catchProgress >= 1) {
        const newSpecies = new Set(state.speciesCaught);
        newSpecies.add(state.fish.species.name);
        const newStreak = state.streak + 1;
        return {
          ...state,
          phase: "CATCH",
          score: state.score + state.fish.species.points,
          caught: state.caught + 1,
          speciesCaught: newSpecies,
          biggestWeight: Math.max(state.biggestWeight, state.fish.weight),
          streak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          fightState: { ...newFight, catchProgress: 1 },
        };
      }
      if (tension >= 1.0) {
        return {
          ...state,
          phase: "SNAP",
          linesSnapped: state.linesSnapped + 1,
          streak: 0,
          fightState: { ...newFight, tension: 1 },
        };
      }
      if (catchProgress <= 0 && elapsed > 8) {
        return { ...state, phase: "ESCAPE", streak: 0, fightState: newFight };
      }

      return { ...state, fightState: newFight };
    }

    case "ESCAPE":
      if (state.phase !== "BITE") return state;
      return { ...state, phase: "ESCAPE", streak: 0 };

    case "RETURN_TO_IDLE":
      return { ...state, phase: "IDLE", fish: null, fightState: INITIAL_FIGHT };

    case "UPDATE_R2":
      return { ...state, r2Position: action.pos };

    case "UPDATE_TILT": {
      const clamped = clamp(action.pitch, -0.4, 0.4);
      if (Math.abs(clamped - state.rodTilt) < 0.005) return state;
      return { ...state, rodTilt: clamped };
    }

    default:
      return state;
  }
}

/* ── Animations ────────────────────────────────────────────────── */

const bobFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const bobPlunge = keyframes`
  0% { transform: translateY(0); }
  30% { transform: translateY(12px); }
  100% { transform: translateY(8px); }
`;

const waterWave = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const rodShake = keyframes`
  0%, 100% { transform: rotate(var(--rod-tilt, 0deg)); }
  20% { transform: rotate(calc(var(--rod-tilt, 0deg) + 3deg)); }
  40% { transform: rotate(calc(var(--rod-tilt, 0deg) - 2deg)); }
  60% { transform: rotate(calc(var(--rod-tilt, 0deg) + 1deg)); }
`;

/* Cast rotation is now driven inline in JS so the line endpoint can track it. */

const catchCelebrate = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const snapAnim = keyframes`
  0% { opacity: 1; }
  25% { transform: translateX(-4px); opacity: 0.8; }
  50% { transform: translateX(3px); opacity: 0.6; }
  75% { transform: translateX(-2px); opacity: 0.8; }
  100% { transform: translateX(0); opacity: 1; }
`;

/* ── Styled Components ─────────────────────────────────────────── */

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`;

const DescriptionSection = styled.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`;

const DescriptionHeading = styled.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`;

const FeatureList = styled.ul`
  margin: 6px 0 16px;
  padding-left: 20px;
  li {
    margin: 4px 0;
  }
  code {
    font-size: 12px;
    padding: 1px 5px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    color: rgba(191, 204, 214, 0.75);
  }
`;

const GameArea = styled.div`
  padding: 24px 24px 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 480px;
  position: relative;
`;

const NoControllerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`;

const OverlayContent = styled.div<{ $inactive: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(p) => (p.$inactive ? 0.3 : 1)};
  filter: ${(p) => (p.$inactive ? "grayscale(0.8)" : "none")};
  pointer-events: ${(p) => (p.$inactive ? "none" : "auto")};
  transition:
    opacity 0.2s,
    filter 0.2s;
`;

const OverlayBadge = styled.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
  z-index: 3;
`;

const ScoreHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 0 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
`;

const ScoreItem = styled.span`
  white-space: nowrap;
`;

const Spacer = styled.span`
  flex: 1;
`;

const SpeciesDotsContainer = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const SpeciesDot = styled.span<{ $caught: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$caught ? "#48aff0" : "rgba(255, 255, 255, 0.1)")};
  transition: background 0.3s;
`;

/* ── Scene ──────────────────────────────────────────────────────── */

const SceneContainer = styled.div`
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
`;

const Sky = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(
    180deg,
    rgba(10, 15, 30, 0.8) 0%,
    rgba(20, 35, 60, 0.5) 100%
  );
`;

const WaterDiv = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    90deg,
    rgba(20, 50, 80, 0.4) 0%,
    rgba(30, 70, 100, 0.5) 25%,
    rgba(20, 50, 80, 0.4) 50%,
    rgba(30, 70, 100, 0.5) 75%,
    rgba(20, 50, 80, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: ${waterWave} 8s linear infinite;
`;

const WaterLine = styled.div`
  position: absolute;
  top: 55%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(72, 175, 240, 0.15);
`;

const Dock = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 18%;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(80, 55, 30, 0.3) 0%,
    rgba(60, 40, 20, 0.4) 100%
  );
  border-right: 2px solid rgba(80, 55, 30, 0.25);
  z-index: 1;
`;

const DockPlanks = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 18%;
  height: 50%;
  z-index: 2;
  /* Plank lines */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(80, 55, 30, 0.2);
  }
  &::before {
    top: 33%;
  }
  &::after {
    top: 66%;
  }
`;

const RodGroup = styled.div<{ $shake: boolean }>`
  position: absolute;
  top: 10px;
  left: 14%;
  transform-origin: bottom center;
  transition: transform 0.08s ease-out;
  z-index: 3;
  ${(p) =>
    p.$shake &&
    css`
      animation: ${rodShake} 0.4s ease;
    `}
`;

/** Bobber: position fully driven in JS so the SVG line can track every animated frame.
 *  Only discrete state stays as a styled-component prop. */
const BobberCircle = styled.div<{ $phase: GamePhase }>`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f29e02;
  transform: translate(-50%, -50%);

  ${(p) =>
    p.$phase === "IDLE" &&
    css`
      opacity: 0;
    `}
  ${(p) =>
    (p.$phase === "FIGHT" ||
      p.$phase === "CATCH" ||
      p.$phase === "ESCAPE" ||
      p.$phase === "SNAP") &&
    css`
      box-shadow: 0 0 6px rgba(242, 158, 2, 0.3);
    `}
`;

const LineSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`;

const CastTargetEl = styled.div`
  position: absolute;
  top: 52%;
  width: 16px;
  height: 5px;
  border: 1px solid rgba(242, 158, 2, 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
`;

/** Pond fish — only $interested/$hidden are styled-component props (discrete states).
 *  Position, size, and facing are passed via inline style to avoid class explosion. */
const PondFishEl = styled.div<{ $interested: boolean; $hidden: boolean }>`
  position: absolute;
  transition: opacity 0.4s ease;
  opacity: ${(p) => (p.$hidden ? 0 : p.$interested ? 0.85 : 0.4)};
  pointer-events: none;
  z-index: 1;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p) =>
      p.$interested
        ? "rgba(255, 180, 100, 0.75)"
        : "rgba(150, 180, 200, 0.55)"};
    border-radius: 60% 25% 25% 60%;
  }
  &::after {
    content: "";
    position: absolute;
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: 4px solid
      ${(p) =>
        p.$interested
          ? "rgba(255, 180, 100, 0.75)"
          : "rgba(150, 180, 200, 0.55)"};
  }
`;

/* ── Middle zone ────────────────────────────────────────────────── */

const MiddleZone = styled.div`
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FishLabel = styled.div<{ $anim?: "celebrate" | "snap" | "escape" }>`
  font-size: 16px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  text-align: center;
  ${(p) =>
    p.$anim === "celebrate" &&
    css`
      animation: ${catchCelebrate} 0.5s ease;
      color: #00e050;
    `}
  ${(p) =>
    p.$anim === "snap" &&
    css`
      animation: ${snapAnim} 0.4s ease;
      color: #ff3030;
    `}
  ${(p) =>
    p.$anim === "escape" &&
    css`
      animation: ${fadeInUp} 0.3s ease;
      color: rgba(191, 204, 214, 0.5);
    `}
`;

const FishWeight = styled.div`
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.45);
  margin-top: 2px;
`;

const IdleHint = styled.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.6);
  text-align: center;
  line-height: 1.6;
  max-width: 320px;
`;

/* ── Depth gauge ───────────────────────────────────────────────── */

const DepthGaugeContainer = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 400px;
  margin: 8px 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.2s;
`;

const DepthGaugeLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 3px;
`;

const DepthTrack = styled.div`
  position: relative;
  width: 100%;
  height: 28px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
`;

const CatchZone = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  height: 100%;
  background: ${(p) =>
    p.$active ? "rgba(0, 200, 80, 0.2)" : "rgba(72, 175, 240, 0.12)"};
  border-left: 2px solid
    ${(p) => (p.$active ? "rgba(0, 200, 80, 0.5)" : "rgba(72, 175, 240, 0.25)")};
  border-right: 2px solid
    ${(p) => (p.$active ? "rgba(0, 200, 80, 0.5)" : "rgba(72, 175, 240, 0.25)")};
  transition:
    background 0.15s,
    border-color 0.15s;
`;

const FishMarker = styled.div<{ $thrashing: boolean }>`
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${(p) => (p.$thrashing ? "#ff6030" : "#f29e02")};
    box-shadow: 0 0
      ${(p) =>
        p.$thrashing
          ? "8px rgba(255, 96, 48, 0.6)"
          : "4px rgba(242, 158, 2, 0.4)"};
    transition: background 0.1s;
  }
`;

/* ── Progress & tension bars ───────────────────────────────────── */

const BarsRow = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.2s;
`;

const BarContainer = styled.div`
  width: 100%;
`;

const BarLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`;

const BarTrack = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  overflow: hidden;
`;

const BarFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px 0 0 3px;
  transition: background 0.15s;
  opacity: 0.7;
`;

const BarValue = styled.span`
  font-size: 10px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.4);
`;

/* ── Bottom area ────────────────────────────────────────────────── */

const PromptText = styled.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.45);
  text-align: center;
  margin-top: 12px;
  animation: ${pulse} 2.5s ease-in-out infinite;
  min-height: 21px;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 11px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.35);
  justify-content: center;
  flex-wrap: wrap;
`;

/* ── Rod SVG ────────────────────────────────────────────────────── */

const RodSvg: React.FC = () => (
  <svg width="60" height="110" viewBox="0 0 60 110" fill="none">
    <line
      x1="30"
      y1="100"
      x2="30"
      y2="10"
      stroke="rgba(191, 204, 214, 0.35)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="30"
      y1="10"
      x2="30"
      y2="2"
      stroke="rgba(191, 204, 214, 0.2)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="30"
      cy="82"
      r="6"
      stroke="rgba(191, 204, 214, 0.25)"
      strokeWidth="1.5"
      fill="rgba(191, 204, 214, 0.05)"
    />
    <line
      x1="36"
      y1="82"
      x2="42"
      y2="82"
      stroke="rgba(191, 204, 214, 0.2)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="30"
      cy="30"
      r="2"
      stroke="rgba(191, 204, 214, 0.15)"
      strokeWidth="1"
      fill="none"
    />
    <circle
      cx="30"
      cy="55"
      r="2.5"
      stroke="rgba(191, 204, 214, 0.15)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

/* ── Component ─────────────────────────────────────────────────── */

const FishingPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const stateRef = useRef(state);

  const fightLoopRef = useRef<number>(0);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const hookTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const resultTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const prevPhaseRef = useRef<GamePhase>("IDLE");
  const flashIntervalRef = useRef<ReturnType<typeof setInterval>>();

  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneWidth, setSceneWidth] = useState(800);
  const biteStartRef = useRef(0);
  const castStartRef = useRef(0);
  const catchStartRef = useRef(0);
  const retrieveStartRef = useRef(0);
  const retrieveFromXRef = useRef(0.5);
  const retrieveFromYRef = useRef(53);
  const tiltBufferRef = useRef<TiltSample[]>([]);
  const preBiteFishRef = useRef<Fish | null>(null);

  const pondFishRef = useRef<PondFish[]>([]);
  if (pondFishRef.current.length === 0) {
    for (let i = 0; i < 5; i++) {
      pondFishRef.current.push({
        id: i,
        x: 0.5 + Math.random() * 0.5,
        y: 0.25 + Math.random() * 0.55,
        vx: -(0.04 + Math.random() * 0.06),
        size: 0.7 + Math.random() * 0.5,
        facing: -1,
        interested: false,
        bobX: Math.random() * Math.PI * 2,
        hidden: false,
        respawnAt: 0,
      });
    }
  }
  const [pondTick, setPondTick] = useState(0);
  void pondTick; // tick triggers re-render; values read from pondFishRef

  stateRef.current = state;

  // Track connection
  useEffect(() => {
    if (!controller?.connection) return;
    const handler = () => setConnected(!!controller.connection.state);
    handler();
    controller.connection.on("change", handler);
    return () => {
      controller.connection.removeListener("change", handler);
    };
  }, [controller]);

  // R2 trigger position
  useEffect(() => {
    if (!controller?.right?.trigger) return;
    const handler = () => {
      dispatch({ type: "UPDATE_R2", pos: controller.right.trigger.state });
    };
    controller.right.trigger.on("change", handler);
    return () => {
      controller.right.trigger.removeListener("change", handler);
    };
  }, [controller]);

  // Cross button handler
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "IDLE") {
        const t = getBufferedTilt(tiltBufferRef.current, 500);
        dispatch({ type: "CAST", bobberX: getBobberXFromTilt(t) });
      } else if (phase === "BITE") dispatch({ type: "HOOK" });
    };
    controller.cross.on("press", handler);
    return () => {
      controller.cross.off("press", handler);
    };
  }, [controller]);

  // Shake-to-cast AND shake-to-hook
  // Delay shake polling during BITE so the bite rumble doesn't
  // immediately trigger the ShakeDetector and auto-hook the fish.
  useEffect(() => {
    if (!controller?.shake) return;
    if (state.phase !== "IDLE" && state.phase !== "BITE") return;
    let raf: number;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    const poll = () => {
      const { phase } = stateRef.current;
      if (phase !== "IDLE" && phase !== "BITE") return;
      if (controller.shake.active && controller.shake.intensity > 0.3) {
        if (phase === "IDLE") {
          const t = getBufferedTilt(tiltBufferRef.current, 500);
          dispatch({ type: "CAST", bobberX: getBobberXFromTilt(t) });
        } else if (phase === "BITE") dispatch({ type: "HOOK" });
      } else {
        raf = requestAnimationFrame(poll);
      }
    };
    if (state.phase === "BITE") {
      // Wait for bite rumble to settle before listening for shakes
      delayTimer = setTimeout(() => {
        raf = requestAnimationFrame(poll);
      }, 400);
    } else {
      raf = requestAnimationFrame(poll);
    }
    return () => {
      cancelAnimationFrame(raf);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [controller, state.phase]);

  // Orientation polling — throttled, only dispatches on meaningful change
  useEffect(() => {
    if (!controller?.orientation) return;
    let raf: number;
    let running = true;
    let frame = 0;
    const poll = () => {
      if (!running) return;
      // Poll at ~15fps instead of 60fps
      frame++;
      if (frame % 4 === 0) {
        const roll = controller.orientation.roll;
        dispatch({ type: "UPDATE_TILT", pitch: roll });
        const normalized = clamp(roll / (Math.PI / 4), -1, 1);
        tiltBufferRef.current.push({
          time: performance.now(),
          value: normalized,
        });
        if (tiltBufferRef.current.length > 30) tiltBufferRef.current.shift();
      }
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [controller]);

  // Track scene width for accurate rod-tip projection
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    setSceneWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setSceneWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Ambient pond fish animation — runs continuously, throttled rerenders
  useEffect(() => {
    let raf: number;
    let lastT = performance.now();
    let lastRender = lastT;
    const animate = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const phase = stateRef.current.phase;
      const bobberX = stateRef.current.bobberX;
      for (const f of pondFishRef.current) {
        // Respawn hidden fish from the right edge after their timer
        if (f.hidden) {
          if (f.respawnAt > 0 && t > f.respawnAt) {
            f.hidden = false;
            f.x = 1.02;
            f.y = 0.25 + Math.random() * 0.55;
            f.vx = -(0.04 + Math.random() * 0.06);
            f.size = 0.7 + Math.random() * 0.5;
            f.facing = -1;
            f.respawnAt = 0;
          }
          continue;
        }
        if (f.interested && phase === "WAIT") {
          // Approach bobber, then hover quietly when close
          const dx = bobberX - f.x;
          const dist = Math.abs(dx);
          const HOVER = 0.025;
          if (dist > HOVER) {
            const speed = Math.min(0.18, dist * 0.4);
            f.vx = Math.sign(dx) * speed;
            f.facing = f.vx >= 0 ? 1 : -1;
            f.x += f.vx * dt;
            f.y = Math.max(0.1, f.y - dt * 0.15);
          } else {
            f.vx *= 0.6;
            f.x += f.vx * dt;
            f.y = Math.max(0.09, f.y - dt * 0.05);
            f.y += Math.sin(t * 0.003 + f.bobX) * dt * 0.015;
          }
        } else if (f.interested && phase === "BITE") {
          const dx = bobberX - f.x;
          f.vx = Math.sign(dx || 1) * 0.6;
          f.facing = f.vx >= 0 ? 1 : -1;
          f.x += f.vx * dt;
          f.y += (0.04 - f.y) * dt * 8;
        } else {
          // Ambient swim — enter from right, can leave via right
          f.x += f.vx * dt;
          if (f.x < 0.22) {
            f.x = 0.22;
            f.vx = Math.abs(f.vx);
            f.facing = 1;
          }
          if (f.x > 1.02) {
            f.hidden = true;
            f.respawnAt = t + 3000 + Math.random() * 5000;
            continue;
          }
          // Random direction changes — occasionally head back out
          if (Math.random() < 0.4 * dt) {
            f.vx = -f.vx;
            f.facing = f.vx >= 0 ? 1 : -1;
          }
          f.y += Math.sin(t * 0.0008 + f.bobX) * dt * 0.04;
          f.y = Math.max(0.18, Math.min(0.85, f.y));
        }
      }
      // 30fps re-render — smooth bobber + line tracking
      if (t - lastRender > 33) {
        lastRender = t;
        setPondTick((p) => (p + 1) % 1000000);
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // On WAIT entry: pre-pick the species (for shadow scale) and mark closest fish.
  // On BITE: lurch then hide. On IDLE: respawn hidden fish from the right edge.
  useEffect(() => {
    const phase = state.phase;
    if (phase === "WAIT") {
      const s = stateRef.current;
      const fish = pickFish(s.caught, s.bobberX);
      preBiteFishRef.current = fish;

      const bobberX = s.bobberX;
      let chosen: PondFish | undefined;
      let best = Infinity;
      for (const f of pondFishRef.current) {
        if (f.hidden) continue;
        const d = Math.abs(f.x - bobberX);
        if (d < best) {
          best = d;
          chosen = f;
        }
      }
      if (chosen) {
        chosen.interested = true;
        chosen.size = SPECIES_SHADOW_SCALE[speciesKeyOf(fish.species)] ?? 1;
      }
    } else if (phase === "BITE") {
      biteStartRef.current = performance.now();
      const t = setTimeout(() => {
        for (const f of pondFishRef.current) {
          if (f.interested) {
            f.hidden = true;
            f.interested = false;
            f.respawnAt = performance.now() + 4000 + Math.random() * 3000;
          }
        }
      }, 220);
      return () => clearTimeout(t);
    } else if (phase === "IDLE") {
      for (const f of pondFishRef.current) {
        if (f.hidden && f.respawnAt === 0) {
          f.respawnAt = performance.now() + 1000 + Math.random() * 2000;
        }
        f.interested = false;
      }
    } else if (phase === "ESCAPE" || phase === "SNAP" || phase === "CATCH") {
      if (phase === "CATCH") catchStartRef.current = performance.now();
      if (phase === "ESCAPE" || phase === "SNAP") {
        // Snapshot the bobber's current rendered position so the rod can reel
        // it back smoothly from wherever it was at the moment of failure.
        const s = stateRef.current;
        const DOCK_EDGE_X = 0.2;
        retrieveFromXRef.current =
          s.bobberX + (DOCK_EDGE_X - s.bobberX) * s.fightState.catchProgress;
        retrieveFromYRef.current = 55 + s.fightState.fishPos * 35;
        retrieveStartRef.current = performance.now();
      }
      for (const f of pondFishRef.current) f.interested = false;
    } else if (phase === "CAST") {
      castStartRef.current = performance.now();
    }
  }, [state.phase]);

  // CAST → WAIT
  useEffect(() => {
    if (state.phase !== "CAST") return;
    const t = setTimeout(() => dispatch({ type: "START_WAIT" }), 800);
    return () => clearTimeout(t);
  }, [state.phase]);

  // WAIT → BITE
  useEffect(() => {
    if (state.phase !== "WAIT") return;
    const duration = getWaitDuration(state.rodTilt);
    waitTimerRef.current = setTimeout(() => {
      const fish =
        preBiteFishRef.current ??
        pickFish(stateRef.current.caught, stateRef.current.bobberX);
      dispatch({ type: "BITE", fish });
    }, duration);
    return () => {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, [state.phase]);

  // BITE → ESCAPE if not hooked
  useEffect(() => {
    if (state.phase !== "BITE" || !state.fish) return;
    hookTimerRef.current = setTimeout(() => {
      dispatch({ type: "ESCAPE" });
    }, state.fish.species.hookWindow);
    return () => {
      if (hookTimerRef.current) clearTimeout(hookTimerRef.current);
    };
  }, [state.phase, state.fish]);

  // ── Fight loop with integrated controller outputs ────────────
  // All fight-time HID writes (trigger, lightbar, rumble) happen here
  // instead of in separate useEffects. This avoids React running
  // multiple effect cleanup/setup cycles 30× per second.
  useEffect(() => {
    if (state.phase !== "FIGHT" || !controller) return;
    controller.mute?.setLed(MuteLedMode.On);
    let lastTime = performance.now();
    let lastTriggerUpdate = 0;
    let lastLightbarUpdate = 0;
    let lastRumbleUpdate = 0;
    let prevVelSign = 0;
    let pulseUntil = 0;
    const VEL_FLIP_THRESHOLD = 0.15;
    const PULSE_MS = 180;
    const TICK = 1000 / 30;
    let accum = 0;

    const loop = (now: number) => {
      accum += now - lastTime;
      lastTime = now;
      while (accum >= TICK) {
        dispatch({ type: "FIGHT_TICK", dt: 1 / 30 });
        accum -= TICK;
      }

      // Read latest state from ref (avoids stale closure)
      const s = stateRef.current;
      if (s.phase !== "FIGHT" || !s.fish) {
        fightLoopRef.current = requestAnimationFrame(loop);
        return;
      }
      const { fightState: f, r2Position } = s;
      const fish = s.fish.species;

      // Trigger effect (~10/sec)
      if (now - lastTriggerUpdate > 50) {
        lastTriggerUpdate = now;
        const effect = getFightTriggerEffect(
          fish,
          f.isThrashing,
          r2Position,
          f.elapsed,
        );
        controller.right?.trigger?.feedback?.set(effect);
      }

      // Lightbar (~10/sec)
      if (now - lastLightbarUpdate > 100) {
        lastLightbarUpdate = now;
        const color = getTensionColor(f.tension);
        if (f.tension >= 0.85) {
          // Flash: alternate based on time
          const flash = Math.floor(now / 200) % 2 === 0;
          controller.lightbar?.set(flash ? color : { r: 0, g: 0, b: 0 });
        } else {
          controller.lightbar?.set(color);
        }
      }

      // Detect fish direction change → pulse left rumble immediately
      if (Math.abs(f.fishVel) > VEL_FLIP_THRESHOLD) {
        const sign = f.fishVel > 0 ? 1 : -1;
        if (prevVelSign !== 0 && sign !== prevVelSign) {
          pulseUntil = now + PULSE_MS;
          const pulseStrength = Math.min(1, 0.55 + 0.35 * fish.strength);
          controller.left?.rumble(pulseStrength);
          lastRumbleUpdate = now;
        }
        prevVelSign = sign;
      }

      // Rumble (~10/sec) — right = ambient tension, left = thrash/direction pulse
      if (now - lastRumbleUpdate > 100) {
        lastRumbleUpdate = now;
        controller.right?.rumble(0.15 * f.tension);
        if (now < pulseUntil) {
          const pulseStrength = Math.min(1, 0.55 + 0.35 * fish.strength);
          controller.left?.rumble(pulseStrength);
        } else {
          controller.left?.rumble(
            f.isThrashing ? 0.5 * f.tension : 0.1 * f.tension,
          );
        }
      }

      fightLoopRef.current = requestAnimationFrame(loop);
    };
    fightLoopRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(fightLoopRef.current);
      // Reset outputs when leaving fight
      controller.right?.trigger?.feedback?.reset();
      controller.left?.rumble(0);
      controller.right?.rumble(0);
      controller.mute?.resetLed();
    };
  }, [state.phase, controller]);

  // Trigger effect during non-fight phases
  useEffect(() => {
    if (!controller?.right?.trigger?.feedback) return;
    if (state.phase === "FIGHT") return; // handled by fight loop
    if (state.phase === "CAST" || state.phase === "WAIT") {
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position: 0.2,
        strength: 0.15,
      });
    } else {
      controller.right.trigger.feedback.reset();
    }
  }, [controller, state.phase]);

  // Lightbar for non-fight phases
  useEffect(() => {
    if (!controller?.lightbar) return;
    if (state.phase === "FIGHT") return; // handled by fight loop
    if (state.phase === "CATCH")
      controller.lightbar.set({ r: 0, g: 255, b: 80 });
    else if (state.phase === "SNAP")
      controller.lightbar.set({ r: 255, g: 20, b: 20 });
    else if (state.phase === "ESCAPE")
      controller.lightbar.set({ r: 80, g: 80, b: 100 });
    else controller.lightbar.set({ r: 0, g: 40, b: 100 });
  }, [controller, state.phase]);

  // ── Phase transition audio & haptics ──────────────────────────
  // Use prevPhaseRef to detect transitions and fire one-shot effects.
  useEffect(() => {
    if (!controller) return;
    const prev = prevPhaseRef.current;
    const curr = state.phase;
    prevPhaseRef.current = curr;
    if (prev === curr) return;

    if (curr === "BITE") {
      controller.right?.rumble(0.6);
      controller.left?.rumble(0.3);
      playBiteSound(controller);
      const t = setTimeout(() => {
        controller.right?.rumble(0);
        controller.left?.rumble(0);
      }, 200);
      return () => {
        clearTimeout(t);
        controller.right?.rumble(0);
        controller.left?.rumble(0);
      };
    }
    if (curr === "CATCH") {
      controller.left?.rumble(0.4);
      controller.right?.rumble(0.4);
      playCatchSound(controller);
      const t = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 200);
      return () => clearTimeout(t);
    }
    if (curr === "SNAP") {
      controller.left?.rumble(0.8);
      controller.right?.rumble(0);
      controller.mute?.setLed(MuteLedMode.Pulse);
      playSnapSound(controller);
      const t1 = setTimeout(() => controller.left?.rumble(0), 300);
      const t2 = setTimeout(() => controller.mute?.resetLed(), 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (curr === "ESCAPE") {
      controller.right?.rumble(0.2);
      playEscapeSound(controller);
      const t = setTimeout(() => controller.right?.rumble(0), 100);
      return () => clearTimeout(t);
    }
  }, [controller, state.phase]);

  // Player LEDs — one per species caught
  useEffect(() => {
    if (!controller?.playerLeds) return;
    for (const [key, idx] of Object.entries(SPECIES_LED_MAP)) {
      controller.playerLeds.setLed(
        idx,
        state.speciesCaught.has(SPECIES[key].name),
      );
    }
  }, [controller, state.speciesCaught]);

  // Auto-return to IDLE after result phases
  useEffect(() => {
    if (
      state.phase !== "CATCH" &&
      state.phase !== "SNAP" &&
      state.phase !== "ESCAPE"
    )
      return;
    resultTimerRef.current = setTimeout(
      () => dispatch({ type: "RETURN_TO_IDLE" }),
      2000,
    );
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [state.phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controller?.right?.trigger?.feedback?.reset();
      controller?.left?.trigger?.feedback?.reset();
      controller?.left?.rumble(0);
      controller?.right?.rumble(0);
      controller?.lightbar?.set({ r: 0, g: 0, b: 255 });
      controller?.playerLeds?.clear();
      controller?.mute?.resetLed();
      controller?.stopTestTone()?.catch(() => {});
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (hookTimerRef.current) clearTimeout(hookTimerRef.current);
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      cancelAnimationFrame(fightLoopRef.current);
      if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
    };
  }, [controller]);

  const inactive = !hasWebHID || !connected;
  const overlayMsg = !hasWebHID
    ? "Requires WebHID (Chrome, Edge, Opera)"
    : !connected
      ? "Connect a controller to play"
      : null;

  const showFightUI = state.phase === "FIGHT";
  const hasAnyActivity =
    state.caught > 0 || state.linesSnapped > 0 || state.escaped > 0;

  const playerPos = state.r2Position;
  const zoneLeft = clamp(playerPos - CATCH_ZONE_HALF);
  const zoneRight = clamp(playerPos + CATCH_ZONE_HALF);
  const zoneWidth = zoneRight - zoneLeft;
  const fishInZone =
    showFightUI &&
    Math.abs(state.fightState.fishPos - playerPos) <= CATCH_ZONE_HALF;

  // Bobber Y during fight — follows fish position
  const bobberFightY = state.fightState.fishPos;

  // Rod-tip position (projected from rod pivot through current tilt).
  // Pivot is the bottom-center of the rod SVG: scene X = 14% width, Y = 120px from top
  // (RodGroup top:10 + rod height 110). Tip is the top of the rod (110 - 2 = 108px above pivot).
  const ROD_LENGTH_PX = 108;
  const ROD_PIVOT_X_PCT = 14;
  const ROD_PIVOT_Y_PX = 120;
  const SCENE_HEIGHT_PX = 240;
  // During CAST, add a brief extra rotation to the right (no lateral translation).
  // Driven in JS so the line endpoint stays glued to the rod tip.
  let castRotationDeg = 0;
  if (state.phase === "CAST") {
    const t = Math.min(1, (performance.now() - castStartRef.current) / 700);
    const peak = 22; // degrees of extra swing to the right
    if (t < 0.3) {
      castRotationDeg = (t / 0.3) * peak;
    } else {
      const sub = (t - 0.3) / 0.7;
      castRotationDeg = peak * (1 - sub * sub);
    }
  }
  const totalRodAngleDeg = state.rodTilt * 15 + castRotationDeg;
  const tiltRad = (totalRodAngleDeg * Math.PI) / 180;
  const tipDxPx = ROD_LENGTH_PX * Math.sin(tiltRad);
  const tipDyPx = -ROD_LENGTH_PX * Math.cos(tiltRad);
  const rodTipX = ROD_PIVOT_X_PCT + (tipDxPx / sceneWidth) * 100;
  const rodTipY = ((ROD_PIVOT_Y_PX + tipDyPx) / SCENE_HEIGHT_PX) * 100;

  // Bobber render position — driven entirely in JS so the line can track it.
  // Replaces the prior CSS keyframe animations for bobFloat/bobPlunge.
  const isFightLike =
    state.phase === "FIGHT" ||
    state.phase === "CATCH" ||
    state.phase === "ESCAPE" ||
    state.phase === "SNAP";
  const DOCK_EDGE_X = 0.2;
  const reelProgress = state.fightState.catchProgress;
  let bobberRenderX = state.bobberX;
  let bobberYPct = 53;
  const nowMs = performance.now();
  if (state.phase === "CAST") {
    // Arc from rod tip out to landing target
    const t = Math.min(1, (nowMs - castStartRef.current) / 800);
    const eased = 1 - (1 - t) * (1 - t);
    const startX = ROD_PIVOT_X_PCT / 100;
    bobberRenderX = startX + (state.bobberX - startX) * eased;
    bobberYPct = rodTipY + (53 - rodTipY) * t - 28 * Math.sin(Math.PI * t);
  } else if (state.phase === "WAIT") {
    bobberYPct = 53 + Math.sin((nowMs / 2000) * Math.PI * 2) * 1.2;
  } else if (state.phase === "BITE") {
    const elapsed = nowMs - biteStartRef.current;
    const t = Math.min(1, Math.max(0, elapsed / 300));
    const eased = 1 - (1 - t) * (1 - t);
    bobberYPct = 53 + eased * 7;
  } else if (state.phase === "CATCH") {
    // Flick out of the water: arc from dock edge up to rod tip area
    const t = Math.min(1, (nowMs - catchStartRef.current) / 600);
    const eased = 1 - (1 - t) * (1 - t);
    const startX = DOCK_EDGE_X;
    const endX = ROD_PIVOT_X_PCT / 100;
    bobberRenderX = startX + (endX - startX) * eased;
    bobberYPct = 53 + (rodTipY - 53) * eased - 22 * Math.sin(Math.PI * t);
  } else if (state.phase === "ESCAPE" || state.phase === "SNAP") {
    // Reel the bobber back from wherever it failed: lift to surface, then arc to rod
    const t = Math.min(1, (nowMs - retrieveStartRef.current) / 900);
    const startX = retrieveFromXRef.current;
    const startY = retrieveFromYRef.current;
    const endX = ROD_PIVOT_X_PCT / 100;
    const endY = rodTipY;
    const surfaceY = 53;
    const easedX = 1 - (1 - t) * (1 - t);
    bobberRenderX = startX + (endX - startX) * easedX;
    if (t < 0.4) {
      const sub = t / 0.4;
      bobberYPct = startY + (surfaceY - startY) * sub;
    } else {
      const sub = (t - 0.4) / 0.6;
      const subEased = 1 - (1 - sub) * (1 - sub);
      bobberYPct =
        surfaceY + (endY - surfaceY) * subEased - 12 * Math.sin(Math.PI * sub);
    }
  } else if (isFightLike) {
    bobberYPct = 55 + bobberFightY * 35;
    bobberRenderX =
      state.bobberX + (DOCK_EDGE_X - state.bobberX) * reelProgress;
  }
  const bobberXPct = bobberRenderX * 100;
  const lineVisible = state.phase !== "IDLE";
  // Bezier control point: midpoint X, sags below the lower of the two endpoints
  const midX = (rodTipX + bobberXPct) / 2;
  const sagY = Math.max(rodTipY, bobberYPct) + 15;
  const linePath = `M ${rodTipX} ${rodTipY} Q ${midX} ${sagY} ${bobberXPct} ${bobberYPct}`;

  const prompt = (() => {
    switch (state.phase) {
      case "IDLE":
        return "Flick controller to cast \u2014 or press \u2715";
      case "CAST":
        return "Casting...";
      case "WAIT":
        return "Waiting for a bite...";
      case "BITE":
        return "Flick or press \u2715 to hook!";
      case "FIGHT":
        return "Track the fish with R2!";
      case "CATCH":
        return state.fish ? `${state.fish.species.name} caught!` : "Caught!";
      case "SNAP":
        return "Line snapped!";
      case "ESCAPE":
        return "It got away...";
      default:
        return "\u00a0";
    }
  })();

  return (
    <PageContainer>
      <Header>
        <PageTitle>Fishing</PageTitle>
        <PageSubtitle>Reel them in!</PageSubtitle>
      </Header>

      <GameArea>
        {overlayMsg && (
          <NoControllerOverlay>
            <OverlayBadge>{overlayMsg}</OverlayBadge>
          </NoControllerOverlay>
        )}
        <OverlayContent $inactive={inactive}>
          <ScoreHeader>
            <ScoreItem>Score {state.score}</ScoreItem>
            <ScoreItem>Caught {state.caught}</ScoreItem>
            <Spacer />
            <SpeciesDotsContainer title="Species collected">
              {SPECIES_KEYS.map((key) => (
                <SpeciesDot
                  key={key}
                  $caught={state.speciesCaught.has(SPECIES[key].name)}
                />
              ))}
            </SpeciesDotsContainer>
          </ScoreHeader>

          <SceneContainer ref={sceneRef}>
            <Sky />
            <WaterDiv />
            <WaterLine />
            {state.phase === "IDLE" && (
              <CastTargetEl
                style={{ left: `${getCastTargetX(state.rodTilt) * 100}%` }}
              />
            )}
            <Dock />
            <DockPlanks />
            {pondFishRef.current.map((f) => (
              <PondFishEl
                key={f.id}
                $interested={f.interested}
                $hidden={f.hidden}
                style={{
                  left: `${f.x * 100}%`,
                  top: `${56 + f.y * 40}%`,
                  width: `${14 * f.size}px`,
                  height: `${6 * f.size}px`,
                  transform: `translate(-50%, -50%) scaleX(${f.facing})`,
                }}
              />
            ))}
            <RodGroup
              $shake={state.phase === "BITE"}
              style={{
                transform: `translateX(-50%) rotate(${totalRodAngleDeg}deg)`,
              }}
            >
              <RodSvg />
            </RodGroup>
            <LineSvg viewBox="0 0 100 100" preserveAspectRatio="none">
              {lineVisible && (
                <path
                  d={linePath}
                  stroke="rgba(191, 204, 214, 0.15)"
                  strokeWidth="0.3"
                  fill="none"
                />
              )}
            </LineSvg>
            <BobberCircle
              $phase={state.phase}
              style={{
                left: `${bobberXPct}%`,
                top: `${bobberYPct}%`,
              }}
            />
          </SceneContainer>

          <MiddleZone>
            {state.phase === "IDLE" && (
              <IdleHint>
                Cast your line and wait for a bite.
                <br />
                Aim by tilting the controller.
                <br />
                Track the fish with R2.
              </IdleHint>
            )}
            {state.phase === "FIGHT" && state.fish && (
              <>
                <FishLabel>{state.fish.species.name}</FishLabel>
                <FishWeight>{state.fish.weight} kg</FishWeight>
              </>
            )}
            {state.phase === "CATCH" && state.fish && (
              <>
                <FishLabel $anim="celebrate">
                  {state.fish.species.name}
                </FishLabel>
                <FishWeight>
                  {state.fish.weight} kg &middot; +{state.fish.species.points}
                </FishWeight>
              </>
            )}
            {state.phase === "SNAP" && (
              <FishLabel $anim="snap">Line snapped!</FishLabel>
            )}
            {state.phase === "ESCAPE" && (
              <FishLabel $anim="escape">It got away...</FishLabel>
            )}
            {(state.phase === "CAST" ||
              state.phase === "WAIT" ||
              state.phase === "BITE") && (
              <div style={{ opacity: 0 }}>&nbsp;</div>
            )}
          </MiddleZone>

          <DepthGaugeContainer $visible={showFightUI}>
            <DepthGaugeLabel>Depth</DepthGaugeLabel>
            <DepthTrack>
              <CatchZone
                $active={fishInZone}
                style={{
                  left: `${zoneLeft * 100}%`,
                  width: `${zoneWidth * 100}%`,
                }}
              />
              {showFightUI && (
                <FishMarker
                  $thrashing={state.fightState.isThrashing}
                  style={{ left: `${state.fightState.fishPos * 100}%` }}
                />
              )}
            </DepthTrack>
          </DepthGaugeContainer>

          <BarsRow $visible={showFightUI}>
            <BarContainer>
              <BarLabel>
                <span>Progress</span>
                <BarValue>
                  {Math.round(state.fightState.catchProgress * 100)}%
                </BarValue>
              </BarLabel>
              <BarTrack>
                <BarFill
                  style={{
                    width: `${state.fightState.catchProgress * 100}%`,
                    background: "rgba(0, 200, 80, 0.6)",
                  }}
                />
              </BarTrack>
            </BarContainer>
            <BarContainer>
              <BarLabel>
                <span>Tension</span>
                <BarValue>
                  {Math.round(state.fightState.tension * 100)}%
                </BarValue>
              </BarLabel>
              <BarTrack>
                <BarFill
                  style={{
                    width: `${state.fightState.tension * 100}%`,
                    background: getTensionCssColor(state.fightState.tension),
                  }}
                />
              </BarTrack>
            </BarContainer>
          </BarsRow>

          {!showFightUI && <div style={{ height: 82 }} />}

          <PromptText>{prompt}</PromptText>

          {hasAnyActivity && (
            <StatsRow>
              {state.biggestWeight > 0 && (
                <span>Best {state.biggestWeight} kg</span>
              )}
              {state.linesSnapped > 0 && (
                <span>Snapped {state.linesSnapped}</span>
              )}
              {state.escaped > 0 && <span>Escaped {state.escaped}</span>}
              {state.bestStreak > 1 && <span>Streak {state.bestStreak}</span>}
            </StatsRow>
          )}
        </OverlayContent>
      </GameArea>

      <DescriptionSection>
        <DescriptionHeading>Controller Features</DescriptionHeading>
        <FeatureList>
          <li><strong>Adaptive triggers</strong> &mdash; <code>TriggerEffect.Feedback</code> provides steady resistance during the reel, pulsing with the fish's pull. <code>TriggerEffect.Bow</code> fires during thrash events, snapping the trigger back and physically disrupting R2 position.</li>
          <li><strong>Trigger position</strong> &mdash; R2 analog position controls the catch zone on the depth gauge. The fight mechanic is built around physically maintaining trigger position against adaptive resistance.</li>
          <li><strong>Orientation (IMU)</strong> &mdash; Controller roll maps to rod tilt, which aims the cast target and determines bobber landing position. A 500ms tilt buffer prevents flick motion from corrupting the aimed position.</li>
          <li><strong>Shake detection</strong> &mdash; Flick to cast, flick to hook. A 400ms debounce after bite prevents rumble feedback from triggering a false hook.</li>
          <li><strong>Dual rumble</strong> &mdash; Right motor carries ambient tension under the trigger finger. Left motor pulses on fish direction changes and thrash events, scaled by species strength. Both fire one-shot patterns on bite, catch, snap, and escape.</li>
          <li><strong>Lightbar</strong> &mdash; Maps to tension color (green&rarr;yellow&rarr;red) during fight, flashes above 85%. Phase-specific colors on catch, snap, and escape.</li>
          <li><strong>Player LEDs</strong> &mdash; Each of the 5 LEDs corresponds to a species. LEDs light up as you complete your collection.</li>
          <li><strong>Speaker (test tones)</strong> &mdash; Short chirps via <code>startTestTone</code> / <code>stopTestTone</code> for bite, catch, snap, and escape feedback.</li>
          <li><strong>Mute LED</strong> &mdash; Enabled during the fight as a visual status indicator.</li>
        </FeatureList>

        <DescriptionHeading>Implementation Notes</DescriptionHeading>
        <p>The fight loop consolidates all high-frequency HID writes (trigger, lightbar, rumble) into a single <code>requestAnimationFrame</code> loop throttled to 30fps, avoiding the performance penalty of multiple React effects with rapidly-changing dependencies.</p>

        <CodeBlock code={`// Adaptive trigger: steady pull with "breathing" resistance
const pulse = Math.sin(elapsed * 2.5);
const strength = clamp(0.25 + fish.strength * 0.5 + pulse * 0.18);
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Feedback, position, strength
});

// Thrash: Bow effect drifts across player position
const drift = Math.sin(elapsed * 6) * 0.15;
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Bow,
  start, end, strength, snapForce
});`} />

        <p>Continuously-changing values (positions, widths, colors) are set via inline <code>style</code> rather than styled-component props to avoid class explosion in the stylesheet. Discrete state like phase and boolean flags stay as styled-component props.</p>

        <CodeBlock code={`// Buffered tilt: use position from 500ms ago to survive flick
const roll = controller.orientation.roll;
const normalized = clamp(roll / (Math.PI / 4), -1, 1);
tiltBuffer.push({ time: performance.now(), value: normalized });

// On cast, read the buffer instead of current tilt
const bufferedTilt = getBufferedTilt(tiltBuffer, 500);
const bobberX = getBobberXFromTilt(bufferedTilt);`} />

        <p>Cast distance biases species rarity &mdash; further casts into deeper water increase the odds of rare species, giving the tilt-aiming mechanic gameplay significance beyond aesthetics.</p>
      </DescriptionSection>
    </PageContainer>
  );
};

export default FishingPage;
