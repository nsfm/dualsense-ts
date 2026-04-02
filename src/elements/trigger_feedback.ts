/** Canonical trigger effect types from the DualSense firmware */
export const enum TriggerEffect {
  /** No resistance — default linear feel */
  Off = 'off',
  /** Zone-based continuous resistance */
  Feedback = 'feedback',
  /** Resistance with a snap release point, like a weapon trigger */
  Weapon = 'weapon',
  /** Weapon feel with snap-back force, like drawing a bow */
  Bow = 'bow',
  /** Rhythmic two-stroke oscillation */
  Galloping = 'galloping',
  /** Zone-based oscillation with configurable amplitude and frequency */
  Vibration = 'vibration',
  /** Dual-amplitude vibration with frequency and period control */
  Machine = 'machine',
}

/** Zone-based resistance with per-zone force control */
export interface FeedbackEffect {
  effect: TriggerEffect.Feedback;
  /** Where resistance begins along trigger travel (0-1) */
  position: number;
  /** Resistance strength (0-1, maps to firmware's 1-8 scale) */
  strength: number;
}

/** Resistance with a start position, snap release point, and force */
export interface WeaponEffect {
  effect: TriggerEffect.Weapon;
  /** Where resistance begins (0-1, maps to zones 2-7) */
  start: number;
  /** Where snap release occurs (0-1, maps to zones 3-8, must be after start) */
  end: number;
  /** Resistance strength (0-1) */
  strength: number;
}

/** Weapon feel with snap-back force */
export interface BowEffect {
  effect: TriggerEffect.Bow;
  /** Where resistance begins (0-1) */
  start: number;
  /** Where snap-back occurs (0-1, must be after start) */
  end: number;
  /** Pull strength (0-1) */
  strength: number;
  /** Snap-back force (0-1) */
  snapForce: number;
}

/** Rhythmic two-stroke oscillation */
export interface GallopingEffect {
  effect: TriggerEffect.Galloping;
  /** Where effect begins (0-1) */
  start: number;
  /** Where effect ends (0-1) */
  end: number;
  /** First foot timing (0-1, maps to 0-6) */
  firstFoot: number;
  /** Second foot timing (0-1, maps to 0-7, must be after firstFoot) */
  secondFoot: number;
  /** Oscillation frequency in Hz (1-255) */
  frequency: number;
}

/** Zone-based oscillation with amplitude and frequency control */
export interface VibrationEffect {
  effect: TriggerEffect.Vibration;
  /** Where vibration begins along trigger travel (0-1) */
  position: number;
  /** Vibration amplitude (0-1, maps to firmware's 1-8 scale) */
  amplitude: number;
  /** Vibration frequency in Hz (1-255) */
  frequency: number;
}

/** Dual-amplitude vibration with frequency and period */
export interface MachineEffect {
  effect: TriggerEffect.Machine;
  /** Where effect begins (0-1) */
  start: number;
  /** Where effect ends (0-1) */
  end: number;
  /** First amplitude (0-1, maps to 0-7) */
  amplitudeA: number;
  /** Second amplitude (0-1, maps to 0-7) */
  amplitudeB: number;
  /** Vibration frequency in Hz (1-255) */
  frequency: number;
  /** Period in tenths of a second */
  period: number;
}

export type TriggerFeedbackConfig =
  | { effect: TriggerEffect.Off }
  | FeedbackEffect
  | WeaponEffect
  | BowEffect
  | GallopingEffect
  | VibrationEffect
  | MachineEffect;

// --- Internal translation to raw 11-byte trigger effect block ---

/** Mode byte values per effect type */
const EFFECT_MODE: Record<TriggerEffect, number> = {
  [TriggerEffect.Off]: 0x05,
  [TriggerEffect.Feedback]: 0x21,
  [TriggerEffect.Weapon]: 0x25,
  [TriggerEffect.Bow]: 0x22,
  [TriggerEffect.Galloping]: 0x23,
  [TriggerEffect.Vibration]: 0x26,
  [TriggerEffect.Machine]: 0x27,
};

/** Clamp and round a 0-1 value to an integer range */
function scale(value: number, max: number, min = 0): number {
  return Math.round(Math.min(max, Math.max(min, value * max)));
}

