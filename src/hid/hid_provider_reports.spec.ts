import {
  HIDProvider,
  mapBatteryLevel,
  mapGyroAccel,
  mapAxis,
  InputId,
} from "./hid_provider";
import { ChargeStatus } from "./battery_state";
import { ByteArray } from "./byte_array";

class TestProvider extends HIDProvider {
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

describe("mapBatteryLevel", () => {
  it("maps 0 to 0", () => {
    expect(mapBatteryLevel(0)).toBe(0);
  });

  it("maps 5 to 0.5", () => {
    expect(mapBatteryLevel(5)).toBe(0.5);
  });

  it("maps 10 to 1", () => {
    expect(mapBatteryLevel(10)).toBe(1);
  });

  it("clamps values above 10 to 1", () => {
    expect(mapBatteryLevel(15)).toBe(1);
  });

  it("masks to low nibble", () => {
    // 0x25 & 0xf = 5
    expect(mapBatteryLevel(0x25)).toBe(0.5);
  });
});

describe("mapGyroAccel", () => {
  it("maps center (0x00, 0x00) near -1 (unsigned 0)", () => {
    // v = 0, mapped via mapAxis(0 + 0x7fff, 0xffff)
    expect(mapGyroAccel(0x00, 0x00)).toBeCloseTo(
      mapAxis(0x7fff, 0xffff),
      5
    );
  });

  it("maps (0xff, 0x7f) near +1", () => {
    // v = 0x7fff, mapAxis(0x7fff + 0x7fff, 0xffff) = mapAxis(0xfffe, 0xffff)
    expect(mapGyroAccel(0xff, 0x7f)).toBeCloseTo(1, 1);
  });

  it("maps (0x00, 0x80) near -1", () => {
    // v = 0x8000, > 0x7fff so v -= 0x10000 = -0x8000
    // mapAxis(-0x8000 + 0x7fff, 0xffff) = mapAxis(-1, 0xffff)
    // mapAxis clamps to 0, so result is -1
    expect(mapGyroAccel(0x00, 0x80)).toBeCloseTo(-1, 1);
  });

  it("maps midpoint (0xff, 0xff) near 0", () => {
    // v = 0xffff, > 0x7fff so v -= 0x10000 = -1
    // mapAxis(-1 + 0x7fff, 0xffff) = mapAxis(0x7ffe, 0xffff) ≈ 0
    expect(mapGyroAccel(0xff, 0xff)).toBeCloseTo(0, 2);
  });
});

describe("processUsbInputReport01", () => {
  it("parses analog sticks, triggers, buttons, dpad, and battery", () => {
    const provider = new TestProvider();
    provider.wireless = false;

    const bytes: number[] = new Array<number>(64).fill(0);
    bytes[0] = 0x01; // report ID
    bytes[1] = 0; // left analog X = -1
    bytes[2] = 255; // left analog Y = -1 (inverted, so -(mapAxis(255)) = -1)
    bytes[3] = 128; // right analog X ≈ 0
    bytes[4] = 0; // right analog Y = -(-1) = 1
    bytes[5] = 255; // left trigger = 1
    bytes[6] = 0; // right trigger = 0

    // Byte 8: low nibble = dpad (0 = up), high nibble = buttons
    // Triangle=8, Circle=4, Cross=2, Square=1
    bytes[8] = (0b1010 << 4) | 0; // Triangle + Cross pressed, dpad up
    bytes[9] = 0b00100001; // LeftBumper + Options
    bytes[10] = 0b00000101; // Playstation + Mute

    // Battery: byte 53
    // Low nibble = level, high nibble = status
    bytes[53] = (Number(ChargeStatus.Charging) << 4) | 8; // level 8 = 0.8, charging

    // Status flags: byte 54
    bytes[54] = 0b00001111; // Status + MuteLed + Microphone + Headphone

    const state = provider.process(mockBuffer(bytes));

    expect(state[InputId.LeftAnalogX]).toBeCloseTo(-1);
    expect(state[InputId.LeftAnalogY]).toBeCloseTo(-1); // -mapAxis(255) = -1
    expect(state[InputId.RightAnalogX]).toBeCloseTo(0, 1);
    expect(state[InputId.RightAnalogY]).toBeCloseTo(1); // -mapAxis(0) = 1
    expect(state[InputId.LeftTrigger]).toBeCloseTo(1);
    expect(state[InputId.RightTrigger]).toBeCloseTo(0);

    expect(state[InputId.Triangle]).toBe(true);
    expect(state[InputId.Circle]).toBe(false);
    expect(state[InputId.Cross]).toBe(true);
    expect(state[InputId.Square]).toBe(false);

    expect(state[InputId.Up]).toBe(true);
    expect(state[InputId.Down]).toBe(false);
    expect(state[InputId.Dpad]).toBe(0);

    expect(state[InputId.LeftBumper]).toBe(true);
    expect(state[InputId.RightBumper]).toBe(false);
    expect(state[InputId.Options]).toBe(true);

    expect(state[InputId.Playstation]).toBe(true);
    expect(state[InputId.Mute]).toBe(true);

    expect(state[InputId.BatteryLevel]).toBeCloseTo(0.8);
    expect(state[InputId.BatteryStatus]).toBe(ChargeStatus.Charging);

    expect(state[InputId.Status]).toBe(true);
    expect(state[InputId.MuteLed]).toBe(true);
    expect(state[InputId.Microphone]).toBe(true);
    expect(state[InputId.Headphone]).toBe(true);

    expect(provider.limited).toBe(false);
  });
});

describe("processBluetoothInputReport01", () => {
  it("parses limited BT report and sets limited=true", () => {
    const provider = new TestProvider();
    provider.wireless = true;

    const bytes: number[] = new Array<number>(10).fill(0);
    bytes[0] = 0x01; // report ID
    bytes[1] = 128; // left analog X ≈ 0
    bytes[5] = (0b0100 << 4) | 3; // Circle pressed, dpad = 3 (right-down)
    bytes[6] = 0b00000010; // RightBumper
    bytes[7] = 0b00000010; // TouchButton

    const state = provider.process(mockBuffer(bytes));

    expect(provider.limited).toBe(true);
    expect(state[InputId.Circle]).toBe(true);
    expect(state[InputId.Triangle]).toBe(false);
    expect(state[InputId.Dpad]).toBe(3);
    expect(state[InputId.Right]).toBe(true);
    expect(state[InputId.Down]).toBe(true);
    expect(state[InputId.RightBumper]).toBe(true);
    expect(state[InputId.TouchButton]).toBe(true);
    expect(state[InputId.LeftAnalogX]).toBeCloseTo(0, 1);
  });
});

describe("processBluetoothInputReport31", () => {
  it("parses full BT report with shifted offsets and sets limited=false", () => {
    const provider = new TestProvider();
    provider.wireless = true;

    const bytes: number[] = new Array<number>(78).fill(0);
    bytes[0] = 0x31; // report ID
    bytes[2] = 0; // left analog X = -1
    bytes[3] = 128; // left analog Y ≈ 0 (inverted)
    bytes[6] = 128; // left trigger ≈ 0.5
    bytes[7] = 255; // right trigger = 1

    // Byte 9: dpad=7 (up-left), Square pressed (bit 0 of high nibble)
    bytes[9] = (0b0001 << 4) | 7;
    bytes[10] = 0; // misc buttons
    bytes[11] = 0b00000100; // Mute

    // Battery: byte 54
    bytes[54] = (Number(ChargeStatus.Full) << 4) | 10; // level 10 = 1.0, full

    const state = provider.process(mockBuffer(bytes));

    expect(provider.limited).toBe(false);
    expect(state[InputId.LeftAnalogX]).toBeCloseTo(-1);
    expect(state[InputId.LeftTrigger]).toBeCloseTo(0.5, 1);
    expect(state[InputId.RightTrigger]).toBeCloseTo(1);
    expect(state[InputId.Square]).toBe(true);
    expect(state[InputId.Up]).toBe(true);
    expect(state[InputId.Left]).toBe(true);
    expect(state[InputId.Mute]).toBe(true);
    expect(state[InputId.BatteryLevel]).toBeCloseTo(1);
    expect(state[InputId.BatteryStatus]).toBe(ChargeStatus.Full);
  });
});

describe("processReport dispatching", () => {
  it("routes report 0x01 to USB parser when wired", () => {
    const provider = new TestProvider();
    provider.wireless = false;

    const bytes: number[] = new Array<number>(64).fill(0);
    bytes[0] = 0x01;
    // Set byte 8 to a recognizable dpad value for USB
    bytes[8] = 0b00010010; // Square + dpad=2 (right)

    const state = provider.process(mockBuffer(bytes));
    expect(state[InputId.Square]).toBe(true);
    expect(state[InputId.Dpad]).toBe(2);
    expect(provider.limited).toBe(false);
  });

  it("routes report 0x01 to BT01 parser when wireless", () => {
    const provider = new TestProvider();
    provider.wireless = true;

    const bytes: number[] = new Array<number>(10).fill(0);
    bytes[0] = 0x01;
    bytes[5] = 0b10000000; // Triangle pressed (bit 3 of high nibble = 8)

    const state = provider.process(mockBuffer(bytes));
    expect(state[InputId.Triangle]).toBe(true);
    expect(provider.limited).toBe(true);
  });

  it("routes report 0x31 to BT31 parser", () => {
    const provider = new TestProvider();
    provider.wireless = true;

    const bytes: number[] = new Array<number>(78).fill(0);
    bytes[0] = 0x31;

    provider.process(mockBuffer(bytes));
    expect(provider.limited).toBe(false);
  });

  it("calls onError for unknown report ID", () => {
    const provider = new TestProvider();
    const errors: Error[] = [];
    provider.onError = (e) => errors.push(e);

    const bytes: number[] = [0xff];
    provider.process(mockBuffer(bytes));

    expect(errors.length).toBe(1);
    expect(errors[0].message).toContain("unexpected report id");
  });
});
