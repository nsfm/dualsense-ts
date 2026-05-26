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
  | "WAVE_CLEAR"
  | "GAME_OVER"
  | "VICTORY"
  | "PAUSED";

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  angularVel: number;
}

interface Missile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  life: number; // 0..1, counts down toward 0
  maxLife: number;
  radius: number;
}

interface ShieldInput {
  active: boolean;
  angle: number; // screen-space radians: 0=right, π/2=down, -π/2=up
}

interface GameState {
  phase: GamePhase;
  prevPhase: GamePhase;
  waveIndex: number;
  hp: number;
  asteroids: Asteroid[];
  missiles: Missile[];
  explosions: Explosion[];
  toSpawn: number;
  spawnTimer: number;
  r2Cooldown: number;
  l2Cooldown: number;
  prevR2: number;
  prevL2: number;
  shield1: ShieldInput;
  shield2: ShieldInput;
  empUses: number;
  empFlashAt: number;
  shieldBlockAt: number;
  missileKillAt: number;
  baseHitAt: number;
  score: number;
  bestScore: number;
  phaseTimer: number;
  elapsedMs: number;
  nextId: number;
}

type GameAction =
  | { type: "START_GAME" }
  | { type: "RESTART" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "EMP_PRESS" }
  | {
      type: "TICK";
      dt: number;
      now: number;
      shield1: ShieldInput;
      shield2: ShieldInput;
      r2: number;
      l2: number;
    };

/* ── Constants ─────────────────────────────────────────────────── */

const ARENA = 520;
const CENTER_X = ARENA / 2;
const CENTER_Y = ARENA / 2;

const BASE_RADIUS = 26;
const BASE_CORE_RADIUS = 14;
const SHIELD_RING_RADIUS = 110;
const SHIELD_THICKNESS = 9;
const SHIELD_ARC_1 = Math.PI / 3; // 60°
const SHIELD_ARC_2 = (Math.PI * 2) / 9; // 40°
const ASTEROID_SPAWN_RADIUS = 310;
const ARENA_CULL_RADIUS = 340; // beyond this asteroids are culled
const MISSILE_SPEED = 460;
const MISSILE_COOLDOWN = 0.3;
const MISSILE_LIFETIME = 1.1;
const MISSILE_RADIUS = 4;
const MAX_HP = 5;
const EMP_USES_PER_WAVE = 2;
const EMP_RADIUS = 150;
const EMP_FLASH_DURATION = 0.45;
const WAVE_CLEAR_DURATION = 1.8;
const TRIGGER_EDGE = 0.65;

/* ── Wave configuration ────────────────────────────────────────── */

interface WaveConfig {
  count: number;
  minSpeed: number;
  maxSpeed: number;
  minR: number;
  maxR: number;
  spawnInterval: number;
  burstSize: number;
}

const WAVES: WaveConfig[] = [
  { count: 10, minSpeed: 55, maxSpeed: 80, minR: 14, maxR: 22, spawnInterval: 0.9, burstSize: 1 },
  { count: 14, minSpeed: 75, maxSpeed: 105, minR: 12, maxR: 20, spawnInterval: 0.7, burstSize: 1 },
  { count: 18, minSpeed: 95, maxSpeed: 135, minR: 10, maxR: 18, spawnInterval: 0.55, burstSize: 1 },
  { count: 24, minSpeed: 115, maxSpeed: 165, minR: 9, maxR: 16, spawnInterval: 0.45, burstSize: 2 },
  { count: 34, minSpeed: 135, maxSpeed: 200, minR: 8, maxR: 15, spawnInterval: 0.32, burstSize: 2 },
];

/* ── Pure helpers ──────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function rand(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo);
}

function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function inShieldArc(
  asteroidAngle: number,
  shield: ShieldInput,
  arcWidth: number,
): boolean {
  if (!shield.active) return false;
  return Math.abs(angleDiff(asteroidAngle, shield.angle)) < arcWidth / 2;
}

function spawnAsteroid(cfg: WaveConfig, id: number): Asteroid {
  const spawnAngle = rand(0, Math.PI * 2);
  const x = CENTER_X + Math.cos(spawnAngle) * ASTEROID_SPAWN_RADIUS;
  const y = CENTER_Y + Math.sin(spawnAngle) * ASTEROID_SPAWN_RADIUS;
  // Velocity heads toward center with a slight tangential jitter
  const speed = rand(cfg.minSpeed, cfg.maxSpeed);
  const toCenter = Math.atan2(CENTER_Y - y, CENTER_X - x);
  const jitter = rand(-0.15, 0.15); // ±~8.5°
  const dir = toCenter + jitter;
  return {
    id,
    x,
    y,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    radius: rand(cfg.minR, cfg.maxR),
    rotation: rand(0, Math.PI * 2),
    angularVel: rand(-1.6, 1.6),
  };
}

function makeMissile(id: number, angle: number): Missile {
  return {
    id,
    x: CENTER_X + Math.cos(angle) * (BASE_RADIUS + 6),
    y: CENTER_Y + Math.sin(angle) * (BASE_RADIUS + 6),
    vx: Math.cos(angle) * MISSILE_SPEED,
    vy: Math.sin(angle) * MISSILE_SPEED,
    life: MISSILE_LIFETIME,
  };
}

function makeExplosion(id: number, x: number, y: number, radius: number): Explosion {
  const maxLife = 0.35 + Math.min(0.2, radius * 0.01);
  return { id, x, y, life: maxLife, maxLife, radius };
}

/* ── Audio (speaker test tones) ────────────────────────────────── */

function playShieldClick(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 18);
}

