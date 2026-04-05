import {
  Momentary,
  Dpad,
  DpadParams,
  Mute,
  Unisense,
  UnisenseParams,
  Touchpad,
  Gyroscope,
  GyroscopeParams,
  Accelerometer,
  AccelerometerParams,
  Battery,
  BatteryParams,
  Lightbar,
  PlayerLeds,
} from "./elements";
import { Input, InputSet, InputParams } from "./input";
import {
  DualsenseHIDState,
  DualsenseHID,
  PlatformHIDProvider,
  InputId,
  ChargeStatus,
  PulseOptions,
} from "./hid";
import { Intensity } from "./math";

/** Settings for your Dualsense controller and each of its inputs */
export interface DualsenseParams extends InputParams {
  /** Sets the source for HID events. Default: decide automatically */
  hid?: DualsenseHID | null;
  /** Settings for the Playstation button */
  ps?: InputParams;
  /** Settings for the mute button */
  mute?: InputParams;
  /** Settings for the options button */
  options?: InputParams;
  /** Settings for the create button */
  create?: InputParams;
  /** Settings for the triangle button */
  triangle?: InputParams;
  /** Settings for the circle button */
  circle?: InputParams;
  /** Settings for the cross button */
  cross?: InputParams;
  /** Settings for the square button */
  square?: InputParams;
  /** Settings for the dpad buttons */
  dpad?: DpadParams;
  /** Settings for inputs on the left half of the controller */
  left?: UnisenseParams;
  /** Settings for inputs on the right side of the controller */
  right?: UnisenseParams;
  /** Settings for the touchpad inputs */
  touchpad?: InputParams;
  /** Settings for the gyroscope */
  gyroscope?: GyroscopeParams;
  /** Settings for the accelerometer */
  accelerometer?: AccelerometerParams;
  /** Settings for the battery */
  battery?: BatteryParams;
}

/** Represents a Dualsense controller */
export class Dualsense extends Input<Dualsense> {
  public readonly state: Dualsense = this;

  /** The Playstation button */
  public readonly ps: Momentary;
  /** The mute button and status light */
  public readonly mute: Mute;
  /** The options button */
  public readonly options: Momentary;
  /** The create button */
  public readonly create: Momentary;
  /** The triangle button */
  public readonly triangle: Momentary;
  /** The circle button */
  public readonly circle: Momentary;
  /** The cross, or X button */
  public readonly cross: Momentary;
  /** The square button */
  public readonly square: Momentary;
  /** The up/down/left/right dpad buttons */
  public readonly dpad: Dpad;
  /** Inputs on the left half of the controller */
  public readonly left: Unisense;
  /** Inputs on the right half of the controller */
  public readonly right: Unisense;
  /** The touchpad; works like a pair of analog sticks */
  public readonly touchpad: Touchpad;
  /** Tracks the controller's angular velocity */
  public readonly gyroscope: Gyroscope;
  /** Tracks the controller's linear acceleration */
  public readonly accelerometer: Accelerometer;
  /** Battery level and charging status */
  public readonly battery: Battery;
  /** The RGB light bar at the top of the controller */
  public readonly lightbar = new Lightbar();
  /** The 5 white player indicator LEDs */
  public readonly playerLeds = new PlayerLeds();

  /** Buffered battery reading, sampled on a slow cadence */
  private readonly pendingBattery = {
    peakLevel: 0,
    status: ChargeStatus.Discharging as ChargeStatus,
  };

  /** Represents the underlying HID device. Provides input events */
  public readonly hid: DualsenseHID;

  /** A virtual button representing whether or not a controller is connected */
  public readonly connection: Momentary;

  public get active(): boolean {
    return Object.values(this).some(
      (input) => input !== this && input instanceof Input && input.active,
    );
  }

  /** Returns `true` if the controller is connected via Bluetooth */
  public get wireless(): boolean {
    return this.hid.wireless;
  }

  /** Unique identifier for the connected device (path or fingerprint) */
  public get deviceId(): string | undefined {
    return this.hid.provider.deviceId;
  }

