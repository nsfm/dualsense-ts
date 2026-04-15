/** Controls the white status LED on the Access controller */
export class AccessStatusLed {
  private _on: boolean = true;

  /** Get the current state */
  public get on(): boolean {
    return this._on;
  }

  /** Set the status LED on or off */
  public set(on: boolean): void {
    this._on = on;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return this._on ? "1" : "0";
  }
}