function playMissilePop(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 30);
}

function playBaseHit(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 180);
}

function playEmpBurst(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 60);
    }, 40);
  }, 120);
}

function playWaveClear(controller: Dualsense) {
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 120);
    }, 70);
  }, 80);
}

function playVictory(controller: Dualsense) {
  const steps = [0, 90, 160, 240];
  steps.forEach((t, i) => {
    setTimeout(() => {
      controller.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(
        () => controller.stopTestTone().catch(() => {}),
        i === steps.length - 1 ? 220 : 70,
      );
    }, t);
  });
}

function playGameOver(controller: Dualsense) {
  controller.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => controller.stopTestTone().catch(() => {}), 500);
}

/* ── Reducer ───────────────────────────────────────────────────── */

function initialState(bestScore = 0): GameState {
  return {
    phase: "TITLE",
    prevPhase: "TITLE",
    waveIndex: 0,
    hp: MAX_HP,
    asteroids: [],
    missiles: [],
    explosions: [],
    toSpawn: 0,
    spawnTimer: 0,
    r2Cooldown: 0,
    l2Cooldown: 0,
    prevR2: 0,
    prevL2: 0,
    shield1: { active: false, angle: 0 },
    shield2: { active: false, angle: 0 },
    empUses: EMP_USES_PER_WAVE,
    empFlashAt: 0,
    shieldBlockAt: 0,
    missileKillAt: 0,
    baseHitAt: 0,
    score: 0,
    bestScore,
    phaseTimer: 0,
    elapsedMs: 0,
    nextId: 1,
  };
}