  /** Hardware serial number of the connected device, if available */
  public get serialNumber(): string | undefined {
    return this.hid.provider.serialNumber;
  }

  constructor(params: DualsenseParams = {}) {
    super(params);

    this.ps = new Momentary({
      icon: "㎰",
      name: "Home",
      ...(params.ps ?? {}),
    });
    this.mute = new Mute({
      icon: "🕩",
      name: "Mute",
      ...(params.mute ?? {}),
    });
    this.options = new Momentary({
      icon: "⋯",
      name: "Options",
      ...(params.options ?? {}),
    });
    this.create = new Momentary({
      icon: "🖉",
      name: "Create",
      ...(params.create ?? {}),
    });
    this.triangle = new Momentary({
      icon: "🟕",
      name: "Triangle",
      ...(params.triangle ?? {}),
    });
    this.circle = new Momentary({
      icon: "⊚",
      name: "Circle",
      ...(params.circle ?? {}),
    });
    this.cross = new Momentary({
      icon: "⮿",
      name: "Cross",
      ...(params.cross ?? {}),
    });
    this.square = new Momentary({
      icon: "🟗",
      name: "Square",
      ...(params.square ?? {}),
    });
    this.dpad = new Dpad({
      icon: "D",
      name: "D-pad",
      ...(params.dpad ?? {}),
    });
    this.left = new Unisense({
      icon: "L",
      name: "Left",
      ...(params.left ?? {}),
    });
    this.right = new Unisense({
      icon: "R",
      name: "Right",
      ...(params.right ?? {}),
    });
    this.touchpad = new Touchpad({
      icon: "⎚",
      name: "Touchpad",
      ...(params.touchpad ?? {}),
    });
    this.connection = new Momentary({
      icon: "🔗",
      name: "Connected",
      ...(params.square ?? {}),
    });
    this.gyroscope = new Gyroscope({
      icon: "∞",
      name: "Gyroscope",
      threshold: 0.01,
      ...(params.gyroscope ?? {}),
    });
    this.accelerometer = new Accelerometer({
      icon: "⤲",
      name: "Accelerometer",
      threshold: 0.01,
      ...(params.accelerometer ?? {}),
    });
    this.battery = new Battery({
      icon: "🔋",
      name: "Battery",
      ...(params.battery ?? {}),
    });

    this.connection[InputSet](false);
    this.hid = params.hid ?? new DualsenseHID(new PlatformHIDProvider());
    this.hid.register((state: DualsenseHIDState) => {
      this.processHID(state);
    });

    const rumbleMemo = { left: -1, right: -1 };
    const triggerFeedbackMemo = { left: "", right: "" };
    const lightbarMemo = { key: "" };
    const playerLedsMemo = { key: "" };

    /** Refresh connection state */
    let lastConnected = false;
    setInterval(() => {
      const {
        provider: { connected },
      } = this.hid;

      this.connection[InputSet](connected);
      if (connected && !lastConnected) {
        // Invalidate memos so the output loop restores desired state on reconnect.
        triggerFeedbackMemo.left = "";
        triggerFeedbackMemo.right = "";
        lightbarMemo.key = "";
        playerLedsMemo.key = "";
      }
      lastConnected = connected;
      if (!connected) this.hid.provider.connect();
    }, 200);

    /** Refresh battery state on a slow cadence to filter transient glitches */
    setInterval(() => {
      if (!this.connection.active) return;
      this.battery.level[InputSet](this.pendingBattery.peakLevel);
      this.battery.status[InputSet](this.pendingBattery.status);
      this.pendingBattery.peakLevel = 0;
    }, 1000);

    /** Refresh output state (rumble + trigger feedback) */
    setInterval(() => {
      if (!this.connection.active) return;

      const leftRumble = this.left.rumble();
      const rightRumble = this.right.rumble();
      if (leftRumble !== rumbleMemo.left || rightRumble !== rumbleMemo.right) {
        this.hid.setRumble(leftRumble * 255, rightRumble * 255);
        rumbleMemo.left = leftRumble;
        rumbleMemo.right = rightRumble;
      }

      const leftFeedback = this.left.trigger.feedback;
      const rightFeedback = this.right.trigger.feedback;
      const leftKey = leftFeedback.toKey();
      const rightKey = rightFeedback.toKey();
      const feedbackChanged =
        leftKey !== triggerFeedbackMemo.left ||
        rightKey !== triggerFeedbackMemo.right;

      if (feedbackChanged) {
        // Force rumble into the same batch so MotorPower scope bit is always present.
        this.hid.setRumble(leftRumble * 255, rightRumble * 255);
        rumbleMemo.left = leftRumble;
        rumbleMemo.right = rightRumble;
      }

      if (leftKey !== triggerFeedbackMemo.left) {
        this.hid.setLeftTriggerFeedback(leftFeedback.toBytes());
        triggerFeedbackMemo.left = leftKey;
      }
      if (rightKey !== triggerFeedbackMemo.right) {
        this.hid.setRightTriggerFeedback(rightFeedback.toBytes());
        triggerFeedbackMemo.right = rightKey;
      }

      const lightbarKey = this.lightbar.toKey();
      if (lightbarKey !== lightbarMemo.key) {
        const { r, g, b } = this.lightbar.color;
        this.hid.setLightbar(r, g, b);
        lightbarMemo.key = lightbarKey;
      }

      const pulse = this.lightbar.consumePulse();
      if (pulse !== PulseOptions.Off) {
        this.hid.setLightbar(0, 0, 0, pulse);
      }

      const playerLedsKey = this.playerLeds.toKey();
      if (playerLedsKey !== playerLedsMemo.key) {
        this.hid.setPlayerLeds(this.playerLeds.bitmask, this.playerLeds.brightness);
        playerLedsMemo.key = playerLedsKey;
      }

    }, 1000 / 30);
  }

