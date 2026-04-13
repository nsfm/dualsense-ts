import { PowerSaveControl } from "./power_save";
import { PowerSave } from "../hid/command";

describe("PowerSaveControl", () => {
  it("should default to all subsystems enabled", () => {
    const ps = new PowerSaveControl();
    expect(ps.touch).toBe(true);
    expect(ps.motion).toBe(true);
    expect(ps.haptics).toBe(true);
    expect(ps.audio).toBe(true);
    expect(ps.hapticsMuted).toBe(false);
    expect(ps.flags).toBe(0);
  });

  it("should disable individual subsystems", () => {
    const ps = new PowerSaveControl();
    ps.touch = false;
    expect(ps.touch).toBe(false);
    expect(ps.flags & PowerSave.DisableTouch).toBeTruthy();
    expect(ps.motion).toBe(true);
  });

  it("should re-enable individual subsystems", () => {
    const ps = new PowerSaveControl();
    ps.motion = false;
    expect(ps.motion).toBe(false);
    ps.motion = true;
    expect(ps.motion).toBe(true);
    expect(ps.flags).toBe(0);
  });

  it("should mute haptics independently of disable", () => {
    const ps = new PowerSaveControl();
    ps.hapticsMuted = true;
    expect(ps.hapticsMuted).toBe(true);
    expect(ps.haptics).toBe(true);
    expect(ps.flags).toBe(PowerSave.MuteHaptics);
  });

  it("should compose multiple flags", () => {
    const ps = new PowerSaveControl();
    ps.touch = false;
    ps.motion = false;
    ps.hapticsMuted = true;
    expect(ps.flags).toBe(
      PowerSave.DisableTouch | PowerSave.DisableMotion | PowerSave.MuteHaptics,
    );
  });

  it("should bulk-set via set()", () => {
    const ps = new PowerSaveControl();
    ps.set({ touch: false, motion: false, audio: false });
    expect(ps.touch).toBe(false);
    expect(ps.motion).toBe(false);
    expect(ps.audio).toBe(false);
    expect(ps.haptics).toBe(true);
  });

  it("should only affect specified keys in set()", () => {
    const ps = new PowerSaveControl();
    ps.touch = false;
    ps.set({ motion: false });
    expect(ps.touch).toBe(false);
    expect(ps.motion).toBe(false);
  });

  it("should reset all to defaults", () => {
    const ps = new PowerSaveControl();
    ps.set({ touch: false, motion: false, haptics: false, audio: false, muteHaptics: true });
    ps.reset();
    expect(ps.flags).toBe(0);
    expect(ps.touch).toBe(true);
    expect(ps.hapticsMuted).toBe(false);
  });

  it("should produce a stable toKey for change detection", () => {
    const ps = new PowerSaveControl();
    const k1 = ps.toKey();
    ps.motion = false;
    const k2 = ps.toKey();
    expect(k1).not.toEqual(k2);
    ps.motion = true;
    expect(ps.toKey()).toEqual(k1);
  });
});
