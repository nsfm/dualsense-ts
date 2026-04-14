/** Controls the player indicator LED pattern on the Access controller (6-segment cross) */
export class AccessPlayerIndicatorLed {
  private _pattern: number = 0;

  /** Get the current pattern (0–4) */
  public get pattern(): number {
    return this._pattern;
  }

  /** Set the player indicator pattern (0=off, 1–4=player number) */
  public set(pattern: number): void {
    this._pattern = Math.max(0, Math.min(4, Math.round(pattern)));
  }

  /** Turn off the player indicator */
  public clear(): void {
    this._pattern = 0;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return `${this._pattern}`;
  }
}
