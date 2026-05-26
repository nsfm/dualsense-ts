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

/* ═══════════════════════════════════════════════════════════════════
 * TYPES
 * ═══════════════════════════════════════════════════════════════════ */

type GamePhase =
  | "TITLE"
  | "PLAYING"
  | "PAUSED"
  | "ROOM_TRANSITION"
  | "ITEM_PICKUP"
  | "FLOOR_CLEAR"
  | "DEAD"
  | "VICTORY";

type RoomType = "START" | "COMBAT" | "TREASURE" | "BOSS";

type Dir = "N" | "S" | "E" | "W";

type EnemyKind = "fly" | "shooter" | "turret" | "charger" | "boss";

type ItemKind = "heart" | "damage" | "rapid" | "speed" | "homing" | "pierce";

interface Vec2 {
  x: number;
  y: number;
}

interface Player {
  x: number;
  y: number;
  aimAngle: number; // radians, screen-space
  invuln: number; // seconds of invulnerability remaining
  dashT: number; // seconds remaining in dash
  dashVx: number;
  dashVy: number;
  dashCooldown: number;
  fireCooldown: number;
  hp: number;
  maxHp: number;
  bombs: number;
  items: Record<ItemKind, number>;
}

interface Enemy {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  radius: number;
  // per-kind state
  timer: number; // generic timer (reload, windup, phase)
  subtimer: number;
  phase: number; // for boss
  jitter: number; // stored noise for fly
  targetX: number;
  targetY: number;
  flash: number; // wind-up flash alpha, 0..1
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ttl: number;
  damage: number;
  friendly: boolean; // true = player bullet, false = enemy bullet
  pierce: boolean;
  homing: boolean;
  hitIds: number[]; // enemies already pierced (to avoid double-hit)
}

interface BombEntity {
  id: number;
  x: number;
  y: number;
  fuse: number; // seconds remaining
  exploding: number; // seconds remaining of explosion visual (0 = not yet)
}

interface Pickup {
  id: number;
  x: number;
  y: number;
  kind: ItemKind;
  bob: number; // bob animation phase
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface DamagePopup {
  id: number;
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  value: number;
  kind: "hit" | "kill";
}

interface Pillar {
  x: number; // cell col
  y: number; // cell row
}

interface RoomState {
  col: number; // 0..4
  row: number; // 0..4
  type: RoomType;
  neighbors: Set<Dir>; // which sides have connections
  pillars: Pillar[];
  cleared: boolean;
  visited: boolean;
  // Populated on entry:
  enemies: Enemy[];
  bullets: Bullet[];
  pickups: Pickup[];
  bombs: BombEntity[];
  particles: Particle[];
  popups: DamagePopup[];
  pickupSpawned: boolean; // combat rooms spawn a pickup on clear (chance)
}

interface FloorState {
  rooms: Map<string, RoomState>; // key = "col,row"
  currentKey: string;
}

interface GameState {
  phase: GamePhase;
  prevPhase: GamePhase;
  floorIndex: number; // 0..2
  floor: FloorState | null;
  player: Player;
  transitionDir: Dir | null;
  transitionT: number;
  pendingPickup: Pickup | null;
  phaseTimer: number;
  runStats: {
    roomsCleared: number;
    kills: number;
    damageTaken: number;
    startedAt: number;
  };
  // One-shot event markers for useEffect hooks / rAF:
  hitAt: number; // player hit
  killAt: number; // enemy killed
  pickupAt: number; // item picked up
  bombAt: number; // bomb placed
  explosionAt: number; // bomb exploded
  doorClearedAt: number; // room cleared
  elapsedMs: number;
  nextId: number;
  aimLast: number; // last valid aim angle (screen-space)
  moveAngle: number; // latest input
  moveMag: number;
  l2: number; // latest L2 trigger value (for focus aim line)
  lightbarFlash: { r: number; g: number; b: number; at: number } | null;
  showMap: boolean;
  showInventory: boolean;
}

type GameAction =
  | { type: "START_RUN" }
  | { type: "RESTART" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "TOGGLE_MAP" }
  | { type: "TOGGLE_INVENTORY" }
  | { type: "DASH" }
  | { type: "BOMB" }
  | { type: "CONFIRM" } // Cross outside PLAYING
  | {
      type: "TICK";
      dt: number;
      now: number;
      moveAngle: number;
      moveMag: number;
      aimAngle: number;
      aimMag: number;
      r2: number;
      l2: number;
      dpad: { up: boolean; down: boolean; left: boolean; right: boolean };
    };

/* ═══════════════════════════════════════════════════════════════════
 * CONSTANTS
 * ═══════════════════════════════════════════════════════════════════ */

const ARENA_W = 520;
const ARENA_H = 400;
const CELL = 40;
const GRID_COLS = ARENA_W / CELL; // 13
const GRID_ROWS = ARENA_H / CELL; // 10
const FLOOR_GRID = 5;

const PLAYER_RADIUS = 10;
const PLAYER_SPEED_BASE = 220;
const PLAYER_FOCUS_MULT = 0.5;
const PLAYER_DASH_DIST = 180;
const PLAYER_DASH_TIME = 0.25;
const PLAYER_DASH_IFRAMES = 0.2;
const PLAYER_DASH_COOLDOWN = 0.6;
const PLAYER_HIT_IFRAMES = 1.0;
const PLAYER_MAX_BOMBS_START = 3;
const PLAYER_HP_START = 3;

const BOMB_FUSE = 0.8;
const BOMB_EXPLOSION_TIME = 0.42;
const BOMB_RADIUS = 70;
const BOMB_DAMAGE_ENEMY = 3;
const BOMB_SELF_DAMAGE = 1;
const BOMB_SELF_RADIUS = 50;

const BULLET_RADIUS_PLAYER = 4;
const BULLET_RADIUS_ENEMY = 5;
const BULLET_SPEED_PLAYER = 450;
const BULLET_SPEED_ENEMY_BASE = 200;
const BULLET_LIFETIME_PLAYER = 1.2;
const BULLET_LIFETIME_ENEMY = 3.0;

const FIRE_RATE_SLOW = 2; // Hz at 0.2 < r2 < 0.6
const FIRE_RATE_FAST = 6; // Hz at r2 > 0.6
const FIRE_THRESHOLD_LOW = 0.2;
const FIRE_THRESHOLD_HIGH = 0.6;

const MOVE_DEADZONE = 0.18;
const AIM_DEADZONE = 0.3;

const DOOR_WIDTH = 48;
const PLAYER_SPAWN_MARGIN = 50;

const TRANSITION_DURATION = 0.25;
const FLOOR_CLEAR_DURATION = 2.4;
const DEAD_PAUSE_MS = 1200;

// Enemy defs
const ENEMY_DEFS: Record<
  EnemyKind,
  {
    hp: number;
    radius: number;
    speed: number;
    color: string;
  }
> = {
  fly: { hp: 1, radius: 9, speed: 140, color: "#b077ff" },
  shooter: { hp: 2, radius: 11, speed: 90, color: "#ff6060" },
  turret: { hp: 4, radius: 14, speed: 0, color: "#a0a0b0" },
  charger: { hp: 3, radius: 12, speed: 400, color: "#ff9940" },
  boss: { hp: 40, radius: 26, speed: 60, color: "#ff33aa" },
};

// Item definitions (display metadata)
const ITEM_DEFS: Record<
  ItemKind,
  { label: string; desc: string; color: string; glyph: string }
> = {
  heart: {
    label: "Heart",
    desc: "+1 max HP · full heal",
    color: "#ff4d6d",
    glyph: "♥",
  },
  damage: {
    label: "Damage Up",
    desc: "+1 damage per shot",
    color: "#f29e02",
    glyph: "◆",
  },
  rapid: {
    label: "Rapid",
    desc: "Fire rate × 1.5",
    color: "#48aff0",
    glyph: "»",
  },
  speed: {
    label: "Speed",
    desc: "+40 px/s movement",
    color: "#4fffc5",
    glyph: "➤",
  },
  homing: {
    label: "Homing",
    desc: "Bullets track enemies",
    color: "#a5f3fc",
    glyph: "◎",
  },
  pierce: {
    label: "Pierce",
    desc: "Bullets pass through",
    color: "#c084fc",
    glyph: "⇒",
  },
};

const FLOOR_ENEMY_POOL: EnemyKind[][] = [
  // Floor 1: easy
  ["fly", "fly", "fly", "shooter", "shooter", "turret"],
  // Floor 2: mid
  ["fly", "shooter", "shooter", "turret", "charger", "fly"],
  // Floor 3: hard
  ["shooter", "turret", "charger", "charger", "fly", "shooter"],
];

const FLOOR_BOSS_HP = [40, 60, 90];

/* ═══════════════════════════════════════════════════════════════════
 * UTILITIES (RNG, math, collision)
 * ═══════════════════════════════════════════════════════════════════ */

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function rand(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo);
}

function randInt(lo: number, hi: number): number {
  return Math.floor(rand(lo, hi + 1));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function angleTo(fromX: number, fromY: number, toX: number, toY: number): number {
  return Math.atan2(toY - fromY, toX - fromX);
}

function distSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt(distSq(ax, ay, bx, by));
}

function oppositeDir(d: Dir): Dir {
  return d === "N" ? "S" : d === "S" ? "N" : d === "E" ? "W" : "E";
}

function dirDelta(d: Dir): { dc: number; dr: number } {
  switch (d) {
    case "N":
      return { dc: 0, dr: -1 };
    case "S":
      return { dc: 0, dr: 1 };
    case "E":
      return { dc: 1, dr: 0 };
    case "W":
      return { dc: -1, dr: 0 };
  }
}

function roomKey(col: number, row: number): string {
  return `${col},${row}`;
}

