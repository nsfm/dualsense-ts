import { Momentary } from "elements/momentary";
import { InputId } from "elements/input_ids";
import { Dpad } from "elements/dpad";
import { Mute } from "elements/mute";

import { Unisense } from "./unisense";

export class Dualsense {
  public readonly ps = new Momentary({ id: InputId.Playstation, icon: "ℙ𝕊" });
  public readonly mute = new Mute({ id: InputId.Mute, icon: "🎙" });

  public readonly options = new Momentary({ id: InputId.Options, icon: "☰" });
  public readonly create = new Momentary({ id: InputId.Create, icon: "🖉" });

  public readonly triangle = new Momentary({ id: InputId.Triangle, icon: "▲" });
  public readonly circle = new Momentary({ id: InputId.Circle, icon: "o" });
  public readonly cross = new Momentary({ id: InputId.Cross, icon: "x" });
  public readonly square = new Momentary({ id: InputId.Square, icon: "■" });

  public readonly dpad = new Dpad();

  public readonly left = new Unisense("left");
  public readonly right = new Unisense("right");
}
