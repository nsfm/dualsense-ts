import { AccessHIDProvider, AccessHIDState, DefaultAccessHIDState } from "./access_hid_provider";
import { AccessInputId } from "./access_hid_state";
import { ChargeStatus } from "../battery_state";
import { ByteArray } from "../byte_array";
import { AccessInput, AccessButton1, AccessButton2 } from "../access_hid";
import { mapAxis, mapBatteryLevel } from "../hid_provider";

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

  async write() {}

  readFeatureReport() {
    return Promise.resolve(new Uint8Array(0));
  }

  async sendFeatureReport() {}
}

function mockBuffer(bytes: number[]): ByteArray {
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
  const bytes = new Array(64).fill(0);
  bytes[0] = 0x01; // Report ID
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
  const bytes = new Array(78).fill(0);
  bytes[0] = 0x31; // Report ID
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

  describe("BT Input Report 0x01 (limited mode)", () => {
    it("should return default state", () => {
      provider.wireless = true;
      const bytes = new Array(10).fill(0);
      bytes[0] = 0x01;
      const state = provider.process(mockBuffer(bytes));
      expect(state).toEqual(DefaultAccessHIDState);
    });
  });

  describe("reset", () => {
    it("should emit default state on reset", () => {
      let lastState: AccessHIDState | undefined;
      provider.onData = (state) => {
        lastState = state;
      };
      // Simulate disconnect
      (provider as any).reset();
      expect(lastState).toEqual(DefaultAccessHIDState);
    });
  });
});