/** Build the 11-byte trigger effect block from a config */
export function buildTriggerEffectBlock(config: TriggerFeedbackConfig): Uint8Array {
  const block = new Uint8Array(11).fill(0);

  if (config.effect === TriggerEffect.Off) {
    block[0] = EFFECT_MODE[TriggerEffect.Off];
    return block;
  }

  block[0] = EFFECT_MODE[config.effect];

  switch (config.effect) {
    case TriggerEffect.Feedback: {
      const position = scale(config.position, 9);
      const strength = scale(config.strength, 8, 1);
      const forceValue = (strength - 1) & 0x07;
      let forceZones = 0;
      let activeZones = 0;
      for (let i = position; i < 10; i++) {
        forceZones |= forceValue << (3 * i);
        activeZones |= 1 << i;
      }
      block[1] = activeZones & 0xff;
      block[2] = (activeZones >> 8) & 0xff;
      block[3] = forceZones & 0xff;
      block[4] = (forceZones >> 8) & 0xff;
      block[5] = (forceZones >> 16) & 0xff;
      block[6] = (forceZones >> 24) & 0xff;
      break;
    }

    case TriggerEffect.Weapon: {
      const start = Math.min(7, Math.max(2, scale(config.start, 9)));
      const end = Math.min(8, Math.max(start + 1, scale(config.end, 9)));
      const strength = scale(config.strength, 8, 1);
      const startAndStopZones = (1 << start) | (1 << end);
      block[1] = startAndStopZones & 0xff;
      block[2] = (startAndStopZones >> 8) & 0xff;
      block[3] = strength - 1;
      break;
    }

    case TriggerEffect.Bow: {
      const start = scale(config.start, 8);
      const end = Math.max(start + 1, scale(config.end, 8));
      const strength = scale(config.strength, 8, 1);
      const snapForce = scale(config.snapForce, 8, 1);
      const startAndStopZones = (1 << start) | (1 << end);
      const forcePair = ((strength - 1) & 0x07) | (((snapForce - 1) & 0x07) << 3);
      block[1] = startAndStopZones & 0xff;
      block[2] = (startAndStopZones >> 8) & 0xff;
      block[3] = forcePair & 0xff;
      block[4] = (forcePair >> 8) & 0xff;
      break;
    }

    case TriggerEffect.Galloping: {
      const start = scale(config.start, 8);
      const end = Math.max(start + 1, scale(config.end, 9));
      const firstFoot = scale(config.firstFoot, 6);
      const secondFoot = Math.max(firstFoot + 1, scale(config.secondFoot, 7));
      const startAndStopZones = (1 << start) | (1 << end);
      const timeAndRatio = (secondFoot & 0x07) | ((firstFoot & 0x07) << 3);
      block[1] = startAndStopZones & 0xff;
      block[2] = (startAndStopZones >> 8) & 0xff;
      block[3] = timeAndRatio & 0xff;
      block[4] = Math.min(255, Math.max(1, Math.round(config.frequency)));
      break;
    }

    case TriggerEffect.Vibration: {
      const position = scale(config.position, 9);
      const amplitude = scale(config.amplitude, 8, 1);
      const strengthValue = (amplitude - 1) & 0x07;
      let amplitudeZones = 0;
      let activeZones = 0;
      for (let i = position; i < 10; i++) {
        amplitudeZones |= strengthValue << (3 * i);
        activeZones |= 1 << i;
      }
      block[1] = activeZones & 0xff;
      block[2] = (activeZones >> 8) & 0xff;
      block[3] = amplitudeZones & 0xff;
      block[4] = (amplitudeZones >> 8) & 0xff;
      block[5] = (amplitudeZones >> 16) & 0xff;
      block[6] = (amplitudeZones >> 24) & 0xff;
      block[9] = Math.min(255, Math.max(1, Math.round(config.frequency)));
      break;
    }

    case TriggerEffect.Machine: {
      const start = scale(config.start, 8);
      const end = Math.max(start + 1, scale(config.end, 9));
      const amplitudeA = scale(config.amplitudeA, 7);
      const amplitudeB = scale(config.amplitudeB, 7);
      const startAndStopZones = (1 << start) | (1 << end);
      const strengthPair = (amplitudeA & 0x07) | ((amplitudeB & 0x07) << 3);
      block[1] = startAndStopZones & 0xff;
      block[2] = (startAndStopZones >> 8) & 0xff;
      block[3] = strengthPair & 0xff;
      block[4] = Math.min(255, Math.max(1, Math.round(config.frequency)));
      block[5] = Math.round(config.period);
      break;
    }
  }

  return block;
}

/** Holds the desired adaptive trigger feedback state and translates it for HID output */
export class TriggerFeedback {
  private _config: TriggerFeedbackConfig = { effect: TriggerEffect.Off };

  /** The current feedback configuration */
  public get config(): TriggerFeedbackConfig {
    return this._config;
  }

  /** The current effect type */
  public get effect(): TriggerEffect {
    return this._config.effect;
  }

  /** Set adaptive trigger feedback */
  public set(config: TriggerFeedbackConfig): void {
    this._config = config;
  }

  /** Reset to no resistance */
  public reset(): void {
    this._config = { effect: TriggerEffect.Off };
  }

  /** Build the raw 11-byte effect block for HID output */
  public toBytes(): Uint8Array {
    return buildTriggerEffectBlock(this._config);
  }

  /** String key for change detection in the polling loop */
  public toKey(): string {
    return JSON.stringify(this._config);
  }
}
