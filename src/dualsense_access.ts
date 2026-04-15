import {
  Momentary,
  Analog,
  AnalogParams,
  Battery,
  BatteryParams,
  Lightbar,
  Mute,
  Unisense,
  UnisenseParams,
  Dpad,
  DpadParams,
  Touchpad,
} from "./elements";
import { AccessProfileLeds } from "./elements/access_profile_leds";
import { AccessStatusLed } from "./elements/access_status_led";
import { AccessPlayerIndicatorLed } from "./elements/access_player_indicator";
import { Input, InputSet, InputParams } from "./input";
import { AccessInputId, AccessHIDState } from "./hid/access/access_hid_state";
import { AccessHID } from "./hid/access/access_hid";
import { AccessNullHIDProvider } from "./hid/access/access_null_hid_provider";
import { AccessPlatformHIDProvider } from "./hid/access/access_platform_hid_provider";
import { ChargeStatus } from "./hid/battery_state";
import type { FirmwareInfo } from "./hid/firmware_info";
import type { FactoryInfo } from "./hid/factory_info";

/** Settings for your DualSense Access controller */
export interface DualsenseAccessParams extends InputParams {
  /** Sets the source for HID events. Default: decide automatically */
  hid?: AccessHID | null;

  // Raw hardware inputs
  /** Settings for the B1 button */
  b1?: InputParams;
  /** Settings for the B2 button */
  b2?: InputParams;
  /** Settings for the B3 button */
  b3?: InputParams;
  /** Settings for the B4 button */
  b4?: InputParams;
  /** Settings for the B5 button */
  b5?: InputParams;
  /** Settings for the B6 button */
  b6?: InputParams;
  /** Settings for the B7 button */
  b7?: InputParams;
  /** Settings for the B8 button */
  b8?: InputParams;
  /** Settings for the center button */
  center?: InputParams;
  /** Settings for the PS button */
  ps?: InputParams;
  /** Settings for the profile cycle button */
  profile?: InputParams;
  /** Settings for the analog stick */
  stick?: AnalogParams;

  // Profile-mapped inputs (DualSense-compatible)
  /** Settings for the left stick/trigger/bumper group */
  left?: UnisenseParams;
  /** Settings for the right stick/trigger/bumper group */
  right?: UnisenseParams;
  /** Settings for the D-pad */
  dpad?: DpadParams;
  /** Settings for the Cross button */
  cross?: InputParams;
  /** Settings for the Circle button */
  circle?: InputParams;
  /** Settings for the Square button */
  square?: InputParams;
  /** Settings for the Triangle button */
  triangle?: InputParams;
  /** Settings for the touchpad */
  touchpad?: InputParams;
  /** Settings for the Options button */
  options?: InputParams;
  /** Settings for the Create button */
  create?: InputParams;
  /** Settings for the Mute button */
  mute?: InputParams;

  /** Settings for the battery */
  battery?: BatteryParams;
  /** Settings for the connection indicator */
  connection?: InputParams;
}

/** Tracks the active profile ID (1–3) */
class ProfileId extends Input<number> {
  public state: number = 1;

  public get active(): boolean {
    return false;
  }
}

/** Represents a DualSense Access controller */
export class DualsenseAccess extends Input<DualsenseAccess> {
  public readonly state: DualsenseAccess = this;

  /** Hardware button 1 */
  public readonly b1: Momentary;
  /** Hardware button 2 */
  public readonly b2: Momentary;
  /** Hardware button 3 */
  public readonly b3: Momentary;
  /** Hardware button 4 */
  public readonly b4: Momentary;
  /** Hardware button 5 */
  public readonly b5: Momentary;
  /** Hardware button 6 */
  public readonly b6: Momentary;
  /** Hardware button 7 */
  public readonly b7: Momentary;
  /** Hardware button 8 */
  public readonly b8: Momentary;
  /** Center button */
  public readonly center: Momentary;
  /** PlayStation button */
  public readonly ps: Momentary;
  /** Profile cycle button */
  public readonly profile: Momentary;
  /** Analog stick (x, y, button = stick click) */
  public readonly stick: Analog;