  private get rumbleIntensity(): number {
    return (this.left.rumble() + this.right.rumble()) / 2;
  }

  /** Reset adaptive trigger feedback on both sides to the default linear feel */
  public resetTriggerFeedback(): void {
    this.left.trigger.feedback.reset();
    this.right.trigger.feedback.reset();
  }

  /** Check or adjust rumble intensity evenly across both sides of the controller */
  public rumble(intensity?: Intensity): number {
    this.left.rumble(intensity);
    this.right.rumble(intensity);
    return this.rumbleIntensity;
  }

  /** Distributes HID event values to the controller's inputs */
  private processHID(state: DualsenseHIDState): void {
    this.ps[InputSet](state[InputId.Playstation]);
    this.options[InputSet](state[InputId.Options]);
    this.create[InputSet](state[InputId.Create]);

    this.mute[InputSet](state[InputId.Mute]);
    this.mute.status[InputSet](state[InputId.MuteLed]);

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
    this.left.analog.button[InputSet](state[InputId.LeftAnalogButton]);
    this.left.bumper[InputSet](state[InputId.LeftBumper]);
    this.left.trigger[InputSet](state[InputId.LeftTrigger]);
    this.left.trigger.button[InputSet](state[InputId.LeftTriggerButton]);

    this.right.analog.x[InputSet](state[InputId.RightAnalogX]);
    this.right.analog.y[InputSet](state[InputId.RightAnalogY]);
    this.right.analog.button[InputSet](state[InputId.RightAnalogButton]);
    this.right.bumper[InputSet](state[InputId.RightBumper]);
    this.right.trigger[InputSet](state[InputId.RightTrigger]);
    this.right.trigger.button[InputSet](state[InputId.RightTriggerButton]);

    this.gyroscope.x[InputSet](state[InputId.GyroX]);
    this.gyroscope.y[InputSet](state[InputId.GyroY]);
    this.gyroscope.z[InputSet](state[InputId.GyroZ]);
    this.accelerometer.x[InputSet](state[InputId.AccelX]);
    this.accelerometer.y[InputSet](state[InputId.AccelY]);
    this.accelerometer.z[InputSet](state[InputId.AccelZ]);

    const level = state[InputId.BatteryLevel];
    if (level > this.pendingBattery.peakLevel) {
      this.pendingBattery.peakLevel = level;
    }
    this.pendingBattery.status = state[InputId.BatteryStatus];
  }
}
