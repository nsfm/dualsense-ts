import React, {
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { keyframes, css } from "styled-components";
import { TriggerEffect, MuteLedMode } from "dualsense-ts";
import type { Dualsense } from "dualsense-ts";
import { ControllerContext, hasWebHID } from "../../controller";
import { CodeBlock } from "../../components/ui/CodeBlock";

/* ── Types ──────────────────────────────────────────────────────── */

type GamePhase =
  | "TITLE"
  | "PLAYING"
  | "WAVE_CLEAR"
  | "DEAD"
  | "GAME_OVER"
  | "PAUSED";

type AsteroidSize = "large" | "medium" | "small";

interface Ship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // radians, aim direction
  invulnerable: number; // seconds remaining
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number; // seconds remaining
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: AsteroidSize;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  shape: string; // cached clip-path polygon
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  life: number; // original ttl
}

interface GameState {
  phase: GamePhase;
  prevPhase: GamePhase; // for pause resume
  ship: Ship;
  bullets: Bullet[];
  asteroids: Asteroid[];
  particles: Particle[];
  score: number;
  highScore: number;
  lives: number;
  wave: number;
  spreadAmmo: number;
  lastFireAt: number; // performance.now() of last bullet spawned
  lastSpreadAt: number;
  phaseTimer: number; // countdown seconds for WAVE_CLEAR / DEAD
  destroyed: number;
  nextId: number;
  fireFlashAt: number; // most recent fire time — used by rAF loop for rumble burst
  destroyFlashAt: number; // most recent asteroid destruction — for audio
  prevL2: number; // previous L2 value for edge-triggered spread
}

type GameAction =
  | { type: "START_GAME" }
  | {
      type: "TICK";
      dt: number;
      now: number;
      moveAngle: number; // screen-space radians
      moveMag: number; // 0..1, deadzone applied by DualSense API
      aimAngle: number;
      aimMag: number;
      r2: number;
      l2: number;
    }
  | { type: "TOGGLE_PAUSE" }
  | { type: "SKIP_DEATH" }
  | { type: "RESTART" };

/* ── Constants ─────────────────────────────────────────────────── */

const ARENA_W = 552;
const ARENA_H = 400;

const SHIP_ACCEL = 1200; // px/s^2
const SHIP_FRICTION = 0.92; // per frame at 60fps
const SHIP_MAX_SPEED = 400; // px/s
const SHIP_RADIUS = 12;
const MOVE_DEADZONE = 0.15;
const AIM_DEADZONE = 0.25;
const FIRE_THRESHOLD = 0.5; // R2/L2 trigger pull threshold

const BULLET_SPEED = 600;
const BULLET_LIFETIME = 1.0;
const BULLET_RADIUS = 3;
const FIRE_INTERVAL_MS = 150;
const MAX_BULLETS = 24;

const SPREAD_COOLDOWN_MS = 500;
// 7 bullets fanned across ±36°
const SPREAD_ANGLES = [
  -Math.PI / 5,
  -Math.PI / 7.5,
  -Math.PI / 15,
  0,
  Math.PI / 15,
  Math.PI / 7.5,
  Math.PI / 5,
];

const INVULN_DURATION = 2.0; // seconds after respawn
const DEATH_DURATION = 1.5;
const WAVE_CLEAR_DURATION = 2.0;

const ASTEROID_CONFIG: Record<
  AsteroidSize,
  { radius: number; speedMin: number; speedMax: number; points: number }
> = {
  large: { radius: 35, speedMin: 30, speedMax: 80, points: 20 },
  medium: { radius: 20, speedMin: 50, speedMax: 120, points: 50 },
  small: { radius: 10, speedMin: 80, speedMax: 160, points: 100 },
};

const STARTING_LIVES = 5;
const STARTING_SPREAD = 3;
const MAX_SPREAD = 5;

