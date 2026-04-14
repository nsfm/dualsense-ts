/**
 * DualSense Access Controller HID Report Maps
 *
 * Byte-level layout for USB and Bluetooth input/output reports.
 * Cross-referenced with titania C library (access_input_msg, access_output_msg)
 * and confirmed by physical testing.
 */

// ── Input Report ──

/**
 * USB Input Report 0x01 (64 bytes) / BT Input Report 0x31 (78 bytes)
 *
 * The Access input report has two regions:
 * - Shared header (bytes 0–15): DualSense-compatible mapped output
 * - Access-specific (bytes 16–55): raw buttons, raw stick, expansion ports, battery, profile
 *
 * BT offset: USB byte N → BT byte N+1 (one header byte, NOT +2 like DualSense)
 */
export const AccessInput = {
  /** BT 0x31 has 1 header byte after report ID (DualSense has 2) */
  BT_OFFSET: 1,

  // ── Shared header (bytes 0–15, DualSense-compatible) ──

  REPORT_ID: 0,
  /** Profile-mapped left stick X (0x80 center). May be unused depending on profile. */
  MAPPED_STICK_LX: 1,
  /** Profile-mapped left stick Y (0x80 center). May be unused depending on profile. */
  MAPPED_STICK_LY: 2,
  /** Profile-mapped right stick X (0x80 center). May be unused depending on profile. */
  MAPPED_STICK_RX: 3,
  /** Profile-mapped right stick Y (0x80 center). May be unused depending on profile. */
  MAPPED_STICK_RY: 4,
  /** Mapped L2 trigger (0x00–0xFF) */
  MAPPED_L2: 5,
  /** Mapped R2 trigger (0x00–0xFF) */
  MAPPED_R2: 6,
  /** Sequence counter (increments each report) */
  SEQ_COUNTER: 7,
  /** Lower nibble: hat direction (0-7 = N/NE/E/SE/S/SW/W/NW, 8 = null). Upper nibble: buttons. */
  HAT_BUTTONS: 8,
  /** Mapped buttons byte 2 */
  BUTTONS_2: 9,
  /** Mapped buttons byte 3 + vendor bits */
  BUTTONS_3: 10,
  /** Vendor byte (static) */
  VENDOR: 11,
  /** Firmware timestamp (uint32 LE, bytes 12–15) */
  TIMESTAMP: 12,

  // ── Access-specific section (bytes 16–55) ──

  /** Raw button byte 1: bits 0–7 = b1–b8 (physical buttons, profile-independent) */
  RAW_BUTTONS_1: 16,
  /** Raw button byte 2: bit 0 = center, bit 1 = stick click, bit 2 = PS, bit 3 = profile */
  RAW_BUTTONS_2: 17,
  /** Raw stick X before profile mapping (0x80 center) */
  RAW_STICK_X: 18,
  /** Raw stick Y before profile mapping (0x80 center) */
  RAW_STICK_Y: 19,
  /** Expansion port 1 X axis */
  E1_X: 20,
  /** Expansion port 1 Y axis */
  E1_Y: 21,
  /** Expansion port 2 X axis */
  E2_X: 22,
  /** Expansion port 2 Y axis */
  E2_Y: 23,
  /** Expansion port 3 X axis */
  E3_X: 24,
  /** Expansion port 3 Y axis */
  E3_Y: 25,
  /** Expansion port 4 X axis */
  E4_X: 26,
  /** Expansion port 4 Y axis */
  E4_Y: 27,

  /** Battery: lower nibble = level (0–10), upper nibble = charge status */
  BATTERY: 37,
  /** Profile ID (bits 0–2, values 1–3) + profile switching disabled (bit 3) */
  PROFILE: 40,
  /** Expansion port types: E3 (lower nibble), E4 (upper nibble) */
  PORT_TYPES_E3_E4: 41,
  /** Post-profile virtual left stick X (0x80 center) */
  VIRTUAL_STICK_1_X: 43,
  /** Post-profile virtual left stick Y (0x80 center) */
  VIRTUAL_STICK_1_Y: 44,
  /** Post-profile virtual right stick X (0x80 center) */
  VIRTUAL_STICK_2_X: 47,
  /** Post-profile virtual right stick Y (0x80 center) */
  VIRTUAL_STICK_2_Y: 48,
  /** Expansion port types: E1 (lower nibble), E2 (upper nibble) */
  PORT_TYPES_E1_E2: 49,
} as const;

/** Raw button bit masks for AccessInput.RAW_BUTTONS_1 */
export const AccessButton1 = {
  B1: 0x01,
  B2: 0x02,
  B3: 0x04,
  B4: 0x08,
  B5: 0x10,
  B6: 0x20,
  B7: 0x40,
  B8: 0x80,
} as const;

/** Raw button bit masks for AccessInput.RAW_BUTTONS_2 */
export const AccessButton2 = {
  CENTER: 0x01,
  STICK: 0x02,
  PS: 0x04,
  PROFILE: 0x08,
} as const;

