import { AccessHIDProvider, AccessHIDState, DefaultAccessHIDState } from "./access_hid_provider";
import { AccessInputId } from "./access_hid_state";
import { ChargeStatus } from "../battery_state";
import { ByteArray } from "../byte_array";
import { AccessInput, AccessButton1, AccessButton2 } from "../access_hid";

class TestAccessProvider extends AccessHIDProvider {
  device = undefined;
  wireless: boolean | undefined = false;
  buffer = undefined;
  connect() {}
  disconnect() {}
  readonly connected = false;
  process(input: unknown) {
    return this.processReport(input as ByteArray);
  }

  testReset() {
    this.reset();
  }

  async write() {}

  readFeatureReport() {
    return Promise.resolve(new Uint8Array(0));
  }

  async sendFeatureReport() {}
}

function mockBuffer(bytes: readonly number[]): ByteArray {
  return {
    length: bytes.length,
    readUint8: (o: number) => bytes[o] ?? 0,
    readUint16LE: (o: number) => (bytes[o] ?? 0) | ((bytes[o + 1] ?? 0) << 8),
    readUint32LE: (o: number) =>
      (bytes[o] ?? 0) |
      ((bytes[o + 1] ?? 0) << 8) |
      ((bytes[o + 2] ?? 0) << 16) |
      ((bytes[o + 3] ?? 0) << 24) >>> 0,
  };
}

/** Build a minimal USB input report (report ID 0x01) with Access-specific fields */
function buildUsbReport(overrides: Record<number, number> = {}): ByteArray {
  const bytes: number[] = new Array<number>(64).fill(0);
  bytes[0] = 0x01; // Report ID
  // Default mapped sticks centered
  bytes[AccessInput.MAPPED_STICK_LX] = 0x80;
  bytes[AccessInput.MAPPED_STICK_LY] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RX] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RY] = 0x80;
  // Default hat = null (no dpad)
  bytes[AccessInput.HAT_BUTTONS] = 0x08;
  // Default raw stick centered
  bytes[AccessInput.RAW_STICK_X] = 0x80;
  bytes[AccessInput.RAW_STICK_Y] = 0x80;
  // Default profile = 1
  bytes[AccessInput.PROFILE] = 0x01;
  for (const [offset, value] of Object.entries(overrides)) {
    bytes[Number(offset)] = value;
  }
  return mockBuffer(bytes);
}

/** Build a BT 0x31 report with +1 offset applied */
function buildBtReport(overrides: Record<number, number> = {}): ByteArray {
  const o = AccessInput.BT_OFFSET;
  const bytes: number[] = new Array<number>(78).fill(0);
  bytes[0] = 0x31; // Report ID
  // Default mapped sticks centered (shifted +1)
  bytes[AccessInput.MAPPED_STICK_LX + o] = 0x80;
  bytes[AccessInput.MAPPED_STICK_LY + o] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RX + o] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RY + o] = 0x80;
  // Default hat = null (shifted +1)
  bytes[AccessInput.HAT_BUTTONS + o] = 0x08;
  // Default raw stick centered (shifted +1)
  bytes[AccessInput.RAW_STICK_X + o] = 0x80;
  bytes[AccessInput.RAW_STICK_Y + o] = 0x80;
  // Default profile = 1 (shifted +1)
  bytes[AccessInput.PROFILE + o] = 0x01;
  for (const [offset, value] of Object.entries(overrides)) {
    bytes[Number(offset)] = value;
  }
  return mockBuffer(bytes);
}

/** Build a BT 0x01 limited report (mapped header only, no raw Access data) */
function buildBtLimitedReport(
  overrides: Record<number, number> = {}
): ByteArray {
  const bytes: number[] = new Array<number>(10).fill(0);
  bytes[0] = 0x01;
  // Default mapped sticks centered
  bytes[AccessInput.MAPPED_STICK_LX] = 0x80;
  bytes[AccessInput.MAPPED_STICK_LY] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RX] = 0x80;
  bytes[AccessInput.MAPPED_STICK_RY] = 0x80;
  // Default hat = null
  bytes[AccessInput.HAT_BUTTONS] = 0x08;
  for (const [offset, value] of Object.entries(overrides)) {
    bytes[Number(offset)] = value;
  }
  return mockBuffer(bytes);
}