/* ── Pure functions ────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function wrap(v: number, min: number, max: number): number {
  const range = max - min;
  let r = v;
  while (r < min) r += range;
  while (r >= max) r -= range;
  return r;
}

function generateAsteroidShape(): string {
  const verts = 7 + Math.floor(Math.random() * 4); // 7-10
  const points: string[] = [];
  for (let i = 0; i < verts; i++) {
    const angle = (i / verts) * Math.PI * 2;
    const r = 0.7 + Math.random() * 0.3;
    const px = 50 + Math.cos(angle) * r * 50;
    const py = 50 + Math.sin(angle) * r * 50;
    points.push(`${px.toFixed(1)}% ${py.toFixed(1)}%`);
  }
  return `polygon(${points.join(", ")})`;
}

function makeAsteroid(
  id: number,
  x: number,
  y: number,
  size: AsteroidSize,
  vx?: number,
  vy?: number,
): Asteroid {
  const cfg = ASTEROID_CONFIG[size];
  let finalVx: number;
  let finalVy: number;
  if (vx !== undefined && vy !== undefined) {
    finalVx = vx;
    finalVy = vy;
  } else {
    const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
    const angle = Math.random() * Math.PI * 2;
    finalVx = Math.cos(angle) * speed;
    finalVy = Math.sin(angle) * speed;
  }
  return {
    id,
    x,
    y,
    vx: finalVx,
    vy: finalVy,
    size,
    radius: cfg.radius,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 60, // -30 to +30 deg/sec
    shape: generateAsteroidShape(),
  };
}

function spawnEdgeAsteroid(
  id: number,
  shipX: number,
  shipY: number,
  size: AsteroidSize = "large",
): Asteroid {
  let x = 0;
  let y = 0;
  let attempts = 0;
  while (attempts < 8) {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      x = Math.random() * ARENA_W;
      y = -20;
    } else if (edge === 1) {
      x = ARENA_W + 20;
      y = Math.random() * ARENA_H;
    } else if (edge === 2) {
      x = Math.random() * ARENA_W;
      y = ARENA_H + 20;
    } else {
      x = -20;
      y = Math.random() * ARENA_H;
    }
    const dx = x - shipX;
    const dy = y - shipY;
    if (dx * dx + dy * dy > 150 * 150) break;
    attempts++;
  }
  // Aim roughly toward center, ±45° deviation
  const towardCx = ARENA_W / 2 - x;
  const towardCy = ARENA_H / 2 - y;
  const baseAngle = Math.atan2(towardCy, towardCx);
  const finalAngle = baseAngle + (Math.random() - 0.5) * (Math.PI / 2);
  const cfg = ASTEROID_CONFIG[size];
  const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
  return makeAsteroid(
    id,
    x,
    y,
    size,
    Math.cos(finalAngle) * speed,
    Math.sin(finalAngle) * speed,
  );
}

function spawnWave(
  waveNum: number,
  shipX: number,
  shipY: number,
  startId: number,
): { asteroids: Asteroid[]; nextId: number } {
  const largeCount = Math.min(3 + waveNum, 12);
  const mediumCount = Math.floor(Math.max(0, waveNum - 3) / 2);
  const asteroids: Asteroid[] = [];
  let id = startId;
  for (let i = 0; i < largeCount; i++) {
    asteroids.push(spawnEdgeAsteroid(id++, shipX, shipY, "large"));
  }
  for (let i = 0; i < mediumCount; i++) {
    asteroids.push(spawnEdgeAsteroid(id++, shipX, shipY, "medium"));
  }
  return { asteroids, nextId: id };
}

function getLivesColor(lives: number): { r: number; g: number; b: number } {
  if (lives >= 5) return { r: 0, g: 150, b: 30 };
  if (lives === 4) return { r: 80, g: 180, b: 0 };
  if (lives === 3) return { r: 200, g: 200, b: 0 };
  if (lives === 2) return { r: 220, g: 100, b: 0 };
  return { r: 255, g: 20, b: 20 };
}

function makeParticles(
  startId: number,
  x: number,
  y: number,
  count: number,
): { particles: Particle[]; nextId: number } {
  const particles: Particle[] = [];
  let id = startId;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 100 + Math.random() * 150;
    const life = 0.25 + Math.random() * 0.2;
    particles.push({
      id: id++,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      ttl: life,
      life,
    });
  }
  return { particles, nextId: id };
}

function splitAsteroid(parent: Asteroid, startId: number): Asteroid[] {
  if (parent.size === "small") return [];
  const childSize: AsteroidSize = parent.size === "large" ? "medium" : "small";
  const parentSpeed = Math.sqrt(parent.vx * parent.vx + parent.vy * parent.vy);
  const parentAngle = Math.atan2(parent.vy, parent.vx);
  const spread = Math.PI / 4 + Math.random() * (Math.PI / 4); // 45-90 deg
  const childSpeed = parentSpeed * (1.2 + Math.random() * 0.3);
  const a1 = parentAngle + spread;
  const a2 = parentAngle - spread;
  return [
    makeAsteroid(
      startId,
      parent.x,
      parent.y,
      childSize,
      Math.cos(a1) * childSpeed,
      Math.sin(a1) * childSpeed,
    ),
    makeAsteroid(
      startId + 1,
      parent.x,
      parent.y,
      childSize,
      Math.cos(a2) * childSpeed,
      Math.sin(a2) * childSpeed,
    ),
  ];
}

/* ── Audio (speaker test tones) ────────────────────────────────── */

function playFireSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 15);
}

function playDestroySound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 25);
}

function playSpreadSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 30);
}

function playDeathSound(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 20);
    }, 30);
  }, 60);
}

function playWaveClearSound(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 40);
    }, 20);
  }, 40);
}

/* ── Reducer ───────────────────────────────────────────────────── */

function makeInitialShip(): Ship {
  return {
    x: ARENA_W / 2,
    y: ARENA_H / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2, // facing up
    invulnerable: 0,
  };
}