/** Expansion port device types (4-bit nibble values) */
export enum AccessPortType {
  Disconnected = 0,
  Button = 1,
  Trigger = 2,
  Stick = 3,
}

// ── Output Report ──

/**
 * USB Output Report 0x02 (32 bytes) / BT Output Report 0x31 (78 bytes)
 *
 * BT offset: USB byte N → BT byte N+1
 * BT requires: report ID 0x31 at byte 0, constant 0x02 at byte 1, CRC32 at bytes 74–77
 */
export const AccessOutput = {
  /** BT output constant byte value at BT[1] */
  BT_CONSTANT: 0x02,

  // USB byte positions (add +1 for BT)

  /** Report ID: 0x02 for USB, 0x31 for BT */
  REPORT_ID_USB: 0x02,
  REPORT_ID_BT: 0x31,
  /** Mutator flags (scope A). Controls which subsystems are updated. */
  MUTATOR: 1,
  /** Scope B flags. Required for lightbar over BT (bit 2). */
  SCOPE_B: 2,
  /** Player indicator pattern (0–4). Requires mutator bit 4. */
  PLAYER_INDICATOR: 5,
  /** Lightbar Red (0x00–0xFF). Requires mutator bit 2 + scope B bit 2 over BT. */
  LIGHTBAR_R: 6,
  /** Lightbar Green (0x00–0xFF) */
  LIGHTBAR_G: 7,
  /** Lightbar Blue (0x00–0xFF) */
  LIGHTBAR_B: 8,
  /** Control field. Requires mutator bit 5. */
  CONTROL: 9,
  /** Control2 field (2 bytes). Requires mutator bit 6. */
  CONTROL2: 10,
  /** LED flags 1: bit 0 = profile enable, bit 1 = profile mute, bit 4 = status LED command enable */
  LED_FLAGS_1: 12,
  /** LED flags 2 / Profile LED mode: 0=off, 1=on, 2=fade, 3=sweep */
  LED_FLAGS_2: 13,
  /** Status LED value: 0=off, 1=on. Also requires LED_FLAGS_1 bit 4. */
  STATUS_LED: 23,

  /** USB output report size (including report ID) */
  USB_SIZE: 32,
  /** BT output report size (including report ID and CRC) */
  BT_SIZE: 78,
  /** BT CRC position (bytes 74–77, little-endian) */
  BT_CRC_OFFSET: 74,
} as const;

/** Output mutator flag bits (AccessOutput.MUTATOR byte) */
export const AccessMutator = {
  /** Profile LEDs + Status LED (LED flags bytes 12–13, status LED byte 23) */
  STATUS_LED: 0x01,
  /** Profile indicator LED (titania naming, overlaps with STATUS_LED) */
  PROFILE_LED: 0x02,
  /** Lightbar RGB (bytes 6–8) + Player indicator (byte 5). Over BT, also needs SCOPE_B_LED. */
  LED: 0x04,
  /** Reset all LEDs to default */
  RESET_LED: 0x08,
  /** Player indicator LED (byte 5) */
  PLAYER_INDICATOR_LED: 0x10,
  /** Control field (byte 9) */
  CONTROL: 0x20,
  /** Control2 field (bytes 10–11) */
  CONTROL2: 0x40,

  /** Combined: all LED subsystems */
  ALL_LEDS: 0x15, // STATUS_LED | LED | PLAYER_INDICATOR_LED
} as const;

/** Scope B flag bits (AccessOutput.SCOPE_B byte) — needed for BT output */
export const AccessScopeB = {
  /** Required for lightbar RGB over BT (both this AND AccessMutator.LED must be set) */
  LED: 0x04,
} as const;

/** LED flags 1 bit definitions (AccessOutput.LED_FLAGS_1 byte) */
export const AccessLedFlags1 = {
  /** Enable profile LEDs */
  PROFILE_ENABLE: 0x01,
  /** Mute/disable profile LEDs (overrides PROFILE_ENABLE) */
  PROFILE_MUTE: 0x02,
  /** Enable status LED command (must be set for status LED on OR off) */
  STATUS_LED_ENABLE: 0x10,

  /** Common: profile on + status LED command enabled */
  PROFILE_AND_STATUS: 0x11,
} as const;

/** Profile LED animation modes (AccessOutput.LED_FLAGS_2 byte) */
export enum AccessProfileLedMode {
  Off = 0,
  On = 1,
  Fade = 2,
  Sweep = 3,
}

/** Player indicator patterns (AccessOutput.PLAYER_INDICATOR byte) */
export enum AccessPlayerIndicator {
  Off = 0,
  /** S (1 segment) */
  Player1 = 1,
  /** S + N (2 segments) */
  Player2 = 2,
  /** S + NE + NW (3 segments) */
  Player3 = 3,
  /** N + S + E + W (cross, 4 segments) */
  Player4 = 4,
}