function resolveCircleAabb(
  px: number,
  py: number,
  pr: number,
  ax: number,
  ay: number,
  aw: number,
  ah: number,
): { x: number; y: number; hit: boolean; normalX: number; normalY: number } {
  // Closest point on AABB to circle center
  const cx = clamp(px, ax, ax + aw);
  const cy = clamp(py, ay, ay + ah);
  const dx = px - cx;
  const dy = py - cy;
  const d2 = dx * dx + dy * dy;
  if (d2 >= pr * pr) {
    return { x: px, y: py, hit: false, normalX: 0, normalY: 0 };
  }
  const d = Math.sqrt(d2) || 0.0001;
  const nx = dx / d;
  const ny = dy / d;
  return {
    x: cx + nx * pr,
    y: cy + ny * pr,
    hit: true,
    normalX: nx,
    normalY: ny,
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * PROCEDURAL GENERATION
 * ═══════════════════════════════════════════════════════════════════ */

function generateFloor(floorIndex: number): FloorState {
  // Random-walk to place ~6-9 connected rooms.
  const targetCount = 6 + floorIndex + randInt(0, 2); // 6-8 floor 1, 7-9 floor 2, 8-10 floor 3
  const visited = new Map<string, { col: number; row: number }>();
  const connections = new Map<string, Set<Dir>>();

  const startCol = 0;
  const startRow = Math.floor(FLOOR_GRID / 2);
  const startKey = roomKey(startCol, startRow);
  visited.set(startKey, { col: startCol, row: startRow });
  connections.set(startKey, new Set());

  let cursor = { col: startCol, row: startRow };
  const walkOrder: string[] = [startKey];
  let attempts = 0;

  while (visited.size < targetCount && attempts < 500) {
    attempts++;
    const dirs: Dir[] = ["N", "S", "E", "W"];
    // Shuffle dirs
    dirs.sort(() => Math.random() - 0.5);
    let moved = false;
    for (const d of dirs) {
      const { dc, dr } = dirDelta(d);
      const nc = cursor.col + dc;
      const nr = cursor.row + dr;
      if (nc < 0 || nc >= FLOOR_GRID || nr < 0 || nr >= FLOOR_GRID) continue;
      const nk = roomKey(nc, nr);
      // Prefer unvisited neighbors; if all visited, occasionally back-step.
      const k = roomKey(cursor.col, cursor.row);
      if (!visited.has(nk)) {
        visited.set(nk, { col: nc, row: nr });
        connections.set(nk, new Set());
        connections.get(k)!.add(d);
        connections.get(nk)!.add(oppositeDir(d));
        cursor = { col: nc, row: nr };
        walkOrder.push(nk);
        moved = true;
        break;
      }
    }
    if (!moved) {
      // Backtrack to a random visited cell
      const keys = Array.from(visited.keys());
      const r = keys[Math.floor(Math.random() * keys.length)];
      const [c, ro] = r.split(",").map(Number);
      cursor = { col: c, row: ro };
    }
  }

  // Pick boss room = farthest walkable from start (by BFS distance).
  const distances = new Map<string, number>();
  distances.set(startKey, 0);
  const queue: string[] = [startKey];
  while (queue.length) {
    const k = queue.shift()!;
    const d = distances.get(k)!;
    const cell = visited.get(k)!;
    const conns = connections.get(k)!;
    for (const dir of conns) {
      const { dc, dr } = dirDelta(dir);
      const nk = roomKey(cell.col + dc, cell.row + dr);
      if (!distances.has(nk)) {
        distances.set(nk, d + 1);
        queue.push(nk);
      }
    }
  }

  let bossKey = startKey;
  let maxDist = -1;
  for (const [k, d] of distances) {
    if (d > maxDist) {
      maxDist = d;
      bossKey = k;
    }
  }

  // Pick treasure room = random cell that isn't start or boss.
  const candidates = Array.from(visited.keys()).filter(
    (k) => k !== startKey && k !== bossKey,
  );
  const treasureKey =
    candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : null;

  // Build rooms
  const rooms = new Map<string, RoomState>();
  for (const [k, cell] of visited) {
    const type: RoomType =
      k === startKey
        ? "START"
        : k === bossKey
          ? "BOSS"
          : k === treasureKey
            ? "TREASURE"
            : "COMBAT";
    rooms.set(k, {
      col: cell.col,
      row: cell.row,
      type,
      neighbors: connections.get(k)!,
      pillars: generatePillars(type, k),
      cleared: type === "START", // start always cleared
      visited: k === startKey,
      enemies: [],
      bullets: [],
      pickups: [],
      bombs: [],
      particles: [],
      popups: [],
      pickupSpawned: false,
    });
  }

  return { rooms, currentKey: startKey };
}

function generatePillars(type: RoomType, _seedKey: string): Pillar[] {
  if (type === "START" || type === "TREASURE") return [];
  // Place 1-3 pillars away from borders and doors.
  const count = randInt(1, 3);
  const result: Pillar[] = [];
  const attempts = 30;
  for (let i = 0; i < count; i++) {
    for (let a = 0; a < attempts; a++) {
      const col = randInt(2, GRID_COLS - 3);
      const row = randInt(2, GRID_ROWS - 3);
      // Keep away from center corridor (for door reachability)
      if (
        Math.abs(col - GRID_COLS / 2) < 1 &&
        Math.abs(row - GRID_ROWS / 2) < 1
      )
        continue;
      if (result.some((p) => Math.abs(p.x - col) + Math.abs(p.y - row) < 2))
        continue;
      result.push({ x: col, y: row });
      break;
    }
  }
  return result;
}

function generateEnemiesForRoom(
  floorIndex: number,
  room: RoomState,
  nextIdStart: number,
): { enemies: Enemy[]; nextId: number } {
  if (room.type === "START" || room.type === "TREASURE") {
    return { enemies: [], nextId: nextIdStart };
  }
  if (room.type === "BOSS") {
    const bossHp = FLOOR_BOSS_HP[floorIndex];
    return {
      enemies: [
        {
          id: nextIdStart,
          kind: "boss",
          x: ARENA_W / 2,
          y: ARENA_H / 2,
          vx: 0,
          vy: 0,
          hp: bossHp,
          maxHp: bossHp,
          radius: ENEMY_DEFS.boss.radius,
          timer: 0,
          subtimer: 0,
          phase: 0,
          jitter: 0,
          targetX: ARENA_W / 2,
          targetY: ARENA_H / 2,
          flash: 0,
        },
      ],
      nextId: nextIdStart + 1,
    };
  }
  // COMBAT: pick a few enemies from the floor pool.
  const pool = FLOOR_ENEMY_POOL[floorIndex] ?? FLOOR_ENEMY_POOL[0];
  const count = 2 + randInt(1, 2) + Math.floor(floorIndex / 2);
  const enemies: Enemy[] = [];
  let id = nextIdStart;
  // Keep-away zones around every door the player could enter through.
  const doorCenters: Vec2[] = [];
  for (const dir of room.neighbors) doorCenters.push(doorCenter(dir));
  const SPAWN_DOOR_KEEPOUT = 140;
  for (let i = 0; i < count; i++) {
    const kind = pool[Math.floor(Math.random() * pool.length)];
    const def = ENEMY_DEFS[kind];
    // Spawn inside inner playable area, avoid pillars and doors
    let x = 0;
    let y = 0;
    let ok = false;
    for (let a = 0; a < 30; a++) {
      x = rand(CELL * 2, ARENA_W - CELL * 2);
      y = rand(CELL * 2, ARENA_H - CELL * 2);
      if (room.pillars.some((p) => dist(x, y, p.x * CELL + CELL / 2, p.y * CELL + CELL / 2) < CELL + def.radius)) continue;
      if (doorCenters.some((d) => dist(x, y, d.x, d.y) < SPAWN_DOOR_KEEPOUT)) continue;
      ok = true;
      break;
    }
    if (!ok) {
      x = ARENA_W / 2 + rand(-60, 60);
      y = ARENA_H / 2 + rand(-60, 60);
    }
    enemies.push({
      id: id++,
      kind,
      x,
      y,
      vx: 0,
      vy: 0,
      hp: def.hp,
      maxHp: def.hp,
      radius: def.radius,
      timer: rand(0, 2),
      subtimer: 0,
      phase: 0,
      jitter: rand(0, Math.PI * 2),
      targetX: x,
      targetY: y,
      flash: 0,
    });
  }
  return { enemies, nextId: id };
}

function generatePickupForKind(
  kind: ItemKind,
  id: number,
  x: number,
  y: number,
): Pickup {
  return { id, x, y, kind, bob: rand(0, Math.PI * 2) };
}

function pickRandomItem(): ItemKind {
  const kinds: ItemKind[] = [
    "heart",
    "damage",
    "rapid",
    "speed",
    "homing",
    "pierce",
  ];
  return kinds[Math.floor(Math.random() * kinds.length)];
}

/* ═══════════════════════════════════════════════════════════════════
 * DOOR GEOMETRY
 * ═══════════════════════════════════════════════════════════════════ */

function doorRect(dir: Dir): { x: number; y: number; w: number; h: number } {
  // A door opening in the corresponding wall, centered.
  switch (dir) {
    case "N":
      return {
        x: ARENA_W / 2 - DOOR_WIDTH / 2,
        y: 0,
        w: DOOR_WIDTH,
        h: CELL,
      };
    case "S":
      return {
        x: ARENA_W / 2 - DOOR_WIDTH / 2,
        y: ARENA_H - CELL,
        w: DOOR_WIDTH,
        h: CELL,
      };
    case "W":
      return {
        x: 0,
        y: ARENA_H / 2 - DOOR_WIDTH / 2,
        w: CELL,
        h: DOOR_WIDTH,
      };
    case "E":
      return {
        x: ARENA_W - CELL,
        y: ARENA_H / 2 - DOOR_WIDTH / 2,
        w: CELL,
        h: DOOR_WIDTH,
      };
  }
}

function doorCenter(dir: Dir): Vec2 {
  const r = doorRect(dir);
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

function spawnPointForEntryDir(entryDir: Dir | null): Vec2 {
  // If entering from north, spawn just below the north door.
  if (!entryDir) {
    // Fresh room (start): default to left side mid-height
    return { x: PLAYER_SPAWN_MARGIN, y: ARENA_H / 2 };
  }
  const c = doorCenter(entryDir);
  switch (entryDir) {
    case "N":
      return { x: c.x, y: c.y + CELL * 0.8 };
    case "S":
      return { x: c.x, y: c.y - CELL * 0.8 };
    case "E":
      return { x: c.x - CELL * 0.8, y: c.y };
    case "W":
      return { x: c.x + CELL * 0.8, y: c.y };
  }
}

/* ═══════════════════════════════════════════════════════════════════
 * ENEMY AI  —  pure per-tick update functions
 * ═══════════════════════════════════════════════════════════════════ */

interface AICtx {
  player: Player;
  dt: number;
  now: number;
  nextId: number;
  nextBullets: Bullet[]; // enemies append new bullets here (and update nextId)
}

function updateFly(e: Enemy, ctx: AICtx): Enemy {
  const { player, dt } = ctx;
  e.jitter += dt * 3;
  const jx = Math.sin(e.jitter * 1.7) * 0.4;
  const jy = Math.cos(e.jitter * 2.1) * 0.4;
  const a = angleTo(e.x, e.y, player.x, player.y);
  const dirX = Math.cos(a) + jx;
  const dirY = Math.sin(a) + jy;
  const norm = Math.hypot(dirX, dirY) || 1;
  const speed = ENEMY_DEFS.fly.speed;
  e.vx = (dirX / norm) * speed;
  e.vy = (dirY / norm) * speed;
  e.x += e.vx * dt;
  e.y += e.vy * dt;
  return e;
}

function updateShooter(e: Enemy, ctx: AICtx): Enemy {
  const { player, dt } = ctx;
  e.timer -= dt;
  // Perpendicular strafe toward player, stop to fire
  const toPlayer = angleTo(e.x, e.y, player.x, player.y);
  const perp = toPlayer + Math.PI / 2;

  if (e.subtimer > 0) {
    // In fire lockup
    e.subtimer -= dt;
    e.vx = 0;
    e.vy = 0;
    if (e.subtimer <= 0 && e.phase < 3) {
      // Fire one of three shots
      ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, toPlayer, 1));
      e.phase++;
      e.subtimer = 0.15;
    } else if (e.phase >= 3) {
      e.phase = 0;
      e.subtimer = 0;
      e.timer = rand(2.0, 3.0);
    }
  } else if (e.timer <= 0) {
    // Begin burst
    e.subtimer = 0.01;
    e.phase = 0;
  } else {
    // Strafe
    const dirX = Math.cos(perp) * (e.jitter > Math.PI ? 1 : -1);
    const dirY = Math.sin(perp) * (e.jitter > Math.PI ? 1 : -1);
    const speed = ENEMY_DEFS.shooter.speed;
    e.vx = dirX * speed;
    e.vy = dirY * speed;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.jitter += dt * 0.5;
    if (e.jitter > Math.PI * 2) e.jitter = 0;
  }
  return e;
}

function updateTurret(e: Enemy, ctx: AICtx): Enemy {
  const { dt } = ctx;
  e.timer -= dt;
  if (e.timer <= 0) {
    // Radial burst
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + e.jitter;
      ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 0.9));
    }
    e.jitter += 0.2;
    e.timer = 3.0;
  }
  return e;
}

function updateCharger(e: Enemy, ctx: AICtx): Enemy {
  const { player, dt } = ctx;
  // Phases: 0 = pursue, 1 = windup, 2 = charge, 3 = rest
  if (e.phase === 0) {
    const a = angleTo(e.x, e.y, player.x, player.y);
    const speed = 120;
    e.vx = Math.cos(a) * speed;
    e.vy = Math.sin(a) * speed;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    // When close enough, wind up
    if (dist(e.x, e.y, player.x, player.y) < 160) {
      e.phase = 1;
      e.timer = 0.85;
      e.targetX = player.x;
      e.targetY = player.y;
    }
  } else if (e.phase === 1) {
    e.timer -= dt;
    e.flash = 1 - e.timer / 0.85;
    e.vx = 0;
    e.vy = 0;
    if (e.timer <= 0) {
      const a = angleTo(e.x, e.y, e.targetX, e.targetY);
      const speed = ENEMY_DEFS.charger.speed;
      e.vx = Math.cos(a) * speed;
      e.vy = Math.sin(a) * speed;
      e.phase = 2;
      e.timer = 0.3;
      e.flash = 1;
    }
  } else if (e.phase === 2) {
    e.timer -= dt;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.flash = Math.max(0, e.timer / 0.3);
    if (e.timer <= 0) {
      e.phase = 3;
      e.timer = 0.6;
      e.flash = 0;
    }
  } else {
    e.timer -= dt;
    e.vx = 0;
    e.vy = 0;
    if (e.timer <= 0) e.phase = 0;
  }
  return e;
}

function updateBoss(e: Enemy, ctx: AICtx): Enemy {
  const { player, dt } = ctx;
  // Figure-8 drift
  const t = (e.subtimer += dt);
  const baseX = ARENA_W / 2;
  const baseY = ARENA_H / 2 - 30;
  const driftX = Math.sin(t * 0.6) * 80;
  const driftY = Math.sin(t * 1.2) * 40;
  e.vx = (baseX + driftX - e.x) * 1.5;
  e.vy = (baseY + driftY - e.y) * 1.5;
  e.x += e.vx * dt;
  e.y += e.vy * dt;

  const hpRatio = e.hp / e.maxHp;
  const targetPhase = hpRatio > 0.66 ? 0 : hpRatio > 0.33 ? 1 : 2;
  if (targetPhase !== e.phase) {
    e.phase = targetPhase;
    e.timer = 0;
    e.flash = 1; // phase transition flash
  }

  e.timer += dt;

  // Phase 0: radial spiral every 1.6s
  if (e.phase === 0) {
    if (e.timer > 1.6) {
      e.timer = 0;
      const n = 10;
      e.jitter += 0.3;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + e.jitter;
        ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 0.85));
      }
    }
  }
  // Phase 1: radial every 2s + 3-way aimed every 1s
  else if (e.phase === 1) {
    if (e.timer > 1.0) {
      e.timer = 0;
      const aim = angleTo(e.x, e.y, player.x, player.y);
      for (let i = -1; i <= 1; i++) {
        const a = aim + i * 0.22;
        ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 1.1));
      }
    }
    if (Math.floor(t) !== Math.floor(t - dt) && Math.floor(t) % 2 === 0) {
      const n = 12;
      e.jitter += 0.3;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + e.jitter;
        ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 0.8));
      }
    }
  }
  // Phase 2: aimed volleys every 0.7s, radial every 1.5s
  else {
    if (e.timer > 0.7) {
      e.timer = 0;
      const aim = angleTo(e.x, e.y, player.x, player.y);
      for (let i = -2; i <= 2; i++) {
        const a = aim + i * 0.2;
        ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 1.2));
      }
    }
    if (Math.floor(t * 1.5) !== Math.floor((t - dt) * 1.5)) {
      const n = 14;
      e.jitter -= 0.25;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + e.jitter;
        ctx.nextBullets.push(makeEnemyBullet(ctx.nextId++, e.x, e.y, a, 0.95));
      }
    }
  }
  return e;
}

