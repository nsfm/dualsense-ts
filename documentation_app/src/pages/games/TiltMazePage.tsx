import React, {
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";
import { TriggerEffect, MuteLedMode } from "dualsense-ts";
import type { Dualsense } from "dualsense-ts";
import { ControllerContext, hasWebHID } from "../../controller";
import { CodeBlock } from "../../components/ui/CodeBlock";

/* ── Types ──────────────────────────────────────────────────────── */

type GamePhase =
  | "TITLE"
  | "PLAYING"
  | "LEVEL_CLEAR"
  | "DEAD"
  | "GAME_OVER"
  | "VICTORY"
  | "PAUSED";

interface Vec2 {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Hole {
  x: number;
  y: number;
  r: number;
}

interface ParsedLevel {
  walls: Set<string>; // "col,row" keys for occupied cells
  wallCells: Array<{ col: number; row: number }>; // for rendering
  holes: Hole[];
  start: Vec2;
  goal: Vec2;
}

interface GameState {
  phase: GamePhase;
  prevPhase: GamePhase;
  levelIndex: number; // 0-based into LEVELS
  ball: Ball;
  lives: number;
  phaseTimer: number; // countdown seconds for LEVEL_CLEAR / DEAD
  deathProgress: number; // 0..1 for death animation
  neutralPitch: number; // reference for tilt subtraction
  neutralRoll: number;
  effectiveRoll: number; // latest applied-to-physics roll
  effectivePitch: number;
  wallHitAt: number; // performance.now() of last wall tap
  bestTimeMs: number; // overall best completion time across attempts
  elapsedMs: number; // current run elapsed time
  ballSpeed: number; // computed each tick for HID feedback
}

type GameAction =
  | { type: "START_GAME" }
  | {
      type: "TICK";
      dt: number;
      now: number;
      tiltPitch: number;
      tiltRoll: number;
      r2: number;
    }
  | { type: "RECENTER"; tiltPitch: number; tiltRoll: number }
  | { type: "SKIP_DEATH" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "RESTART" };

/* ── Constants ─────────────────────────────────────────────────── */

const ARENA_W = 520;
const ARENA_H = 400;
const CELL = 40;
const GRID_W = ARENA_W / CELL; // 13
const GRID_H = ARENA_H / CELL; // 10

const BALL_RADIUS = 7;
const GRAVITY = 1400; // px/s^2 at full tilt (clamped to ±π/4)
const FRICTION = 0.985; // per-frame at 60fps — heavy marble
const MAX_SPEED = 520; // px/s
const BOUNCE = 0.35; // wall collision restitution
const MAX_TILT = Math.PI / 4; // 45° saturation
const TILT_EPSILON = 0.04; // ignore micro-tilts (radians)
const BRAKE_FRICTION_MAX = 5.0; // friction multiplier at full R2

const HOLE_RADIUS = 12;
const GOAL_RADIUS = 16;
const STARTING_LIVES = 5;

const LEVEL_CLEAR_DURATION = 1.4;
const DEATH_DURATION = 1.0;

/* ── Level data ────────────────────────────────────────────────── */
// Grid is 13 cols × 10 rows. Legend:
//   '#' wall   '.' open   'o' hole   'S' start   'G' goal

const LEVELS: string[][] = [
  // Level 1 — Gentle zigzag, no hazards
  [
    "#############",
    "#S..........#",
    "#.#########.#",
    "#...........#",
    "#.#########.#",
    "#...........#",
    "#.#########.#",
    "#...........#",
    "#..........G#",
    "#############",
  ],
  // Level 2 — Tighter corridors, branching
  [
    "#############",
    "#S....#.....#",
    "#.###.#.###.#",
    "#.#.......#.#",
    "#.#.#####.#.#",
    "#...#.......#",
    "###.#.###.#.#",
    "#...#.#.#...#",
    "#.###.#.#..G#",
    "#############",
  ],
  // Level 3 — Holes introduced
  [
    "#############",
    "#S.......o..#",
    "#.#########.#",
    "#.....o.....#",
    "#.#######.#.#",
    "#.#.......#.#",
    "#.#.#####.#.#",
    "#...#.o.....#",
    "#.o.#......G#",
    "#############",
  ],
  // Level 4 — Dense hazards, pillars
  [
    "#############",
    "#S..o......o#",
    "#.#.#.###.#.#",
    "#...#...#...#",
    "#.#.###.###.#",
    "#.#...o.....#",
    "#.#.#####.#.#",
    "#.#.#...#.#o#",
    "#...o.#...#G#",
    "#############",
  ],
  // Level 5 — The gauntlet: narrow snaking path past many holes
  [
    "#############",
    "#S#.......#G#",
    "#.#.#####.#.#",
    "#.#.#o..#.#.#",
    "#...#.#.#.#.#",
    "###.###.#.#.#",
    "#..o....#.#.#",
    "#.#######.#.#",
    "#....o......#",
    "#############",
  ],
];

/* ── Pure functions ────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}

function parseLevel(lines: string[]): ParsedLevel {
  const walls = new Set<string>();
  const wallCells: Array<{ col: number; row: number }> = [];
  const holes: Hole[] = [];
  let start: Vec2 = { x: ARENA_W / 2, y: ARENA_H / 2 };
  let goal: Vec2 = { x: ARENA_W - CELL * 1.5, y: ARENA_H - CELL * 1.5 };

  for (let row = 0; row < Math.min(lines.length, GRID_H); row++) {
    const line = lines[row];
    for (let col = 0; col < Math.min(line.length, GRID_W); col++) {
      const ch = line[col];
      const cx = col * CELL + CELL / 2;
      const cy = row * CELL + CELL / 2;
      if (ch === "#") {
        walls.add(cellKey(col, row));
        wallCells.push({ col, row });
      } else if (ch === "o") {
        holes.push({ x: cx, y: cy, r: HOLE_RADIUS });
      } else if (ch === "S") {
        start = { x: cx, y: cy };
      } else if (ch === "G") {
        goal = { x: cx, y: cy };
      }
    }
  }

  return { walls, wallCells, holes, start, goal };
}

function isLevelSolvable(p: ParsedLevel): boolean {
  const sc = Math.floor(p.start.x / CELL);
  const sr = Math.floor(p.start.y / CELL);
  const gc = Math.floor(p.goal.x / CELL);
  const gr = Math.floor(p.goal.y / CELL);
  const seen = new Set<string>([cellKey(sc, sr)]);
  const queue: Array<[number, number]> = [[sc, sr]];
  while (queue.length) {
    const [c, r] = queue.shift()!;
    if (c === gc && r === gr) return true;
    for (const [dc, dr] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nc = c + dc;
      const nr = r + dr;
      if (nc < 0 || nc >= GRID_W || nr < 0 || nr >= GRID_H) continue;
      const k = cellKey(nc, nr);
      if (seen.has(k) || p.walls.has(k)) continue;
      seen.add(k);
      queue.push([nc, nr]);
    }
  }
  return false;
}

// Precompute all parsed levels once at module load, and flag any whose goal
// can't be reached from start — cell-level BFS, holes treated as passable.
const PARSED: ParsedLevel[] = LEVELS.map(parseLevel);
PARSED.forEach((p, i) => {
  if (!isLevelSolvable(p)) {
    console.error(
      `[Tilt Maze] Level ${i + 1} is unsolvable: goal unreachable from start.`,
    );
  }
});

function makeBallAt(p: Vec2): Ball {
  return { x: p.x, y: p.y, vx: 0, vy: 0 };
}

function resolveWallCollision(
  ball: Ball,
  walls: Set<string>,
): { hit: boolean } {
  let hit = false;
  // Check the 9 cells around the ball (center cell + 8 neighbors).
  const cc = Math.floor(ball.x / CELL);
  const cr = Math.floor(ball.y / CELL);
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const col = cc + dc;
      const row = cr + dr;
      if (!walls.has(cellKey(col, row))) continue;
      // Closest point on this cell's AABB to the ball center.
      const ax = col * CELL;
      const ay = row * CELL;
      const closestX = clamp(ball.x, ax, ax + CELL);
      const closestY = clamp(ball.y, ay, ay + CELL);
      const dx = ball.x - closestX;
      const dy = ball.y - closestY;
      const distSq = dx * dx + dy * dy;
      if (distSq < BALL_RADIUS * BALL_RADIUS) {
        hit = true;
        if (distSq === 0) {
          // Ball center inside the cell — push out along dominant axis.
          const leftPen = ball.x - ax;
          const rightPen = ax + CELL - ball.x;
          const topPen = ball.y - ay;
          const botPen = ay + CELL - ball.y;
          const minPen = Math.min(leftPen, rightPen, topPen, botPen);
          if (minPen === leftPen) {
            ball.x = ax - BALL_RADIUS;
            ball.vx = -Math.abs(ball.vx) * BOUNCE;
          } else if (minPen === rightPen) {
            ball.x = ax + CELL + BALL_RADIUS;
            ball.vx = Math.abs(ball.vx) * BOUNCE;
          } else if (minPen === topPen) {
            ball.y = ay - BALL_RADIUS;
            ball.vy = -Math.abs(ball.vy) * BOUNCE;
          } else {
            ball.y = ay + CELL + BALL_RADIUS;
            ball.vy = Math.abs(ball.vy) * BOUNCE;
          }
        } else {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = BALL_RADIUS - dist;
          ball.x += nx * overlap;
          ball.y += ny * overlap;
          // Reflect velocity along normal
          const vDotN = ball.vx * nx + ball.vy * ny;
          if (vDotN < 0) {
            ball.vx -= (1 + BOUNCE) * vDotN * nx;
            ball.vy -= (1 + BOUNCE) * vDotN * ny;
          }
        }
      }
    }
  }
  return { hit };
}

function nearestHoleEdgeDist(ball: Ball, holes: Hole[]): number {
  let nearest = Infinity;
  for (const h of holes) {
    const dx = h.x - ball.x;
    const dy = h.y - ball.y;
    const d = Math.sqrt(dx * dx + dy * dy) - h.r;
    if (d < nearest) nearest = d;
  }
  return nearest;
}

// Lightbar hue derived from tilt direction.
// tiltRoll > 0 → right (warm orange), < 0 → left (cool blue)
// tiltPitch > 0 → back (magenta), < 0 → forward (cyan-green)
function lightbarFromTilt(
  effectivePitch: number,
  effectiveRoll: number,
): { r: number; g: number; b: number } {
  const mag = Math.min(
    1,
    Math.sqrt(effectivePitch * effectivePitch + effectiveRoll * effectiveRoll) /
      MAX_TILT,
  );
  if (mag < 0.02) return { r: 20, g: 30, b: 60 };
  // Base color from 2D direction
  const rollN = clamp(effectiveRoll / MAX_TILT, -1, 1);
  const pitchN = clamp(effectivePitch / MAX_TILT, -1, 1);
  // Right: warm orange; Left: cool blue; Forward (pitch<0): teal; Back: magenta
  let r = 128 + rollN * 127 - pitchN * 40;
  let g = 128 - Math.abs(rollN) * 40 - pitchN * 40;
  let b = 128 - rollN * 127 + pitchN * 80;
  r = clamp(r, 10, 255);
  g = clamp(g, 10, 255);
  b = clamp(b, 10, 255);
  const scale = 0.3 + mag * 0.7;
  return {
    r: Math.round(r * scale),
    g: Math.round(g * scale),
    b: Math.round(b * scale),
  };
}

/* ── Audio (speaker test tones) ────────────────────────────────── */

function playClickSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 12);
}

