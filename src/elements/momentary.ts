import { Input } from "../input";

export class Momentary extends Input<boolean> {
  public state: boolean = false;

  public get active(): boolean {
    return this.state;
  }
}
