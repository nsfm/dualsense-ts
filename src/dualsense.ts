import { Momentary } from "./momentary";
import { Unisense } from "./unisense";
import { Dpad } from "./dpad";
import { Mute } from "./mute";

export class Dualsense {
  public readonly ps = new Momentary();
  public readonly mute = new Mute();

  public readonly options = new Momentary();
  public readonly create = new Momentary();

  public readonly triangle = new Momentary();
  public readonly circle = new Momentary();
  public readonly cross = new Momentary();
  public readonly square = new Momentary();

  public readonly dpad = new Dpad();

  public readonly left = new Unisense();
  public readonly right = new Unisense();
}