function makeInitialState(highScore: number): GameState {
  return {
    phase: "TITLE",
    prevPhase: "TITLE",
    ship: makeInitialShip(),
    bullets: [],
    asteroids: [],
    particles: [],
    score: 0,
    highScore,
    lives: STARTING_LIVES,
    wave: 1,
    spreadAmmo: STARTING_SPREAD,
    lastFireAt: 0,
    lastSpreadAt: 0,
    phaseTimer: 0,
    destroyed: 0,
    nextId: 1,
    fireFlashAt: 0,
    destroyFlashAt: 0,
    prevL2: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      const ship = makeInitialShip();
      const spawn = spawnWave(1, ship.x, ship.y, 1);
      return {
        ...makeInitialState(state.highScore),
        phase: "PLAYING",
        ship,
        asteroids: spawn.asteroids,
        nextId: spawn.nextId,
      };
    }

    case "RESTART": {
      return {
        ...makeInitialState(Math.max(state.highScore, state.score)),
        phase: "TITLE",
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
        return {
          ...state,
          phase: "GAME_OVER",
          highScore: Math.max(state.highScore, state.score),
          phaseTimer: 0,
        };
      }
      return {
        ...state,
        phase: "PLAYING",
        phaseTimer: 0,
        ship: { ...makeInitialShip(), invulnerable: INVULN_DURATION },
      };
    }

    case "TICK": {
      if (state.phase === "TITLE" || state.phase === "GAME_OVER") return state;
      if (state.phase === "PAUSED") return state;

      const { dt, now, moveAngle, moveMag, aimAngle, aimMag, r2, l2 } = action;
      let nextId = state.nextId;

      // Phase timers
      if (state.phase === "WAVE_CLEAR") {
        const remaining = state.phaseTimer - dt;
        if (remaining <= 0) {
          const newWave = state.wave + 1;
          const spawn = spawnWave(newWave, state.ship.x, state.ship.y, nextId);
          return {
            ...state,
            phase: "PLAYING",
            wave: newWave,
            asteroids: spawn.asteroids,
            nextId: spawn.nextId,
            phaseTimer: 0,
            spreadAmmo: Math.min(MAX_SPREAD, state.spreadAmmo + 1),
          };
        }
      }
      if (state.phase === "DEAD") {
        const remaining = state.phaseTimer - dt;
        if (remaining <= 0) {
          if (state.lives <= 0) {
            return {
              ...state,
              phase: "GAME_OVER",
              highScore: Math.max(state.highScore, state.score),
              phaseTimer: 0,
            };
          }
          return {
            ...state,
            phase: "PLAYING",
            phaseTimer: 0,
            ship: { ...makeInitialShip(), invulnerable: INVULN_DURATION },
          };
        }
      }

      // ── Ship physics ──
      let { vx, vy, angle, invulnerable } = state.ship;
      let { x: sx, y: sy } = state.ship;

      if (state.phase === "PLAYING") {
        // moveMag has the configured deadzone already applied by the API
        if (moveMag > 0) {
          const accel = moveMag * SHIP_ACCEL * dt;
          vx += Math.cos(moveAngle) * accel;
          vy += Math.sin(moveAngle) * accel;
        }
        // Friction (scale to dt: friction^60dt ~= per-frame-at-60fps)
        const fricFactor = Math.pow(SHIP_FRICTION, dt * 60);
        vx *= fricFactor;
        vy *= fricFactor;
        // Speed clamp
        const spd = Math.sqrt(vx * vx + vy * vy);
        if (spd > SHIP_MAX_SPEED) {
          vx = (vx / spd) * SHIP_MAX_SPEED;
          vy = (vy / spd) * SHIP_MAX_SPEED;
        }
        sx = wrap(sx + vx * dt, 0, ARENA_W);
        sy = wrap(sy + vy * dt, 0, ARENA_H);

        if (aimMag > 0) angle = aimAngle;
        invulnerable = Math.max(0, invulnerable - dt);
      }

      // ── Bullets: move, expire, remove off-screen ──
      let bullets: Bullet[] = [];
      for (const b of state.bullets) {
        const newTtl = b.ttl - dt;
        if (newTtl <= 0) continue;
        const nx = b.x + b.vx * dt;
        const ny = b.y + b.vy * dt;
        if (nx < 0 || nx > ARENA_W || ny < 0 || ny > ARENA_H) continue;
        bullets.push({ ...b, x: nx, y: ny, ttl: newTtl });
      }

      let fireFlashAt = state.fireFlashAt;
      let lastFireAt = state.lastFireAt;
      let spreadAmmo = state.spreadAmmo;
      let lastSpreadAt = state.lastSpreadAt;
      if (state.phase === "PLAYING") {
        // R2 → primary fire
        if (
          r2 > FIRE_THRESHOLD &&
          now - state.lastFireAt > FIRE_INTERVAL_MS &&
          bullets.length < MAX_BULLETS
        ) {
          const a = angle;
          bullets.push({
            id: nextId++,
            x: sx + Math.cos(a) * 18,
            y: sy + Math.sin(a) * 18,
            vx: Math.cos(a) * BULLET_SPEED,
            vy: Math.sin(a) * BULLET_SPEED,
            ttl: BULLET_LIFETIME,
          });
          lastFireAt = now;
          fireFlashAt = now;
        }
        // L2 edge → spread shot
        if (
          state.prevL2 < FIRE_THRESHOLD &&
          l2 >= FIRE_THRESHOLD &&
          spreadAmmo > 0 &&
          now - state.lastSpreadAt >= SPREAD_COOLDOWN_MS
        ) {
          for (const offset of SPREAD_ANGLES) {
            const a = angle + offset;
            bullets.push({
              id: nextId++,
              x: sx + Math.cos(a) * 18,
              y: sy + Math.sin(a) * 18,
              vx: Math.cos(a) * BULLET_SPEED,
              vy: Math.sin(a) * BULLET_SPEED,
              ttl: BULLET_LIFETIME,
            });
          }
          spreadAmmo -= 1;
          lastSpreadAt = now;
          fireFlashAt = now;
        }
      }

      // ── Asteroids: move, wrap, rotate ──
      let asteroids: Asteroid[] = state.asteroids.map((a) => ({
        ...a,
        x: wrap(a.x + a.vx * dt, -a.radius, ARENA_W + a.radius),
        y: wrap(a.y + a.vy * dt, -a.radius, ARENA_H + a.radius),
        rotation: a.rotation + a.rotationSpeed * dt,
      }));

      // ── Particles ──
      const particles: Particle[] = [];
      for (const p of state.particles) {
        const newTtl = p.ttl - dt;
        if (newTtl <= 0) continue;
        particles.push({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vx: p.vx * 0.95,
          vy: p.vy * 0.95,
          ttl: newTtl,
        });
      }

      // ── Collisions ──
      let score = state.score;
      let destroyed = state.destroyed;
      let destroyFlashAt = state.destroyFlashAt;
      const destroyedAsteroidIds = new Set<number>();
      const destroyedBulletIds = new Set<number>();
      const newChildren: Asteroid[] = [];

      // Bullet × Asteroid
      for (const b of bullets) {
        if (destroyedBulletIds.has(b.id)) continue;
        for (const a of asteroids) {
          if (destroyedAsteroidIds.has(a.id)) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const rr = a.radius + BULLET_RADIUS;
          if (dx * dx + dy * dy < rr * rr) {
            destroyedBulletIds.add(b.id);
            destroyedAsteroidIds.add(a.id);
            score += ASTEROID_CONFIG[a.size].points;
            destroyed += 1;
            destroyFlashAt = now;
            const children = splitAsteroid(a, nextId);
            nextId += children.length;
            newChildren.push(...children);
            const parts = makeParticles(nextId, a.x, a.y, 6);
            nextId = parts.nextId;
            particles.push(...parts.particles);
            break;
          }
        }
      }

      if (destroyedBulletIds.size > 0) {
        bullets = bullets.filter((b) => !destroyedBulletIds.has(b.id));
      }
      if (destroyedAsteroidIds.size > 0) {
        asteroids = asteroids.filter((a) => !destroyedAsteroidIds.has(a.id));
      }
      if (newChildren.length > 0) {
        asteroids = [...asteroids, ...newChildren];
      }

      // Ship × Asteroid
      let phase = state.phase;
      let lives = state.lives;
      let phaseTimer = state.phaseTimer;
      if (phase === "DEAD") phaseTimer -= dt;
      if (phase === "WAVE_CLEAR") phaseTimer -= dt;

      if (phase === "PLAYING" && invulnerable <= 0) {
        for (const a of asteroids) {
          const dx = a.x - sx;
          const dy = a.y - sy;
          const rr = a.radius + SHIP_RADIUS;
          if (dx * dx + dy * dy < rr * rr) {
            phase = "DEAD";
            phaseTimer = DEATH_DURATION;
            lives = Math.max(0, lives - 1);
            const parts = makeParticles(nextId, sx, sy, 10);
            nextId = parts.nextId;
            particles.push(...parts.particles);
            break;
          }
        }
      }

      // Wave clear check
      if (phase === "PLAYING" && asteroids.length === 0) {
        phase = "WAVE_CLEAR";
        phaseTimer = WAVE_CLEAR_DURATION;
        score += 200 * state.wave;
      }

      return {
        ...state,
        phase,
        phaseTimer,
        lives,
        ship: { x: sx, y: sy, vx, vy, angle, invulnerable },
        bullets,
        asteroids,
        particles,
        score,
        destroyed,
        nextId,
        lastFireAt,
        lastSpreadAt,
        spreadAmmo,
        fireFlashAt,
        destroyFlashAt,
        prevL2: l2,
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

const flash = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
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

const ScoreHeader = styled.div`
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

const ScoreItem = styled.span`
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

const LifeIcon = styled.span<{ $alive: boolean }>`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid
    ${(p) => (p.$alive ? "rgba(191, 204, 214, 0.85)" : "rgba(191, 204, 214, 0.15)")};
  transition: border-bottom-color 0.3s;
`;

const SpreadDots = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const SpreadDot = styled.span<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) =>
    p.$active ? "rgba(242, 158, 2, 0.85)" : "rgba(255, 255, 255, 0.1)"};
  transition: background 0.2s;
`;

const Arena = styled.div`
  position: relative;
  width: ${ARENA_W}px;
  height: ${ARENA_H}px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: ${ARENA_H * 0.8}px;
  }