function makeEnemyBullet(
  id: number,
  x: number,
  y: number,
  angle: number,
  speedMult: number,
): Bullet {
  const speed = BULLET_SPEED_ENEMY_BASE * speedMult;
  return {
    id,
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    ttl: BULLET_LIFETIME_ENEMY,
    damage: 1,
    friendly: false,
    pierce: false,
    homing: false,
    hitIds: [],
  };
}

function updateEnemy(e: Enemy, ctx: AICtx): Enemy {
  e.flash = Math.max(0, e.flash - ctx.dt * 6);
  switch (e.kind) {
    case "fly":
      return updateFly(e, ctx);
    case "shooter":
      return updateShooter(e, ctx);
    case "turret":
      return updateTurret(e, ctx);
    case "charger":
      return updateCharger(e, ctx);
    case "boss":
      return updateBoss(e, ctx);
  }
}

/* ═══════════════════════════════════════════════════════════════════
 * PLAYER HELPERS
 * ═══════════════════════════════════════════════════════════════════ */

function computePlayerStats(p: Player): {
  damage: number;
  speed: number;
  fireRateMult: number;
  homing: boolean;
  pierce: boolean;
} {
  return {
    damage: 1 + (p.items.damage ?? 0),
    speed: PLAYER_SPEED_BASE + 40 * (p.items.speed ?? 0),
    fireRateMult: Math.pow(1.5, p.items.rapid ?? 0),
    homing: (p.items.homing ?? 0) > 0,
    pierce: (p.items.pierce ?? 0) > 0,
  };
}