function startWave(state: GameState, waveIndex: number): GameState {
  const cfg = WAVES[waveIndex];
  return {
    ...state,
    phase: "PLAYING",
    waveIndex,
    asteroids: [],
    missiles: [],
    explosions: [],
    toSpawn: cfg.count,
    spawnTimer: 0.6, // small grace period
    empUses: EMP_USES_PER_WAVE,
    phaseTimer: 0,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return startWave(
        {
          ...initialState(state.bestScore),
          hp: MAX_HP,
        },
        0,
      );

    case "RESTART":
      return startWave(
        {
          ...initialState(state.bestScore),
          hp: MAX_HP,
        },
        0,
      );

    case "TOGGLE_PAUSE":
      if (state.phase === "PLAYING") {
        return { ...state, phase: "PAUSED", prevPhase: "PLAYING" };
      }
      if (state.phase === "PAUSED") {
        return { ...state, phase: state.prevPhase, prevPhase: "PLAYING" };
      }
      return state;

    case "EMP_PRESS": {
      if (state.phase !== "PLAYING") return state;
      if (state.empUses <= 0) return state;
      // Destroy all asteroids within EMP_RADIUS of the base
      const survivors: Asteroid[] = [];
      const explosions: Explosion[] = [...state.explosions];
      let nextId = state.nextId;
      let killed = 0;
      for (const a of state.asteroids) {
        const dx = a.x - CENTER_X;
        const dy = a.y - CENTER_Y;
        if (dx * dx + dy * dy < EMP_RADIUS * EMP_RADIUS) {
          explosions.push(makeExplosion(nextId++, a.x, a.y, a.radius));
          killed++;
        } else {
          survivors.push(a);
        }
      }
      return {
        ...state,
        asteroids: survivors,
        explosions,
        empUses: state.empUses - 1,
        empFlashAt: performance.now(),
        score: state.score + killed * (state.waveIndex + 1) * 2,
        nextId,
      };
    }

    case "TICK": {
      if (state.phase === "TITLE" || state.phase === "GAME_OVER") return state;
      if (state.phase === "VICTORY" || state.phase === "PAUSED") return state;

      const { dt, now, shield1, shield2, r2, l2 } = action;

      if (state.phase === "WAVE_CLEAR") {
        const remaining = state.phaseTimer - dt;
        if (remaining <= 0) {
          const next = state.waveIndex + 1;
          if (next >= WAVES.length) {
            const newBest = Math.max(state.bestScore, state.score);
            return {
              ...state,
              phase: "VICTORY",
              bestScore: newBest,
              phaseTimer: 0,
            };
          }
          return startWave(
            { ...state, hp: Math.min(MAX_HP, state.hp + 1) },
            next,
          );
        }
        return { ...state, phaseTimer: remaining };
      }

      // PLAYING
      const cfg = WAVES[state.waveIndex];

      let nextId = state.nextId;
      let toSpawn = state.toSpawn;
      let spawnTimer = state.spawnTimer - dt;
      const asteroids: Asteroid[] = [];
      const explosions: Explosion[] = [];
      const missiles: Missile[] = [];

      // Spawn asteroids according to wave config
      while (spawnTimer <= 0 && toSpawn > 0) {
        const burst = Math.min(cfg.burstSize, toSpawn);
        for (let i = 0; i < burst; i++) {
          asteroids.push(spawnAsteroid(cfg, nextId++));
          toSpawn--;
        }
        spawnTimer += cfg.spawnInterval;
      }
      if (toSpawn === 0) spawnTimer = 0;

      // Carry forward existing explosions
      for (const e of state.explosions) {
        const life = e.life - dt;
        if (life > 0) explosions.push({ ...e, life });
      }

      // Carry forward asteroids (move, collide with shields, collide with base)
      let hp = state.hp;
      let score = state.score;
      let shieldBlockAt = state.shieldBlockAt;
      let baseHitAt = state.baseHitAt;
      let missileKillAt = state.missileKillAt;
      const waveMult = state.waveIndex + 1;

      for (const src of state.asteroids) {
        const a: Asteroid = {
          ...src,
          x: src.x + src.vx * dt,
          y: src.y + src.vy * dt,
          rotation: src.rotation + src.angularVel * dt,
        };
        const dx = a.x - CENTER_X;
        const dy = a.y - CENTER_Y;
        const distSq = dx * dx + dy * dy;

        // Cull if wandered outside the arena (jittered miss)
        if (distSq > ARENA_CULL_RADIUS * ARENA_CULL_RADIUS) {
          continue;
        }

        // Base collision
        const baseHitRSq = (BASE_RADIUS + a.radius) * (BASE_RADIUS + a.radius);
        if (distSq < baseHitRSq) {
          hp = Math.max(0, hp - 1);
          baseHitAt = now;
          explosions.push(makeExplosion(nextId++, a.x, a.y, a.radius * 1.3));
          continue;
        }

        // Shield collision — treat shield ring as a band of thickness.
        const dist = Math.sqrt(distSq);
        const inBand =
          dist < SHIELD_RING_RADIUS + a.radius + SHIELD_THICKNESS / 2 &&
          dist > SHIELD_RING_RADIUS - a.radius - SHIELD_THICKNESS / 2;

        if (inBand) {
          const ang = Math.atan2(dy, dx);
          const blocked =
            inShieldArc(ang, shield1, SHIELD_ARC_1) ||
            inShieldArc(ang, shield2, SHIELD_ARC_2);
          if (blocked) {
            explosions.push(makeExplosion(nextId++, a.x, a.y, a.radius));
            score += waveMult;
            shieldBlockAt = now;
            continue;
          }
        }

        asteroids.push(a);
      }

      // Missile firing — edge-triggered on rising R2/L2
      let r2Cooldown = Math.max(0, state.r2Cooldown - dt);
      let l2Cooldown = Math.max(0, state.l2Cooldown - dt);

      if (
        r2 > TRIGGER_EDGE &&
        state.prevR2 <= TRIGGER_EDGE &&
        r2Cooldown === 0 &&
        shield1.active
      ) {
        missiles.push(makeMissile(nextId++, shield1.angle));
        r2Cooldown = MISSILE_COOLDOWN;
      }
      if (
        l2 > TRIGGER_EDGE &&
        state.prevL2 <= TRIGGER_EDGE &&
        l2Cooldown === 0 &&
        (shield2.active || shield1.active)
      ) {
        // L2 prefers shield2; falls back to shield1 if only one finger is down
        const targetAngle = shield2.active ? shield2.angle : shield1.angle;
        missiles.push(makeMissile(nextId++, targetAngle));
        l2Cooldown = MISSILE_COOLDOWN;
      }

      // Carry forward existing missiles, collide with remaining asteroids
      const liveMissiles: Missile[] = missiles;
      const finalAsteroids: Asteroid[] = [];
      const asteroidAlive = asteroids.map(() => true);

      for (const src of state.missiles) {
        const life = src.life - dt;
        if (life <= 0) continue;
        const m: Missile = {
          ...src,
          x: src.x + src.vx * dt,
          y: src.y + src.vy * dt,
          life,
        };
        // Cull if wandered far
        const mdx = m.x - CENTER_X;
        const mdy = m.y - CENTER_Y;
        if (mdx * mdx + mdy * mdy > ARENA_CULL_RADIUS * ARENA_CULL_RADIUS) {
          continue;
        }
        // Check against asteroids
        let hit = false;
        for (let i = 0; i < asteroids.length; i++) {
          if (!asteroidAlive[i]) continue;
          const a = asteroids[i];
          const adx = a.x - m.x;
          const ady = a.y - m.y;
          const hitR = a.radius + MISSILE_RADIUS;
          if (adx * adx + ady * ady < hitR * hitR) {
            asteroidAlive[i] = false;
            explosions.push(makeExplosion(nextId++, a.x, a.y, a.radius));
            score += waveMult * 2;
            missileKillAt = now;
            hit = true;
            break;
          }
        }
        if (!hit) liveMissiles.push(m);
      }

      for (let i = 0; i < asteroids.length; i++) {
        if (asteroidAlive[i]) finalAsteroids.push(asteroids[i]);
      }

      // Wave clear — all spawned, none remaining
      let phase: GamePhase = state.phase;
      let phaseTimer = state.phaseTimer;
      if (
        hp > 0 &&
        toSpawn === 0 &&
        finalAsteroids.length === 0 &&
        liveMissiles.length === 0
      ) {
        phase = "WAVE_CLEAR";
        phaseTimer = WAVE_CLEAR_DURATION;
      }

      // Game over
      if (hp <= 0) {
        phase = "GAME_OVER";
        phaseTimer = 0;
      }

      return {
        ...state,
        phase,
        phaseTimer,
        hp,
        asteroids: finalAsteroids,
        missiles: liveMissiles,
        explosions,
        toSpawn,
        spawnTimer,
        r2Cooldown,
        l2Cooldown,
        prevR2: r2,
        prevL2: l2,
        shield1,
        shield2,
        shieldBlockAt,
        missileKillAt,
        baseHitAt,
        score,
        elapsedMs:
          state.phase === "PLAYING"
            ? state.elapsedMs + dt * 1000
            : state.elapsedMs,
        nextId,
      };
    }

    default:
      return state;
  }
}

/* ── Animations ────────────────────────────────────────────────── */

const pulseAnim = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const baseCorePulse = keyframes`
  0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
`;

