import { TriggerMode } from "../hid/command";

export { TriggerMode };

export class TriggerFeedback {
  public mode: TriggerMode = TriggerMode.Off;
  public forces: number[] = [];

  /** Set adaptive trigger resistance mode and force parameters */
  public set(mode: TriggerMode, forces: number[]): void {
    this.mode = mode;
    this.forces = forces;
  }

  /** Reset to no resistance */
  public reset(): void {
    this.mode = TriggerMode.Off;
    this.forces = [];
  }
}
