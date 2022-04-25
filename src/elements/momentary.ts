import { Input } from "../inputs";

export class Momentary extends Input<boolean> {
  public state: boolean = false;

  public get active(): boolean {
    return this.state;
  }

  public try(state: unknown): void {
    if (typeof state === "boolean") this.set(state);
  }
}
