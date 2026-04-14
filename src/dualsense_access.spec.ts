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
