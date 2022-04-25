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
import { Input, Intensity } from "./inputs";
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
  [InputId.Playstation]: Momentary;
  [InputId.Options]: Momentary;
  [InputId.Mute]: Mute;
  [InputId.Create]: Momentary;
  [InputId.Triangle]: Momentary;
  [InputId.Circle]: Momentary;
  [InputId.Cross]: Momentary;
  [InputId.Square]: Momentary;
  [InputId.Up]: Momentary;
  [InputId.Down]: Momentary;
  [InputId.Left]: Momentary;
  [InputId.Right]: Momentary;
  [InputId.TouchpadButton]: Momentary;
  [InputId.TouchpadX1]: Axis;
  [InputId.TouchpadY1]: Axis;
  [InputId.TouchpadX2]: Axis;
  [InputId.TouchpadY2]: Axis;
  [InputId.LeftAnalogX]: Axis;
  [InputId.LeftAnalogY]: Axis;
  [InputId.LeftAnalogButton]: Momentary;
  [InputId.LeftBumper]: Momentary;
  [InputId.LeftTrigger]: Trigger;
  [InputId.LeftTriggerButton]: Momentary;
  [InputId.RightAnalogX]: Axis;
  [InputId.RightAnalogY]: Axis;
  [InputId.RightAnalogButton]: Momentary;
  [InputId.RightBumper]: Momentary;
  [InputId.RightTrigger]: Trigger;
  [InputId.RightTriggerButton]: Momentary;
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

    if (this.hid) {
      this.hid.on("input", () => {
        this.processHID();
      });
    }
  }

  private processHID() {
    if (!this.hid) return;
    this.ps.set(this.hid.state[InputId.Playstation]);
    this.options.set(this.hid.state[InputId.Options]);
    this.mute.set(this.hid.state[InputId.Mute]);
    this.create.set(this.hid.state[InputId.Create]);
    this.triangle.set(this.hid.state[InputId.Triangle]);
    this.circle.set(this.hid.state[InputId.Circle]);
    this.cross.set(this.hid.state[InputId.Cross]);
    this.square.set(this.hid.state[InputId.Square]);
    this.dpad.up.set(this.hid.state[InputId.Up]);
    this.dpad.down.set(this.hid.state[InputId.Down]);
    this.dpad.right.set(this.hid.state[InputId.Right]);
    this.dpad.left.set(this.hid.state[InputId.Left]);
    this.touchpad.button.set(this.hid.state[InputId.TouchpadButton]);
    this.left.analog.x.set(this.hid.state[InputId.LeftAnalogX]);
    this.left.analog.y.set(this.hid.state[InputId.LeftAnalogY]);
    this.right.analog.x.set(this.hid.state[InputId.RightAnalogX]);
    this.right.analog.y.set(this.hid.state[InputId.RightAnalogY]);
    this.left.trigger.set(new Intensity(this.hid.state[InputId.LeftTrigger]));
    this.right.trigger.set(new Intensity(this.hid.state[InputId.RightTrigger]));
    this.left.trigger.button.set(this.hid.state[InputId.LeftTriggerButton]);
    this.right.trigger.button.set(this.hid.state[InputId.RightTriggerButton]);
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
    [InputId.LeftTriggerButton]: this.left.trigger.button,
    [InputId.RightAnalogX]: this.right.analog.x,
    [InputId.RightAnalogY]: this.right.analog.y,
    [InputId.RightAnalogButton]: this.right.analog.button,
    [InputId.RightBumper]: this.right.bumper,
    [InputId.RightTrigger]: this.right.trigger,
    [InputId.RightTriggerButton]: this.right.trigger.button,
  };
}