`;

const ShipEl = styled.div<{ $thrusting: boolean; $blink: boolean }>`
  position: absolute;
  width: 18px;
  height: 20px;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: ${(p) => (p.$blink ? 0.35 : 1)};
  transition: opacity 0.05s linear;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    clip-path: polygon(100% 50%, 0% 0%, 25% 50%, 0% 100%);
    background: rgba(191, 204, 214, 0.18);
    border: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    clip-path: polygon(
      100% 50%,
      0% 0%,
      25% 50%,
      0% 100%,
      100% 50%,
      96% 50%,
      22% 8%,
      22% 92%,
      96% 50%
    );
    background: rgba(72, 175, 240, 0.9);
  }

  ${(p) =>
    p.$thrusting &&
    css`
      filter: drop-shadow(0 0 4px rgba(72, 175, 240, 0.35));
    `}
`;

const ThrustFlame = styled.div`
  position: absolute;
  width: 8px;
  height: 6px;
  background: rgba(255, 160, 40, 0.8);
  clip-path: polygon(0% 50%, 100% 0%, 75% 50%, 100% 100%);
  pointer-events: none;
  filter: drop-shadow(0 0 3px rgba(255, 120, 20, 0.6));
`;

const AsteroidEl = styled.div<{ $size: AsteroidSize }>`
  position: absolute;
  pointer-events: none;
  border-radius: 0;

  ${(p) =>
    p.$size === "large" &&
    css`
      width: 70px;
      height: 70px;
    `}
  ${(p) =>
    p.$size === "medium" &&
    css`
      width: 40px;
      height: 40px;
    `}
  ${(p) =>
    p.$size === "small" &&
    css`
      width: 20px;
      height: 20px;
    `}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(191, 204, 214, 0.06);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 1px;
    background: rgba(0, 0, 0, 0.85);
  }