  // Profile-mapped inputs (DualSense-compatible)
  /** Left stick, trigger (L2), and bumper (L1) — profile-mapped */
  public readonly left: Unisense;
  /** Right stick, trigger (R2), and bumper (R1) — profile-mapped */
  public readonly right: Unisense;
  /** D-pad — profile-mapped */
  public readonly dpad: Dpad;
  /** Cross button — profile-mapped */
  public readonly cross: Momentary;
  /** Circle button — profile-mapped */
  public readonly circle: Momentary;
  /** Square button — profile-mapped */
  public readonly square: Momentary;
  /** Triangle button — profile-mapped */
  public readonly triangle: Momentary;
  /** Touchpad (button only, contacts stay at neutral) — profile-mapped */
  public readonly touchpad: Touchpad;
  /** Options button — profile-mapped */
  public readonly options: Momentary;
  /** Create button — profile-mapped */
  public readonly create: Momentary;
  /** Mute button — profile-mapped */
  public readonly mute: Mute;

  /** Battery level and charging status */
  public readonly battery: Battery;
  /** Active profile ID (1–3) */
  public readonly profileId: ProfileId;
  /** Whether a controller is connected */
  public readonly connection: Momentary;

  /** RGB light bar */
  public readonly lightbar = new Lightbar();
  /** Profile indicator LEDs (3 LEDs, animation modes) */
  public readonly profileLeds = new AccessProfileLeds();
  /** Player indicator LED pattern (6-segment cross) */
  public readonly playerIndicator = new AccessPlayerIndicatorLed();
  /** White status LED */
  public readonly statusLed = new AccessStatusLed();

  /** Active interval timers, cleared on dispose */
  private readonly timers: ReturnType<typeof setInterval>[] = [];

  /** Buffered battery reading */
  private readonly pendingBattery = {
    peakLevel: 0,
    status: ChargeStatus.Discharging as ChargeStatus,
  };

  /** The underlying HID coordinator */
  public readonly hid: AccessHID;

  /** Firmware and hardware information */
  public get firmwareInfo(): FirmwareInfo {
    return this.hid.firmwareInfo;
  }

  /** Factory information (serial number, body color, board revision) */
  public get factoryInfo(): FactoryInfo {
    return this.hid.factoryInfo;
  }

  /** True if any input is active */
  public get active(): boolean {
    return Object.values(this).some(
      (input) => input !== this && input instanceof Input && input.active
    );
  }

  /** Returns true if connected via Bluetooth */
  public get wireless(): boolean {
    return this.hid.wireless;
  }

  /** Factory-stamped serial number */
  public get serialNumber(): string {
    return this.hid.factoryInfo.serialNumber;
  }

