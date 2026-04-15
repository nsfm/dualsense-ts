import { DualsenseAccess } from "./dualsense_access";
import { AccessHID } from "./hid/access/access_hid";
import { AccessNullHIDProvider } from "./hid/access/access_null_hid_provider";
import { DefaultAccessHIDState, AccessInputId, AccessProfileLedMode } from "./hid/access/access_hid_state";

describe("DualsenseAccess", () => {
  let provider: AccessNullHIDProvider;
  let hid: AccessHID;
  let access: DualsenseAccess;

  beforeEach(() => {
    provider = new AccessNullHIDProvider();
    hid = new AccessHID(provider);
    access = new DualsenseAccess({ hid });
  });

  afterEach(() => {
    access.dispose();
  });

  describe("constructor", () => {
    it("should create with managed hid", () => {
      expect(access.hid).toBe(hid);
    });

    it("should create headless with null hid", () => {
      const headless = new DualsenseAccess({ hid: null });
      expect(headless.connection.state).toBe(false);
      headless.dispose();
    });

    it("should default connection to false", () => {
      expect(access.connection.state).toBe(false);
    });
  });

  describe("processHID", () => {
    it("should map button states", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.B1]: true,
        [AccessInputId.B4]: true,
        [AccessInputId.Center]: true,
      });

      expect(access.b1.state).toBe(true);
      expect(access.b2.state).toBe(false);
      expect(access.b4.state).toBe(true);
      expect(access.center.state).toBe(true);
    });

    it("should map stick values", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.StickX]: 0.75,
        [AccessInputId.StickY]: -0.5,
        [AccessInputId.StickClick]: true,
      });

      expect(access.stick.x.state).toBeCloseTo(0.75);
      expect(access.stick.y.state).toBeCloseTo(-0.5);
      expect(access.stick.button.state).toBe(true);
    });

    it("should map profile ID", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.ProfileId]: 2,
      });

      expect(access.profileId.state).toBe(2);
    });

    it("should map PS and profile buttons", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.PS]: true,
        [AccessInputId.Profile]: true,
      });

      expect(access.ps.state).toBe(true);
      expect(access.profile.state).toBe(true);
    });
  });

  describe("processHID — mapped inputs", () => {
    it("should map left stick and trigger", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.MappedLeftStickX]: 0.5,
        [AccessInputId.MappedLeftStickY]: -0.3,
        [AccessInputId.L3]: true,
        [AccessInputId.MappedL2]: 0.8,
        [AccessInputId.L2Button]: true,
        [AccessInputId.L1]: true,
      });

      expect(access.left.analog.x.state).toBeCloseTo(0.5);
      expect(access.left.analog.y.state).toBeCloseTo(-0.3);
      expect(access.left.analog.button.state).toBe(true);
      expect(access.left.trigger.state).toBeCloseTo(0.8);
      expect(access.left.trigger.button.state).toBe(true);
      expect(access.left.bumper.state).toBe(true);
    });

    it("should map right stick and trigger", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.MappedRightStickX]: -0.7,
        [AccessInputId.MappedRightStickY]: 0.4,
        [AccessInputId.R3]: true,
        [AccessInputId.MappedR2]: 0.6,
        [AccessInputId.R2Button]: true,
        [AccessInputId.R1]: true,
      });

      expect(access.right.analog.x.state).toBeCloseTo(-0.7);
      expect(access.right.analog.y.state).toBeCloseTo(0.4);
      expect(access.right.analog.button.state).toBe(true);
      expect(access.right.trigger.state).toBeCloseTo(0.6);
      expect(access.right.trigger.button.state).toBe(true);
      expect(access.right.bumper.state).toBe(true);
    });

    it("should map dpad directions", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.DpadUp]: true,
        [AccessInputId.DpadRight]: true,
      });

      expect(access.dpad.up.state).toBe(true);
      expect(access.dpad.right.state).toBe(true);
      expect(access.dpad.down.state).toBe(false);
      expect(access.dpad.left.state).toBe(false);
    });

    it("should map face buttons", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.Cross]: true,
        [AccessInputId.Triangle]: true,
      });

      expect(access.cross.state).toBe(true);
      expect(access.triangle.state).toBe(true);
      expect(access.circle.state).toBe(false);
      expect(access.square.state).toBe(false);
    });

    it("should map touchpad button", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.TouchButton]: true,
      });

      expect(access.touchpad.button.state).toBe(true);
    });

    it("should leave touchpad contacts at neutral", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.TouchButton]: true,
      });

      expect(access.touchpad.left.x.state).toBe(0);
      expect(access.touchpad.left.y.state).toBe(0);
      expect(access.touchpad.left.contact.state).toBe(false);
      expect(access.touchpad.right.x.state).toBe(0);
      expect(access.touchpad.right.y.state).toBe(0);
    });

    it("should map options, create, and mute", () => {
      provider.onData({
        ...DefaultAccessHIDState,
        [AccessInputId.Options]: true,
        [AccessInputId.Create]: true,
        [AccessInputId.MuteButton]: true,
      });

      expect(access.options.state).toBe(true);
      expect(access.create.state).toBe(true);
      expect(access.mute.state).toBe(true);
    });
  });

  describe("output controllers", () => {
    it("should have lightbar with default blue", () => {
      expect(access.lightbar.color).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("should have profile LEDs defaulting to On", () => {
      expect(access.profileLeds.mode).toEqual(AccessProfileLedMode.On);
    });

    it("should have player indicator defaulting to off", () => {
      expect(access.playerIndicator.pattern).toEqual(0);
    });

    it("should have status LED defaulting to on", () => {
      expect(access.statusLed.on).toBe(true);
    });
  });

  describe("properties", () => {
    it("should default wireless to false", () => {
      expect(access.wireless).toBe(false);
    });

    it("should delegate firmwareInfo to hid", () => {
      expect(access.firmwareInfo).toBe(hid.firmwareInfo);
    });

    it("should delegate factoryInfo to hid", () => {
      expect(access.factoryInfo).toBe(hid.factoryInfo);
    });

    it("should delegate serialNumber to factoryInfo", () => {
      expect(access.serialNumber).toBe(hid.factoryInfo.serialNumber);
    });
  });
});
