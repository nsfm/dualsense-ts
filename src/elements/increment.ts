import { Input } from "../input";

/** Container for counters associated with other inputs */
export class Increment extends Input<number> {
  public state: number = 0;
  public active = false;
}
