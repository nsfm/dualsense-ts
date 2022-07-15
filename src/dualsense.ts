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
import {
  DualsenseHIDState,
  DualsenseHID,
  PlatformHIDProvider,
  InputId,
} from "./hid";

export interface DualsenseParams extends InputParams {
  /**
   * Sets the source of HID events for the controller interface.
   */
  hid?: DualsenseHID | null;

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

/**
 * Represents a Dualsense controller.
 */
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

  public readonly hid: DualsenseHID;

  public get active(): boolean {
    return Object.values(this).some(
      (input) => input !== this && input instanceof Input && input.active
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

    this.hid = params.hid || new DualsenseHID(new PlatformHIDProvider());
    this.hid.register((state: DualsenseHIDState) => {
      this.processHID(state);
    });
    this.hid.provider.connect();
  }

  /**
   * Distributes input values to various elements.
   */
  private processHID(state: DualsenseHIDState): void {
    this.ps[InputSet](state[InputId.Playstation]);
    this.options[InputSet](state[InputId.Options]);
    this.create[InputSet](state[InputId.Create]);

    this.mute[InputSet](state[InputId.Mute]);
    this.mute.status[InputSet](state[InputId.Status]);

    this.triangle[InputSet](state[InputId.Triangle]);
    this.circle[InputSet](state[InputId.Circle]);
    this.cross[InputSet](state[InputId.Cross]);
    this.square[InputSet](state[InputId.Square]);

    this.dpad.up[InputSet](state[InputId.Up]);
    this.dpad.down[InputSet](state[InputId.Down]);
    this.dpad.right[InputSet](state[InputId.Right]);
    this.dpad.left[InputSet](state[InputId.Left]);

    this.touchpad.button[InputSet](state[InputId.TouchButton]);
    this.touchpad.left.x[InputSet](state[InputId.TouchX0]);
    this.touchpad.left.y[InputSet](state[InputId.TouchY0]);
    this.touchpad.left.contact[InputSet](state[InputId.TouchContact0]);
    this.touchpad.left.tracker[InputSet](state[InputId.TouchId0]);
    this.touchpad.right.x[InputSet](state[InputId.TouchX1]);
    this.touchpad.right.y[InputSet](state[InputId.TouchY1]);
    this.touchpad.right.contact[InputSet](state[InputId.TouchContact1]);
    this.touchpad.right.tracker[InputSet](state[InputId.TouchId1]);

    this.left.analog.x[InputSet](state[InputId.LeftAnalogX]);
    this.left.analog.y[InputSet](state[InputId.LeftAnalogY]);
    this.left.bumper[InputSet](state[InputId.LeftBumper]);
    this.left.trigger[InputSet](state[InputId.LeftTrigger]);
    this.left.trigger.button[InputSet](state[InputId.LeftTriggerButton]);

    this.right.analog.x[InputSet](state[InputId.RightAnalogX]);
    this.right.analog.y[InputSet](state[InputId.RightAnalogY]);
    this.right.bumper[InputSet](state[InputId.RightBumper]);
    this.right.trigger[InputSet](state[InputId.RightTrigger]);
    this.right.trigger.button[InputSet](state[InputId.RightTriggerButton]);
  }
}