function playThudSound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 140);
}

function playClearSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 80);
    }, 80);
  }, 60);
}

function playVictorySound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => {
        controller.stopTestTone().catch(() => {});
        setTimeout(() => {
          controller.startTestTone("speaker", "1khz").catch(() => {});
          setTimeout(() => controller.stopTestTone().catch(() => {}), 200);
        }, 60);
      }, 50);
    }, 50);
  }, 50);
}

/* ── Reducer ───────────────────────────────────────────────────── */

function makeInitialState(bestTimeMs = 0): GameState {
  const parsed = PARSED[0];
  return {
    phase: "TITLE",
    prevPhase: "TITLE",
    levelIndex: 0,
    ball: makeBallAt(parsed.start),
    lives: STARTING_LIVES,
    phaseTimer: 0,
    deathProgress: 0,
    neutralPitch: 0,
    neutralRoll: 0,
    effectivePitch: 0,
    effectiveRoll: 0,
    wallHitAt: 0,
    bestTimeMs,
    elapsedMs: 0,
    ballSpeed: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const parsed = PARSED[0];
      return {
        ...makeInitialState(state.bestTimeMs),
        phase: "PLAYING",
        levelIndex: 0,
        ball: makeBallAt(parsed.start),
        neutralPitch: state.neutralPitch,
        neutralRoll: state.neutralRoll,
      };
    }

    case "RESTART": {
      return {
        ...makeInitialState(state.bestTimeMs),
        neutralPitch: state.neutralPitch,
        neutralRoll: state.neutralRoll,
      };
    }

    case "RECENTER": {
      return {
        ...state,
        neutralPitch: action.tiltPitch,
        neutralRoll: action.tiltRoll,
      };
    }

    case "TOGGLE_PAUSE": {
      if (state.phase === "PLAYING") {
        return { ...state, phase: "PAUSED", prevPhase: "PLAYING" };
      }
      if (state.phase === "PAUSED") {
        return { ...state, phase: state.prevPhase, prevPhase: "PLAYING" };
      }
      return state;
    }

    case "SKIP_DEATH": {
      if (state.phase !== "DEAD") return state;
      if (state.lives <= 0) {
        return { ...state, phase: "GAME_OVER", phaseTimer: 0 };
      }
      const parsed = PARSED[state.levelIndex];
      return {
        ...state,
        phase: "PLAYING",
        phaseTimer: 0,
        deathProgress: 0,
        ball: makeBallAt(parsed.start),
      };
    }

    case "TICK": {
      if (state.phase === "TITLE" || state.phase === "GAME_OVER") return state;
      if (state.phase === "VICTORY" || state.phase === "PAUSED") return state;

      const { dt, now, tiltPitch, tiltRoll, r2 } = action;

      // Phase timers
      if (state.phase === "LEVEL_CLEAR") {
        const remaining = state.phaseTimer - dt;
        if (remaining <= 0) {
          const nextIndex = state.levelIndex + 1;
          if (nextIndex >= LEVELS.length) {
            const newBest =
              state.bestTimeMs === 0
                ? state.elapsedMs
                : Math.min(state.bestTimeMs, state.elapsedMs);
            return {
              ...state,
              phase: "VICTORY",
              phaseTimer: 0,
              bestTimeMs: newBest,
            };
          }
          const parsed = PARSED[nextIndex];
          return {
            ...state,
            phase: "PLAYING",
            phaseTimer: 0,
            levelIndex: nextIndex,
            ball: makeBallAt(parsed.start),
          };
        }
        return { ...state, phaseTimer: remaining };
      }

      if (state.phase === "DEAD") {
        const remaining = state.phaseTimer - dt;
        const deathProgress = Math.min(1, 1 - remaining / DEATH_DURATION);
        if (remaining <= 0) {
          if (state.lives <= 0) {
            return { ...state, phase: "GAME_OVER", phaseTimer: 0 };
          }
          const parsed = PARSED[state.levelIndex];
          return {
            ...state,
            phase: "PLAYING",
            phaseTimer: 0,
            deathProgress: 0,
            ball: makeBallAt(parsed.start),
          };
        }
        return { ...state, phaseTimer: remaining, deathProgress };
      }

      // PLAYING: physics
      const parsed = PARSED[state.levelIndex];

      // Effective tilt (relative to neutral), clamped to saturation
      const effPitch = clamp(
        tiltPitch - state.neutralPitch,
        -MAX_TILT,
        MAX_TILT,
      );
      const effRoll = clamp(tiltRoll - state.neutralRoll, -MAX_TILT, MAX_TILT);

      const ball: Ball = {
        x: state.ball.x,
        y: state.ball.y,
        vx: state.ball.vx,
        vy: state.ball.vy,
      };

      const tiltMag = Math.sqrt(effPitch * effPitch + effRoll * effRoll);
      if (tiltMag > TILT_EPSILON) {
        // DualSense tiltPitch>0 means "back tilt" (top toward player),
        // tiltRoll>0 means "right tilt" — these map directly to screen axes
        // if we interpret forward tilt as rolling the ball toward the top
        // of the screen (negative y). sin(pitch)<0 when pitch<0 (forward),
        // so gy = sin(pitch) * G naturally gives negative gy on forward tilt.
        const gx = -Math.sin(effRoll) * GRAVITY;
        const gy = Math.sin(effPitch) * GRAVITY;
        ball.vx += gx * dt;
        ball.vy += gy * dt;
      }

      // Friction, amplified by R2 brake
      const brake = 1 + clamp(r2, 0, 1) * (BRAKE_FRICTION_MAX - 1);
      const fric = Math.pow(FRICTION, brake * dt * 60);
      ball.vx *= fric;
      ball.vy *= fric;

      // Speed clamp
      const spd = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (spd > MAX_SPEED) {
        ball.vx = (ball.vx / spd) * MAX_SPEED;
        ball.vy = (ball.vy / spd) * MAX_SPEED;
      }

      // Integrate
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Wall collision (may adjust position and velocity)
      let wallHitAt = state.wallHitAt;
      const { hit } = resolveWallCollision(ball, parsed.walls);
      if (hit) wallHitAt = now;

      // Goal check
      const gdx = parsed.goal.x - ball.x;
      const gdy = parsed.goal.y - ball.y;
      if (gdx * gdx + gdy * gdy < GOAL_RADIUS * GOAL_RADIUS) {
        return {
          ...state,
          phase: "LEVEL_CLEAR",
          phaseTimer: LEVEL_CLEAR_DURATION,
          ball,
          wallHitAt,
          effectivePitch: effPitch,
          effectiveRoll: effRoll,
          elapsedMs: state.elapsedMs + dt * 1000,
          ballSpeed: Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy),
        };
      }

      // Hole check
      for (const h of parsed.holes) {
        const hdx = h.x - ball.x;
        const hdy = h.y - ball.y;
        if (hdx * hdx + hdy * hdy < h.r * h.r) {
          return {
            ...state,
            phase: "DEAD",
            phaseTimer: DEATH_DURATION,
            deathProgress: 0,
            lives: state.lives - 1,
            ball: { ...ball, x: h.x, y: h.y, vx: 0, vy: 0 },
            effectivePitch: effPitch,
            effectiveRoll: effRoll,
          };
        }
      }

      return {
        ...state,
        ball,
        wallHitAt,
        effectivePitch: effPitch,
        effectiveRoll: effRoll,
        elapsedMs: state.elapsedMs + dt * 1000,
        ballSpeed: Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy),
      };
    }

    default:
      return state;
  }
}

