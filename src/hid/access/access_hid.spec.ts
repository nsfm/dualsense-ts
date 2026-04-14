import { AccessHID } from "./access_hid";
import { AccessNullHIDProvider } from "./access_null_hid_provider";
import { DefaultAccessHIDState, AccessInputId, AccessProfileLedMode } from "./access_hid_state";

describe("AccessHID", () => {
  let provider: AccessNullHIDProvider;
  let hid: AccessHID;

  beforeEach(() => {
    provider = new AccessNullHIDProvider();
    hid = new AccessHID(provider);
  });

  afterEach(() => {
    hid.dispose();
  });

  it("should initialize with default state", () => {
    expect(hid.state).toEqual(DefaultAccessHIDState);
  });

  it("should register and receive state updates", () => {
    const states: typeof hid.state[] = [];
    hid.register((state) => states.push(state));

    const testState = {
      ...DefaultAccessHIDState,
      [AccessInputId.B1]: true,
    };
    provider.onData(testState);

    expect(states.length).toBe(1);
    expect(states[0][AccessInputId.B1]).toBe(true);
  });

  it("should unregister callbacks", () => {
    const states: typeof hid.state[] = [];
    const callback = (state: typeof hid.state) => states.push(state);
    hid.register(callback);
    hid.unregister(callback);

    provider.onData({ ...DefaultAccessHIDState });
    expect(states.length).toBe(0);
  });

  it("should default wireless to false", () => {
    expect(hid.wireless).toBe(false);
  });

  it("should not be ready initially", () => {
    expect(hid.ready).toBe(false);
  });

  it("should have undefined identity initially", () => {
    expect(hid.identity).toBeUndefined();
  });

  describe("output methods", () => {
    it("should accept setLightbar without error", () => {
      expect(() => hid.setLightbar(255, 0, 128)).not.toThrow();
    });

    it("should accept setProfileLeds without error", () => {
      expect(() => hid.setProfileLeds(AccessProfileLedMode.Sweep)).not.toThrow();
    });

    it("should accept setPlayerIndicator without error", () => {
      expect(() => hid.setPlayerIndicator(3)).not.toThrow();
    });

    it("should accept setStatusLed without error", () => {
      expect(() => hid.setStatusLed(true)).not.toThrow();
      expect(() => hid.setStatusLed(false)).not.toThrow();
    });
  });

  describe("connection callbacks", () => {
    it("should fire connection change callbacks", () => {
      const events: boolean[] = [];
      hid.onConnectionChange((connected) => events.push(connected));

      provider.onConnect();
      provider.onDisconnect();

      expect(events).toEqual([true, false]);
    });

    it("should support unsubscribe from connection changes", () => {
      const events: boolean[] = [];
      const unsub = hid.onConnectionChange((connected) => events.push(connected));
      unsub();

      provider.onConnect();
      expect(events.length).toBe(0);
    });
  });

  describe("error handling", () => {
    it("should forward errors to subscribers", () => {
      const errors: Error[] = [];
      hid.on("error", (err) => errors.push(err));

      provider.onError(new Error("test error"));
      expect(errors.length).toBe(1);
      expect(errors[0].message).toBe("test error");
    });
  });
});
