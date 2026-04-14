import { AccessProfileLedMode } from "../hid/access/access_hid_state";

/** Controls the 3 profile indicator LEDs on the Access controller */
export class AccessProfileLeds {
  private _mode: AccessProfileLedMode = AccessProfileLedMode.On;

  /** Get the current LED animation mode */
  public get mode(): AccessProfileLedMode {
    return this._mode;
  }

  /** Set the profile LED animation mode */
  public set(mode: AccessProfileLedMode): void {
    this._mode = mode;
  }

  /** Returns a string key for change detection */
  public toKey(): string {
    return `${this._mode}`;
  }
}
