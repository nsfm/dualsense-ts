import { Input } from "../input";

export class Increment extends Input<number> {
  public state: number = 0;

  public get active(): boolean {
    return false;
  }
}