const starField = keyframes`
  from { background-position: 0 0, 0 0, 0 0; }
  to { background-position: 520px 260px, -260px 520px, 130px -260px; }
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

const HpRow = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const HpPip = styled.span<{ $alive: boolean; $low: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) =>
    p.$alive
      ? p.$low
        ? "rgba(255, 100, 100, 0.9)"
        : "rgba(100, 220, 140, 0.85)"
      : "rgba(191, 204, 214, 0.15)"};
  box-shadow: ${(p) =>
    p.$alive && p.$low ? "0 0 6px rgba(255, 100, 100, 0.6)" : "none"};
  transition:
    background 0.2s,
    box-shadow 0.2s;
`;

const Arena = styled.div<{ $locked: boolean }>`
  position: relative;
  width: ${ARENA}px;
  height: ${ARENA}px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: ${(p) => (p.$locked ? "none" : "pointer")};
  background:
    radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.4) 0.5px, transparent 1px),
    radial-gradient(circle at 35% 80%, rgba(255, 255, 255, 0.3) 0.5px, transparent 1px),
    radial-gradient(
      circle at center,
      rgba(15, 20, 40, 0.95),
      rgba(8, 10, 22, 1) 70%
    );
  background-size:
    260px 260px,
    260px 260px,
    260px 260px,
    auto;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  animation: ${starField} 60s linear infinite;
`;

const LockHintBar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
  min-height: 24px;
`;

const LockHint = styled.div`
  padding: 4px 10px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(72, 175, 240, 0.3);
  border-radius: 14px;
  font-size: 11px;
  color: rgba(72, 175, 240, 0.85);
  font-family: "Fira Code", monospace;
  white-space: nowrap;
`;

const OrbitRing = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${SHIELD_RING_RADIUS * 2}px;
  height: ${SHIELD_RING_RADIUS * 2}px;
  border-radius: 50%;
  border: 1px dashed rgba(72, 175, 240, 0.15);
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const BaseEl = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${BASE_RADIUS * 2}px;
  height: ${BASE_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(120, 180, 255, 0.35),
    rgba(40, 80, 180, 0.2) 70%,
    transparent
  );
  border: 1px solid rgba(120, 180, 255, 0.45);
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow:
    0 0 12px rgba(72, 175, 240, 0.3),
    inset 0 0 8px rgba(120, 180, 255, 0.25);
`;

const BaseCore = styled.div<{ $hpRatio: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${BASE_CORE_RADIUS * 2}px;
  height: ${BASE_CORE_RADIUS * 2}px;
  border-radius: 50%;
  background: ${(p) =>
    p.$hpRatio > 0.6
      ? "radial-gradient(circle, rgba(100, 255, 180, 0.95), rgba(0, 180, 120, 0.5))"
      : p.$hpRatio > 0.3
        ? "radial-gradient(circle, rgba(255, 220, 100, 0.95), rgba(200, 140, 0, 0.55))"
        : "radial-gradient(circle, rgba(255, 100, 100, 0.95), rgba(200, 40, 40, 0.6))"};
  pointer-events: none;
  animation: ${baseCorePulse} 1.6s ease-in-out infinite;
`;

const AsteroidEl = styled.div<{ $radius: number }>`
  position: absolute;
  width: ${(p) => p.$radius * 2}px;
  height: ${(p) => p.$radius * 2}px;
  border-radius: 45% 55% 40% 60% / 50% 45% 55% 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(180, 170, 160, 0.9),
    rgba(110, 100, 95, 0.85) 60%,
    rgba(70, 60, 55, 0.85)
  );
  border: 1px solid rgba(60, 50, 45, 0.6);
  pointer-events: none;
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.12),
    inset -3px -3px 6px rgba(0, 0, 0, 0.45);
