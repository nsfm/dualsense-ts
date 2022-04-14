import { Input } from "./input";

export class Momentary extends Input<boolean> {
  public state: boolean = false;
  public defaultState: boolean = false;
}
