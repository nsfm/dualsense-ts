import { Input } from "../generics/input";

export class Momentary extends Input<Boolean> {
  public state: boolean = false;
  public defaultState: boolean = false;
}