`;

const BulletEl = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(72, 175, 240, 0.95);
  box-shadow: 0 0 5px rgba(72, 175, 240, 0.6);
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

const ParticleEl = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 180, 60, 0.9);
  pointer-events: none;
  transform: translate(-50%, -50%);
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

const BigScore = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #f29e02;
  font-family: "Fira Code", monospace;
  margin: 8px 0;
`;

const GameOverLabel = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 60, 60, 0.9);
  letter-spacing: 3px;
  margin-bottom: 8px;
  animation: ${fadeInUp} 0.4s ease;
`;

const WaveClearLabel = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 230, 120, 0.9);
  letter-spacing: 2px;
  animation: ${fadeInUp} 0.3s ease, ${flash} 1s ease infinite;
`;

const PausedLabel = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
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

/* ── Component ─────────────────────────────────────────────────── */

const AsteroidsPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    makeInitialState(0),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const gameLoopRef = useRef<number>(0);
  const prevPhaseRef = useRef<GamePhase>("TITLE");
  const renderTickRef = useRef(0);
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

  // Configure per-stick deadzones; restore the API defaults on unmount so
  // other pages see the controller's original configuration.
  useEffect(() => {
    const left = controller?.left?.analog;
    const right = controller?.right?.analog;
    if (!left || !right) return;
    const prevLeft = left.deadzone;
    const prevRight = right.deadzone;
    left.deadzone = MOVE_DEADZONE;
    right.deadzone = AIM_DEADZONE;
    return () => {
      left.deadzone = prevLeft;
      right.deadzone = prevRight;
    };
  }, [controller]);

  // Cross button — start / restart / skip death
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "TITLE") dispatch({ type: "START_GAME" });
      else if (phase === "GAME_OVER") dispatch({ type: "RESTART" });
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

  // Main game loop: dispatches TICK and performs throttled HID writes
  useEffect(() => {
    if (!controller) return;
    const running = ["PLAYING", "WAVE_CLEAR", "DEAD"];
    if (!running.includes(state.phase)) return;

    let lastTime = performance.now();
    let lastRumble = 0;
    let lastLightbar = 0;
    let lastTrigger = 0;
    let lastRenderAt = 0;
    let lastLightbarFlashToggle = 0;
    let lightbarFlashOn = true;
    const TICK = 1000 / 60;
    let accum = 0;

    const loop = (now: number) => {
      const elapsed = now - lastTime;
      lastTime = now;
      // Cap accumulation to avoid spiral of death if tab was backgrounded
      accum = Math.min(accum + elapsed, TICK * 3);

      while (accum >= TICK) {
        // .magnitude applies the configured deadzone and re-scales 0..1;
        // .angle is atan2(y, x) in stick-space (y positive up), so negate
        // to convert to screen-space (y positive down).
        const leftStick = controller.left?.analog;
        const rightStick = controller.right?.analog;
        const moveMag = leftStick?.magnitude ?? 0;
        const moveAngle = -(leftStick?.angle ?? 0);
        const aimMag = rightStick?.magnitude ?? 0;
        const aimAngle = -(rightStick?.angle ?? 0);
        const r2 = controller.right?.trigger?.state ?? 0;
        const l2 = controller.left?.trigger?.state ?? 0;
        dispatch({
          type: "TICK",
          dt: 1 / 60,
          now,
          moveAngle,
          moveMag,
          aimAngle,
          aimMag,
          r2,
          l2,
        });
        accum -= TICK;
      }

      const s = stateRef.current;

      // ── Rumble (~10Hz) ──
      if (now - lastRumble > 100) {
        lastRumble = now;
        if (s.phase === "PLAYING") {
          // Proximity alert on right (high-frequency) motor — more
          // perceptible for the short bursts around near misses.
          let nearest = Infinity;
          for (const a of s.asteroids) {
            const dx = a.x - s.ship.x;
            const dy = a.y - s.ship.y;
            const edgeDist = Math.sqrt(dx * dx + dy * dy) - a.radius;
            if (edgeDist < nearest) nearest = edgeDist;
          }
          // Quadratic falloff over 70px so rumble only fires when
          // asteroids are genuinely close.
          const t = Math.max(0, Math.min(1, 1 - nearest / 70));
          const prox = t * t * 0.45;
          controller.right?.rumble(prox);
        } else if (s.phase === "DEAD") {
          // Handled by phase transition, but keep writing 0 to clear
          controller.right?.rumble(0);
        } else {
          controller.right?.rumble(0);
        }
      }

      // ── Lightbar (~10Hz) ──
      if (now - lastLightbar > 100) {
        lastLightbar = now;
        if (s.phase === "PLAYING" || s.phase === "DEAD") {
          const color = getLivesColor(s.lives);
          if (s.lives <= 1 && s.lives > 0 && s.phase === "PLAYING") {
            if (now - lastLightbarFlashToggle > 300) {
              lastLightbarFlashToggle = now;
              lightbarFlashOn = !lightbarFlashOn;
            }
            controller.lightbar?.set(
              lightbarFlashOn ? color : { r: 20, g: 0, b: 0 },
            );
          } else if (s.ship.invulnerable > 0 && s.phase === "PLAYING") {
            // Pulse white during invulnerability
            const pulseVal = 0.5 + Math.sin(now / 80) * 0.5;
            controller.lightbar?.set({
              r: Math.round(120 + pulseVal * 80),
              g: Math.round(120 + pulseVal * 80),
              b: Math.round(180 + pulseVal * 60),
            });
          } else {
            controller.lightbar?.set(color);
          }
        } else if (s.phase === "WAVE_CLEAR") {
          controller.lightbar?.set({ r: 255, g: 255, b: 255 });
        }
      }

      // ── Trigger effects (~5Hz) ──
      if (now - lastTrigger > 200) {
        lastTrigger = now;
        if (s.phase === "PLAYING") {
          // R2: primary fire — weapon click-stop feel
          controller.right?.trigger?.feedback?.set({
            effect: TriggerEffect.Weapon,
            start: 0.15,
            end: 0.45,
            strength: 0.7,
          });

          // L2: spread shot — weapon click when ammo available,
          // cleared when empty so the trigger goes slack.
          if (s.spreadAmmo > 0) {
            controller.left?.trigger?.feedback?.set({
              effect: TriggerEffect.Weapon,
              start: 0.2,
              end: 0.5,
              strength: 0.9,
            });
          } else {
            controller.left?.trigger?.feedback?.reset();
          }
        }
      }

      // Throttle re-render to ~60fps. state updates from reducer already
      // force re-renders, but we also force a tick for phase timer overlays.
      if (now - lastRenderAt > 16) {
        lastRenderAt = now;
        renderTickRef.current++;
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

  // Player LEDs — one per life
  useEffect(() => {
    if (!controller?.playerLeds) return;
    for (let i = 0; i < 5; i++) {
      controller.playerLeds.setLed(i, i < state.lives);
    }
  }, [controller, state.lives]);

  // Phase transition one-shots: audio, rumble bursts, mute LED
  useEffect(() => {
    if (!controller) return;
    const prev = prevPhaseRef.current;
    const curr = state.phase;
    prevPhaseRef.current = curr;
    if (prev === curr) return;

    if (curr === "DEAD") {
      controller.left?.rumble(1);
      controller.right?.rumble(0.6);
      controller.mute?.setLed(MuteLedMode.Pulse);
      playDeathSound(controller);
      const t1 = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 300);
      return () => {
        clearTimeout(t1);
      };
    }

    if (curr === "WAVE_CLEAR") {
      playWaveClearSound(controller);
      controller.right?.rumble(0.35);
      controller.left?.rumble(0.35);
      const t = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 250);
      return () => clearTimeout(t);
    }

    if (curr === "PLAYING" && prev === "DEAD") {
      controller.mute?.setLed(MuteLedMode.On);
      const t = setTimeout(() => controller.mute?.resetLed(), 2000);
      return () => clearTimeout(t);
    }

    if (curr === "GAME_OVER") {
      controller.left?.rumble(0);
      controller.right?.rumble(0);
      controller.right?.trigger?.feedback?.reset();
      controller.left?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 80, g: 0, b: 0 });
      controller.mute?.resetLed();
    }

    if (curr === "TITLE") {
      controller.left?.rumble(0);
      controller.right?.rumble(0);
      controller.right?.trigger?.feedback?.reset();
      controller.left?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 0, g: 30, b: 80 });
      controller.mute?.resetLed();
    }
  }, [controller, state.phase]);

  // Fire/destroy audio — observe the timestamp refs on the state
  const lastFireAudioRef = useRef(0);
  const lastDestroyAudioRef = useRef(0);
  useEffect(() => {
    if (!controller) return;
    if (
      state.fireFlashAt !== lastFireAudioRef.current &&
      state.fireFlashAt !== 0
    ) {
      const prev = lastFireAudioRef.current;
      lastFireAudioRef.current = state.fireFlashAt;
      // Only play on actual new fire (non-initial)
      if (prev !== 0 || state.phase === "PLAYING") {
        playFireSound(controller);
      }
    }
    if (
      state.destroyFlashAt !== lastDestroyAudioRef.current &&
      state.destroyFlashAt !== 0
    ) {
      lastDestroyAudioRef.current = state.destroyFlashAt;
      playDestroySound(controller);
    }
  }, [controller, state.fireFlashAt, state.destroyFlashAt, state.phase]);

  // Spread audio (separate — uses the lastSpreadAt timestamp)
  const lastSpreadAudioRef = useRef(0);
  useEffect(() => {
    if (!controller) return;
    if (
      state.lastSpreadAt !== lastSpreadAudioRef.current &&
      state.lastSpreadAt !== 0
    ) {
      lastSpreadAudioRef.current = state.lastSpreadAt;
      playSpreadSound(controller);
    }
  }, [controller, state.lastSpreadAt]);

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

  const shipThrusting = (() => {
    if (state.phase !== "PLAYING" || !controller) return false;
    const lx = controller.left?.analog?.x?.state ?? 0;
    const ly = controller.left?.analog?.y?.state ?? 0;
    return Math.sqrt(lx * lx + ly * ly) > MOVE_DEADZONE;
  })();

  // Ship blink during invulnerability / death
  const shipBlink = (() => {
    if (state.phase === "DEAD") {
      return Math.floor(performance.now() / 80) % 2 === 0;
    }
    if (state.ship.invulnerable > 0) {
      return Math.floor(performance.now() / 100) % 2 === 0;
    }
    return false;
  })();

  const shipVisible = state.phase !== "TITLE" && state.phase !== "GAME_OVER";

  return (
    <PageContainer>
      <Header>
        <PageTitle>Asteroids</PageTitle>
        <PageSubtitle>Twin-stick arcade shooter.</PageSubtitle>
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
            <ScoreItem>Wave {state.wave}</ScoreItem>
            <Spacer />
            <LivesRow title="Lives">
              {Array.from({ length: STARTING_LIVES }, (_, i) => (
                <LifeIcon key={i} $alive={i < state.lives} />
              ))}
            </LivesRow>
            <SpreadDots title="Spread ammo">
              {Array.from({ length: MAX_SPREAD }, (_, i) => (
                <SpreadDot key={i} $active={i < state.spreadAmmo} />
              ))}
            </SpreadDots>
          </ScoreHeader>

          <Arena>
            {state.asteroids.map((a) => (
              <AsteroidEl
                key={a.id}
                $size={a.size}
                style={{
                  left: `${a.x - a.radius}px`,
                  top: `${a.y - a.radius}px`,
                  clipPath: a.shape,
                  transform: `rotate(${a.rotation}deg)`,
                }}
              />
            ))}

            {state.bullets.map((b) => (
              <BulletEl
                key={b.id}
                style={{ left: `${b.x}px`, top: `${b.y}px` }}
              />
            ))}

            {state.particles.map((p) => (
              <ParticleEl
                key={p.id}
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  opacity: p.ttl / p.life,
                }}
              />
            ))}

            {shipThrusting && shipVisible && state.phase === "PLAYING" && (
              <ThrustFlame
                style={{
                  left: `${state.ship.x - Math.cos(state.ship.angle) * 14 - 4}px`,
                  top: `${state.ship.y - Math.sin(state.ship.angle) * 14 - 3}px`,
                  transform: `rotate(${(state.ship.angle * 180) / Math.PI + 180}deg)`,
                }}
              />
            )}

            {shipVisible && (
              <ShipEl
                $thrusting={shipThrusting}
                $blink={shipBlink}
                style={{
                  left: `${state.ship.x - 9}px`,
                  top: `${state.ship.y - 10}px`,
                  transform: `rotate(${state.ship.angle}rad)`,
                }}
              />
            )}

            {state.phase === "TITLE" && (
              <Overlay $dim>
                <TitleText>ASTEROIDS</TitleText>
                <SubText>
                  Left stick to fly &middot; Right stick to aim
                  <br />
                  R2: fire &middot; L2: spread shot &middot; Triangle: pause
                </SubText>
                <PromptText>Press &times; to start</PromptText>
                {state.highScore > 0 && (
                  <SubText style={{ marginTop: 16, marginBottom: 0 }}>
                    Best: {state.highScore}
                  </SubText>
                )}
              </Overlay>
            )}

            {state.phase === "WAVE_CLEAR" && (
              <Overlay>
                <WaveClearLabel>WAVE {state.wave} CLEAR</WaveClearLabel>
                <SubText style={{ marginTop: 8 }}>
                  +{200 * state.wave} bonus
                </SubText>
              </Overlay>
            )}

            {state.phase === "PAUSED" && (
              <Overlay $dim>
                <PausedLabel>PAUSED</PausedLabel>
                <SubText style={{ marginTop: 16 }}>
                  Triangle to resume
                </SubText>
              </Overlay>
            )}

            {state.phase === "GAME_OVER" && (
              <Overlay $dim>
                <GameOverLabel>GAME OVER</GameOverLabel>
                <BigScore>{state.score}</BigScore>
                <SubText>
                  Wave {state.wave} &middot; {state.destroyed} destroyed
                  {state.score === state.highScore &&
                    state.score > 0 &&
                    " \u2014 new best!"}
                </SubText>
                <PromptText>Press &times; to try again</PromptText>
              </Overlay>
            )}
          </Arena>

          {(state.phase === "PLAYING" ||
            state.phase === "DEAD" ||
            state.phase === "WAVE_CLEAR" ||
            state.phase === "PAUSED") && (
            <StatsRow>
              <span>Destroyed {state.destroyed}</span>
              {state.highScore > 0 && <span>Best {state.highScore}</span>}
            </StatsRow>
          )}
        </OverlayContent>
      </GameArea>

      <DescriptionSection>
        <DescriptionHeading>Controller Features</DescriptionHeading>
        <FeatureList>
          <li><strong>Dual analog sticks</strong> &mdash; Left stick controls ship movement with acceleration and friction physics. Right stick sets aim direction. Each stick is read via <code>.angle</code> and <code>.magnitude</code>, which apply the stick's configured <code>.deadzone</code> and rescale the live range to 0..1. Movement uses a 0.15 deadzone, aim uses 0.25 — set at mount and restored on unmount.</li>
          <li><strong>Adaptive triggers</strong> &mdash; <code>R2</code> fires the primary weapon (one bullet per 150ms while held past the click-stop). <code>L2</code> fires a seven-bullet spread on each pull — the trigger uses <code>TriggerEffect.Weapon</code> when spread ammo is available and resets when empty, giving you a physical sense of the remaining charges.</li>
          <li><strong>Face buttons</strong> &mdash; <code>Cross</code> to start / restart / skip death, <code>Triangle</code> to pause. Discrete actions via <code>.on("press", ...)</code>.</li>
          <li><strong>Rumble</strong> &mdash; Right (high-frequency) motor carries a proximity alert proportional to the nearest asteroid's edge distance, with a quadratic falloff over 70px so it only kicks in on near misses. Written from the rAF loop at 10Hz to stay within HID bandwidth. Both motors also fire coordinated bursts during death, wave clear, and spread shots via phase transitions.</li>
          <li><strong>Lightbar</strong> &mdash; Maps to remaining lives: green&rarr;yellow&rarr;red. Flashes on last life, pulses white during respawn invulnerability, bright white on wave clear.</li>
          <li><strong>Player LEDs</strong> &mdash; 5 LEDs = 5 lives. Turn off right-to-left as lives are lost. Reset on restart.</li>
          <li><strong>Mute LED</strong> &mdash; <code>MuteLedMode.Pulse</code> during death animation, <code>On</code> during post-respawn invulnerability, off otherwise.</li>
          <li><strong>Speaker (test tones)</strong> &mdash; Short 1kHz chirps on fire, 100Hz thuds on asteroid destruction, dual-tone patterns on death and wave clear via <code>startTestTone</code> / <code>stopTestTone</code>.</li>
        </FeatureList>

        <DescriptionHeading>Implementation Notes</DescriptionHeading>
        <p>The game runs on a consolidated <code>requestAnimationFrame</code> loop using a fixed-timestep physics update (1/60s) with an accumulator capped to prevent runaway after a backgrounded tab. All rapid HID writes (rumble, lightbar, trigger effects) live in this same loop, throttled independently to avoid flooding the USB connection.</p>

        <CodeBlock code={`// Per-stick deadzones — set once at mount, restored on unmount.
controller.left.analog.deadzone = 0.15;   // movement
controller.right.analog.deadzone = 0.25;  // aim

// .magnitude applies the deadzone and rescales to 0..1.
// .angle is atan2(y, x) in stick-space (y positive up); negate
// for screen-space math (y positive down).
const moveMag = controller.left.analog.magnitude;
const moveAngle = -controller.left.analog.angle;
const aimMag = controller.right.analog.magnitude;
const aimAngle = -controller.right.analog.angle;

// Left stick → acceleration along stick direction
if (moveMag > 0) {
  vx += Math.cos(moveAngle) * moveMag * ACCEL * dt;
  vy += Math.sin(moveAngle) * moveMag * ACCEL * dt;
}

// Right stick → aim
if (aimMag > 0) ship.angle = aimAngle;

// R2 held → primary fire (rate limited)
// L2 edge-triggered → spread shot
if (r2 > 0.5 && timeSinceLastFire > 150) spawnBullet();
if (prevL2 < 0.5 && l2 >= 0.5 && spreadAmmo > 0) fireSpread();`} />

        <p>Entity positions use inline <code>style</code> rather than styled-component props. The reducer stores arrays of bullets, asteroids, and particles &mdash; each tick filters out expired entities and appends new ones (splits, particles, fresh bullets). Asteroid clip-path polygons are generated once at spawn time and stored on the entity so their irregular shape is cached.</p>

        <CodeBlock code={`// R2 is primary fire — a click-stop keeps the break point tactile.
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.15, end: 0.45, strength: 0.7,
});

// L2 fires the spread. Weapon effect while ammo remains, so the
// trigger physically signals when you're out of charges.
if (spreadAmmo > 0) {
  controller.left.trigger.feedback.set({
    effect: TriggerEffect.Weapon,
    start: 0.2, end: 0.5, strength: 0.9,
  });
} else {
  controller.left.trigger.feedback.reset();
}`} />

        <p>Asteroids split on hit: large &rarr; two medium, medium &rarr; two small, small &rarr; destroyed. Child velocities are the parent velocity rotated &plusmn;45&ndash;90&deg; and scaled up, producing the classic spreading pattern. Wave generation adds more large asteroids with each wave and introduces medium asteroids from wave 4 onward.</p>
      </DescriptionSection>
    </PageContainer>
  );
};

export default AsteroidsPage;