describe("AccessHIDProvider report parsing", () => {
  let provider: TestAccessProvider;

  beforeEach(() => {
    provider = new TestAccessProvider();
    provider.wireless = false;
  });

  describe("USB Input Report 0x01", () => {
    it("should parse all buttons as released by default", () => {
      const state = provider.process(buildUsbReport());
      expect(state[AccessInputId.B1]).toBe(false);
      expect(state[AccessInputId.B2]).toBe(false);
      expect(state[AccessInputId.B3]).toBe(false);
      expect(state[AccessInputId.B4]).toBe(false);
      expect(state[AccessInputId.B5]).toBe(false);
      expect(state[AccessInputId.B6]).toBe(false);
      expect(state[AccessInputId.B7]).toBe(false);
      expect(state[AccessInputId.B8]).toBe(false);
      expect(state[AccessInputId.Center]).toBe(false);
      expect(state[AccessInputId.StickClick]).toBe(false);
      expect(state[AccessInputId.PS]).toBe(false);
      expect(state[AccessInputId.Profile]).toBe(false);
    });

    it("should parse B1 pressed", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.RAW_BUTTONS_1]: AccessButton1.B1 })
      );
      expect(state[AccessInputId.B1]).toBe(true);
      expect(state[AccessInputId.B2]).toBe(false);
    });

    it("should parse multiple buttons pressed", () => {
      const state = provider.process(
        buildUsbReport({
          [AccessInput.RAW_BUTTONS_1]: AccessButton1.B3 | AccessButton1.B7,
          [AccessInput.RAW_BUTTONS_2]: AccessButton2.CENTER | AccessButton2.PS,
        })
      );
      expect(state[AccessInputId.B3]).toBe(true);
      expect(state[AccessInputId.B7]).toBe(true);
      expect(state[AccessInputId.Center]).toBe(true);
      expect(state[AccessInputId.PS]).toBe(true);
      expect(state[AccessInputId.B1]).toBe(false);
      expect(state[AccessInputId.StickClick]).toBe(false);
    });

    it("should parse stick at center as 0,0", () => {
      const state = provider.process(buildUsbReport());
      expect(state[AccessInputId.StickX]).toBeCloseTo(0, 1);
      expect(state[AccessInputId.StickY]).toBeCloseTo(0, 1);
    });

    it("should parse stick pushed right", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.RAW_STICK_X]: 255 })
      );
      expect(state[AccessInputId.StickX]).toBeCloseTo(1);
    });

    it("should parse stick pushed up (high byte = up)", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.RAW_STICK_Y]: 255 })
      );
      expect(state[AccessInputId.StickY]).toBeCloseTo(1);
    });

    it("should parse battery level", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.BATTERY]: 0x25 })
      );
      // Lower nibble = 5, maps to 0.5
      expect(state[AccessInputId.BatteryLevel]).toBeCloseTo(0.5);
      // Upper nibble = 2, ChargeStatus.Full
      expect(state[AccessInputId.BatteryStatus]).toEqual(ChargeStatus.Full);
    });

    it("should parse profile ID", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.PROFILE]: 0x03 })
      );
      expect(state[AccessInputId.ProfileId]).toEqual(3);
    });

    it("should default profile ID to 1 when zero", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.PROFILE]: 0x00 })
      );
      expect(state[AccessInputId.ProfileId]).toEqual(1);
    });
  });

  describe("BT Input Report 0x31 (offset +1)", () => {
    it("should parse buttons with BT offset", () => {
      const o = AccessInput.BT_OFFSET;
      provider.wireless = true;
      const state = provider.process(
        buildBtReport({
          [AccessInput.RAW_BUTTONS_1 + o]: AccessButton1.B5,
          [AccessInput.RAW_BUTTONS_2 + o]: AccessButton2.STICK,
        })
      );
      expect(state[AccessInputId.B5]).toBe(true);
      expect(state[AccessInputId.StickClick]).toBe(true);
      expect(state[AccessInputId.B1]).toBe(false);
    });

    it("should parse battery with BT offset", () => {
      const o = AccessInput.BT_OFFSET;
      provider.wireless = true;
      const state = provider.process(
        buildBtReport({ [AccessInput.BATTERY + o]: 0x18 })
      );
      expect(state[AccessInputId.BatteryLevel]).toBeCloseTo(0.8);
      expect(state[AccessInputId.BatteryStatus]).toEqual(ChargeStatus.Charging);
    });
  });

  describe("Mapped header parsing (bytes 1–10)", () => {
    it("should parse mapped sticks at center as 0,0", () => {
      const state = provider.process(buildUsbReport());
      expect(state[AccessInputId.MappedLeftStickX]).toBeCloseTo(0, 1);
      expect(state[AccessInputId.MappedLeftStickY]).toBeCloseTo(0, 1);
      expect(state[AccessInputId.MappedRightStickX]).toBeCloseTo(0, 1);
      expect(state[AccessInputId.MappedRightStickY]).toBeCloseTo(0, 1);
    });

    it("should parse mapped left stick pushed right and up", () => {
      const state = provider.process(
        buildUsbReport({
          [AccessInput.MAPPED_STICK_LX]: 255,
          [AccessInput.MAPPED_STICK_LY]: 0, // 0x00 = up in DualSense convention
        })
      );
      expect(state[AccessInputId.MappedLeftStickX]).toBeCloseTo(1);
      expect(state[AccessInputId.MappedLeftStickY]).toBeCloseTo(1); // negated: -mapAxis(0) = 1
    });

    it("should parse mapped triggers", () => {
      const state = provider.process(
        buildUsbReport({
          [AccessInput.MAPPED_L2]: 255,
          [AccessInput.MAPPED_R2]: 128,
        })
      );
      expect(state[AccessInputId.MappedL2]).toBeCloseTo(1);
      expect(state[AccessInputId.MappedR2]).toBeCloseTo(128 / 255, 2);
    });

    it("should parse face buttons from byte 8 upper nibble", () => {
      // Square=1, Cross=2, Circle=4, Triangle=8 in upper nibble
      const state = provider.process(
        buildUsbReport({
          [AccessInput.HAT_BUTTONS]: (0b1010 << 4) | 0x08, // Triangle+Cross, hat=null
        })
      );
      expect(state[AccessInputId.Triangle]).toBe(true);
      expect(state[AccessInputId.Cross]).toBe(true);
      expect(state[AccessInputId.Circle]).toBe(false);
      expect(state[AccessInputId.Square]).toBe(false);
    });

    it("should parse dpad from byte 8 lower nibble", () => {
      // dpad=0 = North (up)
      const state = provider.process(
        buildUsbReport({ [AccessInput.HAT_BUTTONS]: 0x00 })
      );
      expect(state[AccessInputId.DpadUp]).toBe(true);
      expect(state[AccessInputId.DpadDown]).toBe(false);
      expect(state[AccessInputId.DpadLeft]).toBe(false);
      expect(state[AccessInputId.DpadRight]).toBe(false);
    });

    it("should parse dpad diagonal (NE = up + right)", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.HAT_BUTTONS]: 0x01 }) // NE
      );
      expect(state[AccessInputId.DpadUp]).toBe(true);
      expect(state[AccessInputId.DpadRight]).toBe(true);
      expect(state[AccessInputId.DpadDown]).toBe(false);
      expect(state[AccessInputId.DpadLeft]).toBe(false);
    });

    it("should parse dpad null (8) as all released", () => {
      const state = provider.process(
        buildUsbReport({ [AccessInput.HAT_BUTTONS]: 0x08 })
      );
      expect(state[AccessInputId.DpadUp]).toBe(false);
      expect(state[AccessInputId.DpadDown]).toBe(false);
      expect(state[AccessInputId.DpadLeft]).toBe(false);
      expect(state[AccessInputId.DpadRight]).toBe(false);
    });

    it("should parse misc buttons from byte 9", () => {
      // L1=1, R1=2, L2Button=4, R2Button=8, Create=16, Options=32, L3=64, R3=128
      const state = provider.process(
        buildUsbReport({
          [AccessInput.BUTTONS_2]: 0b10100101, // L1 + L2Button + Options + R3
        })
      );
      expect(state[AccessInputId.L1]).toBe(true);
      expect(state[AccessInputId.L2Button]).toBe(true);
      expect(state[AccessInputId.Options]).toBe(true);
      expect(state[AccessInputId.R3]).toBe(true);
      expect(state[AccessInputId.R1]).toBe(false);
      expect(state[AccessInputId.R2Button]).toBe(false);
      expect(state[AccessInputId.Create]).toBe(false);
      expect(state[AccessInputId.L3]).toBe(false);
    });

    it("should parse system buttons from byte 10", () => {
      const state = provider.process(
        buildUsbReport({
          [AccessInput.BUTTONS_3]: 0b00000110, // TouchButton (bit 1) + Mute (bit 2)
        })
      );
      expect(state[AccessInputId.TouchButton]).toBe(true);
      expect(state[AccessInputId.MuteButton]).toBe(true);
    });

    it("should parse mapped header with BT 0x31 offset", () => {
      const o = AccessInput.BT_OFFSET;
      provider.wireless = true;
      const state = provider.process(
        buildBtReport({
          [AccessInput.MAPPED_L2 + o]: 200,
          [AccessInput.HAT_BUTTONS + o]: (0b0100 << 4) | 0x04, // Circle, dpad=South
          [AccessInput.BUTTONS_2 + o]: 0x02, // R1
        })
      );
      expect(state[AccessInputId.MappedL2]).toBeCloseTo(200 / 255, 2);
      expect(state[AccessInputId.Circle]).toBe(true);
      expect(state[AccessInputId.DpadDown]).toBe(true);
      expect(state[AccessInputId.R1]).toBe(true);
    });
  });

  describe("BT Input Report 0x01 (limited mode)", () => {
    it("should return defaults for raw inputs", () => {
      provider.wireless = true;
      const state = provider.process(buildBtLimitedReport());
      expect(state[AccessInputId.B1]).toBe(false);
      expect(state[AccessInputId.StickX]).toBe(0);
      expect(state[AccessInputId.BatteryLevel]).toBe(0);
      expect(state[AccessInputId.ProfileId]).toBe(1);
    });

    it("should parse mapped inputs from limited mode header", () => {
      provider.wireless = true;
      const state = provider.process(
        buildBtLimitedReport({
          [AccessInput.HAT_BUTTONS]: (0b0010 << 4) | 0x02, // Cross, dpad=East
          [AccessInput.BUTTONS_2]: 0x01, // L1
        })
      );
      expect(state[AccessInputId.Cross]).toBe(true);
      expect(state[AccessInputId.DpadRight]).toBe(true);
      expect(state[AccessInputId.L1]).toBe(true);
      // Raw inputs remain at defaults
      expect(state[AccessInputId.B1]).toBe(false);
    });
  });

  describe("reset", () => {
    it("should emit default state on reset", () => {
      let lastState: AccessHIDState | undefined;
      provider.onData = (state) => {
        lastState = state;
      };
      // Simulate disconnect
      provider.testReset();
      expect(lastState).toEqual(DefaultAccessHIDState);
    });
  });
});
