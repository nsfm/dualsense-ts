import {
  Momentary,
  Dpad,
  Mute,
  Unisense,
  Touchpad,
  Analog,
  Axis,
  Trigger,
} from "./elements";
import { Input } from "./inputs";
import { InputId } from "./ids";
import { DualsenseHID } from "./hid";

export type DualsenseInput =
  | Momentary
  | Dpad
  | Mute
  | Unisense
  | Touchpad
  | Analog
  | Trigger
  | Axis;

export type DualsenseIdMap = {
  [id in InputId]: DualsenseInput;
};

export interface DualsenseParams {
  hid?: DualsenseHID | null;
}

export class Dualsense extends Input<Dualsense> {
  public readonly state: Dualsense = this;

  public readonly ps = new Momentary({ icon: "ℙ𝕊" });
  public readonly mute = new Mute({ icon: "🎙" });

  public readonly options = new Momentary({ icon: "☰" });
  public readonly create = new Momentary({ icon: "🖉" });

  public readonly triangle = new Momentary({ icon: "▲" });
  public readonly circle = new Momentary({ icon: "o" });
  public readonly cross = new Momentary({ icon: "x" });
  public readonly square = new Momentary({ icon: "■" });

  public readonly dpad = new Dpad({ icon: "+" });

  public readonly left = new Unisense({});
  public readonly right = new Unisense({});

  public readonly touchpad = new Touchpad({});

  public readonly hid: DualsenseHID | null = null;

  public get active(): boolean {
    return Object.values(this.byId).some((input) => input.active);
  }

  constructor({ hid }: DualsenseParams = {}) {
    super({});
    this.hid = hid ? hid : new DualsenseHID();
  }

  public readonly byId: DualsenseIdMap = {
    [InputId.Playstation]: this.ps,
    [InputId.Options]: this.options,
    [InputId.Mute]: this.mute,
    [InputId.Create]: this.create,
    [InputId.Triangle]: this.triangle,
    [InputId.Circle]: this.circle,
    [InputId.Cross]: this.cross,
    [InputId.Square]: this.square,
    [InputId.Up]: this.dpad.up,
    [InputId.Down]: this.dpad.down,
    [InputId.Left]: this.dpad.left,
    [InputId.Right]: this.dpad.right,
    [InputId.TouchpadButton]: this.touchpad.button,
    [InputId.TouchpadX1]: this.touchpad.x1,
    [InputId.TouchpadY1]: this.touchpad.y1,
    [InputId.TouchpadX2]: this.touchpad.x2,
    [InputId.TouchpadY2]: this.touchpad.y2,
    [InputId.LeftAnalogX]: this.left.analog.x,
    [InputId.LeftAnalogY]: this.left.analog.y,
    [InputId.LeftAnalogButton]: this.left.analog.button,
    [InputId.LeftBumper]: this.left.bumper,
    [InputId.LeftTrigger]: this.left.trigger,
    [InputId.LeftTriggerButton]: this.left.trigger,
    [InputId.RightAnalogX]: this.right.analog.x,
    [InputId.RightAnalogY]: this.right.analog.y,
    [InputId.RightAnalogButton]: this.right.analog.button,
    [InputId.RightBumper]: this.right.bumper,
    [InputId.RightTrigger]: this.right.trigger,
    [InputId.RightTriggerButton]: this.left.trigger,
  };
}