  constructor(params: DualsenseAccessParams = {}) {
    super(params);

    this.b1 = new Momentary({ icon: "1", name: "B1", ...(params.b1 ?? {}) });
    this.b2 = new Momentary({ icon: "2", name: "B2", ...(params.b2 ?? {}) });
    this.b3 = new Momentary({ icon: "3", name: "B3", ...(params.b3 ?? {}) });
    this.b4 = new Momentary({ icon: "4", name: "B4", ...(params.b4 ?? {}) });
    this.b5 = new Momentary({ icon: "5", name: "B5", ...(params.b5 ?? {}) });
    this.b6 = new Momentary({ icon: "6", name: "B6", ...(params.b6 ?? {}) });
    this.b7 = new Momentary({ icon: "7", name: "B7", ...(params.b7 ?? {}) });
    this.b8 = new Momentary({ icon: "8", name: "B8", ...(params.b8 ?? {}) });
    this.center = new Momentary({
      icon: "C",
      name: "Center",
      ...(params.center ?? {}),
    });
    this.ps = new Momentary({
      icon: "㎰",
      name: "PS",
      ...(params.ps ?? {}),
    });
    this.profile = new Momentary({
      icon: "P",
      name: "Profile",
      ...(params.profile ?? {}),
    });
    this.stick = new Analog({
      icon: "⊕",
      name: "Stick",
      ...(params.stick ?? {}),
    });

    // Profile-mapped inputs (DualSense-compatible)
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
    this.dpad = new Dpad({
      icon: "D",
      name: "D-pad",
      ...(params.dpad ?? {}),
    });
    this.cross = new Momentary({
      icon: "⮿",
      name: "Cross",
      ...(params.cross ?? {}),
    });
    this.circle = new Momentary({
      icon: "⊚",
      name: "Circle",
      ...(params.circle ?? {}),
    });
    this.square = new Momentary({
      icon: "🟗",
      name: "Square",
      ...(params.square ?? {}),
    });
    this.triangle = new Momentary({
      icon: "🟕",
      name: "Triangle",
      ...(params.triangle ?? {}),
    });
    this.touchpad = new Touchpad({
      icon: "⎚",
      name: "Touchpad",
      ...(params.touchpad ?? {}),
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
    this.mute = new Mute({
      icon: "🕩",
      name: "Mute",
      ...(params.mute ?? {}),
    });

    this.battery = new Battery({
      icon: "🔋",
      name: "Battery",
      ...(params.battery ?? {}),
    });
    this.profileId = new ProfileId({ icon: "#", name: "ProfileId" });
    this.connection = new Momentary({
      icon: "🔗",
      name: "Connected",
      ...(params.connection ?? {}),
    });

    this.connection[InputSet](false);

    const externallyManaged = params.hid !== undefined;
    this.hid =
      params.hid === null
        ? new AccessHID(new AccessNullHIDProvider())
        : (params.hid ?? new AccessHID(new AccessPlatformHIDProvider()));
    this.hid.register((state: AccessHIDState) => {
      this.processHID(state);
    });

    const lightbarMemo = { key: "" };
    const profileLedsMemo = { key: "" };
    const playerIndicatorMemo = { key: "" };
    const statusLedMemo = { key: "" };

    const invalidateMemos = () => {
      lightbarMemo.key = "";
      profileLedsMemo.key = "";
      playerIndicatorMemo.key = "";
      statusLedMemo.key = "";
    };

    this.hid.onConnectionChange((connected) => {
      this.connection[InputSet](connected);
      if (connected) {
        invalidateMemos();
        // BT full-mode switch (triggered by Feature Report 0x05) can take
        // up to ~1s. Output reports sent during this window are silently
        // dropped, so re-invalidate memos to force re-sends.
        this.timers.push(
          setTimeout(() => invalidateMemos(), 500) as unknown as ReturnType<
            typeof setInterval
          >
        );
        this.timers.push(
          setTimeout(() => invalidateMemos(), 1500) as unknown as ReturnType<
            typeof setInterval
          >
        );
      }
    });
    this.connection[InputSet](this.hid.provider.connected);

    // Standalone mode: poll for devices
    if (!externallyManaged) {
      this.timers.push(
        setInterval(() => {
          if (!this.hid.provider.connected) {
            void Promise.resolve(this.hid.provider.connect()).catch(() => {});
          }
        }, 200)
      );
    }

    // Battery: 1s buffered cadence with peak-filtering
    this.timers.push(
      setInterval(() => {
        if (!this.connection.active) return;
        this.battery.level[InputSet](this.pendingBattery.peakLevel);
        this.battery.status[InputSet](this.pendingBattery.status);
        this.pendingBattery.peakLevel = 0;
      }, 1000)
    );

    // Output loop (30Hz)
    // When any subsystem changes, send all 4 in one report — the Access
    // controller over BT requires combined mutator + LED_FLAGS_1.
    this.timers.push(
      setInterval(() => {
        if (!this.connection.active) return;

        const lightbarKey = this.lightbar.toKey();
        const profileLedsKey = this.profileLeds.toKey();
        const playerIndicatorKey = this.playerIndicator.toKey();
        const statusLedKey = this.statusLed.toKey();

        const anyChanged =
          lightbarKey !== lightbarMemo.key ||
          profileLedsKey !== profileLedsMemo.key ||
          playerIndicatorKey !== playerIndicatorMemo.key ||
          statusLedKey !== statusLedMemo.key;

        if (anyChanged) {
          const { r, g, b } = this.lightbar.color;
          this.hid.setLightbar(r, g, b);
          this.hid.setProfileLeds(this.profileLeds.mode);
          this.hid.setPlayerIndicator(this.playerIndicator.pattern);
          this.hid.setStatusLed(this.statusLed.on);
          lightbarMemo.key = lightbarKey;
          profileLedsMemo.key = profileLedsKey;
          playerIndicatorMemo.key = playerIndicatorKey;
          statusLedMemo.key = statusLedKey;
        }
      }, 1000 / 30)
    );
  }

  /** Stop all internal timers and release resources */
  public dispose(): void {
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
    this.timers.length = 0;
    this.hid.dispose();
  }

  /** Distributes HID state to inputs */
  private processHID(state: AccessHIDState): void {
    // Raw hardware inputs
    this.b1[InputSet](state[AccessInputId.B1]);
    this.b2[InputSet](state[AccessInputId.B2]);
    this.b3[InputSet](state[AccessInputId.B3]);
    this.b4[InputSet](state[AccessInputId.B4]);
    this.b5[InputSet](state[AccessInputId.B5]);
    this.b6[InputSet](state[AccessInputId.B6]);
    this.b7[InputSet](state[AccessInputId.B7]);
    this.b8[InputSet](state[AccessInputId.B8]);
    this.center[InputSet](state[AccessInputId.Center]);
    this.ps[InputSet](state[AccessInputId.PS]);
    this.profile[InputSet](state[AccessInputId.Profile]);

    this.stick.x[InputSet](state[AccessInputId.StickX]);
    this.stick.y[InputSet](state[AccessInputId.StickY]);
    this.stick.button[InputSet](state[AccessInputId.StickClick]);

    // Profile-mapped inputs
    this.left.analog.x[InputSet](state[AccessInputId.MappedLeftStickX]);
    this.left.analog.y[InputSet](state[AccessInputId.MappedLeftStickY]);
    this.left.analog.button[InputSet](state[AccessInputId.L3]);
    this.left.trigger[InputSet](state[AccessInputId.MappedL2]);
    this.left.trigger.button[InputSet](state[AccessInputId.L2Button]);
    this.left.bumper[InputSet](state[AccessInputId.L1]);

    this.right.analog.x[InputSet](state[AccessInputId.MappedRightStickX]);
    this.right.analog.y[InputSet](state[AccessInputId.MappedRightStickY]);
    this.right.analog.button[InputSet](state[AccessInputId.R3]);
    this.right.trigger[InputSet](state[AccessInputId.MappedR2]);
    this.right.trigger.button[InputSet](state[AccessInputId.R2Button]);
    this.right.bumper[InputSet](state[AccessInputId.R1]);

    this.dpad.up[InputSet](state[AccessInputId.DpadUp]);
    this.dpad.down[InputSet](state[AccessInputId.DpadDown]);
    this.dpad.left[InputSet](state[AccessInputId.DpadLeft]);
    this.dpad.right[InputSet](state[AccessInputId.DpadRight]);

    this.cross[InputSet](state[AccessInputId.Cross]);
    this.circle[InputSet](state[AccessInputId.Circle]);
    this.square[InputSet](state[AccessInputId.Square]);
    this.triangle[InputSet](state[AccessInputId.Triangle]);

    this.touchpad.button[InputSet](state[AccessInputId.TouchButton]);
    this.options[InputSet](state[AccessInputId.Options]);
    this.create[InputSet](state[AccessInputId.Create]);
    this.mute[InputSet](state[AccessInputId.MuteButton]);

    this.profileId[InputSet](state[AccessInputId.ProfileId]);

    const level = state[AccessInputId.BatteryLevel];
    if (level > this.pendingBattery.peakLevel) {
      this.pendingBattery.peakLevel = level;
    }
    this.pendingBattery.status = state[AccessInputId.BatteryStatus];
  }
}
