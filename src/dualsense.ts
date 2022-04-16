import {
  Momentary,
  Dpad,
  Mute,
  Unisense,
  Touchpad,
  Analog,
  Axis,
  Trigger,
} from "elements";
import { Input } from "inputs";
import { InputId } from "ids";

export type DualsenseInput =
  | Momentary
  | Dpad
  | Mute
  | Unisense
  | Touchpad
  | Analog
  | Trigger
  | Axis;

export type DualsenseIDMap = {
  [id in InputId]: DualsenseInput;
};

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

  public get active(): boolean {
    return Object.values(this.byId).some((input) => input.active);
  }

  constructor() {
    super({});
  }

  // Mirror InputIds for convenience
  static readonly Options = InputId.Options;
  static readonly Create = InputId.Create;
  static readonly Playstation = InputId.Playstation;
  static readonly Mute = InputId.Mute;
  static readonly Triangle = InputId.Triangle;
  static readonly Circle = InputId.Circle;
  static readonly Cross = InputId.Cross;
  static readonly Square = InputId.Square;
  static readonly Up = InputId.Up;
  static readonly Down = InputId.Down;
  static readonly Left = InputId.Left;
  static readonly Right = InputId.Right;
  static readonly TouchpadX1 = InputId.TouchpadX1;
  static readonly TouchpadY1 = InputId.TouchpadY1;
  static readonly TouchpadX2 = InputId.TouchpadX2;
  static readonly TouchpadY2 = InputId.TouchpadY2;
  static readonly Touchpad = InputId.Touchpad;
  static readonly TouchpadButton = InputId.TouchpadButton;
  static readonly LeftAnalogX = InputId.LeftAnalogX;
  static readonly LeftAnalogY = InputId.LeftAnalogY;
  static readonly LeftAnalogButton = InputId.LeftAnalogButton;
  static readonly LeftAnalog = InputId.LeftAnalog;
  static readonly LeftBumper = InputId.LeftBumper;
  static readonly LeftTrigger = InputId.LeftTrigger;
  static readonly RightAnalogX = InputId.RightAnalogX;
  static readonly RightAnalogY = InputId.RightAnalogY;
  static readonly RightAnalogButton = InputId.RightAnalogButton;
  static readonly RightAnalog = InputId.RightAnalog;
  static readonly RightBumper = InputId.RightBumper;
  static readonly RightTrigger = InputId.RightTrigger;

  public readonly byId: DualsenseIDMap = {
    [Dualsense.Playstation]: this.ps,
    [Dualsense.Options]: this.options,
    [Dualsense.Mute]: this.mute,
    [Dualsense.Create]: this.create,
    [Dualsense.Triangle]: this.triangle,
    [Dualsense.Circle]: this.circle,
    [Dualsense.Cross]: this.cross,
    [Dualsense.Square]: this.square,
    [Dualsense.Up]: this.dpad.up,
    [Dualsense.Down]: this.dpad.down,
    [Dualsense.Left]: this.dpad.left,
    [Dualsense.Right]: this.dpad.right,
    [Dualsense.Touchpad]: this.touchpad,
    [Dualsense.TouchpadButton]: this.touchpad.button,
    [Dualsense.TouchpadX1]: this.touchpad.x1,
    [Dualsense.TouchpadY1]: this.touchpad.y1,
    [Dualsense.TouchpadX2]: this.touchpad.x2,
    [Dualsense.TouchpadY2]: this.touchpad.y2,
    [Dualsense.LeftAnalogX]: this.left.analog.x,
    [Dualsense.LeftAnalogY]: this.left.analog.y,
    [Dualsense.LeftAnalogButton]: this.left.analog.button,
    [Dualsense.LeftAnalog]: this.left.analog,
    [Dualsense.LeftBumper]: this.left.bumper,
    [Dualsense.LeftTrigger]: this.left.trigger,
    [Dualsense.RightAnalogX]: this.right.analog.x,
    [Dualsense.RightAnalogY]: this.right.analog.y,
    [Dualsense.RightAnalogButton]: this.right.analog.button,
    [Dualsense.RightAnalog]: this.right.analog,
    [Dualsense.RightBumper]: this.right.bumper,
    [Dualsense.RightTrigger]: this.right.trigger,
  };
}