/* ── Animations ────────────────────────────────────────────────── */

const pulseAnim = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const goalPulse = keyframes`
  0%, 100% { box-shadow: 0 0 6px rgba(0, 220, 120, 0.6), 0 0 16px rgba(0, 220, 120, 0.25); transform: scale(1); }
  50% { box-shadow: 0 0 14px rgba(0, 220, 120, 0.95), 0 0 30px rgba(0, 220, 120, 0.45); transform: scale(1.08); }
`;

const holeGlow = keyframes`
  0%, 100% { box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.9), 0 0 6px rgba(255, 60, 60, 0.25); }
  50% { box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.95), 0 0 10px rgba(255, 60, 60, 0.45); }
`;

/* ── Styled components ─────────────────────────────────────────── */

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

const GameArea = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const NoControllerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`;

const OverlayBadge = styled.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
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

const HUD = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 0 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
`;

const HudItem = styled.span`
  white-space: nowrap;
`;

const Spacer = styled.span`
  flex: 1;
`;

const LivesRow = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const LifeDot = styled.span<{ $alive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) =>
    p.$alive ? "rgba(191, 204, 214, 0.85)" : "rgba(191, 204, 214, 0.15)"};
  transition: background 0.3s;
`;

const Arena = styled.div`
  position: relative;
  width: ${ARENA_W}px;
  height: ${ARENA_H}px;
  background:
    radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px
    ),
    rgba(10, 14, 26, 0.9);
  background-size: ${CELL}px ${CELL}px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: ${ARENA_H * 0.8}px;
  }
