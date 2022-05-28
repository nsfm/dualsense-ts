import {
  Momentary,
  Dpad,
  DpadParams,
  Mute,
  Unisense,
  UnisenseParams,
  Touchpad,
} from "./elements";
import { Input, InputSet, InputParams } from "./input";
import { DualsenseHID, InputId } from "./hid";

export interface DualsenseParams extends InputParams {
  hid?: DualsenseHID | null;

  // Input param overrides
  ps?: InputParams;
  mute?: InputParams;
  options?: InputParams;
  create?: InputParams;
  triangle?: InputParams;
  circle?: InputParams;
  cross?: InputParams;
  square?: InputParams;
  dpad?: DpadParams;
  left?: UnisenseParams;
  right?: UnisenseParams;
  touchpad?: InputParams;
}

export class Dualsense extends Input<Dualsense> {
  public readonly state: Dualsense = this;

  public readonly ps: Momentary;
  public readonly mute: Mute;

  public readonly options: Momentary;
  public readonly create: Momentary;

  public readonly triangle: Momentary;
  public readonly circle: Momentary;
  public readonly cross: Momentary;
  public readonly square: Momentary;

  public readonly dpad: Dpad;

  public readonly left: Unisense;
  public readonly right: Unisense;

  public readonly touchpad: Touchpad;

  public readonly hid: DualsenseHID | null = null;

  public get active(): boolean {
    return Object.values(this).some(
      (input: unknown) =>
        input instanceof Input && input !== this && input.active
    );
  }

  constructor(params: DualsenseParams = {}) {
    super(params);

    this.ps = new Momentary({
      icon: "㎰",
      name: "Home",
      ...(params.ps || {}),
    });
    this.mute = new Mute({
      icon: "🕩",
      name: "Mute",
      ...(params.mute || {}),
    });
    this.options = new Momentary({
      icon: "⋯",
      name: "Options",
      ...(params.options || {}),
    });
    this.create = new Momentary({
      icon: "🖉",
      name: "Create",
      ...(params.create || {}),
    });
    this.triangle = new Momentary({
      icon: "🟕",
      name: "Triangle",
      ...(params.triangle || {}),
    });
    this.circle = new Momentary({
      icon: "⊚",
      name: "Circle",
      ...(params.circle || {}),
    });
    this.cross = new Momentary({
      icon: "⮿",
      name: "Cross",
      ...(params.cross || {}),
    });
    this.square = new Momentary({
      icon: "🟗",
      name: "Square",
      ...(params.square || {}),
    });
    this.dpad = new Dpad({
      icon: "D",
      name: "D-pad",
      ...(params.dpad || {}),
    });
    this.left = new Unisense({
      icon: "L",
      name: "Left",
      ...(params.left || {}),
    });
    this.right = new Unisense({
      icon: "R",
      name: "Right",
      ...(params.right || {}),
    });
    this.touchpad = new Touchpad({
      icon: "⎚",
      name: "Touchpad",
      ...(params.touchpad || {}),
    });

    const { hid } = params;
    if (hid !== null) this.hid = hid ? hid : new DualsenseHID();

    if (this.hid) {
      this.hid.on("input", () => {
        this.processHID();
      });
    }
  }

  private processHID() {
    if (!this.hid) return;
    this.ps[InputSet](this.hid.state[InputId.Playstation]);
    this.options[InputSet](this.hid.state[InputId.Options]);
    this.mute[InputSet](this.hid.state[InputId.Mute]);
    this.create[InputSet](this.hid.state[InputId.Create]);
    this.triangle[InputSet](this.hid.state[InputId.Triangle]);
    this.circle[InputSet](this.hid.state[InputId.Circle]);
    this.cross[InputSet](this.hid.state[InputId.Cross]);
    this.square[InputSet](this.hid.state[InputId.Square]);
    this.dpad.up[InputSet](this.hid.state[InputId.Up]);
    this.dpad.down[InputSet](this.hid.state[InputId.Down]);
    this.dpad.right[InputSet](this.hid.state[InputId.Right]);
    this.dpad.left[InputSet](this.hid.state[InputId.Left]);
    this.touchpad.button[InputSet](this.hid.state[InputId.TouchButton]);
    this.left.analog.x[InputSet](this.hid.state[InputId.LeftAnalogX]);
    this.left.analog.y[InputSet](this.hid.state[InputId.LeftAnalogY]);
    this.right.analog.x[InputSet](this.hid.state[InputId.RightAnalogX]);
    this.right.analog.y[InputSet](this.hid.state[InputId.RightAnalogY]);
    this.left.trigger[InputSet](this.hid.state[InputId.LeftTrigger]);
    this.right.trigger[InputSet](this.hid.state[InputId.RightTrigger]);
    this.left.trigger.button[InputSet](
      this.hid.state[InputId.LeftTriggerButton]
    );
    this.right.trigger.button[InputSet](
      this.hid.state[InputId.RightTriggerButton]
    );
  }
}