`;

const MissileEl = styled.div`
  position: absolute;
  width: ${MISSILE_RADIUS * 2}px;
  height: ${MISSILE_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 200, 1),
    rgba(255, 180, 60, 0.9) 60%,
    rgba(255, 100, 40, 0.2)
  );
  box-shadow:
    0 0 6px rgba(255, 200, 100, 0.9),
    0 0 12px rgba(255, 160, 60, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

const ExplosionEl = styled.div<{ $progress: number; $radius: number }>`
  position: absolute;
  width: ${(p) => p.$radius * 2}px;
  height: ${(p) => p.$radius * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 220, 160, ${(p) => 0.9 * (1 - p.$progress)}),
    rgba(255, 120, 60, ${(p) => 0.6 * (1 - p.$progress)}) 60%,
    transparent
  );
  transform: translate(-50%, -50%)
    scale(${(p) => 0.8 + p.$progress * 1.4});
  pointer-events: none;
`;

const EmpFlashEl = styled.div<{ $alpha: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${EMP_RADIUS * 2}px;
  height: ${EMP_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(120, 220, 255, ${(p) => p.$alpha * 0.5}),
    rgba(72, 175, 240, ${(p) => p.$alpha * 0.3}) 60%,
    transparent
  );
  border: 2px solid rgba(120, 220, 255, ${(p) => p.$alpha});
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const ShieldSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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
  background: ${(p) => (p.$dim ? "rgba(0, 0, 0, 0.55)" : "transparent")};
  z-index: 5;
  pointer-events: none;
`;

const TitleText = styled.div`
  font-size: 30px;
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

const WaveClearLabel = styled.div`
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

const BigScore = styled.div`
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

/* ── Description ───────────────────────────────────────────────── */

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

/* ── Shield arc path helper ────────────────────────────────────── */

function shieldArcPath(angle: number, arcWidth: number): string {
  const start = angle - arcWidth / 2;
  const end = angle + arcWidth / 2;
  const r = SHIELD_RING_RADIUS;
  const sx = CENTER_X + Math.cos(start) * r;
  const sy = CENTER_Y + Math.sin(start) * r;
  const ex = CENTER_X + Math.cos(end) * r;
  const ey = CENTER_Y + Math.sin(end) * r;
  const largeArc = arcWidth > Math.PI ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
}

/* ── Component ─────────────────────────────────────────────────── */

const OrbitDefensePage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    initialState(0),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const gameLoopRef = useRef<number>(0);
  const prevPhaseRef = useRef<GamePhase>("TITLE");
  const lastBlockAudioRef = useRef(0);
  const lastMissileKillAudioRef = useRef(0);
  const lastBaseHitAudioRef = useRef(0);
  const arenaRef = useRef<HTMLDivElement>(null);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [, forceRender] = useState(0);

  // Pointer Lock — captures the OS cursor so touchpad input doesn't drift it
  // around. The touchpad HID stream is unaffected; mouse events still fire but
  // as deltas with no visible cursor. Esc releases.
  useEffect(() => {
    const onLockChange = () => {
      setPointerLocked(document.pointerLockElement === arenaRef.current);
    };
    document.addEventListener("pointerlockchange", onLockChange);
    return () => {
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === arenaRef.current) {
        document.exitPointerLock();
      }
    };
  }, []);

  // While locked, freeze the page scroll. Two-finger touchpad input emits
  // scroll events that route to whatever element is under the (invisible)
  // OS cursor, which isn't necessarily the arena — so we must intercept on
  // window in capture mode. Belt-and-suspenders: also lock overflow on both
  // <html> and <body>, and preventDefault touchmove for mobile-style
  // gestures that may reach here.
  useEffect(() => {
    if (!pointerLocked) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const swallow = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", swallow, { passive: false, capture: true });
    window.addEventListener("touchmove", swallow, { passive: false, capture: true });
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("wheel", swallow, { capture: true });
      window.removeEventListener("touchmove", swallow, { capture: true });
    };
  }, [pointerLocked]);

  const requestLock = () => {
    const el = arenaRef.current;
    if (!el || document.pointerLockElement === el) return;
    el.requestPointerLock?.();
  };

  // Track connection state
  useEffect(() => {
    if (!controller?.connection) return;
    const handler = () => setConnected(!!controller.connection.state);
    handler();
    controller.connection.on("change", handler);
    return () => {
      controller.connection.removeListener("change", handler);
    };
  }, [controller]);

  // Cross — start / restart
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "TITLE") dispatch({ type: "START_GAME" });
      else if (phase === "GAME_OVER" || phase === "VICTORY")
        dispatch({ type: "RESTART" });
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

  // Touchpad click — EMP pulse
  useEffect(() => {
    if (!controller?.touchpad?.button) return;
    const handler = () => dispatch({ type: "EMP_PRESS" });
    controller.touchpad.button.on("press", handler);
    return () => {
      controller.touchpad.button.off("press", handler);
    };
  }, [controller]);

  // Main game loop
  useEffect(() => {
    if (!controller?.touchpad) return;
    const running: GamePhase[] = ["PLAYING", "WAVE_CLEAR"];
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
        // Read touchpad. Touchpad Y is mapped screen-convention (top of pad
        // = -1, bottom = +1) via mapAxis(raw, 1080) in the library, so the
        // angle is already screen-space — no negation.
        const l = controller.touchpad.left;
        const r = controller.touchpad.right;
        const shield1: ShieldInput = {
          active: l?.contact?.active && (l?.magnitude ?? 0) > 0.08,
          angle: l ? l.angle : 0,
        };
        const shield2: ShieldInput = {
          active: r?.contact?.active && (r?.magnitude ?? 0) > 0.08,
          angle: r ? r.angle : 0,
        };
        const r2 = controller.right?.trigger?.state ?? 0;
        const l2 = controller.left?.trigger?.state ?? 0;
        dispatch({
          type: "TICK",
          dt: 1 / 60,
          now,
          shield1,
          shield2,
          r2,
          l2,
        });
        accum -= TICK;
      }

      const s = stateRef.current;

      // ── Rumble (right motor only; left is left off to respect user pref) ──
      if (now - lastRumble > 100) {
        lastRumble = now;
        if (s.phase === "PLAYING") {
          // Short right-motor burst when a shield block happens (handled via
          // phase-effect below); keep zero continuous.
          // Zero otherwise.
        }
        // No continuous rumble — bursts are handled reactively below.
      }

      // ── Lightbar (~10Hz) — reflects base HP ──
      if (now - lastLightbar > 100) {
        lastLightbar = now;
        if (s.phase === "PLAYING" || s.phase === "WAVE_CLEAR") {
          // EMP flash overrides briefly
          const sinceEmp = (now - s.empFlashAt) / 1000;
          if (sinceEmp < EMP_FLASH_DURATION) {
            const t = 1 - sinceEmp / EMP_FLASH_DURATION;
            controller.lightbar?.set({
              r: Math.round(120 + 60 * t),
              g: Math.round(200 + 55 * t),
              b: 255,
            });
          } else {
            const ratio = s.hp / MAX_HP;
            if (ratio > 0.6) {
              controller.lightbar?.set({ r: 20, g: 200, b: 80 });
            } else if (ratio > 0.3) {
              controller.lightbar?.set({ r: 220, g: 160, b: 0 });
            } else if (ratio > 0.2) {
              controller.lightbar?.set({ r: 220, g: 60, b: 30 });
            } else {
              // Flash red at low HP
              const phase = Math.floor(now / 180) % 2;
              controller.lightbar?.set(
                phase === 0
                  ? { r: 255, g: 0, b: 0 }
                  : { r: 60, g: 0, b: 0 },
              );
            }
          }
        }
      }

      // ── Trigger effects (~5Hz) — Weapon effect on both triggers ──
      if (now - lastTrigger > 200) {
        lastTrigger = now;
        if (s.phase === "PLAYING") {
          controller.right?.trigger?.feedback?.set({
            effect: TriggerEffect.Weapon,
            start: 0.35,
            end: 0.55,
            strength: 0.7,
          });
          controller.left?.trigger?.feedback?.set({
            effect: TriggerEffect.Weapon,
            start: 0.35,
            end: 0.55,
            strength: 0.55,
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
      controller.right?.rumble(0);
    };
  }, [controller, state.phase]);

  // Shield-block audio + right-motor tap
  useEffect(() => {
    if (!controller) return;
    if (
      state.shieldBlockAt !== lastBlockAudioRef.current &&
      state.shieldBlockAt !== 0
    ) {
      const prev = lastBlockAudioRef.current;
      lastBlockAudioRef.current = state.shieldBlockAt;
      if (state.shieldBlockAt - prev > 60) {
        playShieldClick(controller);
        controller.right?.rumble(0.35);
        setTimeout(() => {
          if (stateRef.current.phase === "PLAYING") {
            controller.right?.rumble(0);
          }
        }, 50);
      }
    }
  }, [controller, state.shieldBlockAt]);

  // Missile-kill audio + right-motor tap
  useEffect(() => {
    if (!controller) return;
    if (
      state.missileKillAt !== lastMissileKillAudioRef.current &&
      state.missileKillAt !== 0
    ) {
      const prev = lastMissileKillAudioRef.current;
      lastMissileKillAudioRef.current = state.missileKillAt;
      if (state.missileKillAt - prev > 60) {
        playMissilePop(controller);
        controller.right?.rumble(0.3);
        setTimeout(() => {
          if (stateRef.current.phase === "PLAYING") {
            controller.right?.rumble(0);
          }
        }, 40);
      }
    }
  }, [controller, state.missileKillAt]);

  // Base-hit audio + harder right-motor thump
  useEffect(() => {
    if (!controller) return;
    if (
      state.baseHitAt !== lastBaseHitAudioRef.current &&
      state.baseHitAt !== 0
    ) {
      lastBaseHitAudioRef.current = state.baseHitAt;
      playBaseHit(controller);
      controller.right?.rumble(0.75);
      setTimeout(() => {
        if (stateRef.current.phase === "PLAYING") {
          controller.right?.rumble(0);
        }
      }, 180);
    }
  }, [controller, state.baseHitAt]);

  // Player LEDs — reflect current wave (1..5)
  useEffect(() => {
    if (!controller?.playerLeds) return;
    const n =
      state.phase === "VICTORY"
        ? 5
        : state.phase === "TITLE" || state.phase === "GAME_OVER"
          ? 0
          : state.waveIndex + 1;
    for (let i = 0; i < 5; i++) {
      controller.playerLeds.setLed(i, i < n);
    }
  }, [controller, state.waveIndex, state.phase]);

  // Mute LED — pulses at 1 HP during play
  useEffect(() => {
    if (!controller?.mute) return;
    if (state.phase === "PLAYING" && state.hp <= 1) {
      controller.mute.setLed(MuteLedMode.Pulse);
    } else {
      controller.mute.resetLed();
    }
  }, [controller, state.hp, state.phase]);

  // EMP one-shot — audio + right-motor thump
  useEffect(() => {
    if (!controller || state.empFlashAt === 0) return;
    playEmpBurst(controller);
    controller.right?.rumble(0.6);
    const t = setTimeout(() => {
      if (stateRef.current.phase === "PLAYING") {
        controller.right?.rumble(0);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [controller, state.empFlashAt]);

  // Phase transitions
  useEffect(() => {
    if (!controller) return;
    const prev = prevPhaseRef.current;
    const curr = state.phase;
    prevPhaseRef.current = curr;
    if (prev === curr) return;

    if (curr === "WAVE_CLEAR") {
      playWaveClear(controller);
      controller.lightbar?.set({ r: 255, g: 255, b: 255 });
      controller.right?.rumble(0.35);
      const t = setTimeout(() => {
        controller.right?.rumble(0);
      }, 260);
      return () => clearTimeout(t);
    }

    if (curr === "VICTORY") {
      playVictory(controller);
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
      const timer = setTimeout(() => {
        cancelAnimationFrame(raf);
      }, 4000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    if (curr === "GAME_OVER") {
      playGameOver(controller);
      controller.right?.rumble(0);
      controller.left?.trigger?.feedback?.reset();
      controller.right?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 80, g: 0, b: 0 });
      controller.mute?.resetLed();
    }

    if (curr === "TITLE") {
      controller.right?.rumble(0);
      controller.left?.trigger?.feedback?.reset();
      controller.right?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 20, g: 30, b: 80 });
      controller.mute?.resetLed();
    }
  }, [controller, state.phase]);

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

  const empAlpha = (() => {
    if (state.empFlashAt === 0) return 0;
    const since = (performance.now() - state.empFlashAt) / 1000;
    if (since > EMP_FLASH_DURATION) return 0;
    return 1 - since / EMP_FLASH_DURATION;
  })();

  return (
    <PageContainer>
      <Header>
        <PageTitle>Orbit Defense</PageTitle>
        <PageSubtitle>
          Slide your thumb around the touchpad to orbit a shield around the
          base. Stop the asteroids.
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
            <HudItem>Wave {state.waveIndex + 1}/{WAVES.length}</HudItem>
            <HudItem>Score {state.score}</HudItem>
            <HudItem>EMP {state.empUses}</HudItem>
            <Spacer />
            <HpRow title="Base HP">
              {Array.from({ length: MAX_HP }, (_, i) => (
                <HpPip
                  key={i}
                  $alive={i < state.hp}
                  $low={state.hp <= 1 && i < state.hp}
                />
              ))}
            </HpRow>
          </HUD>

          <LockHintBar>
            {!pointerLocked && !inactive && (
              <LockHint>click to lock cursor · Esc to release</LockHint>
            )}
          </LockHintBar>

          <Arena
            ref={arenaRef}
            $locked={pointerLocked}
            onClick={requestLock}
          >
            <OrbitRing />

            {/* EMP flash underlay */}
            {empAlpha > 0 && <EmpFlashEl $alpha={empAlpha} />}

            {/* Asteroids */}
            {state.asteroids.map((a) => (
              <AsteroidEl
                key={`a-${a.id}`}
                $radius={a.radius}
                style={{
                  left: `${a.x}px`,
                  top: `${a.y}px`,
                  transform: `translate(-50%, -50%) rotate(${a.rotation}rad)`,
                }}
              />
            ))}

            {/* Missiles */}
            {state.missiles.map((m) => (
              <MissileEl
                key={`m-${m.id}`}
                style={{ left: `${m.x}px`, top: `${m.y}px` }}
              />
            ))}

            {/* Explosions */}
            {state.explosions.map((e) => (
              <ExplosionEl
                key={`e-${e.id}`}
                $progress={1 - e.life / e.maxLife}
                $radius={e.radius * 2.2}
                style={{ left: `${e.x}px`, top: `${e.y}px` }}
              />
            ))}

            {/* Base */}
            <BaseEl />
            <BaseCore $hpRatio={state.hp / MAX_HP} />

            {/* Shield arcs (SVG overlay) */}
            <ShieldSvg viewBox={`0 0 ${ARENA} ${ARENA}`}>
              {state.shield1.active && (
                <path
                  d={shieldArcPath(state.shield1.angle, SHIELD_ARC_1)}
                  stroke="rgba(72, 175, 240, 0.9)"
                  strokeWidth={SHIELD_THICKNESS}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px rgba(72, 175, 240, 0.7))",
                  }}
                />
              )}
              {state.shield2.active && (
                <path
                  d={shieldArcPath(state.shield2.angle, SHIELD_ARC_2)}
                  stroke="rgba(200, 140, 255, 0.9)"
                  strokeWidth={SHIELD_THICKNESS}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px rgba(200, 140, 255, 0.65))",
                  }}
                />
              )}
            </ShieldSvg>

            {/* Overlays */}
            {state.phase === "TITLE" && (
              <Overlay $dim>
                <TitleText>ORBIT DEFENSE</TitleText>
                <SubText>
                  Slide your thumb around the touchpad to orbit a shield
                  <br />
                  Two fingers = two shields &middot; R2 / L2 fire missiles
                  <br />
                  Click the touchpad for an EMP pulse &middot; Triangle pauses
                </SubText>
                <PromptText>Press &times; to start</PromptText>
                {state.bestScore > 0 && (
                  <SubText style={{ marginTop: 16, marginBottom: 0 }}>
                    Best: {state.bestScore}
                  </SubText>
                )}
              </Overlay>
            )}

            {state.phase === "WAVE_CLEAR" && (
              <Overlay>
                <WaveClearLabel>WAVE {state.waveIndex + 1} CLEAR</WaveClearLabel>
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
                <GameOverLabel>BASE DESTROYED</GameOverLabel>
                <SubText>
                  Reached wave {state.waveIndex + 1}
                  <br />
                  Score {state.score}
                </SubText>
                <PromptText>Press &times; to try again</PromptText>
              </Overlay>
            )}

            {state.phase === "VICTORY" && (
              <Overlay $dim>
                <VictoryLabel>ALL WAVES CLEARED</VictoryLabel>
                <BigScore>{state.score}</BigScore>
                <SubText>
                  {state.bestScore > 0 && state.score === state.bestScore
                    ? "New best score!"
                    : state.bestScore > 0
                      ? `Best: ${state.bestScore}`
                      : " "}
                </SubText>
                <PromptText>Press &times; to play again</PromptText>
              </Overlay>
            )}
          </Arena>

          {(state.phase === "PLAYING" ||
            state.phase === "WAVE_CLEAR" ||
            state.phase === "PAUSED") && (
            <StatsRow>
              <span>
                Shields{" "}
                {state.shield1.active ? "●" : "○"}
                {state.shield2.active ? "●" : "○"}
              </span>
              <span>Asteroids {state.asteroids.length}</span>
              <span>Missiles {state.missiles.length}</span>
              {state.bestScore > 0 && <span>Best {state.bestScore}</span>}
            </StatsRow>
          )}
        </OverlayContent>
      </GameArea>

      <DescriptionSection>
        <DescriptionHeading>Controller Features</DescriptionHeading>
        <FeatureList>
          <li>
            <strong>Touchpad as a dial</strong> &mdash; the touchpad is mapped
            like an analog stick, with <code>[0,0]</code> at the center.{" "}
            <code>controller.touchpad.left.angle</code> gives the thumb's angle
            from center — we use it directly as the shield's orbit angle
            around the base.
          </li>
          <li>
            <strong>Multi-touch</strong> &mdash; the second finger drives{" "}
            <code>.touchpad.right</code> as an independent input, lighting a
            second, narrower shield on a separate arc. One-thumb play is fully
            viable; two-thumb play lets you cover both sides at once.
          </li>
          <li>
            <strong>Physical click</strong> &mdash;{" "}
            <code>controller.touchpad.button</code> is a proper{" "}
            <code>Momentary</code>. Its <code>press</code> event fires an EMP
            pulse that clears all asteroids currently within the shield ring —
            click is kept distinct from touch, so resting your thumb won't
            trigger it.
          </li>
          <li>
            <strong>Adaptive triggers</strong> &mdash; both triggers use{" "}
            <code>TriggerEffect.Weapon</code> for a satisfying click-stop
            firing feel. R2 launches a missile along the primary shield's
            angle, L2 along the secondary. Edge-triggered on the rising pull,
            with a short cooldown.
          </li>
          <li>
            <strong>Lightbar</strong> &mdash; base HP at a glance: green →
            yellow → red, flashing red at 1 HP. Bright cyan pulse on EMP,
            white on wave clear, rainbow cycle on victory.
          </li>
          <li>
            <strong>Rumble (right motor only)</strong> &mdash; brief taps on
            each shield block or missile kill, a harder thump when an asteroid
            reaches the base, and an EMP thump on touchpad click. The left
            motor is deliberately unused so nothing blurs the feel of tracking
            the dial.
          </li>
          <li>
            <strong>Player LEDs</strong> &mdash; current wave (1..5). All lit
            on VICTORY.
          </li>
          <li>
            <strong>Mute LED</strong> &mdash; pulses when the base is down to
            its last HP — a peripheral "danger" cue.
          </li>
          <li>
            <strong>Speaker</strong> &mdash; 1kHz click on shield blocks, a
            shorter pop on missile kills, 100Hz thud on base hits, EMP low-
            then-high burst, dual-tone wave clear, four-note victory fanfare.
          </li>
        </FeatureList>

        <DescriptionHeading>Implementation Notes</DescriptionHeading>
        <p>
          <code>Touchpad</code> in dualsense-ts exposes each touch as a{" "}
          <code>Touch</code> that extends <code>Analog</code>, so{" "}
          <code>.angle</code>, <code>.magnitude</code>, and{" "}
          <code>.deadzone</code> are all available on individual contacts — no
          raw coordinate math required. The physical pad click is a separate{" "}
          <code>Momentary</code>, so touch and click are cleanly distinguishable.
        </p>

        <CodeBlock
          code={`// Read both touches as independent dials.
const l = controller.touchpad.left;
const r = controller.touchpad.right;

// Touchpad Y is mapped screen-convention in the library
// (top of pad = -1, bottom = +1), so .angle is already screen-space.
const shield1 = {
  active: l.contact.active && l.magnitude > 0.08,
  angle: l.angle,
};
const shield2 = {
  active: r.contact.active && r.magnitude > 0.08,
  angle: r.angle,
};

// Physical click is a separate Momentary event — distinct from touch.
controller.touchpad.button.on("press", () => {
  dispatch({ type: "EMP_PRESS" });
});`}
        />

        <p>
          Shield-vs-asteroid collision checks a band of the shield ring
          (thickness ≈ asteroid radius) and asks whether the asteroid's angle
          from the base falls inside the current shield arc. Missiles fire
          along the shield angle, giving a "your thumb aims the turret" feel
          even though the ship stays still.
        </p>

        <CodeBlock
          code={`// Shield arc hit test — signed angle difference mod 2π.
function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

for (const ast of asteroids) {
  const dx = ast.x - CENTER_X;
  const dy = ast.y - CENTER_Y;
  const dist = Math.hypot(dx, dy);
  if (Math.abs(dist - SHIELD_RING_RADIUS) < ast.radius) {
    const astAngle = Math.atan2(dy, dx);
    if (Math.abs(angleDiff(astAngle, shield1.angle)) < SHIELD_ARC_1 / 2) {
      // Blocked by primary shield.
    }
  }
}`}
        />

        <p>
          Five waves of escalating difficulty. Wave configuration lives as a
          single array at the top of the file; tuning difficulty is one-line
          edits. Asteroid spawning uses a spawn-interval + burst-size pattern
          so late waves feel swarmy without the reducer doing anything more
          complex than "queue up <code>count</code> asteroids and dispense
          them on a timer".
        </p>

        <DescriptionHeading>Interacting with the OS cursor</DescriptionHeading>
        <p>
          On most platforms the DualSense touchpad also drives the OS mouse
          cursor and two-finger gestures emit scroll events — that's a great
          default for desktop use, but for a browser game that reads the
          touchpad directly it makes the cursor drift across the screen and
          the page scroll away under you. We mitigate with two standard
          browser APIs, both scoped to the arena element:
        </p>
        <FeatureList>
          <li>
            <code>element.requestPointerLock()</code> — captures the cursor
            on click. Mouse events still fire but cursor position is frozen
            and hidden. <code>Esc</code> releases.
          </li>
          <li>
            While locked, we set <code>document.body.style.overflow = "hidden"</code>{" "}
            and add a <code>wheel</code> listener with{" "}
            <code>preventDefault()</code> on the arena — this stops the
            page-scroll that two-finger-drag would otherwise produce.
          </li>
        </FeatureList>
        <p>
          Both are restored on release and on unmount. The touchpad HID
          stream is untouched by any of this — <code>controller.touchpad</code>{" "}
          still reads normally, because it's coming from the WebHID
          interface, not the mouse-emulation layer.
        </p>
      </DescriptionSection>
    </PageContainer>
  );
};

export default OrbitDefensePage;