function initialPlayer(): Player {
  return {
    x: PLAYER_SPAWN_MARGIN,
    y: ARENA_H / 2,
    aimAngle: 0,
    invuln: 0,
    dashT: 0,
    dashVx: 0,
    dashVy: 0,
    dashCooldown: 0,
    fireCooldown: 0,
    hp: PLAYER_HP_START,
    maxHp: PLAYER_HP_START,
    bombs: PLAYER_MAX_BOMBS_START,
    items: {
      heart: 0,
      damage: 0,
      rapid: 0,
      speed: 0,
      homing: 0,
      pierce: 0,
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════
 * REDUCER
 * ═══════════════════════════════════════════════════════════════════ */

function initialState(): GameState {
  return {
    phase: "TITLE",
    prevPhase: "TITLE",
    floorIndex: 0,
    floor: null,
    player: initialPlayer(),
    transitionDir: null,
    transitionT: 0,
    pendingPickup: null,
    phaseTimer: 0,
    runStats: {
      roomsCleared: 0,
      kills: 0,
      damageTaken: 0,
      startedAt: 0,
    },
    hitAt: 0,
    killAt: 0,
    pickupAt: 0,
    bombAt: 0,
    explosionAt: 0,
    doorClearedAt: 0,
    elapsedMs: 0,
    nextId: 1,
    aimLast: 0,
    moveAngle: 0,
    moveMag: 0,
    l2: 0,
    lightbarFlash: null,
    showMap: false,
    showInventory: false,
  };
}

function startRun(): GameState {
  const state = initialState();
  const floor = generateFloor(0);
  // Player spawns in start room at left edge.
  state.floor = floor;
  state.phase = "PLAYING";
  state.runStats.startedAt = performance.now();
  state.player = initialPlayer();
  return state;
}

function beginFloor(state: GameState, floorIndex: number): GameState {
  const floor = generateFloor(floorIndex);
  // Restore player position but keep items/hp/bombs
  const p = state.player;
  p.x = PLAYER_SPAWN_MARGIN;
  p.y = ARENA_H / 2;
  p.dashT = 0;
  p.dashCooldown = 0;
  p.invuln = 0.5;
  return {
    ...state,
    phase: "PLAYING",
    floorIndex,
    floor,
    transitionDir: null,
    transitionT: 0,
    player: p,
  };
}

function currentRoom(state: GameState): RoomState | null {
  if (!state.floor) return null;
  return state.floor.rooms.get(state.floor.currentKey) ?? null;
}

function replaceRoom(state: GameState, room: RoomState): GameState {
  if (!state.floor) return state;
  const newRooms = new Map(state.floor.rooms);
  newRooms.set(roomKey(room.col, room.row), room);
  return { ...state, floor: { ...state.floor, rooms: newRooms } };
}

function ensureRoomPopulated(state: GameState): GameState {
  const room = currentRoom(state);
  if (!room || room.cleared || room.enemies.length > 0) return state;
  const { enemies, nextId } = generateEnemiesForRoom(
    state.floorIndex,
    room,
    state.nextId,
  );
  let updatedRoom: RoomState = { ...room, enemies };
  let newNextId = nextId;
  // For treasure rooms, spawn a pedestal item on entry.
  if (room.type === "TREASURE" && room.pickups.length === 0) {
    updatedRoom = {
      ...updatedRoom,
      pickups: [
        generatePickupForKind(
          pickRandomItem(),
          nextId,
          ARENA_W / 2,
          ARENA_H / 2,
        ),
      ],
    };
    newNextId = nextId + 1;
  }
  const next = replaceRoom(state, updatedRoom);
  return { ...next, nextId: newNextId };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_RUN":
      return ensureRoomPopulated(startRun());

    case "RESTART":
      return ensureRoomPopulated(startRun());

    case "TOGGLE_PAUSE": {
      if (state.phase === "PLAYING") {
        return { ...state, phase: "PAUSED", prevPhase: "PLAYING" };
      }
      if (state.phase === "PAUSED") {
        return { ...state, phase: state.prevPhase };
      }
      return state;
    }

    case "TOGGLE_MAP":
      if (state.phase !== "PLAYING" && state.phase !== "PAUSED") return state;
      return { ...state, showMap: !state.showMap };

    case "TOGGLE_INVENTORY":
      if (state.phase !== "PLAYING" && state.phase !== "PAUSED") return state;
      return { ...state, showInventory: !state.showInventory };

    case "DASH": {
      if (state.phase !== "PLAYING") return state;
      const p = state.player;
      if (p.dashT > 0 || p.dashCooldown > 0) return state;
      // Direction: current move direction, or aim if not moving.
      const dirAngle = state.moveMag > 0.1 ? state.moveAngle : p.aimAngle;
      const speed = PLAYER_DASH_DIST / PLAYER_DASH_TIME;
      const player: Player = {
        ...p,
        dashT: PLAYER_DASH_TIME,
        dashVx: Math.cos(dirAngle) * speed,
        dashVy: Math.sin(dirAngle) * speed,
        dashCooldown: PLAYER_DASH_COOLDOWN,
        invuln: Math.max(p.invuln, PLAYER_DASH_IFRAMES),
      };
      return { ...state, player };
    }

    case "BOMB": {
      if (state.phase !== "PLAYING") return state;
      const room = currentRoom(state);
      if (!room) return state;
      const p = state.player;
      if (p.bombs <= 0) return state;
      const bomb: BombEntity = {
        id: state.nextId,
        x: p.x,
        y: p.y,
        fuse: BOMB_FUSE,
        exploding: 0,
      };
      const next = replaceRoom(state, { ...room, bombs: [...room.bombs, bomb] });
      return {
        ...next,
        nextId: state.nextId + 1,
        player: { ...p, bombs: p.bombs - 1 },
        bombAt: performance.now(),
      };
    }

    case "CONFIRM": {
      if (state.phase === "TITLE") {
        return ensureRoomPopulated(startRun());
      }
      if (state.phase === "DEAD" || state.phase === "VICTORY") {
        return ensureRoomPopulated(startRun());
      }
      if (state.phase === "ITEM_PICKUP") {
        // Confirm pickup — apply item and return to PLAYING
        if (!state.pendingPickup) {
          return { ...state, phase: "PLAYING" };
        }
        return applyPickup(state, state.pendingPickup);
      }
      if (state.phase === "FLOOR_CLEAR") {
        // Descend to next floor
        const next = state.floorIndex + 1;
        if (next >= FLOOR_ENEMY_POOL.length) {
          return { ...state, phase: "VICTORY" };
        }
        return ensureRoomPopulated(beginFloor(state, next));
      }
      return state;
    }

    case "TICK":
      return tick(state, action);

    default:
      return state;
  }
}

function applyPickup(state: GameState, pickup: Pickup): GameState {
  const p = { ...state.player, items: { ...state.player.items } };
  p.items[pickup.kind] = (p.items[pickup.kind] ?? 0) + 1;
  if (pickup.kind === "heart") {
    p.maxHp = p.maxHp + 1;
    p.hp = p.maxHp;
  }
  // Remove the collected pickup from the current room.
  const room = currentRoom(state);
  const next = room
    ? replaceRoom(state, {
        ...room,
        pickups: room.pickups.filter((pu) => pu.id !== pickup.id),
      })
    : state;
  return {
    ...next,
    phase: "PLAYING",
    player: p,
    pendingPickup: null,
    pickupAt: performance.now(),
    lightbarFlash: {
      r: 200,
      g: 80,
      b: 255,
      at: performance.now(),
    },
  };
}

/* ── Tick  (big one) ────────────────────────────────────────────── */

function tick(state: GameState, action: Extract<GameAction, { type: "TICK" }>): GameState {
  if (
    state.phase === "TITLE" ||
    state.phase === "PAUSED" ||
    state.phase === "DEAD" ||
    state.phase === "VICTORY" ||
    state.phase === "ITEM_PICKUP"
  ) {
    return state;
  }

  const { dt, now, aimAngle, aimMag, r2, l2, dpad, moveAngle, moveMag } = action;

  if (state.phase === "ROOM_TRANSITION") {
    const t = state.transitionT - dt;
    if (t <= 0) {
      return {
        ...state,
        phase: "PLAYING",
        transitionT: 0,
        transitionDir: null,
      };
    }
    return { ...state, transitionT: t };
  }

  if (state.phase === "FLOOR_CLEAR") {
    const t = state.phaseTimer - dt;
    return { ...state, phaseTimer: t };
  }

  // PLAYING
  const floor = state.floor;
  if (!floor) return state;
  const room = floor.rooms.get(floor.currentKey);
  if (!room) return state;

  const stats = computePlayerStats(state.player);

  // ── Player movement ──
  let p = { ...state.player };
  p.dashT = Math.max(0, p.dashT - dt);
  p.dashCooldown = Math.max(0, p.dashCooldown - dt);
  p.invuln = Math.max(0, p.invuln - dt);
  p.fireCooldown = Math.max(0, p.fireCooldown - dt);

  let dx = 0;
  let dy = 0;
  if (p.dashT > 0) {
    dx = p.dashVx * dt;
    dy = p.dashVy * dt;
  } else {
    // Determine move direction, factoring in L2 focus
    const focused = l2 > 0.25;
    const sp = stats.speed * (focused ? PLAYER_FOCUS_MULT : 1);
    if (moveMag > 0) {
      dx = Math.cos(moveAngle) * sp * dt * moveMag;
      dy = Math.sin(moveAngle) * sp * dt * moveMag;
    }
  }

  // Compute per-edge clamp: relax through open doors when aligned with the doorway.
  const roomCleared = room.cleared;
  const doorHalf = DOOR_WIDTH / 2 - PLAYER_RADIUS;
  const alignedX = Math.abs(p.x - ARENA_W / 2) <= doorHalf;
  const alignedY = Math.abs(p.y - ARENA_H / 2) <= doorHalf;
  const westOpen = roomCleared && room.neighbors.has("W") && alignedY;
  const eastOpen = roomCleared && room.neighbors.has("E") && alignedY;
  const northOpen = roomCleared && room.neighbors.has("N") && alignedX;
  const southOpen = roomCleared && room.neighbors.has("S") && alignedX;
  const minX = westOpen ? PLAYER_RADIUS : CELL + PLAYER_RADIUS;
  const maxX = eastOpen ? ARENA_W - PLAYER_RADIUS : ARENA_W - CELL - PLAYER_RADIUS;
  const minY = northOpen ? PLAYER_RADIUS : CELL + PLAYER_RADIUS;
  const maxY = southOpen ? ARENA_H - PLAYER_RADIUS : ARENA_H - CELL - PLAYER_RADIUS;
  p.x = clamp(p.x + dx, minX, maxX);
  p.y = clamp(p.y + dy, minY, maxY);

  // Pillar collision
  for (const pil of room.pillars) {
    const res = resolveCircleAabb(
      p.x,
      p.y,
      PLAYER_RADIUS,
      pil.x * CELL,
      pil.y * CELL,
      CELL,
      CELL,
    );
    if (res.hit) {
      p.x = res.x;
      p.y = res.y;
    }
  }

  // Determine aim: right stick > dpad > last
  let finalAim = p.aimAngle;
  if (aimMag > 0) {
    finalAim = aimAngle;
  } else {
    // Dpad cardinal fallback
    let dc = 0;
    let dr = 0;
    if (dpad.up) dr -= 1;
    if (dpad.down) dr += 1;
    if (dpad.left) dc -= 1;
    if (dpad.right) dc += 1;
    if (dc !== 0 || dr !== 0) {
      finalAim = Math.atan2(dr, dc);
    } else {
      finalAim = state.aimLast;
    }
  }
  p.aimAngle = finalAim;

  // ── Fire ──
  const fireRate =
    r2 > FIRE_THRESHOLD_HIGH
      ? FIRE_RATE_FAST * stats.fireRateMult
      : r2 > FIRE_THRESHOLD_LOW
        ? FIRE_RATE_SLOW * stats.fireRateMult
        : 0;
  const bullets = [...room.bullets];
  if (fireRate > 0 && p.fireCooldown <= 0 && !room.cleared) {
    // Fire if room has enemies (prevents wasted bullets in cleared rooms) — but also allow firing for cathartic venting. Let's allow always.
  }
  if (fireRate > 0 && p.fireCooldown <= 0) {
    bullets.push({
      id: state.nextId,
      x: p.x + Math.cos(finalAim) * (PLAYER_RADIUS + 2),
      y: p.y + Math.sin(finalAim) * (PLAYER_RADIUS + 2),
      vx: Math.cos(finalAim) * BULLET_SPEED_PLAYER,
      vy: Math.sin(finalAim) * BULLET_SPEED_PLAYER,
      ttl: BULLET_LIFETIME_PLAYER,
      damage: stats.damage,
      friendly: true,
      pierce: stats.pierce,
      homing: stats.homing,
      hitIds: [],
    });
    p.fireCooldown = 1 / fireRate;
  }

  let nextId = state.nextId + (fireRate > 0 && p.fireCooldown > 0 ? 1 : 0);
  // (correct fallback)
  nextId = state.nextId;
  if (bullets.length !== room.bullets.length) nextId += 1;

  // ── Enemy AI tick (build new bullet list) ──
  const newEnemyBullets: Bullet[] = [];
  const aiCtx: AICtx = {
    player: p,
    dt,
    now,
    nextId,
    nextBullets: newEnemyBullets,
  };

  const updatedEnemies: Enemy[] = room.enemies.map((en) => {
    const copy = { ...en };
    return updateEnemy(copy, aiCtx);
  });
  nextId = aiCtx.nextId;

  // Clamp enemies within arena
  for (const e of updatedEnemies) {
    e.x = clamp(e.x, CELL + e.radius, ARENA_W - CELL - e.radius);
    e.y = clamp(e.y, CELL + e.radius, ARENA_H - CELL - e.radius);
    // Pillar collision
    for (const pil of room.pillars) {
      const res = resolveCircleAabb(
        e.x,
        e.y,
        e.radius,
        pil.x * CELL,
        pil.y * CELL,
        CELL,
        CELL,
      );
      if (res.hit) {
        e.x = res.x;
        e.y = res.y;
      }
    }
  }

  // ── Update bullets ──
  const allBullets = [...bullets, ...newEnemyBullets];
  const liveBullets: Bullet[] = [];
  let hitAt = state.hitAt;
  let killAt = state.killAt;
  const particles: Particle[] = [...room.particles];
  const popups: DamagePopup[] = [...room.popups];
  let damageTaken = state.runStats.damageTaken;
  let kills = state.runStats.kills;

  for (const b of allBullets) {
    const nb: Bullet = {
      ...b,
      x: b.x + b.vx * dt,
      y: b.y + b.vy * dt,
      ttl: b.ttl - dt,
      hitIds: b.hitIds.slice(),
    };
    if (nb.ttl <= 0) continue;
    // Out of arena (inner play space)
    if (
      nb.x < CELL ||
      nb.x > ARENA_W - CELL ||
      nb.y < CELL ||
      nb.y > ARENA_H - CELL
    ) {
      // Spark on wall hit
      spawnSparks(particles, nb.x, nb.y, nb.friendly ? "#48aff0" : "#ff6060", 3, nextId);
      nextId += 3;
      continue;
    }
    // Pillar collision: bullets die on pillars
    let hitPillar = false;
    for (const pil of room.pillars) {
      if (
        nb.x >= pil.x * CELL &&
        nb.x <= pil.x * CELL + CELL &&
        nb.y >= pil.y * CELL &&
        nb.y <= pil.y * CELL + CELL
      ) {
        spawnSparks(particles, nb.x, nb.y, nb.friendly ? "#48aff0" : "#ff6060", 3, nextId);
        nextId += 3;
        hitPillar = true;
        break;
      }
    }
    if (hitPillar) continue;

    if (nb.friendly) {
      // Homing adjustment: gently rotate toward nearest enemy
      if (nb.homing && updatedEnemies.length > 0) {
        let nearest = updatedEnemies[0];
        let nd = distSq(nb.x, nb.y, nearest.x, nearest.y);
        for (const e of updatedEnemies) {
          const d2 = distSq(nb.x, nb.y, e.x, e.y);
          if (d2 < nd) {
            nd = d2;
            nearest = e;
          }
        }
        const want = angleTo(nb.x, nb.y, nearest.x, nearest.y);
        const cur = Math.atan2(nb.vy, nb.vx);
        let diff = want - cur;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turn = clamp(diff, -4 * dt, 4 * dt);
        const newAng = cur + turn;
        const speed = Math.hypot(nb.vx, nb.vy);
        nb.vx = Math.cos(newAng) * speed;
        nb.vy = Math.sin(newAng) * speed;
      }

      // Check vs enemies
      let hit = false;
      for (const e of updatedEnemies) {
        if (e.hp <= 0) continue;
        if (nb.hitIds.includes(e.id)) continue;
        const r = e.radius + BULLET_RADIUS_PLAYER;
        if (distSq(nb.x, nb.y, e.x, e.y) < r * r) {
          e.hp -= nb.damage;
          e.flash = 1;
          spawnSparks(particles, nb.x, nb.y, "#fff", 4, nextId);
          nextId += 4;
          popups.push({
            id: nextId++,
            x: e.x + rand(-6, 6),
            y: e.y - e.radius,
            vy: -40,
            life: 0.55,
            maxLife: 0.55,
            value: nb.damage,
            kind: e.hp <= 0 ? "kill" : "hit",
          });
          if (e.hp <= 0) {
            kills += 1;
            killAt = now;
            spawnSparks(particles, e.x, e.y, ENEMY_DEFS[e.kind].color, 8, nextId);
            nextId += 8;
          }
          if (nb.pierce) {
            nb.hitIds.push(e.id);
          } else {
            hit = true;
            break;
          }
        }
      }
      if (!hit) liveBullets.push(nb);
    } else {
      // Enemy bullet vs player
      if (p.invuln <= 0) {
        const r = PLAYER_RADIUS + BULLET_RADIUS_ENEMY;
        if (distSq(nb.x, nb.y, p.x, p.y) < r * r) {
          p.hp -= nb.damage;
          hitAt = now;
          p.invuln = PLAYER_HIT_IFRAMES;
          damageTaken += nb.damage;
          spawnSparks(particles, p.x, p.y, "#ff4d6d", 6, nextId);
          nextId += 6;
          continue;
        }
      }
      liveBullets.push(nb);
    }
  }

  // ── Enemy contact damage (fly/charger touch player) ──
  if (p.invuln <= 0) {
    for (const e of updatedEnemies) {
      if (e.hp <= 0) continue;
      if (e.kind === "shooter" || e.kind === "turret") continue; // ranged-only
      const r = e.radius + PLAYER_RADIUS;
      if (distSq(p.x, p.y, e.x, e.y) < r * r) {
        p.hp -= 1;
        hitAt = now;
        p.invuln = PLAYER_HIT_IFRAMES;
        damageTaken += 1;
        spawnSparks(particles, p.x, p.y, "#ff4d6d", 6, nextId);
        nextId += 6;
        break;
      }
    }
  }

  // ── Boss contact damage ──
  if (p.invuln <= 0) {
    for (const e of updatedEnemies) {
      if (e.kind !== "boss" || e.hp <= 0) continue;
      const r = e.radius + PLAYER_RADIUS;
      if (distSq(p.x, p.y, e.x, e.y) < r * r) {
        p.hp -= 2;
        hitAt = now;
        p.invuln = PLAYER_HIT_IFRAMES;
        damageTaken += 2;
        spawnSparks(particles, p.x, p.y, "#ff4d6d", 8, nextId);
        nextId += 8;
        break;
      }
    }
  }

  // Remove dead enemies
  const livingEnemies = updatedEnemies.filter((e) => e.hp > 0);

  // ── Bombs ──
  const newBombs: BombEntity[] = [];
  let explosionAt = state.explosionAt;
  for (const b of room.bombs) {
    const nb = { ...b };
    if (nb.exploding === 0) {
      nb.fuse -= dt;
      if (nb.fuse <= 0) {
        nb.exploding = BOMB_EXPLOSION_TIME;
        explosionAt = now;
        // Damage enemies
        for (const e of livingEnemies) {
          if (distSq(nb.x, nb.y, e.x, e.y) < BOMB_RADIUS * BOMB_RADIUS) {
            e.hp -= BOMB_DAMAGE_ENEMY;
            e.flash = 1;
            popups.push({
              id: nextId++,
              x: e.x + rand(-6, 6),
              y: e.y - e.radius,
              vy: -40,
              life: 0.55,
              maxLife: 0.55,
              value: BOMB_DAMAGE_ENEMY,
              kind: e.hp <= 0 ? "kill" : "hit",
            });
            if (e.hp <= 0) {
              kills += 1;
              killAt = now;
              spawnSparks(particles, e.x, e.y, ENEMY_DEFS[e.kind].color, 8, nextId);
              nextId += 8;
            }
          }
        }
        // Self damage
        if (p.invuln <= 0) {
          if (distSq(nb.x, nb.y, p.x, p.y) < BOMB_SELF_RADIUS * BOMB_SELF_RADIUS) {
            p.hp -= BOMB_SELF_DAMAGE;
            hitAt = now;
            p.invuln = PLAYER_HIT_IFRAMES;
            damageTaken += BOMB_SELF_DAMAGE;
          }
        }
        // Explosion particles
        spawnSparks(particles, nb.x, nb.y, "#ffb040", 16, nextId);
        nextId += 16;
      }
    } else {
      nb.exploding -= dt;
      if (nb.exploding <= 0) continue;
    }
    newBombs.push(nb);
  }

  // Purge dead enemies finalized above; update survivors list
  const finalEnemies = livingEnemies;

  // ── Pickups: check if player stepped on a pickup ──
  let pendingPickup = state.pendingPickup;
  let phase: GamePhase = state.phase;
  const remainingPickups: Pickup[] = [];
  for (const pu of room.pickups) {
    const r = PLAYER_RADIUS + 14;
    if (distSq(p.x, p.y, pu.x, pu.y) < r * r) {
      pendingPickup = pu;
      phase = "ITEM_PICKUP";
      // Don't pick up automatically — show confirm dialog
      // Keep pickup in room for now; consumed on CONFIRM via pendingPickup
      remainingPickups.push({ ...pu, bob: pu.bob + dt * 4 });
    } else {
      remainingPickups.push({ ...pu, bob: pu.bob + dt * 4 });
    }
  }

  // ── Particles ──
  const liveParticles: Particle[] = [];
  for (const ptl of particles) {
    const life = ptl.life - dt;
    if (life <= 0) continue;
    liveParticles.push({
      ...ptl,
      x: ptl.x + ptl.vx * dt,
      y: ptl.y + ptl.vy * dt,
      life,
    });
  }

  // ── Damage popups ──
  const livePopups: DamagePopup[] = [];
  for (const pp of popups) {
    const life = pp.life - dt;
    if (life <= 0) continue;
    livePopups.push({
      ...pp,
      y: pp.y + pp.vy * dt,
      life,
    });
  }

  // ── Room clear check ──
  let cleared = room.cleared;
  let doorClearedAt = state.doorClearedAt;
  let roomsCleared = state.runStats.roomsCleared;
  let newPickups = remainingPickups;
  if (
    !cleared &&
    finalEnemies.length === 0 &&
    room.type !== "START"
  ) {
    cleared = true;
    doorClearedAt = now;
    roomsCleared += 1;
    // Chance to spawn a pickup after clearing a COMBAT room.
    if (room.type === "COMBAT" && !room.pickupSpawned && Math.random() < 0.28) {
      newPickups = [
        ...remainingPickups,
        generatePickupForKind(pickRandomItem(), nextId, ARENA_W / 2, ARENA_H / 2),
      ];
      nextId += 1;
    }
  }

  // ── Door transition check ──
  let newCurrentKey = floor.currentKey;
  let transitionDir: Dir | null = null;
  let newFloorState: FloorState = floor;

  if (cleared) {
    for (const dir of room.neighbors) {
      const r = doorRect(dir);
      // Treat doors as rectangles the player can overlap with.
      if (
        p.x > r.x - 2 &&
        p.x < r.x + r.w + 2 &&
        p.y > r.y - 2 &&
        p.y < r.y + r.h + 2
      ) {
        // Transition
        const { dc, dr } = dirDelta(dir);
        const destKey = roomKey(room.col + dc, room.row + dr);
        if (floor.rooms.has(destKey)) {
          newCurrentKey = destKey;
          transitionDir = dir;
          const spawn = spawnPointForEntryDir(oppositeDir(dir));
          p.x = spawn.x;
          p.y = spawn.y;
          p.invuln = Math.max(p.invuln, 0.3);
          phase = "ROOM_TRANSITION";
          break;
        }
      }
    }
  }

  // Build a new rooms Map immutably. On room transitions, wipe transient FX
  // (bullets, bombs, particles) from both the source and destination rooms so
  // revisits are clean.
  const newRoom: RoomState = {
    ...room,
    bullets: transitionDir ? [] : liveBullets,
    enemies: finalEnemies,
    bombs: transitionDir ? [] : newBombs,
    pickups: newPickups,
    particles: transitionDir ? [] : liveParticles,
    popups: transitionDir ? [] : livePopups,
    cleared,
  };
  const newRooms = new Map(floor.rooms);
  newRooms.set(floor.currentKey, newRoom);
  if (transitionDir) {
    const dest = newRooms.get(newCurrentKey)!;
    newRooms.set(newCurrentKey, {
      ...dest,
      visited: true,
      bullets: [],
      bombs: [],
      particles: [],
      popups: [],
    });
  }
  newFloorState = { ...floor, rooms: newRooms, currentKey: newCurrentKey };

  // If we just entered a new room, populate its enemies
  let afterState: GameState = {
    ...state,
    player: p,
    floor: newFloorState,
    phase,
    transitionDir,
    transitionT: transitionDir ? TRANSITION_DURATION : 0,
    pendingPickup,
    hitAt,
    killAt,
    doorClearedAt,
    explosionAt,
    aimLast: p.aimAngle,
    moveAngle,
    moveMag,
    l2: action.l2,
    elapsedMs: state.elapsedMs + dt * 1000,
    nextId,
    runStats: {
      ...state.runStats,
      kills,
      damageTaken,
      roomsCleared,
    },
  };

  if (transitionDir) {
    afterState = ensureRoomPopulated(afterState);
  }

  // ── Death check ──
  if (p.hp <= 0) {
    return { ...afterState, phase: "DEAD", phaseTimer: 0 };
  }

  // ── Floor clear check (boss dead) ──
  if (newRoom.type === "BOSS" && newRoom.cleared && newRoom.enemies.length === 0) {
    return { ...afterState, phase: "FLOOR_CLEAR", phaseTimer: FLOOR_CLEAR_DURATION };
  }

  return afterState;
}

function spawnSparks(
  arr: Particle[],
  x: number,
  y: number,
  color: string,
  count: number,
  nextId: number,
): void {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(60, 180);
    arr.push({
      id: nextId + i,
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: rand(0.15, 0.4),
      maxLife: 0.4,
      color,
      size: rand(2, 3.5),
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════
 * AUDIO HELPERS
 * ═══════════════════════════════════════════════════════════════════ */

function playHit(c: Dualsense) {
  c.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 80);
}
function playKill(c: Dualsense) {
  c.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 25);
}
function playPickup(c: Dualsense) {
  c.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    c.stopTestTone().catch(() => {});
    setTimeout(() => {
      c.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(() => c.stopTestTone().catch(() => {}), 60);
    }, 50);
  }, 50);
}
function playBombPlace(c: Dualsense) {
  c.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 30);
}
function playExplosion(c: Dualsense) {
  c.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 160);
}
// Gentle lub-dub pulse at ~55 BPM for critical-HP warning.
function heartbeatIntensity(now: number): number {
  const t = now % 1100;
  if (t < 140) return 0.06; // lub
  if (t < 280) return 0;
  if (t < 380) return 0.035; // dub
  return 0;
}

