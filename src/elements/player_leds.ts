import { Brightness } from "../hid/command";

/** Controls the 5 white player indicator LEDs at the bottom of the controller */
export class PlayerLeds {
  private _bitmask: number = 0;
  private _brightness: Brightness = Brightness.High;

  /** Get the current bitmask (5 bits, one per LED) */
  public get bitmask(): number {
    return this._bitmask;
  }

  /** Set all 5 LEDs from a bitmask (0–31). PlayerID enum values also work here. */
  public set(bitmask: number): void {
    this._bitmask = bitmask & 0x1f;
  }

  /** Set a single LED on or off (index 0–4, left to right) */
  public setLed(index: number, on: boolean): void {
    if (index < 0 || index > 4) return;
    if (on) {
      this._bitmask |= 1 << index;
    } else {
      this._bitmask &= ~(1 << index);
    }
  }

  /** Get the state of a single LED (index 0–4) */
  public getLed(index: number): boolean {
    return (this._bitmask & (1 << index)) !== 0;
  }

  /** Turn all LEDs off */
  public clear(): void {
    this._bitmask = 0;
  }

  /** Get the current brightness */
  public get brightness(): Brightness {
    return this._brightness;
  }

  /** Set the player LED brightness (High, Medium, Low) */
  public setBrightness(brightness: Brightness): void {
    this._brightness = brightness;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return `${this._bitmask},${this._brightness}`;
  }
}