`;

const WallEl = styled.div`
  position: absolute;
  width: ${CELL}px;
  height: ${CELL}px;
  background: linear-gradient(
    135deg,
    rgba(72, 120, 200, 0.35),
    rgba(40, 70, 130, 0.45)
  );
  border: 1px solid rgba(120, 160, 220, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  pointer-events: none;
`;

const BallEl = styled.div<{ $scale: number; $opacity: number }>`
  position: absolute;
  width: ${BALL_RADIUS * 2}px;
  height: ${BALL_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 1),
    rgba(180, 190, 210, 0.9) 60%,
    rgba(120, 130, 160, 0.9)
  );
  box-shadow:
    0 0 6px rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%) scale(${(p) => p.$scale});
  opacity: ${(p) => p.$opacity};
  transition: opacity 0.05s linear;
`;

const HoleEl = styled.div`
  position: absolute;
  width: ${HOLE_RADIUS * 2}px;
  height: ${HOLE_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 1) 40%,
    rgba(30, 10, 10, 0.8) 70%,
    rgba(60, 20, 20, 0.4)
  );
  border: 1px solid rgba(80, 30, 30, 0.6);
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: ${holeGlow} 2.2s ease-in-out infinite;
`;

const GoalEl = styled.div`
  position: absolute;
  width: ${GOAL_RADIUS * 2}px;
  height: ${GOAL_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(100, 255, 180, 0.9),
    rgba(0, 200, 120, 0.7) 60%,
    rgba(0, 140, 80, 0.3)
  );
  border: 1px solid rgba(120, 255, 200, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: ${goalPulse} 1.6s ease-in-out infinite;
`;

const TiltIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TiltCrosshair = styled.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(72, 175, 240, 0.9);
  box-shadow: 0 0 4px rgba(72, 175, 240, 0.6);
`;

const TiltDotCenter = styled.span`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  pointer-events: none;
`;

const Overlay = styled.div<{ $dim?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: ${(p) => (p.$dim ? "rgba(0, 0, 0, 0.6)" : "transparent")};
  z-index: 5;
  pointer-events: none;
`;

const TitleText = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 4px;
  margin-bottom: 16px;
  animation: ${fadeInUp} 0.4s ease;
`;

const SubText = styled.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.55);
  line-height: 1.7;
  margin-bottom: 24px;
  font-family: "Fira Code", monospace;
`;

const PromptText = styled.div`
  font-size: 14px;
  color: rgba(72, 175, 240, 0.8);
  animation: ${pulseAnim} 1.6s ease-in-out infinite;
`;

const GameOverLabel = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 60, 60, 0.9);
  letter-spacing: 3px;
  margin-bottom: 8px;
  animation: ${fadeInUp} 0.4s ease;
`;

const LevelClearLabel = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 230, 120, 0.9);
  letter-spacing: 2px;
  animation: ${fadeInUp} 0.3s ease;