function playDoorClear(c: Dualsense) {
  c.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 45);
}
function playFloorClear(c: Dualsense) {
  const steps = [0, 90, 180, 280];
  steps.forEach((t, i) => {
    setTimeout(() => {
      c.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(
        () => c.stopTestTone().catch(() => {}),
        i === steps.length - 1 ? 220 : 70,
      );
    }, t);
  });
}
function playDeath(c: Dualsense) {
  c.startTestTone("speaker", "100hz").catch(() => {});
  setTimeout(() => c.stopTestTone().catch(() => {}), 500);
}
function playVictory(c: Dualsense) {
  const steps = [0, 140, 280, 420, 600];
  steps.forEach((t, i) => {
    setTimeout(() => {
      c.startTestTone("speaker", "1khz").catch(() => {});
      setTimeout(
        () => c.stopTestTone().catch(() => {}),
        i === steps.length - 1 ? 300 : 100,
      );
    }, t);
  });
}

/* ═══════════════════════════════════════════════════════════════════
 * ANIMATIONS
 * ═══════════════════════════════════════════════════════════════════ */

const pulseAnim = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bobAnim = keyframes`
  0%, 100% { transform: translate(-50%, calc(-50% - 2px)); }
  50% { transform: translate(-50%, calc(-50% + 2px)); }
`;

const goalPulse = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(255, 100, 220, 0.5); }
  50% { box-shadow: 0 0 24px rgba(255, 100, 220, 0.9); }
`;

const bossGlow = keyframes`
  0%, 100% { box-shadow: 0 0 18px rgba(255, 80, 170, 0.6); }
  50% { box-shadow: 0 0 36px rgba(255, 80, 170, 1); }
`;

const flashRed = keyframes`
  0%, 100% { background: rgba(255, 60, 60, 0); }
  50% { background: rgba(255, 60, 60, 0.2); }
`;

/* ═══════════════════════════════════════════════════════════════════
 * STYLED COMPONENTS
 * ═══════════════════════════════════════════════════════════════════ */

const PageContainer = styled.div`
  max-width: 640px;
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
  transition: opacity 0.2s, filter 0.2s;
`;

const HUD = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
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

const HeartRow = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const HeartPip = styled.span<{ $alive: boolean; $low: boolean }>`
  font-size: 14px;
  color: ${(p) =>
    p.$alive
      ? p.$low
        ? "rgba(255, 80, 80, 0.95)"
        : "rgba(255, 80, 120, 0.95)"
      : "rgba(191, 204, 214, 0.2)"};
  text-shadow: ${(p) =>
    p.$alive && p.$low ? "0 0 5px rgba(255, 80, 80, 0.7)" : "none"};
  transition: color 0.2s, text-shadow 0.2s;
`;

const Spacer = styled.span`
  flex: 1;
`;

const Arena = styled.div`
  position: relative;
  width: ${ARENA_W}px;
  height: ${ARENA_H}px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    radial-gradient(circle at 20% 20%, rgba(60, 40, 80, 0.22) 0%, transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(40, 60, 90, 0.18) 0%, transparent 55%),
    linear-gradient(135deg, #10141e 0%, #0a0c16 100%);
  overflow: hidden;
  max-width: 100%;
  will-change: transform;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: ${ARENA_W} / ${ARENA_H};
  }
`;

const lowHpPulse = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
`;

const LowHpVignette = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 45%,
    rgba(180, 30, 50, 0.35) 80%,
    rgba(180, 30, 50, 0.6) 100%
  );
  animation: ${lowHpPulse} 1.1s ease-in-out infinite;
  z-index: 50;
`;

const WallBorder = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  &::before,
  &::after,
  span {
    position: absolute;
    background: linear-gradient(180deg, #26334a, #1a2234);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
  }
`;

