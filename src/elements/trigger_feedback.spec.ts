import {
  TriggerFeedback,
  TriggerEffect,
  buildTriggerEffectBlock,
} from "./trigger_feedback";

describe("TriggerFeedback", () => {
  it("should default to Off", () => {
    const tf = new TriggerFeedback();
    expect(tf.effect).toEqual(TriggerEffect.Off);
  });

  it("should set and get config", () => {
    const tf = new TriggerFeedback();
    tf.set({ effect: TriggerEffect.Feedback, position: 0.5, strength: 0.5 });
    expect(tf.effect).toEqual(TriggerEffect.Feedback);
    expect(tf.config).toEqual({
      effect: TriggerEffect.Feedback,
      position: 0.5,
      strength: 0.5,
    });
  });

  it("should reset to Off", () => {
    const tf = new TriggerFeedback();
    tf.set({ effect: TriggerEffect.Feedback, position: 0.5, strength: 0.5 });
    tf.reset();
    expect(tf.effect).toEqual(TriggerEffect.Off);
  });

  it("should produce bytes via toBytes", () => {
    const tf = new TriggerFeedback();
    const bytes = tf.toBytes();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toEqual(11);
  });

  it("should produce a string key via toKey", () => {
    const tf = new TriggerFeedback();
    const key1 = tf.toKey();
    tf.set({ effect: TriggerEffect.Feedback, position: 0.5, strength: 0.5 });
    const key2 = tf.toKey();
    expect(key1).not.toEqual(key2);
  });
});

describe("buildTriggerEffectBlock", () => {
  it("should return 11 bytes", () => {
    const block = buildTriggerEffectBlock({ effect: TriggerEffect.Off });
    expect(block.length).toEqual(11);
  });

  it("should set mode 0x05 for Off", () => {
    const block = buildTriggerEffectBlock({ effect: TriggerEffect.Off });
    expect(block[0]).toEqual(0x05);
    for (let i = 1; i < 11; i++) {
      expect(block[i]).toEqual(0);
    }
  });

  it("should set mode 0x21 for Feedback", () => {
    const block = buildTriggerEffectBlock({
      effect: TriggerEffect.Feedback,
      position: 0.5,
      strength: 0.5,
    });
    expect(block[0]).toEqual(0x21);
    expect(block[1] | block[2]).not.toEqual(0);
  });

  it("should set mode 0x25 for Weapon", () => {
    const block = buildTriggerEffectBlock({
      effect: TriggerEffect.Weapon,
      start: 0.3,
      end: 0.7,
      strength: 0.5,
    });
    expect(block[0]).toEqual(0x25);
  });

  it("should set mode 0x26 for Vibration with frequency", () => {
    const block = buildTriggerEffectBlock({
      effect: TriggerEffect.Vibration,
      position: 0.5,
      amplitude: 0.5,
      frequency: 100,
    });
    expect(block[0]).toEqual(0x26);
    expect(block[9]).toEqual(100);
  });

  it("should set mode 0x27 for Machine", () => {
    const block = buildTriggerEffectBlock({
      effect: TriggerEffect.Machine,
      start: 0.2,
      end: 0.8,
      amplitudeA: 0.5,
      amplitudeB: 0.5,
      frequency: 50,
      period: 10,
    });
    expect(block[0]).toEqual(0x27);
  });
});