`;

const VictoryLabel = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: #f29e02;
  letter-spacing: 4px;
  margin-bottom: 12px;
  animation: ${fadeInUp} 0.4s ease;
`;

const PausedLabel = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`;

const BigTime = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #48aff0;
  font-family: "Fira Code", monospace;
  margin: 6px 0;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: 11px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.4);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

/* ── Description section ───────────────────────────────────────── */

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

/* ── Utilities ─────────────────────────────────────────────────── */

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}

/* ── Component ─────────────────────────────────────────────────── */

const TiltMazePage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    makeInitialState(0),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const gameLoopRef = useRef<number>(0);
  const prevPhaseRef = useRef<GamePhase>("TITLE");
  const lastWallHitAudioRef = useRef(0);
  const [, forceRender] = useState(0);

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

  // Cross — start / restart / skip death / dismiss victory
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "TITLE") dispatch({ type: "START_GAME" });
      else if (phase === "GAME_OVER" || phase === "VICTORY")
        dispatch({ type: "RESTART" });
      else if (phase === "DEAD") dispatch({ type: "SKIP_DEATH" });
    };
    controller.cross.on("press", handler);
    return () => {
      controller.cross.off("press", handler);
    };
  }, [controller]);

  // Triangle — pause
  useEffect(() => {
    if (!controller?.triangle) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "PLAYING" || phase === "PAUSED") {
        dispatch({ type: "TOGGLE_PAUSE" });
      }
    };
    controller.triangle.on("press", handler);
    return () => {
      controller.triangle.off("press", handler);
    };
  }, [controller]);

  // Square — recenter (capture current tilt as the new "flat")
  useEffect(() => {
    if (!controller?.square || !controller?.orientation) return;
    const handler = () => {
      dispatch({
        type: "RECENTER",
        tiltPitch: controller.orientation.tiltPitch,
        tiltRoll: controller.orientation.tiltRoll,
      });
    };
    controller.square.on("press", handler);
    return () => {
      controller.square.off("press", handler);
    };
  }, [controller]);

  // Main game loop: reads orientation, dispatches TICK, does throttled HID writes
  useEffect(() => {
    if (!controller?.orientation) return;
    const running: GamePhase[] = ["PLAYING", "LEVEL_CLEAR", "DEAD"];
    if (!running.includes(state.phase)) return;

    let lastTime = performance.now();
    let lastRumble = 0;
    let lastLightbar = 0;
    let lastTrigger = 0;
    let lastRenderAt = 0;
    const TICK = 1000 / 60;
    let accum = 0;

    const loop = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      accum = Math.min(accum + elapsed, TICK * 3);

      while (accum >= TICK) {
        const tiltPitch = controller.orientation.tiltPitch;
        const tiltRoll = controller.orientation.tiltRoll;
        const r2 = controller.right?.trigger?.state ?? 0;
        dispatch({
          type: "TICK",
          dt: 1 / 60,
          now,
          tiltPitch,
          tiltRoll,
          r2,
        });
        accum -= TICK;
      }

      const s = stateRef.current;

      // ── Rumble (~10Hz) ──
      // Continuous rumble (rolling, proximity) throws off the IMU and makes the
      // ball feel drifty. Keep motors silent during play; rely on wall-tap
      // one-shots and phase transitions for haptic feedback. Proximity-to-hole
      // cue lives on the mute LED pulse + lightbar instead.
      if (now - lastRumble > 100) {
        lastRumble = now;
        if (s.phase !== "DEAD" && s.phase !== "LEVEL_CLEAR") {
          controller.left?.rumble(0);
          controller.right?.rumble(0);
        }
      }

      // ── Lightbar (~10Hz) ──
      if (now - lastLightbar > 100) {
        lastLightbar = now;
        if (s.phase === "PLAYING") {
          const color = lightbarFromTilt(s.effectivePitch, s.effectiveRoll);
          controller.lightbar?.set(color);
        }
        // LEVEL_CLEAR / DEAD / VICTORY / TITLE handled via phase transitions.
      }

      // ── Trigger effects (~5Hz) ──
      if (now - lastTrigger > 200) {
        lastTrigger = now;
        if (s.phase === "PLAYING") {
          // R2: brake — moderate resistance, strength scales with speed
          const speedScale = Math.min(1, s.ballSpeed / MAX_SPEED);
          controller.right?.trigger?.feedback?.set({
            effect: TriggerEffect.Feedback,
            position: 0.1,
            strength: 0.3 + speedScale * 0.5,
          });
          // L2: passive — resistance proportional to ball speed ("feel the speed")
          controller.left?.trigger?.feedback?.set({
            effect: TriggerEffect.Feedback,
            position: 0.2,
            strength: 0.2 + speedScale * 0.6,
          });
        }
      }

      if (now - lastRenderAt > 16) {
        lastRenderAt = now;
        forceRender((n) => (n + 1) % 1000000);
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      controller.left?.rumble(0);
      controller.right?.rumble(0);
    };
  }, [controller, state.phase]);

  // Wall-tap audio (observe state.wallHitAt; throttle to avoid spam)
  useEffect(() => {
    if (!controller) return;
    if (
      state.wallHitAt !== lastWallHitAudioRef.current &&
      state.wallHitAt !== 0
    ) {
      const prev = lastWallHitAudioRef.current;
      lastWallHitAudioRef.current = state.wallHitAt;
      // Only play if enough time has passed since the last click
      if (state.wallHitAt - prev > 120) {
        playClickSound(controller);
        // Very brief right-motor tap — short enough that IMU settles fast.
        controller.right?.rumble(0.25);
        setTimeout(() => {
          if (stateRef.current.phase === "PLAYING") {
            controller.right?.rumble(0);
          }
        }, 35);
      }
    }
  }, [controller, state.wallHitAt]);

  // Player LEDs — reflect current level (0..4 → LEDs 1..5 lit)
  useEffect(() => {
    if (!controller?.playerLeds) return;
    const n =
      state.phase === "VICTORY"
        ? 5
        : state.phase === "TITLE" || state.phase === "GAME_OVER"
          ? 0
          : state.levelIndex + 1;
    for (let i = 0; i < 5; i++) {
      controller.playerLeds.setLed(i, i < n);
    }
  }, [controller, state.levelIndex, state.phase]);

  // Phase transition one-shots: audio, rumble bursts, lightbar flashes, mute LED
  useEffect(() => {
    if (!controller) return;
    const prev = prevPhaseRef.current;
    const curr = state.phase;
    prevPhaseRef.current = curr;
    if (prev === curr) return;

    if (curr === "DEAD") {
      playThudSound(controller);
      controller.left?.rumble(0.9);
      controller.right?.rumble(0.7);
      controller.lightbar?.set({ r: 180, g: 20, b: 20 });
      controller.mute?.setLed(MuteLedMode.Pulse);
      const t = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 400);
      return () => clearTimeout(t);
    }

    if (curr === "LEVEL_CLEAR") {
      playClearSound(controller);
      controller.lightbar?.set({ r: 255, g: 255, b: 255 });
      controller.left?.rumble(0.3);
      controller.right?.rumble(0.3);
      const t = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 250);
      return () => clearTimeout(t);
    }

    if (curr === "PLAYING" && prev === "DEAD") {
      controller.mute?.resetLed();
    }

    if (curr === "VICTORY") {
      playVictorySound(controller);
      // Rainbow cycle on the lightbar
      const start = performance.now();
      let raf = 0;
      const cycle = (t: number) => {
        const dt = (t - start) / 1000;
        const r = Math.round(128 + 127 * Math.sin(dt * 2.0));
        const g = Math.round(128 + 127 * Math.sin(dt * 2.0 + 2.094));
        const b = Math.round(128 + 127 * Math.sin(dt * 2.0 + 4.188));
        controller.lightbar?.set({ r, g, b });
        raf = requestAnimationFrame(cycle);
      };
      raf = requestAnimationFrame(cycle);
      const t = setTimeout(() => {
        cancelAnimationFrame(raf);
      }, 4000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }

    if (curr === "GAME_OVER") {
      controller.left?.rumble(0);
      controller.right?.rumble(0);
      controller.left?.trigger?.feedback?.reset();
      controller.right?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 80, g: 0, b: 0 });
      controller.mute?.resetLed();
    }

    if (curr === "TITLE") {
      controller.left?.rumble(0);
      controller.right?.rumble(0);
      controller.left?.trigger?.feedback?.reset();
      controller.right?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 20, g: 30, b: 80 });
      controller.mute?.resetLed();
    }
  }, [controller, state.phase]);

  // Mute LED — pulse when near a hole during play
  useEffect(() => {
    if (!controller?.mute) return;
    if (state.phase !== "PLAYING") return;
    const parsed = PARSED[state.levelIndex];
    const edge = nearestHoleEdgeDist(state.ball, parsed.holes);
    if (edge < 20) {
      controller.mute.setLed(MuteLedMode.Pulse);
    } else {
      controller.mute.resetLed();
    }
  }, [controller, state.ball.x, state.ball.y, state.levelIndex, state.phase]);

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
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [controller]);

  const inactive = !hasWebHID || !connected;
  const overlayMsg = !hasWebHID
    ? "Requires WebHID (Chrome, Edge, Opera)"
    : !connected
      ? "Connect a controller to play"
      : null;

  const parsed = PARSED[state.levelIndex];
  const ballVisible =
    state.phase !== "TITLE" &&
    state.phase !== "GAME_OVER" &&
    state.phase !== "VICTORY";

  const ballScale =
    state.phase === "DEAD" ? Math.max(0.1, 1 - state.deathProgress) : 1;
  const ballOpacity =
    state.phase === "DEAD" ? Math.max(0, 1 - state.deathProgress) : 1;

  // Tilt indicator crosshair position
  const indicatorOffset = {
    x: (state.effectiveRoll / MAX_TILT) * 18,
    y: (state.effectivePitch / MAX_TILT) * 18,
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>Tilt Maze</PageTitle>
        <PageSubtitle>
          Roll a ball through the maze by tilting the controller.
        </PageSubtitle>
      </Header>

      <GameArea>
        {overlayMsg && (
          <NoControllerOverlay>
            <OverlayBadge>{overlayMsg}</OverlayBadge>
          </NoControllerOverlay>
        )}
        <OverlayContent $inactive={inactive}>
          <HUD>
            <HudItem>
              Level {state.levelIndex + 1}/{LEVELS.length}
            </HudItem>
            <HudItem>{formatTime(state.elapsedMs)}</HudItem>
            <Spacer />
            <LivesRow title="Lives">
              {Array.from({ length: STARTING_LIVES }, (_, i) => (
                <LifeDot key={i} $alive={i < state.lives} />
              ))}
            </LivesRow>
          </HUD>

          <Arena>
            {parsed.wallCells.map((w) => (
              <WallEl
                key={`w-${w.col}-${w.row}`}
                style={{
                  left: `${w.col * CELL}px`,
                  top: `${w.row * CELL}px`,
                }}
              />
            ))}

            {parsed.holes.map((h, i) => (
              <HoleEl
                key={`h-${i}`}
                style={{ left: `${h.x}px`, top: `${h.y}px` }}
              />
            ))}

            <GoalEl
              style={{ left: `${parsed.goal.x}px`, top: `${parsed.goal.y}px` }}
            />

            {ballVisible && (
              <BallEl
                $scale={ballScale}
                $opacity={ballOpacity}
                style={{
                  left: `${state.ball.x}px`,
                  top: `${state.ball.y}px`,
                }}
              />
            )}

            {state.phase === "PLAYING" && (
              <TiltIndicator>
                <TiltDotCenter />
                <TiltCrosshair
                  style={{
                    transform: `translate(${indicatorOffset.x}px, ${indicatorOffset.y}px)`,
                  }}
                />
              </TiltIndicator>
            )}

            {state.phase === "TITLE" && (
              <Overlay $dim>
                <TitleText>TILT MAZE</TitleText>
                <SubText>
                  Tilt the controller to roll the ball
                  <br />
                  Square: recenter &middot; R2: brake &middot; Triangle: pause
                </SubText>
                <PromptText>Press &times; to start</PromptText>
                {state.bestTimeMs > 0 && (
                  <SubText style={{ marginTop: 16, marginBottom: 0 }}>
                    Best: {formatTime(state.bestTimeMs)}
                  </SubText>
                )}
              </Overlay>
            )}

            {state.phase === "LEVEL_CLEAR" && (
              <Overlay>
                <LevelClearLabel>
                  LEVEL {state.levelIndex + 1} CLEAR
                </LevelClearLabel>
              </Overlay>
            )}

            {state.phase === "PAUSED" && (
              <Overlay $dim>
                <PausedLabel>PAUSED</PausedLabel>
                <SubText style={{ marginTop: 16 }}>Triangle to resume</SubText>
              </Overlay>
            )}

            {state.phase === "GAME_OVER" && (
              <Overlay $dim>
                <GameOverLabel>GAME OVER</GameOverLabel>
                <SubText>Reached level {state.levelIndex + 1}</SubText>
                <PromptText>Press &times; to try again</PromptText>
              </Overlay>
            )}

            {state.phase === "VICTORY" && (
              <Overlay $dim>
                <VictoryLabel>YOU WIN</VictoryLabel>
                <BigTime>{formatTime(state.elapsedMs)}</BigTime>
                <SubText>
                  {state.bestTimeMs > 0 && state.elapsedMs === state.bestTimeMs
                    ? "New best time!"
                    : state.bestTimeMs > 0
                      ? `Best: ${formatTime(state.bestTimeMs)}`
                      : " "}
                </SubText>
                <PromptText>Press &times; to play again</PromptText>
              </Overlay>
            )}
          </Arena>

          {(state.phase === "PLAYING" ||
            state.phase === "DEAD" ||
            state.phase === "LEVEL_CLEAR" ||
            state.phase === "PAUSED") && (
            <StatsRow>
              <span>
                Tilt ({state.effectiveRoll.toFixed(2)},{" "}
                {state.effectivePitch.toFixed(2)}) rad
              </span>
              {state.bestTimeMs > 0 && (
                <span>Best {formatTime(state.bestTimeMs)}</span>
              )}
            </StatsRow>
          )}
        </OverlayContent>
      </GameArea>

      <DescriptionSection>
        <DescriptionHeading>Controller Features</DescriptionHeading>
        <FeatureList>
          <li>
            <strong>Orientation sensor</strong> &mdash; The controller's fused
            IMU exposes a gravity-referenced tilt via{" "}
            <code>controller.orientation.tiltPitch</code> and{" "}
            <code>.tiltRoll</code>. These are computed from the accelerometer
            alone, so they have <em>zero drift</em> and no yaw — exactly the
            signal you want for a marble-on-a-tray metaphor. The ball
            accelerates along the projected gravity vector each tick.
          </li>
          <li>
            <strong>Recenter</strong> &mdash; <code>Square</code> captures the
            current <code>tiltPitch</code> / <code>tiltRoll</code> as the new
            "flat" reference, so the player can play at any comfortable rest
            angle without the ball drifting.
          </li>
          <li>
            <strong>Adaptive triggers</strong> &mdash; <code>R2</code> is a
            brake: pulling it scales friction 1&times;&ndash;5&times; so the
            ball stops on a dime. <code>TriggerEffect.Feedback</code> strength
            on both triggers is modulated by ball speed — you physically feel
            how fast the marble is rolling.
          </li>
          <li>
            <strong>Dual rumble</strong> &mdash; Left (low-frequency) motor
            carries a continuous rolling rumble scaled by ball speed. Right
            (high-frequency) motor fires a quadratic-falloff proximity pulse
            when near a hole, plus a brief tap on each wall collision.
          </li>
          <li>
            <strong>Lightbar</strong> &mdash; Live tilt indicator: hue shifts
            based on the dominant tilt direction (blue left, orange right, teal
            forward, magenta back), saturation scaled by tilt magnitude. Red
            flash on death, white pulse on level clear, rainbow cycle on
            victory.
          </li>
          <li>
            <strong>Player LEDs</strong> &mdash; Level progress: LEDs 1..N lit
            for current level (of 5). All 5 solid on VICTORY.
          </li>
          <li>
            <strong>Mute LED</strong> &mdash; Pulses when the ball is within
            20px of a hole edge. A physical "you're about to die" indicator you
            can feel without looking.
          </li>
          <li>
            <strong>Speaker (test tones)</strong> &mdash; 1kHz click on wall
            taps (throttled), 100Hz thud on hole death, dual-click ascending
            pattern on level clear, four-note fanfare on victory.
          </li>
        </FeatureList>

        <DescriptionHeading>Implementation Notes</DescriptionHeading>
        <p>
          The whole game runs on a single <code>requestAnimationFrame</code>{" "}
          loop with a fixed 1/60s timestep and accumulator capped at 3 ticks
          (50ms) to survive a backgrounded tab. Reading orientation is one
          property access per frame — the Dualsense instance updates the
          Madgwick filter on every HID report, and <code>tiltPitch</code>/
          <code>tiltRoll</code> are derived directly from the accelerometer
          norm.
        </p>

        <CodeBlock
          code={`// Orientation — gravity-referenced tilt, no drift, no yaw.
