import {
  AudioOutput,
  MicSelect,
  MicFlag,
  MicMode,
  PlayerID,
  Brightness,
  MuteLedMode,
  PulseOptions,
} from "./command";

describe("AudioOutput", () => {
  it("has correct values", () => {
    expect(AudioOutput.Headphone).toBe(0x00);
    expect(AudioOutput.HeadphoneMono).toBe(0x10);
    expect(AudioOutput.Split).toBe(0x20);
    expect(AudioOutput.Speaker).toBe(0x30);
  });
});

describe("MicSelect", () => {
  it("has correct values", () => {
    expect(MicSelect.Internal).toBe(0x01);
    expect(MicSelect.Headset).toBe(0x02);
  });
});

describe("MicFlag", () => {
  it("has correct values", () => {
    expect(MicFlag.EchoCancellation).toBe(0x04);
    expect(MicFlag.NoiseCancellation).toBe(0x08);
  });
});

describe("MicMode", () => {
  it("has correct values", () => {
    expect(MicMode.Default).toBe(0x00);
    expect(MicMode.Chat).toBe(0x40);
    expect(MicMode.ASR).toBe(0x80);
  });
});

describe("PlayerID", () => {
  it("has correct values", () => {
    expect(PlayerID.Player1).toBe(4);
    expect(PlayerID.Player2).toBe(10);
    expect(PlayerID.Player3).toBe(21);
    expect(PlayerID.Player4).toBe(27);
    expect(PlayerID.All).toBe(31);
  });
});

describe("Brightness", () => {
  it("has correct values", () => {
    expect(Brightness.High).toBe(0x0);
    expect(Brightness.Medium).toBe(0x1);
    expect(Brightness.Low).toBe(0x2);
  });
});

describe("MuteLedMode", () => {
  it("has correct values", () => {
    expect(MuteLedMode.Off).toBe(0);
    expect(MuteLedMode.On).toBe(1);
    expect(MuteLedMode.Pulse).toBe(2);
  });
});

describe("PulseOptions", () => {
  it("has correct values", () => {
    expect(PulseOptions.Off).toBe(0x0);
    expect(PulseOptions.FadeBlue).toBe(0x1);
    expect(PulseOptions.FadeOut).toBe(0x2);
  });
});