const WallTop = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: ${CELL}px;
  background: linear-gradient(180deg, #26334a, #1a2234);
  box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

const WallBottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${CELL}px;
  background: linear-gradient(0deg, #26334a, #1a2234);
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

const WallLeft = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${CELL}px;
  background: linear-gradient(90deg, #26334a, #1a2234);
  box-shadow: inset -2px 0 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

const WallRight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${CELL}px;
  background: linear-gradient(-90deg, #26334a, #1a2234);
  box-shadow: inset 2px 0 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`;

const PillarEl = styled.div`
  position: absolute;
  width: ${CELL}px;
  height: ${CELL}px;
  background: linear-gradient(135deg, #3a4866, #1f2738);
  border: 1px solid rgba(120, 140, 180, 0.25);
  border-radius: 4px;
  box-shadow:
    inset 2px 2px 2px rgba(255, 255, 255, 0.05),
    inset -2px -2px 3px rgba(0, 0, 0, 0.5);
  pointer-events: none;
`;

const DoorEl = styled.div<{ $open: boolean; $kind: RoomType }>`
  position: absolute;
  background: ${(p) =>
    p.$open
      ? p.$kind === "BOSS"
        ? "linear-gradient(180deg, rgba(255, 50, 120, 0.45), rgba(160, 20, 70, 0.35))"
        : p.$kind === "TREASURE"
          ? "linear-gradient(180deg, rgba(255, 200, 60, 0.45), rgba(180, 120, 20, 0.35))"
          : "linear-gradient(180deg, rgba(60, 240, 140, 0.4), rgba(20, 160, 80, 0.25))"
      : "linear-gradient(180deg, rgba(200, 60, 60, 0.55), rgba(120, 20, 20, 0.4))"};
  border: 1px solid
    ${(p) =>
      p.$open
        ? p.$kind === "BOSS"
          ? "rgba(255, 120, 180, 0.7)"
          : p.$kind === "TREASURE"
            ? "rgba(255, 220, 120, 0.7)"
            : "rgba(120, 255, 180, 0.55)"
        : "rgba(255, 120, 120, 0.55)"};
  box-shadow: 0 0 10px
    ${(p) =>
      p.$open
        ? p.$kind === "BOSS"
          ? "rgba(255, 80, 160, 0.6)"
          : p.$kind === "TREASURE"
            ? "rgba(255, 200, 80, 0.55)"
            : "rgba(60, 220, 140, 0.5)"
        : "rgba(220, 80, 80, 0.5)"};
  pointer-events: none;
  transition: all 0.25s ease;
`;

const DoorIcon = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
`;

const PlayerEl = styled.div<{ $invuln: boolean; $dashing: boolean }>`
  position: absolute;
  width: ${PLAYER_RADIUS * 2}px;
  height: ${PLAYER_RADIUS * 2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    #f0f4ff,
    #a0b0d8 70%,
    #6070a0
  );
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 8px rgba(180, 200, 255, 0.4),
    inset 1px 1px 2px rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: ${(p) => (p.$invuln ? 0.55 : 1)};
  filter: ${(p) => (p.$dashing ? "brightness(1.3) blur(0.4px)" : "none")};
  transition: opacity 0.08s;
`;

const DashRing = styled.div`
  position: absolute;
  width: ${(PLAYER_RADIUS + 5) * 2}px;
  height: ${(PLAYER_RADIUS + 5) * 2}px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  -webkit-mask: radial-gradient(
    circle,
    transparent ${PLAYER_RADIUS + 2}px,
    black ${PLAYER_RADIUS + 3}px
  );
  mask: radial-gradient(
    circle,
    transparent ${PLAYER_RADIUS + 2}px,
    black ${PLAYER_RADIUS + 3}px
  );
`;

const FocusLine = styled.div`
  position: absolute;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(120, 200, 255, 0.55),
    rgba(120, 200, 255, 0)
  );
  transform-origin: 0 50%;
  pointer-events: none;
`;

const AimIndicator = styled.div`
  position: absolute;
  width: 24px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(180, 220, 255, 0.15),
    rgba(180, 220, 255, 0.75)
  );
  transform-origin: 0 50%;
  pointer-events: none;
  border-radius: 2px;
`;

const EnemyEl = styled.div<{ $kind: EnemyKind; $radius: number; $flash: number }>`
  position: absolute;
  width: ${(p) => p.$radius * 2}px;
  height: ${(p) => p.$radius * 2}px;
  border-radius: ${(p) => (p.$kind === "turret" ? "20%" : "50%")};
  background: ${(p) => {
    const c = ENEMY_DEFS[p.$kind].color;
    return `radial-gradient(circle at 30% 30%, ${c}dd, ${c}88 65%, ${c}55)`;
  }};
  border: 1px solid rgba(0, 0, 0, 0.4);
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow:
    ${(p) =>
      p.$flash > 0
        ? `0 0 ${8 + p.$flash * 14}px rgba(255, 60, 60, ${0.3 + p.$flash * 0.6})`
        : `0 0 6px ${ENEMY_DEFS[p.$kind].color}55`};
  filter: ${(p) =>
    p.$flash > 0
      ? `brightness(${1 + p.$flash * 1.2}) saturate(${1 + p.$flash * 0.6})`
      : "none"};
`;

const BossEl = styled(EnemyEl)`
  animation: ${bossGlow} 1.6s ease-in-out infinite;
`;

const BulletEl = styled.div<{ $friendly: boolean }>`
  position: absolute;
  width: ${(p) => (p.$friendly ? BULLET_RADIUS_PLAYER * 2 : BULLET_RADIUS_ENEMY * 2)}px;
  height: ${(p) => (p.$friendly ? BULLET_RADIUS_PLAYER * 2 : BULLET_RADIUS_ENEMY * 2)}px;
  border-radius: 50%;
  background: ${(p) =>
    p.$friendly
      ? "radial-gradient(circle, #ffffff, #f0d060 55%, #c08020 90%)"
      : "radial-gradient(circle, #ffe0e0, #ff6060 55%, #a02020)"};
  box-shadow: 0 0 ${(p) => (p.$friendly ? 6 : 7)}px
    ${(p) => (p.$friendly ? "rgba(255, 200, 80, 0.75)" : "rgba(255, 100, 100, 0.7)")};
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

const PickupEl = styled.div<{ $color: string }>`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${(p) => p.$color}ee,
    ${(p) => p.$color}55 70%,
    transparent
  );
  border: 1.5px solid ${(p) => p.$color};
  box-shadow: 0 0 10px ${(p) => p.$color}aa;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  animation: ${bobAnim} 1.4s ease-in-out infinite;
`;

const BombEl = styled.div<{ $fuse: number; $exploding: boolean }>`
  position: absolute;
  width: ${(p) => (p.$exploding ? BOMB_RADIUS * 2 : 18)}px;
  height: ${(p) => (p.$exploding ? BOMB_RADIUS * 2 : 18)}px;
  border-radius: 50%;
  background: ${(p) =>
    p.$exploding
      ? "radial-gradient(circle, rgba(255, 220, 160, 0.9), rgba(255, 120, 40, 0.5) 55%, transparent)"
      : "radial-gradient(circle, #1a1a1a, #0a0a0a 60%, #000)"};
  border: ${(p) =>
    p.$exploding ? "none" : "1.5px solid rgba(255, 150, 60, 0.85)"};
  box-shadow: ${(p) =>
    p.$exploding
      ? "0 0 40px rgba(255, 180, 80, 0.6)"
      : `0 0 ${4 + (1 - p.$fuse / BOMB_FUSE) * 10}px rgba(255, 120, 40, 0.6)`};
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.08s, height 0.08s;
`;

const ParticleEl = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

const PopupEl = styled.div<{ $kind: "hit" | "kill" }>`
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  font-weight: 800;
  font-size: ${(p) => (p.$kind === "kill" ? "15px" : "12px")};
  color: ${(p) => (p.$kind === "kill" ? "#ffd060" : "#ffffff")};
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.9),
    0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  white-space: nowrap;
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
  background: ${(p) => (p.$dim ? "rgba(0, 0, 0, 0.65)" : "transparent")};
  z-index: 5;
  pointer-events: none;
`;

const TitleText = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 200, 220, 0.92);
  letter-spacing: 6px;
  margin-bottom: 16px;
  animation: ${fadeInUp} 0.4s ease;
  text-shadow: 0 0 16px rgba(255, 100, 180, 0.45);
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

const DeadLabel = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: rgba(255, 80, 80, 0.92);
  letter-spacing: 4px;
  margin-bottom: 8px;
  animation: ${fadeInUp} 0.4s ease;
`;

const FloorClearLabel = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: rgba(255, 200, 80, 0.95);
  letter-spacing: 3px;
  animation: ${fadeInUp} 0.3s ease;
`;

const VictoryLabel = styled.div`
  font-size: 34px;
  font-weight: 700;
  color: #ffc44f;
  letter-spacing: 5px;
  margin-bottom: 12px;
  animation: ${fadeInUp} 0.4s ease;
`;

const PausedLabel = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`;

const PickupLabel = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: rgba(200, 160, 255, 0.95);
  letter-spacing: 2px;
  margin-bottom: 8px;
  animation: ${fadeInUp} 0.3s ease;
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

const MinimapContainer = styled.div`
  position: absolute;
  top: ${CELL + 4}px;
  right: ${CELL + 4}px;
  display: grid;
  grid-template-columns: repeat(${FLOOR_GRID}, 14px);
  grid-template-rows: repeat(${FLOOR_GRID}, 14px);
  gap: 2px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  pointer-events: none;
`;

const MinimapCell = styled.div<{
  $state: "empty" | "visited" | "current" | "unvisited";
  $type: RoomType | "empty";
}>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: ${(p) =>
    p.$state === "empty"
      ? "transparent"
      : p.$state === "current"
        ? p.$type === "BOSS"
          ? "rgba(255, 100, 180, 0.95)"
          : p.$type === "TREASURE"
            ? "rgba(255, 200, 80, 0.95)"
            : "rgba(120, 200, 255, 0.95)"
        : p.$state === "visited"
          ? p.$type === "BOSS"
            ? "rgba(160, 50, 100, 0.6)"
            : p.$type === "TREASURE"
              ? "rgba(180, 140, 40, 0.6)"
              : "rgba(80, 120, 180, 0.5)"
          : p.$type === "BOSS"
            ? "rgba(100, 30, 70, 0.3)"
            : p.$type === "TREASURE"
              ? "rgba(130, 100, 30, 0.3)"
              : "rgba(50, 70, 100, 0.25)"};
  border: ${(p) =>
    p.$state === "current"
      ? "1px solid rgba(255, 255, 255, 0.85)"
      : p.$state === "empty"
        ? "none"
        : "1px solid rgba(255, 255, 255, 0.1)"};
  position: relative;

  &::after {
    content: ${(p) =>
      p.$state === "empty"
        ? "''"
        : p.$type === "BOSS"
          ? "'!'"
          : p.$type === "TREASURE"
            ? "'?'"
            : "''"};
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const BossHealthBar = styled.div`
  position: absolute;
  top: ${CELL + 4}px;
  left: ${CELL + 4}px;
  right: ${CELL + 120}px;
  height: 8px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 120, 180, 0.4);
  border-radius: 3px;
  overflow: hidden;
  pointer-events: none;
`;

const BossHealthFill = styled.div<{ $ratio: number }>`
  height: 100%;
  width: ${(p) => p.$ratio * 100}%;
  background: linear-gradient(90deg, #ff3380, #ff77aa);
  box-shadow: 0 0 6px rgba(255, 100, 180, 0.5);
  transition: width 0.15s;
`;

const InventoryOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(6, 8, 16, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 6;
`;

const InventoryTitle = styled.div`
  font-size: 18px;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 3px;
  margin-bottom: 16px;
  font-family: "Fira Code", monospace;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  width: 100%;
  max-width: 380px;
`;

const ItemRow = styled.div<{ $owned: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${(p) =>
    p.$owned ? "rgba(255, 255, 255, 0.04)" : "transparent"};
  opacity: ${(p) => (p.$owned ? 1 : 0.4)};
  font-size: 12px;
  font-family: "Fira Code", monospace;
`;

const ItemIcon = styled.div<{ $color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) => p.$color}cc;
  border: 1px solid ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 12px;
  flex-shrink: 0;
  box-shadow: 0 0 4px ${(p) => p.$color}88;
`;

const ItemLabel = styled.div`
  flex: 1;
  color: rgba(191, 204, 214, 0.9);
`;

const ItemCount = styled.div`
  color: rgba(72, 175, 240, 0.9);
  font-weight: 700;
`;

const FlashLayer = styled.div<{ $on: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  opacity: ${(p) => (p.$on ? 1 : 0)};
  animation: ${(p) =>
    p.$on
      ? css`
          ${flashRed} 0.28s ease-out 1
        `
      : "none"};
`;

/* ═══════════════════════════════════════════════════════════════════
 * DESCRIPTION SECTION (styled)
 * ═══════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════
 * COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */

const DescentPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    initialState(),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const gameLoopRef = useRef<number>(0);
  const prevPhaseRef = useRef<GamePhase>("TITLE");
  const lastHitAudioRef = useRef(0);
  const lastKillAudioRef = useRef(0);
  const lastPickupAudioRef = useRef(0);
  const lastBombAudioRef = useRef(0);
  const lastExplosionAudioRef = useRef(0);
  const lastDoorAudioRef = useRef(0);
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

  // Cross — start / confirm
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (
        phase === "TITLE" ||
        phase === "DEAD" ||
        phase === "VICTORY" ||
        phase === "ITEM_PICKUP" ||
        phase === "FLOOR_CLEAR"
      ) {
        dispatch({ type: "CONFIRM" });
      } else if (phase === "PLAYING") {
        dispatch({ type: "DASH" });
      }
    };
    controller.cross.on("press", handler);
    return () => {
      controller.cross.off("press", handler);
    };
  }, [controller]);

  // Square — bomb
  useEffect(() => {
    if (!controller?.square) return;
    const handler = () => dispatch({ type: "BOMB" });
    controller.square.on("press", handler);
    return () => {
      controller.square.off("press", handler);
    };
  }, [controller]);

  // Triangle — pause
  useEffect(() => {
    if (!controller?.triangle) return;
    const handler = () => dispatch({ type: "TOGGLE_PAUSE" });
    controller.triangle.on("press", handler);
    return () => {
      controller.triangle.off("press", handler);
    };
  }, [controller]);

  // Circle — inventory
  useEffect(() => {
    if (!controller?.circle) return;
    const handler = () => dispatch({ type: "TOGGLE_INVENTORY" });
    controller.circle.on("press", handler);
    return () => {
      controller.circle.off("press", handler);
    };
  }, [controller]);

  // D-pad up — toggle map (map already renders always; this expands it)
  useEffect(() => {
    if (!controller?.dpad?.up) return;
    const handler = () => dispatch({ type: "TOGGLE_MAP" });
    controller.dpad.up.on("press", handler);
    return () => {
      controller.dpad.up.off("press", handler);
    };
  }, [controller]);

  // Main rAF loop
  useEffect(() => {
    if (!controller) return;
    const running: GamePhase[] = [
      "PLAYING",
      "ROOM_TRANSITION",
      "FLOOR_CLEAR",
    ];
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
        const la = controller.left.analog;
        const ra = controller.right.analog;
        const moveMag = la.magnitude > MOVE_DEADZONE ? la.magnitude : 0;
        const moveAngle = moveMag > 0 ? -la.angle : 0;
        const aimMag = ra.magnitude > AIM_DEADZONE ? ra.magnitude : 0;
        const aimAngle = aimMag > 0 ? -ra.angle : 0;
        const r2 = controller.right.trigger.state ?? 0;
        const l2 = controller.left.trigger.state ?? 0;
        const dpad = {
          up: !!controller.dpad?.up?.active,
          down: !!controller.dpad?.down?.active,
          left: !!controller.dpad?.left?.active,
          right: !!controller.dpad?.right?.active,
        };
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
          dpad,
        });
        accum -= TICK;
      }

      const s = stateRef.current;

      // ── Rumble (throttled ~10Hz) ──
      if (now - lastRumble > 100) {
        lastRumble = now;
        // Gentle lub-dub heartbeat on left motor when HP = 1
        if (s.phase === "PLAYING" && s.player.hp === 1) {
          controller.left.rumble(heartbeatIntensity(now));
        } else {
          controller.left.rumble(0);
        }
      }

      // ── Lightbar (~10Hz) ──
      if (now - lastLightbar > 100) {
        lastLightbar = now;
        if (s.lightbarFlash && now - s.lightbarFlash.at < 260) {
          controller.lightbar?.set({
            r: s.lightbarFlash.r,
            g: s.lightbarFlash.g,
            b: s.lightbarFlash.b,
          });
        } else if (s.phase === "PLAYING" || s.phase === "ROOM_TRANSITION") {
          const ratio = s.player.hp / Math.max(1, s.player.maxHp);
          if (ratio > 0.6) {
            controller.lightbar?.set({ r: 20, g: 200, b: 80 });
          } else if (ratio > 0.3) {
            controller.lightbar?.set({ r: 220, g: 160, b: 0 });
          } else if (s.player.hp > 1) {
            controller.lightbar?.set({ r: 220, g: 60, b: 30 });
          } else {
            const phase = Math.floor(now / 180) % 2;
            controller.lightbar?.set(
              phase === 0 ? { r: 255, g: 0, b: 0 } : { r: 50, g: 0, b: 0 },
            );
          }
        }
      }

      // ── Trigger effects (~5Hz) ──
      if (now - lastTrigger > 200) {
        lastTrigger = now;
        if (s.phase === "PLAYING" || s.phase === "ROOM_TRANSITION") {
          controller.right?.trigger?.feedback?.set({
            effect: TriggerEffect.Weapon,
            start: 0.18,
            end: 0.5,
            strength: 0.75,
          });
          controller.left?.trigger?.feedback?.set({
            effect: TriggerEffect.Feedback,
            position: 0.25,
            strength: 0.5,
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

  // Hit → right motor burst + audio
  useEffect(() => {
    if (!controller) return;
    if (state.hitAt === 0 || state.hitAt === lastHitAudioRef.current) return;
    lastHitAudioRef.current = state.hitAt;
    playHit(controller);
    controller.left.rumble(0.8);
    const t = setTimeout(() => {
      if (stateRef.current.phase === "PLAYING") {
        controller.left.rumble(
          stateRef.current.player.hp === 1
            ? heartbeatIntensity(performance.now())
            : 0,
        );
      }
    }, 250);
    return () => clearTimeout(t);
  }, [controller, state.hitAt]);

  // Kill → right motor burst + audio (throttled)
  useEffect(() => {
    if (!controller) return;
    if (state.killAt === 0 || state.killAt === lastKillAudioRef.current) return;
    const prev = lastKillAudioRef.current;
    lastKillAudioRef.current = state.killAt;
    if (state.killAt - prev < 45) return;
    playKill(controller);
    controller.right.rumble(0.4);
    const t = setTimeout(() => {
      controller.right.rumble(0);
    }, 60);
    return () => clearTimeout(t);
  }, [controller, state.killAt]);

  // Pickup → audio
  useEffect(() => {
    if (!controller) return;
    if (state.pickupAt === 0 || state.pickupAt === lastPickupAudioRef.current)
      return;
    lastPickupAudioRef.current = state.pickupAt;
    playPickup(controller);
  }, [controller, state.pickupAt]);

  // Bomb place → audio + small right motor
  useEffect(() => {
    if (!controller) return;
    if (state.bombAt === 0 || state.bombAt === lastBombAudioRef.current) return;
    lastBombAudioRef.current = state.bombAt;
    playBombPlace(controller);
  }, [controller, state.bombAt]);

  // Bomb explosion → audio + big rumble on both
  useEffect(() => {
    if (!controller) return;
    if (
      state.explosionAt === 0 ||
      state.explosionAt === lastExplosionAudioRef.current
    )
      return;
    lastExplosionAudioRef.current = state.explosionAt;
    playExplosion(controller);
    controller.left.rumble(0.6);
    controller.right.rumble(0.8);
    const t = setTimeout(() => {
      controller.left.rumble(
        stateRef.current.player.hp === 1
          ? heartbeatIntensity(performance.now())
          : 0,
      );
      controller.right.rumble(0);
    }, 220);
    return () => clearTimeout(t);
  }, [controller, state.explosionAt]);

  // Door/room clear → audio + right motor tap
  useEffect(() => {
    if (!controller) return;
    if (
      state.doorClearedAt === 0 ||
      state.doorClearedAt === lastDoorAudioRef.current
    )
      return;
    lastDoorAudioRef.current = state.doorClearedAt;
    playDoorClear(controller);
    controller.right.rumble(0.3);
    const t = setTimeout(() => {
      controller.right.rumble(0);
    }, 120);
    return () => clearTimeout(t);
  }, [controller, state.doorClearedAt]);

  // Player LEDs — floor progress
  useEffect(() => {
    if (!controller?.playerLeds) return;
    if (state.phase === "VICTORY") {
      for (let i = 0; i < 5; i++) controller.playerLeds.setLed(i, true);
      return;
    }
    if (state.phase === "TITLE" || state.phase === "DEAD") {
      controller.playerLeds.clear();
      return;
    }
    for (let i = 0; i < 5; i++) {
      controller.playerLeds.setLed(i, i < state.floorIndex + 1);
    }
  }, [controller, state.floorIndex, state.phase]);

  // Mute LED — solid when current room uncleared
  useEffect(() => {
    if (!controller?.mute) return;
    if (state.phase === "PAUSED") {
      controller.mute.setLed(MuteLedMode.Pulse);
      return;
    }
    if (state.phase !== "PLAYING" && state.phase !== "ROOM_TRANSITION") {
      controller.mute.resetLed();
      return;
    }
    const room = state.floor?.rooms.get(state.floor.currentKey);
    if (room && !room.cleared) {
      controller.mute.setLed(MuteLedMode.On);
    } else {
      controller.mute.resetLed();
    }
  }, [controller, state.phase, state.floor?.currentKey, state.floor]);

  // Phase transitions — one-shots
  useEffect(() => {
    if (!controller) return;
    const prev = prevPhaseRef.current;
    const curr = state.phase;
    prevPhaseRef.current = curr;
    if (prev === curr) return;

    if (curr === "FLOOR_CLEAR") {
      playFloorClear(controller);
      controller.lightbar?.set({ r: 255, g: 255, b: 255 });
      controller.right.rumble(0.4);
      const t = setTimeout(() => {
        controller.right.rumble(0);
      }, 280);
      return () => clearTimeout(t);
    }

    if (curr === "VICTORY") {
      playVictory(controller);
      const start = performance.now();
      let raf = 0;
      const cycle = (t: number) => {
        const dtv = (t - start) / 1000;
        const r = Math.round(128 + 127 * Math.sin(dtv * 2.2));
        const g = Math.round(128 + 127 * Math.sin(dtv * 2.2 + 2.094));
        const b = Math.round(128 + 127 * Math.sin(dtv * 2.2 + 4.188));
        controller.lightbar?.set({ r, g, b });
        raf = requestAnimationFrame(cycle);
      };
      raf = requestAnimationFrame(cycle);
      const timer = setTimeout(() => cancelAnimationFrame(raf), 6000);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    if (curr === "DEAD") {
      playDeath(controller);
      controller.lightbar?.set({ r: 120, g: 0, b: 0 });
      controller.left.rumble(0);
      controller.right.rumble(0);
      controller.right?.trigger?.feedback?.reset();
      controller.left?.trigger?.feedback?.reset();
      controller.mute?.resetLed();
    }

    if (curr === "TITLE") {
      controller.left.rumble(0);
      controller.right.rumble(0);
      controller.right?.trigger?.feedback?.reset();
      controller.left?.trigger?.feedback?.reset();
      controller.lightbar?.set({ r: 30, g: 20, b: 60 });
      controller.mute?.resetLed();
    }

    if (curr === "ITEM_PICKUP") {
      controller.left.rumble(0);
      controller.right.rumble(0);
    }
  }, [controller, state.phase]);

  // Unmount cleanup
  useEffect(() => {
    return () => {
      controller?.left?.rumble(0);
      controller?.right?.rumble(0);
      controller?.right?.trigger?.feedback?.reset();
      controller?.left?.trigger?.feedback?.reset();
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

  const room = state.floor?.rooms.get(state.floor.currentKey) ?? null;
  const isBossRoom = room?.type === "BOSS";
  const boss = isBossRoom ? room?.enemies.find((e) => e.kind === "boss") : null;

  const hitFlash =
    state.hitAt !== 0 && performance.now() - state.hitAt < 260;

  // ── Minimap cells ──
  const minimapCells: JSX.Element[] = [];
  for (let r = 0; r < FLOOR_GRID; r++) {
    for (let c = 0; c < FLOOR_GRID; c++) {
      const k = roomKey(c, r);
      const rm = state.floor?.rooms.get(k);
      const isCurrent = state.floor?.currentKey === k;
      const cellState: "empty" | "visited" | "current" | "unvisited" = !rm
        ? "empty"
        : isCurrent
          ? "current"
          : rm.visited
            ? "visited"
            : "unvisited";
      const cellType = rm?.type ?? "empty";
      minimapCells.push(
        <MinimapCell
          key={`mm-${k}`}
          $state={cellState}
          $type={cellType}
        />,
      );
    }
  }

  return (
    <PageContainer>
      <Header>
        <PageTitle>Descent</PageTitle>
        <PageSubtitle>
          Procedural roguelite. Twin-stick shoot, dodge-dash, and descend
          three floors of boss-gated rooms.
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
            <HeartRow title="HP">
              {Array.from({ length: state.player.maxHp }, (_, i) => (
                <HeartPip
                  key={i}
                  $alive={i < state.player.hp}
                  $low={state.player.hp <= 1 && i < state.player.hp}
                >
                  ♥
                </HeartPip>
              ))}
            </HeartRow>
            <HudItem>💣 {state.player.bombs}</HudItem>
            <HudItem>Floor {state.floorIndex + 1}/3</HudItem>
            <Spacer />
            <HudItem>Kills {state.runStats.kills}</HudItem>
            <HudItem>Rooms {state.runStats.roomsCleared}</HudItem>
          </HUD>

          <Arena
            style={{
              transform: (() => {
                const now = performance.now();
                let mag = 0;
                const hitAge = now - state.hitAt;
                const expAge = now - state.explosionAt;
                if (state.hitAt > 0 && hitAge < 250) {
                  mag = Math.max(mag, 5 * (1 - hitAge / 250));
                }
                if (state.explosionAt > 0 && expAge < 400) {
                  mag = Math.max(mag, 10 * (1 - expAge / 400));
                }
                if (mag < 0.1) return "none";
                const x = (Math.random() - 0.5) * mag * 2;
                const y = (Math.random() - 0.5) * mag * 2;
                return `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
              })(),
            }}
          >
            <WallTop />
            <WallBottom />
            <WallLeft />
            <WallRight />

            {/* Pillars */}
            {room?.pillars.map((pil, i) => (
              <PillarEl
                key={`pil-${i}`}
                style={{
                  left: `${pil.x * CELL}px`,
                  top: `${pil.y * CELL}px`,
                }}
              />
            ))}

            {/* Doors — one per neighbor */}
            {room &&
              Array.from(room.neighbors).map((dir) => {
                const destKey = (() => {
                  const { dc, dr } = dirDelta(dir);
                  return roomKey(room.col + dc, room.row + dr);
                })();
                const dest = state.floor?.rooms.get(destKey);
                const destType = dest?.type ?? "COMBAT";
                const rect = doorRect(dir);
                const open = room.cleared;
                return (
                  <DoorEl
                    key={`door-${dir}`}
                    $open={open}
                    $kind={destType}
                    style={{
                      left: `${rect.x}px`,
                      top: `${rect.y}px`,
                      width: `${rect.w}px`,
                      height: `${rect.h}px`,
                    }}
                  >
                    {open && destType === "BOSS" && <DoorIcon>!</DoorIcon>}
                    {open && destType === "TREASURE" && <DoorIcon>?</DoorIcon>}
                    {!open && <DoorIcon>✕</DoorIcon>}
                  </DoorEl>
                );
              })}

            {/* Pickups */}
            {room?.pickups.map((pu) => {
              const def = ITEM_DEFS[pu.kind];
              return (
                <PickupEl
                  key={`pu-${pu.id}`}
                  $color={def.color}
                  style={{
                    left: `${pu.x - 13}px`,
                    top: `${pu.y - 13}px`,
                  }}
                  title={def.label}
                >
                  {def.glyph}
                </PickupEl>
              );
            })}

            {/* Bombs */}
            {room?.bombs.map((b) => (
              <BombEl
                key={`b-${b.id}`}
                $fuse={b.fuse}
                $exploding={b.exploding > 0}
                style={{
                  left: `${b.x}px`,
                  top: `${b.y}px`,
                }}
              />
            ))}

            {/* Bullets */}
            {room?.bullets.map((bu) => (
              <BulletEl
                key={`bu-${bu.id}`}
                $friendly={bu.friendly}
                style={{ left: `${bu.x}px`, top: `${bu.y}px` }}
              />
            ))}

            {/* Enemies */}
            {room?.enemies.map((en) =>
              en.kind === "boss" ? (
                <BossEl
                  key={`en-${en.id}`}
                  $kind={en.kind}
                  $radius={en.radius}
                  $flash={en.flash}
                  style={{ left: `${en.x}px`, top: `${en.y}px` }}
                />
              ) : (
                <EnemyEl
                  key={`en-${en.id}`}
                  $kind={en.kind}
                  $radius={en.radius}
                  $flash={en.flash}
                  style={{ left: `${en.x}px`, top: `${en.y}px` }}
                />
              ),
            )}

            {/* Particles */}
            {room?.particles.map((pt) => (
              <ParticleEl
                key={`pt-${pt.id}`}
                style={{
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                  width: `${pt.size}px`,
                  height: `${pt.size}px`,
                  background: pt.color,
                  opacity: Math.max(0, pt.life / pt.maxLife),
                }}
              />
            ))}

            {/* Damage popups */}
            {room?.popups.map((pp) => {
              const t = pp.life / pp.maxLife;
              return (
                <PopupEl
                  key={`pp-${pp.id}`}
                  $kind={pp.kind}
                  style={{
                    left: `${pp.x}px`,
                    top: `${pp.y}px`,
                    opacity: Math.min(1, t * 2),
                    transform: `translate(-50%, -50%) scale(${pp.kind === "kill" ? 1 + (1 - t) * 0.3 : 1})`,
                  }}
                >
                  {pp.value}
                </PopupEl>
              );
            })}

            {/* Player */}
            {state.phase !== "TITLE" && state.phase !== "DEAD" && (
              <>
                {state.l2 > 0.15 && (
                  <FocusLine
                    style={{
                      left: `${state.player.x}px`,
                      top: `${state.player.y}px`,
                      width: `${120 + state.l2 * 120}px`,
                      transform: `rotate(${state.player.aimAngle}rad)`,
                      opacity: Math.min(1, (state.l2 - 0.15) * 2),
                    }}
                  />
                )}
                <PlayerEl
                  $invuln={state.player.invuln > 0.05}
                  $dashing={state.player.dashT > 0}
                  style={{
                    left: `${state.player.x}px`,
                    top: `${state.player.y}px`,
                  }}
                />
                {state.player.dashCooldown > 0 && (
                  <DashRing
                    style={{
                      left: `${state.player.x}px`,
                      top: `${state.player.y}px`,
                      background: `conic-gradient(from -90deg, rgba(120, 220, 255, 0.75) ${((1 - state.player.dashCooldown / PLAYER_DASH_COOLDOWN) * 360).toFixed(1)}deg, transparent 0)`,
                    }}
                  />
                )}
                <AimIndicator
                  style={{
                    left: `${state.player.x}px`,
                    top: `${state.player.y}px`,
                    transform: `rotate(${state.player.aimAngle}rad)`,
                  }}
                />
              </>
            )}

            {/* Hit flash */}
            <FlashLayer $on={hitFlash} />

            {/* Low-HP vignette */}
            {state.phase === "PLAYING" && state.player.hp === 1 && (
              <LowHpVignette />
            )}

            {/* Minimap */}
            {state.floor && <MinimapContainer>{minimapCells}</MinimapContainer>}

            {/* Boss health bar */}
            {isBossRoom && boss && (
              <BossHealthBar>
                <BossHealthFill $ratio={boss.hp / boss.maxHp} />
              </BossHealthBar>
            )}

            {/* Overlays */}
            {state.phase === "TITLE" && (
              <Overlay $dim>
                <TitleText>DESCENT</TitleText>
                <SubText>
                  Twin-stick. R2 fires. L2 focuses.
                  <br />
                  × to dash · □ for a bomb · △ pauses · ○ inventory
                  <br />
                  Clear three floors. Don't die.
                </SubText>
                <PromptText>Press × to begin</PromptText>
              </Overlay>
            )}

            {state.phase === "PAUSED" && !state.showInventory && (
              <Overlay $dim>
                <PausedLabel>PAUSED</PausedLabel>
                <SubText style={{ marginTop: 16 }}>△ to resume</SubText>
              </Overlay>
            )}

            {state.phase === "ITEM_PICKUP" && state.pendingPickup && (
              <Overlay $dim>
                <PickupLabel>
                  {ITEM_DEFS[state.pendingPickup.kind].glyph}{" "}
                  {ITEM_DEFS[state.pendingPickup.kind].label.toUpperCase()}
                </PickupLabel>
                <SubText>{ITEM_DEFS[state.pendingPickup.kind].desc}</SubText>
                <PromptText>× to pick up</PromptText>
              </Overlay>
            )}

            {state.phase === "FLOOR_CLEAR" && (
              <Overlay $dim>
                <FloorClearLabel>
                  FLOOR {state.floorIndex + 1} CLEAR
                </FloorClearLabel>
                <SubText style={{ marginTop: 16 }}>× to descend</SubText>
              </Overlay>
            )}

            {state.phase === "DEAD" && (
              <Overlay $dim>
                <DeadLabel>YOU DIED</DeadLabel>
                <SubText>
                  Floor {state.floorIndex + 1} ·{" "}
                  {state.runStats.roomsCleared} rooms ·{" "}
                  {state.runStats.kills} kills
                </SubText>
                <PromptText>× to try again</PromptText>
              </Overlay>
            )}

            {state.phase === "VICTORY" && (
              <Overlay $dim>
                <VictoryLabel>ASCENDED</VictoryLabel>
                <SubText>
                  {state.runStats.kills} kills · {state.runStats.roomsCleared}{" "}
                  rooms cleared
                  <br />
                  Items: {Object.values(state.player.items).reduce((a, b) => a + b, 0)}
                </SubText>
                <PromptText>× to descend again</PromptText>
              </Overlay>
            )}

            {state.showInventory && state.phase !== "TITLE" && (
              <InventoryOverlay>
                <InventoryTitle>INVENTORY</InventoryTitle>
                <ItemGrid>
                  {(Object.keys(ITEM_DEFS) as ItemKind[]).map((k) => {
                    const def = ITEM_DEFS[k];
                    const n = state.player.items[k] ?? 0;
                    return (
                      <ItemRow key={k} $owned={n > 0}>
                        <ItemIcon $color={def.color}>{def.glyph}</ItemIcon>
                        <ItemLabel>
                          {def.label}
                          <div
                            style={{
                              fontSize: 10,
                              color: "rgba(191,204,214,0.5)",
                            }}
                          >
                            {def.desc}
                          </div>
                        </ItemLabel>
                        <ItemCount>×{n}</ItemCount>
                      </ItemRow>
                    );
                  })}
                </ItemGrid>
                <SubText style={{ marginTop: 20 }}>○ to close</SubText>
              </InventoryOverlay>
            )}
          </Arena>

          {(state.phase === "PLAYING" ||
            state.phase === "ROOM_TRANSITION" ||
            state.phase === "PAUSED" ||
            state.phase === "ITEM_PICKUP") && (
            <StatsRow>
              <span>
                Room {state.floor?.currentKey ?? "-"}{" "}
                {room?.cleared ? "· cleared" : `· ${room?.enemies.length ?? 0} enemies`}
              </span>
              <span>Dash {state.player.dashCooldown > 0 ? "cd" : "ready"}</span>
              <span>
                Items{" "}
                {Object.values(state.player.items).reduce((a, b) => a + b, 0)}
              </span>
            </StatsRow>
          )}
        </OverlayContent>
      </GameArea>

      <DescriptionSection>
        <DescriptionHeading>Controller Features</DescriptionHeading>
        <FeatureList>
          <li>
            <strong>Twin-stick</strong> &mdash; <code>left.analog</code> moves,{" "}
            <code>right.analog</code> aims. If the right stick is dead, the
            D-pad takes over as cardinal aim — showing off{" "}
            <code>Momentary.active</code> as a readable boolean.
          </li>
          <li>
            <strong>Analog fire rate</strong> &mdash; <code>R2</code>'s{" "}
            <code>.state</code> maps to two fire-rate tiers: a slow trickle
            past 20% pull, full auto past 60%. Trigger uses{" "}
            <code>TriggerEffect.Weapon</code> for a click-stop feel so both
            tiers are physically distinguishable.
          </li>
          <li>
            <strong>Focus trigger</strong> &mdash; <code>L2</code> halves
            movement speed (for precise weaving) with a mild resistance via{" "}
            <code>TriggerEffect.Feedback</code> — an always-on "hold this for
            a benefit" button.
          </li>
          <li>
            <strong>Cross — dash</strong> with iframes. Press direction +{" "}
            <code>×</code> to phase through a bullet wall or close a gap. The
            iframes end mid-dash, so it's reactive, not a panic button.
          </li>
          <li>
            <strong>Square — bomb</strong>, Circle — inventory, Triangle —
            pause, D-pad Up — full map toggle.
          </li>
          <li>
            <strong>Left rumble</strong> &mdash; continuous low heartbeat
            when HP drops to 1, and a strong pulse whenever you take damage.
            Two channels of meaning on one motor: a peripheral "you're
            hurting" cue and an acute "you got hit" cue.
          </li>
          <li>
            <strong>Right rumble</strong> &mdash; short tap on each enemy
            kill, tighter tap on door-unlock when a room clears, and a heavy
            dual-motor thump on bomb detonation (the only moment both motors
            fire together).
          </li>
          <li>
            <strong>Lightbar</strong> &mdash; HP color: green → yellow →
            red, flashing red at 1 HP. Purple burst on item pickup, white on
            floor clear, rainbow on final victory.
          </li>
          <li>
            <strong>Player LEDs</strong> &mdash; current floor (1-3) with
            all five lit on victory.
          </li>
          <li>
            <strong>Mute LED</strong> &mdash; solid when the current room
            still has enemies; dark once cleared. A glanceable "can I leave?"
            indicator. Pulses during pause.
          </li>
          <li>
            <strong>Speaker</strong> &mdash; short 1kHz click on enemy kills,
            100Hz hit thump, ascending arpeggio on item pickup, low thud on
            bomb detonation, four-note floor clear, five-note ascended
            fanfare.
          </li>
        </FeatureList>

        <DescriptionHeading>Implementation Notes</DescriptionHeading>
        <p>
          Procedural floor generation is a random walk on a 5×5 logical grid.
          Pick a start cell on the left edge, walk to random unvisited
          neighbors until we have 6-9 rooms, then run BFS from start to find
          the farthest reachable cell and tag it as the boss. A random
          non-start, non-boss cell becomes the treasure room. All of it runs
          in a few hundred lines — no dungeon generator libraries needed.
        </p>

        <CodeBlock
          code={`function generateFloor(floorIndex) {
  const target = 6 + floorIndex + randInt(0, 2);
  const visited = new Map();
  const conns = new Map();
  let cursor = { col: 0, row: 2 };
  visited.set(key(cursor), cursor);
  conns.set(key(cursor), new Set());

  while (visited.size < target) {
    const dirs = shuffle(["N", "S", "E", "W"]);
    for (const d of dirs) {
      const next = step(cursor, d);
      if (inBounds(next) && !visited.has(key(next))) {
        visited.set(key(next), next);
        conns.set(key(next), new Set([oppositeDir(d)]));
        conns.get(key(cursor)).add(d);
        cursor = next;
        break;
      }
    }
  }

  // BFS from start to pick farthest cell as boss.
  const dists = bfs(key(start), conns);
  const bossKey = argmax(dists);
  return { visited, conns, bossKey };
}`}
        />

        <p>
          Enemy AI is four pure per-tick functions:{" "}
          <code>updateFly</code>, <code>updateShooter</code>,{" "}
          <code>updateTurret</code>, <code>updateCharger</code>, plus a
          phased <code>updateBoss</code>. Each takes an enemy and a context
          (player, dt, bullet sink) and returns the next enemy. No side
          effects — testable in isolation, composable, easy to add a fifth
          type.
        </p>

        <CodeBlock
          code={`function updateCharger(e, ctx) {
  // 0 = pursue, 1 = windup (locked-on), 2 = charge, 3 = rest
  if (e.phase === 0) {
    const a = angleTo(e, ctx.player);
    e.vx = Math.cos(a) * 120;
    e.vy = Math.sin(a) * 120;
    if (dist(e, ctx.player) < 160) {
      e.phase = 1;
      e.timer = 0.85;
      e.targetX = ctx.player.x;
      e.targetY = ctx.player.y;
    }
  } else if (e.phase === 1) {
    e.timer -= ctx.dt;
    e.flash = 1 - e.timer / 0.85;
    if (e.timer <= 0) {
      const a = angleTo(e, { x: e.targetX, y: e.targetY });
      e.vx = Math.cos(a) * 400;
      e.vy = Math.sin(a) * 400;
      e.phase = 2;
      e.timer = 0.3;
    }
  }
  // ... phases 2 & 3
  return e;
}`}
        />

        <p>
          Items stack as typed counters on the player. Firing reads a
          computed stats object (<code>damage</code>, <code>fireRateMult</code>
          , <code>homing</code>, <code>pierce</code>) so the bullet-spawn
          code doesn't care whether you have zero items or thirty. Adding a
          seventh item is one entry in the <code>ITEM_DEFS</code> table plus
          a few lines in <code>computePlayerStats</code>.
        </p>

        <CodeBlock
          code={`function computePlayerStats(p) {
  return {
    damage: 1 + (p.items.damage ?? 0),
    speed: 220 + 40 * (p.items.speed ?? 0),
    fireRateMult: Math.pow(1.5, p.items.rapid ?? 0),
    homing: (p.items.homing ?? 0) > 0,
    pierce: (p.items.pierce ?? 0) > 0,
  };
}`}
        />

        <p>
          The whole game is a single reducer over one <code>GameState</code>{" "}
          tree, fixed 60fps accumulator, no mutation in the hot path. The
          rendering layer is styled-components with <code>left</code>/
          <code>top</code> inline styles on each entity — not canvas. For a
          few hundred entities it's fine and diff'd by key cheaply.
        </p>
      </DescriptionSection>
    </PageContainer>
  );
};

export default DescentPage;
