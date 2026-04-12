/**
 * DualSense DSP test command definitions (Feature Report 0x80 / 0x81).
 *
 * The controller contains a MediaTek Spider DSP and Realtek ALC5524 audio
 * codec paired with an ALC1016 Class-D speaker amplifier. Factory test
 * commands are sent via Feature Report 0x80 and responses read from 0x81.
 * The report format is:
 *
 *   0x80: [deviceId, actionId, ...params]
 *   0x81: [0x81, deviceId, actionId, status, ...resultData]
 *
 * For Bluetooth, the HID provider appends a CRC-32 checksum automatically.
 *
 * ## Probing results (firmware 0001_0006, codec built 2020-08-18)
 *
 * Only three Audio actions return data:
 *   - ReadCodecFwInfo (3): returns version + build timestamp
 *   - ReadSpeakerFixedGain (10): returns current gain (all zeros if unset)
 *   - CodecRegRead (129): returns 0xDEADBEEF for all addresses (bridge not exposed)
 *
 * All other Audio actions are write-only or unimplemented (return Idle/no response).
 *
 * Device ID sweep (action 0, IDs 0–31):
 *   - BtPatch (14): responds with empty data
 *   - DspFirmware (15): responds with 0x80 (version/status)
 *   - SpiderDspFirmware (16): responds with 0x80 (version/status)
 *   - All other devices: no response to action 0
 */

/** DSP device IDs for Feature Report 0x80 commands */
export enum DspDevice {
  System = 1,
  Power = 2,
  Memory = 3,
  AnalogData = 4,
  Touch = 5,
  /** Audio DSP — test tone, codec, mic calibration */
  Audio = 6,
  AdaptiveTrigger = 7,
  Bullet = 8,
  Bluetooth = 9,
  Motion = 10,
  Trigger = 11,
  Stick = 12,
  Led = 13,
  /** Responds to action 0 with empty data */
  BtPatch = 14,
  /** Responds to action 0 with 0x80 (version/status byte) */
  DspFirmware = 15,
  /** Responds to action 0 with 0x80 (version/status byte) */
  SpiderDspFirmware = 16,
  Finger = 17,
  PositionTracking = 19,
  BuiltinMicCalibData = 20,
}

/** Action IDs for Audio device (DspDevice.Audio = 6) */
export enum AudioAction {
  /**
   * Start or stop DSP waveform. Params: [start(0|1), tone1, tone2]
   *
   *   byte[0]: 1 = start, 0 = stop
   *   byte[1]: 1 = enable ~1kHz sine wave, 0 = disable
   *   byte[2]: 1 = enable lower-frequency sine wave, 0 = disable
   *
   * Both tones can play simultaneously ([1, 1, 1]).
   * No other byte values (0–255) produce additional tones.
   * Write-only — returns no response data.
   */
  WaveoutCtrl = 2,
  /**
   * Read codec (ALC5524) firmware info.
   * Returns 60 bytes: version fields + ASCII build timestamp (e.g. "20200818152054").
   */
  ReadCodecFwInfo = 3,
  /**
   * Configure output routing before waveout. 20-byte params:
   *
   *   Speaker:   params[2] = 8
   *   Headphone: params[4] = 4, params[6] = 6
   *   All other bytes: zero in reference impl, no effect found in sweep (0–10).
   *
   * Write-only — returns no response data.
   */
  SetPathSelector = 4,
  /** Speaker compensation (EQ/filter). Write-only. */
  SpeakerComp = 5,
  /** Configure noise cancellation algorithm. Write-only. */
  SetNoiseCancellerType = 6,
  /** Set microphone gain level. Write-only. */
  SetMicGain = 7,
  /** Set a fixed speaker gain value. Write-only. */
  SetSpeakerFixedGain = 8,
  /** Write/persist speaker gain to NVS. Write-only. */
  WriteSpeakerFixedGain = 9,
  /** Read current speaker fixed gain. Returns gain value (all zeros if unset). */
  ReadSpeakerFixedGain = 10,
  /** Trial mic calibration gain. Write-only. */
  TryMicCalibGain = 11,
  /** Set compensation status. Write-only. */
  SetCompStatus = 12,
  /** Get compensation status. No response observed — may require prior SetCompStatus. */
  GetCompStatus = 13,
  /** Execute forced compensation. Write-only. */
  ExecForceComp = 14,
  /** Set auto-calibration status. Write-only. */
  SetAutoCalibStatus = 15,
  /** Get auto-calibration status. No response observed — may require prior SetAutoCalibStatus. */
  GetAutoCalibStatus = 16,
  /**
   * Direct register write to ALC5524 codec. Write-only.
   * Params: [addrHi, addrLo, ...data]
   */
  CodecRegWrite = 128,
  /**
   * Direct register read from ALC5524 codec.
   * Params: [addrHi, addrLo]
   * Returns 0xDEADBEEF for all tested addresses (0x0000–0x03FF, 0xFA00–0xFAFF).
   * The register bridge appears to be disabled in production firmware.
   */
  CodecRegRead = 129,
}

/** DSP test response status codes (byte 3 of Feature Report 0x81) */
export enum DspStatus {
  Idle = 0,
  Running = 1,
  Complete = 2,
  /** Multi-part response — more data follows */
  CompleteMulti = 3,
  Timeout = 255,
}