const tiltPitch = controller.orientation.tiltPitch;
const tiltRoll = controller.orientation.tiltRoll;

// Subtract a captured neutral to allow playing at any rest angle,
// then clamp to ±π/4 saturation.
const effPitch = clamp(tiltPitch - neutralPitch, -MAX_TILT, MAX_TILT);
const effRoll = clamp(tiltRoll - neutralRoll, -MAX_TILT, MAX_TILT);

// Project onto screen-space gravity.
const gx = -Math.sin(effRoll) * GRAVITY;
const gy = Math.sin(effPitch) * GRAVITY;
ball.vx += gx * dt;
ball.vy += gy * dt;

// R2 brake: multiply friction so pulling fully stops the marble.
const brake = 1 + r2 * 4;
ball.vx *= Math.pow(FRICTION, brake * dt * 60);
ball.vy *= Math.pow(FRICTION, brake * dt * 60);`}
        />

        <p>
          Walls live as a <code>Set&lt;&quot;col,row&quot;&gt;</code> per level.
          The ball only checks the 9 cells surrounding it for collision — a
          bounded, allocation-free inner loop. Circle-vs-AABB resolution pushes
          the ball along the contact normal and reflects velocity with a 0.35
          restitution coefficient for a satisfying tap.
        </p>

        <CodeBlock
          code={`// Square button recenters the reference tilt — capture current pose as "flat".
controller.square.on("press", () => {
  dispatch({
    type: "RECENTER",
    tiltPitch: controller.orientation.tiltPitch,
    tiltRoll: controller.orientation.tiltRoll,
  });
});

// Lightbar becomes a live tilt indicator — hue from tilt direction,
// saturation from magnitude. The player feels the gravity they're applying.
controller.lightbar.set(lightbarFromTilt(effPitch, effRoll));

// Mute LED pulses when the ball is dangerously close to a hole —
// a tactile "danger" cue that doesn't require looking at the screen.
if (nearestHoleEdgeDist(ball, holes) < 20) {
  controller.mute.setLed(MuteLedMode.Pulse);
}`}
        />

        <p>
          Five levels live as string arrays at the top of the file — parsed once
          at module load into walls, holes, start, and goal. Levels can be added
          or tweaked by editing the ASCII directly; no tooling required.
        </p>
      </DescriptionSection>
    </PageContainer>
  );
};

export default TiltMazePage;
