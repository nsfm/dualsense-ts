import { PulseOptions } from "../hid";

/** RGB color with 0–255 integer components */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Controls the RGB light bar at the top of the controller */
export class Lightbar {
  private _color: RGB = { r: 0, g: 0, b: 255 };

  /** One-shot pulse effect to send on the next output cycle */
  private _pendingPulse: PulseOptions = PulseOptions.Off;

  /** Get the current color */
  public get color(): RGB {
    return { ...this._color };
  }

  /** Set the light bar color (0–255 per channel) */
  public set(color: RGB): void {
    this._color = {
      r: Math.round(Math.max(0, Math.min(255, color.r))),
      g: Math.round(Math.max(0, Math.min(255, color.g))),
      b: Math.round(Math.max(0, Math.min(255, color.b))),
    };
  }

  /** Fade the light bar to Sony blue and hold. Use fadeOut() to return to your set color. */
  public fadeBlue(): void {
    this._pendingPulse = PulseOptions.FadeBlue;
  }

  /** Fade the light bar to black, then return to the set color. */
  public fadeOut(): void {
    this._pendingPulse = PulseOptions.FadeOut;
  }

  /** Consume and return pending pulse (used by the output loop) */
  public consumePulse(): PulseOptions {
    const pulse = this._pendingPulse;
    this._pendingPulse = PulseOptions.Off;
    return pulse;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return `${this._color.r},${this._color.g},${this._color.b}`;
  }
}
