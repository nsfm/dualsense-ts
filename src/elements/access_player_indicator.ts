import { AccessPlayerIndicator } from "../hid/access/access_hid_state";

/** Controls the player indicator LED pattern on the Access controller (6-segment cross) */
export class AccessPlayerIndicatorLed {
  private _pattern: AccessPlayerIndicator = AccessPlayerIndicator.Off;

  /** Get the current pattern */
  public get pattern(): AccessPlayerIndicator {
    return this._pattern;
  }

  /** Set the player indicator pattern */
  public set(pattern: AccessPlayerIndicator): void {
    this._pattern = pattern;
  }

  /** Turn off the player indicator */
  public clear(): void {
    this._pattern = AccessPlayerIndicator.Off;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return `${this._pattern}`;
  }
}
