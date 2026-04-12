import {
  Dualsense,
  InputSet,
  Momentary,
  TriggerEffect,
  ChargeStatus,
  AudioOutput,
  MicSelect,
  MicMode,
  PlayerID,
  Brightness,
  MuteLedMode,
  DualsenseColor,
} from "./index";

describe("README.md example snippets", () => {
  let controller: Dualsense;

  beforeEach(() => {
    controller = new Dualsense({ hid: null });
  });

  afterEach(() => {
    controller.dispose();
  });

  it("should allow synchronous reads", () => {
    expect(controller.circle.active).toEqual(false);
    expect(controller.cross.active).toEqual(false);
    expect(controller.left.bumper.active).toEqual(false);

    expect(controller.right.trigger.active).toEqual(false);
    expect(controller.right.trigger.pressure).toEqual(0);

    expect(+controller.left.analog.x).toEqual(0);
    expect(controller.left.analog.y.magnitude).toEqual(0);
  });

  it("should support callbacks", (done) => {
    expect(controller.triangle.active).toEqual(false);
    setTimeout(() => {
      controller.triangle[InputSet](true);
    });

    controller.triangle.on("change", (input) => {
      expect(input.active).toEqual(true);
    });

    expect(controller.dpad.up.active).toEqual(false);
    setTimeout(() => {
      controller.dpad.up[InputSet](true);
    });

    controller.dpad.on("change", (input, direction) => {
      expect(input.active).toEqual(true);
      expect(direction.active).toEqual(true);
      done();
    });
  });

  it("should provide promises", async () => {
    setTimeout(() => {
      controller.dpad.up[InputSet](true);
    });
    const { active } = await controller.dpad.up.promise();
    expect(active).toEqual(true);

    setTimeout(() => {
      controller.dpad.up[InputSet](false);
    });
    const { left, up, down, right } = await controller.dpad.promise();
    expect(left).toBeInstanceOf(Momentary);
    expect(down).toBeInstanceOf(Momentary);
    expect(up).toBeInstanceOf(Momentary);
    expect(right).toBeInstanceOf(Momentary);
  });

  it("should work as an async iterator", async () => {
    let state = true;
    let iterations = 5;

    setTimeout(() => {
      controller.dpad.up[InputSet](state);
    });
    for await (const { left, right, up, down } of controller.dpad) {
      expect(left).toBeInstanceOf(Momentary);
      expect(down).toBeInstanceOf(Momentary);
      expect(up).toBeInstanceOf(Momentary);
      expect(right).toBeInstanceOf(Momentary);
      iterations--;
      state = !state;
      if (iterations === 0) break;
      setTimeout(() => {
        controller.dpad.up[InputSet](state);
      });
    }
  });

  describe("Touchpad", () => {
    it("should support touch point x/y and contact", () => {
      expect(controller.touchpad.left.contact.state).toBe(false);
      expect(controller.touchpad.left.x.state).toBe(0);
      expect(controller.touchpad.left.y.state).toBe(0);
      expect(controller.touchpad.right.contact.state).toBe(false);
    });

    it("should detect touch contact via press/release", (done) => {
      controller.touchpad.left.contact.on("press", () => {
        expect(controller.touchpad.left.contact.state).toBe(true);
        done();
      });
      setTimeout(() => controller.touchpad.left.contact[InputSet](true));
    });

    it("should have a physical button separate from touch", () => {
      expect(controller.touchpad.button).toBeInstanceOf(Momentary);
      expect(controller.touchpad.button.state).toBe(false);
    });

    it("should expose a tracker for touch IDs", () => {
      expect(controller.touchpad.left.tracker).toBeDefined();
      expect(controller.touchpad.left.tracker.state).toBe(0);
    });
  });

  describe("Motion Control", () => {
    it("should expose gyroscope x, y, z axes", () => {
      expect(controller.gyroscope.x.state).toBe(0);
      expect(controller.gyroscope.y.state).toBe(0);
      expect(controller.gyroscope.z.state).toBe(0);
    });

    it("should expose accelerometer x, y, z axes", () => {
      expect(controller.accelerometer.x.state).toBe(0);
      expect(controller.accelerometer.y.state).toBe(0);
      expect(controller.accelerometer.z.state).toBe(0);
    });

    it("should fire change events on accelerometer axes", (done) => {
      controller.accelerometer.z.on("change", ({ magnitude }) => {
        expect(magnitude).toBeGreaterThan(0);
        done();
      });
      setTimeout(() => controller.accelerometer.z[InputSet](0.5));
    });
  });

  describe("Battery", () => {
    it("should expose battery level and status", () => {
      expect(controller.battery.level.state).toBe(0);
      expect(controller.battery.status.state).toBe(ChargeStatus.Discharging);
    });

    it("should provide ChargeStatus enum values", () => {
      expect(ChargeStatus.Charging).toBeDefined();
      expect(ChargeStatus.Discharging).toBeDefined();
      expect(ChargeStatus.Full).toBeDefined();
    });
  });

  describe("Rumble", () => {
    it("should set rumble intensity on both sides", () => {
      controller.rumble(1.0);
      expect(controller.left.rumble()).toBe(1);
      expect(controller.right.rumble()).toBe(1);
    });

    it("should set rumble per-side", () => {
      controller.left.rumble(0.5);
      expect(controller.left.rumble()).toBe(0.5);
      expect(controller.right.rumble()).toBe(0);
    });

    it("should stop rumble with 0", () => {
      controller.rumble(1.0);
      controller.rumble(0);
      expect(controller.left.rumble()).toBe(0);
      expect(controller.right.rumble()).toBe(0);
    });

    it("should accept boolean for per-side rumble", () => {
      controller.left.rumble(true);
      expect(controller.left.rumble()).toBe(1);
      controller.left.rumble(false);
      expect(controller.left.rumble()).toBe(0);
    });
  });

  describe("Adaptive Triggers", () => {
    it("should set Feedback effect", () => {
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position: 0.3,
        strength: 0.8,
      });
      expect(controller.right.trigger.feedback.effect).toBe(TriggerEffect.Feedback);
      expect(controller.right.trigger.feedback.config).toEqual({
        effect: TriggerEffect.Feedback,
        position: 0.3,
        strength: 0.8,
      });
    });

    it("should set Weapon effect", () => {
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Weapon,
        start: 0.2,
        end: 0.6,
        strength: 0.9,
      });
      expect(controller.right.trigger.feedback.effect).toBe(TriggerEffect.Weapon);
    });

    it("should set Vibration effect with frequency", () => {
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Vibration,
        position: 0.1,
        amplitude: 0.7,
        frequency: 40,
      });
      expect(controller.right.trigger.feedback.effect).toBe(TriggerEffect.Vibration);
    });

    it("should reset to Off", () => {
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position: 0.3,
        strength: 0.8,
      });
      controller.right.trigger.feedback.reset();
      expect(controller.right.trigger.feedback.effect).toBe(TriggerEffect.Off);
    });

    it("should reset both triggers via resetTriggerFeedback", () => {
      controller.left.trigger.feedback.set({
        effect: TriggerEffect.Feedback,
        position: 0.5,
        strength: 1.0,
      });
      controller.right.trigger.feedback.set({
        effect: TriggerEffect.Weapon,
        start: 0.2,
        end: 0.6,
        strength: 0.9,
      });
      controller.resetTriggerFeedback();
      expect(controller.left.trigger.feedback.effect).toBe(TriggerEffect.Off);
      expect(controller.right.trigger.feedback.effect).toBe(TriggerEffect.Off);
    });
  });

  describe("Lights", () => {
    it("should set lightbar color", () => {
      controller.lightbar.set({ r: 255, g: 0, b: 128 });
      expect(controller.lightbar.color).toEqual({ r: 255, g: 0, b: 128 });
    });

    it("should set player LEDs with PlayerID", () => {
      controller.playerLeds.set(PlayerID.Player1);
      expect(controller.playerLeds.bitmask).toBe(PlayerID.Player1);
    });

    it("should toggle individual player LEDs", () => {
      controller.playerLeds.setLed(0, true);
      controller.playerLeds.setLed(4, true);
      expect(controller.playerLeds.getLed(0)).toBe(true);
      expect(controller.playerLeds.getLed(4)).toBe(true);
      expect(controller.playerLeds.getLed(2)).toBe(false);
    });

    it("should clear player LEDs", () => {
      controller.playerLeds.set(PlayerID.All);
      controller.playerLeds.clear();
      expect(controller.playerLeds.bitmask).toBe(0);
    });

    it("should set player LED brightness", () => {
      controller.playerLeds.setBrightness(Brightness.Medium);
      expect(controller.playerLeds.brightness).toBe(Brightness.Medium);
    });

    it("should set mute LED mode", () => {
      controller.mute.setLed(MuteLedMode.On);
      expect(controller.mute.ledMode).toBe(MuteLedMode.On);

      controller.mute.setLed(MuteLedMode.Pulse);
      expect(controller.mute.ledMode).toBe(MuteLedMode.Pulse);

      controller.mute.resetLed();
      expect(controller.mute.ledMode).toBeUndefined();
    });
  });

  describe("Audio Peripherals", () => {
    it("should expose headphone and microphone as Momentary inputs", () => {
      expect(controller.headphone).toBeInstanceOf(Momentary);
      expect(controller.microphone).toBeInstanceOf(Momentary);
      expect(controller.headphone.state).toBe(false);
      expect(controller.microphone.state).toBe(false);
    });

    it("should expose mute status", () => {
      expect(controller.mute.status).toBeInstanceOf(Momentary);
      expect(controller.mute.status.state).toBe(false);
    });
  });

  describe("Audio Control", () => {
    it("should set speaker, headphone, and microphone volume", () => {
      controller.audio.setSpeakerVolume(0.8);
      controller.audio.setHeadphoneVolume(0.5);
      controller.audio.setMicrophoneVolume(1.0);
      expect(controller.audio.speakerVolume).toBeCloseTo(0.8);
      expect(controller.audio.headphoneVolume).toBeCloseTo(0.5);
      expect(controller.audio.microphoneVolume).toBeCloseTo(1.0);
    });

    it("should set audio output routing", () => {
      controller.audio.setOutput(AudioOutput.Speaker);
      expect(controller.audio.output).toBe(AudioOutput.Speaker);

      controller.audio.setOutput(AudioOutput.Headphone);
      expect(controller.audio.output).toBe(AudioOutput.Headphone);

      controller.audio.setOutput(AudioOutput.Split);
      expect(controller.audio.output).toBe(AudioOutput.Split);
    });

    it("should mute and unmute per-output", () => {
      controller.audio.muteSpeaker(true);
      expect(controller.audio.speakerMuted).toBe(true);

      controller.audio.muteHeadphone(true);
      expect(controller.audio.headphoneMuted).toBe(true);

      controller.audio.muteMicrophone(true);
      expect(controller.audio.microphoneMuted).toBe(true);

      controller.audio.muteSpeaker(false);
      expect(controller.audio.speakerMuted).toBe(false);
    });

    it("should set microphone source and mode", () => {
      controller.audio.setMicSelect(MicSelect.Internal);
      controller.audio.setMicSelect(MicSelect.Headset);
      controller.audio.setMicMode(MicMode.Chat);
      // No assertion on internal state, just verify no errors
    });

    it("should set speaker preamp gain and beam forming", () => {
      controller.audio.setPreamp(4);
      expect(controller.audio.preampGain).toBe(4);

      controller.audio.setPreamp(2, true);
      expect(controller.audio.preampGain).toBe(2);
      expect(controller.audio.beamForming).toBe(true);
    });
  });

  describe("Color and Serial Number", () => {
    it("should expose color as DualsenseColor enum", () => {
      // With no HID connection, color defaults to Unknown
      expect(controller.color).toBe(DualsenseColor.Unknown);
    });

    it("should expose serial number", () => {
      expect(controller.serialNumber).toBe("unknown");
    });
  });

  describe("Firmware and Factory Info", () => {
    it("should expose firmwareInfo with defaults", () => {
      const fw = controller.firmwareInfo;
      expect(fw.buildDate).toBe("unknown");
      expect(fw.buildTime).toBe("unknown");
      expect(fw.mainFirmwareVersion).toEqual({ major: 0, minor: 0, patch: 0 });
    });

    it("should expose factoryInfo with defaults", () => {
      const fi = controller.factoryInfo;
      expect(fi.colorName).toBe("unknown");
      expect(fi.boardRevision).toBe("unknown");
      expect(fi.serialNumber).toBe("unknown");
    });
  });

  describe("Test Tones", () => {
    it("should expose startTestTone and stopTestTone methods", () => {
      expect(typeof controller.startTestTone).toBe("function");
      expect(typeof controller.stopTestTone).toBe("function");
    });

    it("should accept target and tone parameters", () => {
      // Verify the method signatures accept the documented parameters
      // (these will fail at the provider level with hid:null, but type-checking passes)
      expect(() => controller.startTestTone("speaker")).not.toThrow();
      expect(() => controller.startTestTone("headphone")).not.toThrow();
      expect(() => controller.startTestTone("speaker", "1khz")).not.toThrow();
      expect(() => controller.startTestTone("speaker", "100hz")).not.toThrow();
      expect(() => controller.startTestTone("headphone", "both")).not.toThrow();
    });
  });

  describe("Connection", () => {
    it("should expose connection as a Momentary input", () => {
      expect(controller.connection).toBeInstanceOf(Momentary);
    });

    it("should report wireless status", () => {
      expect(controller.wireless).toBe(false);
    });
  });
});
