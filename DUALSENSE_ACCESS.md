# DualSense Access Controller Support

Technical investigation and implementation proposal for adding Sony DualSense Access (CFI-ZCA1, USB `054c:0e5f`) support to `dualsense-ts`.

## Executive Summary

The Access controller shares a **compatible HID input header** (bytes 0–10) with the standard DualSense for post-profile mapped sticks, triggers, and buttons. Beyond that, the input report diverges completely — the Access-specific vendor section (bytes 11–55) contains raw physical buttons, expansion port axes and types, battery, profile state, and pre/post-profile virtual sticks. The output report (32 bytes vs 48/64) is a **completely different struct** from the DualSense — it has its own mutator flags, LED brightness controls, and center button indicator, with no rumble, triggers, lightbar, or audio fields. Profile read/write/delete uses Feature Reports 0x60/0x61 with an 18-chunk transfer protocol (956 bytes per profile, CRC32 with seed 0x53). Protocol details cross-referenced with the [titania](https://sr.ht/~chronovore/titania/) C library (the only other open-source Access implementation) and [jfedor's profile editor](https://www.jfedor.org/ps-access/).

---

## 1. Hardware Overview

### Physical Layout
- **One analog stick** (center, clickable) — reports on X/Y axes (bytes 1–2)
- **Multiple face buttons** — remappable, up to 15 in the HID descriptor (hat switch + 15 buttons)
- **No traditional D-pad** — hat switch in HID report may be mapped to button combinations or expansion
- **No touchpad**
- **No gyroscope or accelerometer** (confirmed: no Feature Report 0x05 for IMU calibration)
- **No physical triggers** — HID descriptor declares L2/R2 axes (bytes 5–6) but the controller has no physical triggers; these are mapped from expansion port trigger devices or button assignments
- **No rumble/haptic motors** — output report accepts rumble bytes without error but the controller has no vibration hardware (confirmed by online sources; longer ~9hr battery life as a result)
- **8 remappable ring buttons** — arranged around the outer edge of the circular body
- **1 center button** — on the hat, which also houses player indicator LEDs, lightbar, and status LED
- **Profile button** — switches between up to 3 stored controller profiles
- **PS button** (non-remappable)
- **4 LED systems**: Lightbar (RGB ring around hat), Profile LEDs (3 white LEDs next to profile button), Player Indicator (6-segment pattern on hat), Status LED (small white light on hat towards joystick) — all controllable via output report, none light without host commands on PC
- **Bluetooth 5.1** wireless + USB-C wired
- **~9 hour battery** (longer than DualSense due to no haptics/triggers/speaker)
- Ships with **19 interchangeable button caps** and **3 stick caps**

### E1–E4 Expansion Ports

The four 3.5mm jacks labeled E1–E4 are **expansion ports for accessory input modules**, not headphone jacks. Per the official [Sony Expansion Port Specifications](https://www.playstation.com/en-us/accessories/access-controller/) (v1.00, August 2023), three device types can connect:

| Device Type | Connector | Signals | Description |
|---|---|---|---|
| **Button** | 2-contact 3.5mm (TS) | Tip = digital input, Sleeve = Vdd/2 | Simple ON/OFF switch. Contact resistance <10Ω, insulation >1MΩ. HIGH >0.75V (pressed), LOW <0.3V (released). |
| **Trigger** | 4-contact 3.5mm (TRRS) | Tip = analog input, R1 = NC, R2 = GND, Sleeve = Vdd | Single-axis potentiometer (10k ± 3k Ω). Analog voltage range: ≤0.5V (released) to ≥0.8V (pressed). |
| **Stick** | 4-contact 3.5mm (TRRS) | Tip = Y-axis, R1 = X-axis, R2 = GND, Sleeve = Vdd | Dual-axis potentiometer (10k ± 3k Ω each). Midpoint 0.8–1.0V; extremes ≤0.6V / ≥1.2V. |

**Key details from the spec:**
- **Vdd = 1.8V** (supply voltage for all expansion devices)
- **No power supply** through expansion ports — all devices are passive analog
- **5-contact jack** internally: S (Sleeve), DET (detect), T (Tip), R1 (Ring1), R2 (Ring2). For 2-pole button plugs, R1/R2/S all connect to the plug's Sleeve, producing Vdd/2.
- **Device detection** uses voltage levels on the DET pin and R1 terminal to distinguish the three device types. The MCU reads ADC values on DET and R1 at connection time.
- **Internal pull resistors**: R3=100kΩ (Vdd→DET), R5=100kΩ (T→GND), R4=100kΩ (R1→GND), R1=1kΩ (to jack T), R2=1kΩ (to jack R2)
- **No capacitors or Zener diodes** allowed on the T or R1 terminals of trigger/stick devices
- **Standard 10kΩ joysticks confirmed working** as expansion stick devices (~190 yen/each per Japanese hobbyist testing)

The HID report reserves analog axis bytes at offsets 18–19, 28, 32, 43–44, 47–48 (all idle at 0x80 = centered), likely corresponding to expansion port analog inputs. With a stick module, these report X/Y; with a trigger module, a single axis changes; with a button module, a digital state is reflected (probably via the button bits, not analog axes).

### USB Identification
- **Vendor ID**: 0x054C (Sony Interactive Entertainment)
- **Product ID**: 0x0E5F (distinct from standard DualSense 0x0CE6)
- **Device name**: "Sony Interactive Entertainment Access Controller"
- **USB speed**: High Speed (480 Mbps)
- **Driver**: `hid-generic` (Linux `hid-playstation` does not yet claim this device)
- **Single HID interface** (vs standard DualSense which has 4: 2 HID + 2 Audio)
- **No audio interfaces** — no built-in speaker or microphone
- **EP interval**: 6 (0.75ms at High Speed) vs DualSense's 4 (0.5ms)
- **No serial number** (iSerial = 0; identity relies on Feature Report 0x09 MAC address)

### Bluetooth Connection
- **Bluetooth 5.1** — pairs via PS + Profile buttons held while turning on (different from DualSense which uses PS + Create)
- **Pairing mode**: Hold PS + Profile simultaneously when powering on
- **BT device name**: "Access Controller"
- **BT class**: 0x00002508 (gamepad)
- **BT profiles**: HID (0x1124), PnP Information (0x1200)
- **Modalias**: `usb:v054Cp0E5Fd0100`
- **Linux driver**: `hid-generic` (bus type 0005 for BT, same as USB)
- **BlueZ bonding issue**: BlueZ's input plugin requires bonded devices by default (`ClassicBondedOnly=true` in `/etc/bluetooth/input.conf`). The Access controller pairs but does NOT bond with BlueZ, causing `hidp_add_connection() Rejected connection from !bonded device`. **Workaround**: Set `ClassicBondedOnly=false` under `[General]` in `/etc/bluetooth/input.conf` and restart `bluetooth.service`. This is a BlueZ-specific issue — Windows and macOS handle pairing+bonding together seamlessly. The `hidp` kernel module must also be loaded (`modprobe hidp`).

---

## 2. HID Report Analysis

### Input Report (Report ID 0x01, 64 bytes)

The input report shares byte-level layout compatibility with the DualSense for the first 16 bytes (shared header). The DualSense and Access use a union starting at byte 16 — DualSense has sensors/touchpad/device state, Access has raw buttons, expansion ports, and profile state.

#### Shared Header (bytes 0–15, identical to DualSense)

| Offset | Size | DualSense USB | Access Controller | Match? |
|--------|------|---------------|-------------------|--------|
| 0 | 1 | Report ID (0x01) | Report ID (0x01) | Exact |
| 1 | 1 | Left Stick X | Stick X (mapped) | Exact |
| 2 | 1 | Left Stick Y | Stick Y (mapped) | Exact |
| 3 | 1 | Right Stick X | Stick 2 X (mapped, via profile) | Exact layout |
| 4 | 1 | Right Stick Y | Stick 2 Y (mapped, via profile) | Exact layout |
| 5 | 1 | L2 Trigger | L2 Trigger (mapped) | Exact |
| 6 | 1 | R2 Trigger | R2 Trigger (mapped) | Exact |
| 7 | 1 | Sequence counter | Sequence counter | Exact |
| 8 | 1 | Hat(lo) + Buttons(hi) | Hat(lo) + Buttons(hi) | Same format |
| 9 | 1 | Buttons byte 2 | Buttons byte 2 | Same format |
| 10 | 1 | Buttons byte 3 | Buttons byte 3 + vendor bits | Same format |
| 11 | 1 | Vendor byte | Vendor byte (static) | Same |
| 12–15 | 4 | Firmware timestamp (uint32 LE) | Firmware timestamp (uint32 LE) | Exact |

**Correction (validated by physical testing):** The shared header extends to byte 15, not byte 10. Byte 11 is a static vendor byte. Bytes 12–15 are a continuously incrementing firmware timestamp (uint32 LE). The Access-specific union starts at byte 16. This was confirmed by observing that bytes 12–14 change independently of user input on every read, consistent with a timestamp counter, while byte 11 remains constant.

#### Access-Specific Bytes (16–55)

Cross-referenced with the [titania](https://sr.ht/~chronovore/titania/) C library's `access_input_msg` packed struct and validated by physical button mapping:

| Offset | Size | Content | Notes |
|--------|------|---------|-------|
| 16–17 | 2 | **Raw buttons** (bitfield) | Pre-profile physical button state (see below) |
| 18–19 | 2 | **Raw stick** X, Y | Pre-profile hardware stick position (uint8 each, 0x80 center) |
| 20–21 | 2 | **Extension 1** X, Y | E1 port analog position (uint8 each) |
| 22–23 | 2 | **Extension 2** X, Y | E2 port analog position |
| 24–25 | 2 | **Extension 3** X, Y | E3 port analog position |
| 26–27 | 2 | **Extension 4** X, Y | E4 port analog position |
| 28–31 | 4 | Unknown 1 | Idle: `80 00 00 00` — possibly mapped buttons or DualSense-compat state |
| 32–35 | 4 | Unknown 2 | Idle: `80 00 00 00` — same pattern as unknown 1 |
| 36 | 1 | Unknown 3 | `00` |
| 37 | 1 | **Battery** | Same nibble encoding as DualSense (lower=level, upper=state) |
| 38–39 | 2 | Unknown 4 | Flags? Observed `06 00` |
| 40 | 1 | **Profile ID** (bits 0–2) + **profile switching disabled** (bit 3) + unknown (bits 4–7) | Profile ID 1–3 directly (NOT 0-indexed), confirmed by physical testing |
| 41 | 1 | **E3/E4 port types** | Lower 4 bits = E3 type, upper 4 bits = E4 type |
| 42 | 1 | Unknown 6 | Observed `0x15` (varies) |
| 43–44 | 2 | **Post-profile stick 1** X, Y | Virtual left stick after profile mapping (0x80 center) |
| 45–46 | 2 | Unknown / padding | |
| 47–48 | 2 | **Post-profile stick 2** X, Y | Virtual right stick after profile mapping (0x80 center) |
| 49 | 1 | **E1/E2 port types** | Lower 4 bits = E1 type, upper 4 bits = E2 type |
| 50–54 | 5 | Unknown 9/10 | `00` |
| 55 | 1 | Reserved | |
| 56–63 | 8 | Timestamp/CRC (varies each frame) | USB: vendor timestamp; BT: CRC32 in last 4 bytes |

#### Raw Button Bitfield (bytes 16–17)

The 2-byte raw button bitfield reports **physical button presses before profile mapping**. Validated by physical testing — each button sets exactly one bit:

| Bit | Button | Description |
|-----|--------|-------------|
| 0 | button1 | Physical ring button 1 (counter-clockwise numbering on device) |
| 1 | button2 | Physical ring button 2 |
| 2 | button3 | Physical ring button 3 |
| 3 | button4 | Physical ring button 4 |
| 4 | button5 | Physical ring button 5 |
| 5 | button6 | Physical ring button 6 |
| 6 | button7 | Physical ring button 7 |
| 7 | button8 | Physical ring button 8 |
| 8 | center_button | Center (round) button |
| 9 | stick_button | Stick press (L3 equivalent) |
| 10 | playstation | PS button |
| 11 | profile | Profile cycle button |
| 12–15 | reserved | |

This is distinct from bytes 8–10 which report **post-profile mapped buttons** in DualSense-compatible format.

#### Expansion Port Type Values (runtime, from input report)

| Value | Type |
|-------|------|
| 0 | Disconnected |
| 1 | Button |
| 2 | Trigger (analog) |
| 3 | Stick (dual-axis) |
| 4 | Invalid |

#### Pre-Profile vs Post-Profile Input

The Access controller reports input at **two levels**:

1. **Raw/pre-profile** (bytes 11–22): Physical button presses and raw stick/extension positions exactly as the hardware sees them, before any profile remapping
2. **Mapped/post-profile** (bytes 1–10, 38–42): Virtual DualSense-compatible buttons, sticks, and triggers after the active profile's button mapping, stick assignment, and orientation are applied

This dual-reporting means a library can offer both raw hardware access (for custom remapping) and the controller's own profile-based output.

#### Confirmed idle byte values (50-frame capture)

**Axis bytes (centered at 0x80):** 1, 2, 3, 4, 18, 19, 28, 32, 43, 44, 47, 48

**Counters:**
- Byte 7: Primary sequence counter (same as DualSense)
- Byte 12: Secondary counter (increments by 1 per frame)

**Status bytes (constant during idle but differ between sessions):**
- Byte 13: 0x84 (likely battery/charge state — varied across captures)
- Byte 14: 0xCD
- Byte 15: 0x0E
- Byte 37: 0x15 (varied across captures, possibly expansion port status)
- Byte 38: 0x06
- Byte 40: 0x03
- Byte 42: 0x01 (possibly active profile number)

**Trailing CRC/timestamp:** Bytes 56–63 vary wildly per frame

### HID Descriptor Summary

```
Usage Page: Generic Desktop
Usage: Game Pad
Collection (Application)
  Report ID 0x01 (Input):
    6 × 8-bit axes: X, Y, Z, Rz, Rx, Ry          [6 bytes]
    1 × 8-bit vendor byte                          [1 byte]
    1 × 4-bit hat switch (8 positions + null)       [4 bits]
    15 × 1-bit buttons                              [15 bits]
    13 × 1-bit vendor padding                       [13 bits]
    52 × 8-bit vendor data                          [52 bytes]
    Total: 63 bytes + Report ID = 64 bytes

  Report ID 0x02 (Output):
    31 bytes vendor data                            [31 bytes + Report ID = 32 bytes]
    NOTE: DualSense uses 47 bytes (48 total)

  Feature Reports: 0x09, 0x20, 0x22, 0x61, 0x81, 0x83, 0x85, 0xe0, 0xf1, 0xf2, 0xf5
  Feature Reports (error on read): 0x08, 0x0a, 0x60, 0x80, 0x82, 0x84, 0xa0, 0xf0, 0xf4
```

### Output Report (Report ID 0x02, 32 bytes)

The Access output report is **NOT a truncated DualSense common section**. The [titania](https://sr.ht/~chronovore/titania/) library's `access_output_msg` struct reveals a completely different layout with its own mutator flags, LED control, and control fields. Confirmed by `static_assert(sizeof(access_output_msg) == 0x20)` (32 bytes).

| Byte | Size | Content | Notes |
|------|------|---------|-------|
| 0 | 1 | Report ID (0x02) | Same as DualSense |
| 1–2 | 2 | **Mutator flags** (bitfield) | Controls which fields are active (see below) |
| 3–4 | 2 | **Unknown** | Part of `dualsense_led_output` — no visible effect in testing |
| 5 | 1 | **Player indicator pattern** | Segment count 0–4 (requires mutator bit 4, `player_indicator_led`) |
| 6 | 1 | **Lightbar Red** | 0x00–0xFF, requires mutator bit 2 (`led`) |
| 7 | 1 | **Lightbar Green** | 0x00–0xFF, requires mutator bit 2 (`led`) |
| 8 | 1 | **Lightbar Blue** | 0x00–0xFF, requires mutator bit 2 (`led`) |
| 9 | 1 | **Control** | Requires mutator `control` bit set |
| 10–11 | 2 | **Control2** | Requires mutator `control2` bit set |
| 12 | 1 | **LED flags 1** | Profile LED enable/disable + Status LED enable (see below) |
| 13 | 1 | **LED flags 2** | Profile LED mode (see below) |
| 14–22 | 9 | Unknown | Always zero in testing |
| 23 | 1 | **show_center_indicator** | Required for Status LED (see below) |
| 24–31 | 8 | Reserved | |

#### Access Mutator Flags (bytes 1–2)

Unlike DualSense's rumble/haptics/trigger/audio mutator bits, the Access has a stripped-down set:

| Bit | Name | Enables |
|-----|------|---------|
| 0 | status_led | Profile LEDs + Status LED (LED flags bytes 12–13) |
| 1 | profile_led | Profile indicator LED (titania naming — overlaps with bit 0 in practice) |
| 2 | led | Lightbar RGB (bytes 6–8) + Player indicator (byte 5) |
| 3 | reset_led | Reset all LEDs to default |
| 4 | player_indicator_led | Player indicator LED (byte 5) |
| 5 | control | Control field (byte 9) |
| 6 | control2 | Control2 field (bytes 10–11) |
| 7 | unknown | |
| 8–15 | reserved | |

#### LED Flags (bytes 12–13)

| Bits | Content |
|------|---------|
| 12.0 | Profile LED enable |
| 12.1 | Profile LED disable (overrides bit 0 — acts as mute) |
| 12.2–12.3 | Unknown (no visible effect) |
| 12.4 | Status LED enable |
| 12.5–12.7 | Unknown (no brightness effect observed) |
| 13.0–13.7 | Profile LED mode (see below) |

#### Confirmed LED Control (Physical Testing)

The Access controller has **4 independent LED systems**, each controlled by different mutator bits and output bytes. Each system persists independently — sending a command to one system does not reset the others.

**Lightbar LEDs** (RGB lighting around the hat):
- Byte 6 = Red, Byte 7 = Green, Byte 8 = Blue (0x00–0xFF each)
- Enable: mutator bit 2 (`led`, 0x04)
- Reset: mutator bit 3 (`reset_led`, 0x08) turns all LEDs off
- Profile-independent: color does not change when switching profiles
- **BT note**: Over Bluetooth, lightbar requires **scope B bit 2** (byte 2 = 0x04) in addition to mutator bit 2. See "Bluetooth Output Report" section.
- Example: `[0x02, 0x04, 0, 0, 0, 0, 0xFF, 0x00, 0x00, ...]` = red lightbar

**Profile LEDs** (3 LEDs next to profile button):
- Enable: mutator bit 0 (`status_led`, 0x01) + byte 12 bit 0 set + byte 13 mode
- Byte 12 bit 0 = enable, bit 1 = disable/mute (overrides enable)
- Byte 13 = display mode:
  - 0 = off
  - 1 = instant on
  - 2 = fade in
  - 3 = sweep animation (bounces up and down, then settles)
  - 4+ = no effect
- **LED count always matches active profile** (profile 1 = 1 LED, profile 2 = 2 LEDs, profile 3 = 3 LEDs). The host cannot select how many LEDs to light — only trigger the display and choose the animation mode.
- No brightness control found (byte 12 bits 2-3 had no visible effect)
- Example: `[0x02, 0x01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01, 0x01, ...]` = show profile LEDs (instant)
- Example: `[0x02, 0x01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01, 0x03, ...]` = sweep animation

**Player Indicator LEDs** (6-segment pattern on hat — N, S, E, W, NE, NW):
- Byte 5 = player number (0–4), NOT a bitmask — firmware selects a predefined pattern per value
- Enable: mutator bit 4 (`player_indicator_led`, 0x10)
- Patterns:
  - 0 = off
  - 1 = S (1 segment)
  - 2 = S + N (2 segments)
  - 3 = S + NE + NW (3 segments)
  - 4 = N + S + E + W (cross, 4 segments)
  - 5+ = off (patterns repeat/wrap at higher values but no new segments)
- No SE/SW segments exist on the hardware (exhaustive 0–255 sweep confirmed)
- No brightness control (bytes 3–4 had no effect as modifiers)
- No custom bitmask patterns — unlike DualSense's 5-bit PlayerID bitmask, the Access firmware only accepts player number 0–4
- This is the Access equivalent of DualSense's 5-LED player indicator bar
- Example: `[0x02, 0x10, 0, 0, 0, 0x04, ...]` = full cross pattern

**Status LED** (small white light on hat, offset towards joystick):
- Enable: byte 12 bit 4 (0x10) + byte 23 = 1 (center_indicator). **Both** required — neither alone works.
- Any mutator bit works as the command enable (0x01, 0x02, 0x04, 0x10 all tested)
- No brightness control found (byte 12 bits 5-7 had no visible effect)
- White only (no color control)
- **Possible second status LED**: A physical spot is visible between the known status LED and the south player indicator segment. Not yet investigated — may be controlled by an undiscovered byte or may be hardware-only (manufacturing indicator).
- Example: `[0x02, 0x01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10, 0, ..., 0x01(byte 23)]` = status LED on

**Combined LED output**: All 4 systems can be active simultaneously using combined mutator bits. Example with all systems on:
```
byte 1 = 0x15 (status_led | led | player_indicator_led)
byte 5 = 0x04 (player indicator: cross)
byte 6-8 = R, G, B (lightbar color)
byte 12 = 0x11 (profile LED enable + status LED enable)
byte 13 = 0x01 (profile LED mode: instant)
byte 23 = 0x01 (status LED center indicator)
```

#### What the Access Output Report Does NOT Have

No rumble, no adaptive triggers, no audio control, no haptic filter, no microphone/speaker volume, no powersave control. The DualSense valid_flag0/valid_flag1 bit definitions do NOT apply.

**⚠ Warning**: titania notes that setting `override_profile` in the control field "bricks profiles" — this bit should not be used.

#### DualSense Output Comparison

| Feature | DualSense (48 bytes) | DualSense Edge (64 bytes) | Access (32 bytes) |
|---------|---------------------|--------------------------|-------------------|
| Rumble motors | ✅ 2 bytes | ✅ 2 bytes | ❌ |
| Adaptive triggers | ✅ 22 bytes | ✅ 22 bytes | ❌ |
| Lightbar RGB | ✅ 3 bytes | ✅ 3 bytes | ❌ |
| Player LEDs | ✅ 1 byte | ✅ 1 byte | ❌ |
| Mute LED | ✅ 1 byte | ✅ 1 byte | ❌ (center LED instead) |
| Audio control | ✅ 4 bytes | ✅ 4 bytes | ❌ |
| Lightbar RGB | ❌ | ❌ | ✅ bytes 6/7/8 = R/G/B |
| Profile LEDs | ❌ | ❌ | ✅ 3 LEDs, count = active profile |
| Player Indicator | ✅ 5-LED bar (byte 44) | ✅ 5-LED bar | ✅ 6-segment cross (byte 5) |
| Status LED | ❌ | ❌ | ✅ LED flags + center_indicator |

### Feature Reports

| Report | Size | DualSense | Access | Content |
|--------|------|-----------|--------|---------|
| 0x05 | 41 | IMU calibration | **Missing** | Access has no IMU |
| 0x09 | 20 | BT MAC address | BT MAC address | `8c:30:6d:49:18:10` confirmed |
| 0x20 | 64 | Firmware info | Firmware info | Build date: "Jun 22 2023 16:23:47" |
| 0x22 | 64 | — | FW version + MAC | Access-specific device info |
| 0x60 | 64 | — | Command register | Profile read/write commands (see Section 4) |
| 0x61 | 64 | — | Response register | Profile data response (see Section 4) |
| 0x80 | 64 | Test command TX | Error on read | May need write-first protocol |
| 0x81 | 64 | Test command RX | All zeros | Response register |
| 0x83 | 64 | Stick calibration | `ff ff ff ff 00...` | Uncalibrated/defaults |
| 0x85 | 3 | — | `00 ff` | Access-specific (profile?) |
| 0xe0 | 64 | — | Has data at byte 12 | Access-specific |

---

## 3. Button Mapping (Confirmed by Physical Testing)

The Access controller has **two button reporting layers** in each input report. Physical testing confirmed the raw bitfield (bytes 16–17) is stable regardless of profile, while the mapped output (bytes 8–10) depends on the active profile.

### Raw Physical Buttons (bytes 16–17) — Confirmed

Each physical button maps to exactly one bit. Buttons are numbered **counter-clockwise** on the device chassis:

| Physical Control | Raw Bit | Byte 16/17 |
|-----------------|---------|------------|
| Button 1 | b1 (bit 0) | byte 16 |
| Button 2 | b2 (bit 1) | byte 16 |
| Button 3 | b3 (bit 2) | byte 16 |
| Button 4 | b4 (bit 3) | byte 16 |
| Button 5 | b5 (bit 4) | byte 16 |
| Button 6 | b6 (bit 5) | byte 16 |
| Button 7 | b7 (bit 6) | byte 16 |
| Button 8 | b8 (bit 7) | byte 16 |
| Center button | center (bit 8) | byte 17 |
| Stick press | stick (bit 9) | byte 17 |
| PS button | ps (bit 10) | byte 17 |
| Profile button | profile (bit 11) | byte 17 |

### Post-Profile Mapped Buttons (bytes 8–10, DualSense-compatible)

The mapped output depends on the active profile. With the **factory default profile** (controller never connected to PS5):

| Physical Control | Default Profile Mapping | DualSense Button |
|-----------------|------------------------|------------------|
| Button 5 | Circle | byte 8, bit 6 |
| Button 7 | Options | byte 9, bit 5 |
| Center button | Cross | byte 8, bit 5 |
| Stick press | L3 | byte 9, bit 6 |
| PS button | PS | byte 10, bit 0 |
| Buttons 1–4, 6, 8 | **Unmapped** | No output in bytes 8–10 |
| Profile button | **System button** | Never appears in bytes 8–10 |

This means with the factory default profile, only 5 of 12 physical buttons produce any output in the DualSense-compatible bytes. The remaining 7 buttons are only visible via the raw bitfield at bytes 16–17. A library that only reads bytes 8–10 would miss most button presses.

### Stick Axes — Confirmed

Stick movement appears at:
- Bytes 1–2: Post-profile mapped stick X/Y (shared header, DualSense-compatible)
- Bytes 18–19: Raw pre-profile stick X/Y (Access-specific section)
- Bytes 47–48: Post-profile virtual stick 2 X/Y (mirrors bytes 1–2 for default single-stick config)

### Key Observations

**Button remapping is done in firmware — bytes 8–10 reflect the remapped output, NOT physical buttons.** Bytes 16–17 always provide the raw physical state. This is confirmed by:
- Physical testing: raw bits fire for every button press regardless of default profile mapping
- Titania's `titania_convert_input_access()` reads both raw buttons (bytes 16–17) and mapped buttons (bytes 8–10)
- The [jfedor.org/ps-access](https://www.jfedor.org/ps-access/) web tool reads/writes profiles directly via USB HID feature reports (0x60/0x61)
- **Caveat**: If the controller later connects to a PS5, the PS5 overwrites the on-device profiles

The active profile number is reported at byte 40 (bits 0–2, 0-indexed, +1 for display). Bit 3 of byte 40 is `profile_switching_disabled`. The profile button cycles through profiles and the controller remembers the last active profile across unplug/replug.

### Profile Validation (Confirmed by Physical Testing)

Two runs of the button mapping script — one with factory defaults, one with custom profile — confirmed:

1. **Raw bits (bytes 16–17) are identical** regardless of profile. The raw bitfield always reports physical button state.
2. **Mapped output (bytes 8–10) changes with the profile.** With factory defaults, only 5 of 12 buttons produce mapped output. With all buttons assigned, all 12 produce the correct DualSense-compatible mapped output.
3. **D-pad assignments appear in the hat nibble** (byte 8 low bits), not in the button bits. D-pad Up shows as hat "N".
4. **Stick orientation affects axis routing.** Orientation "below" maps raw stick directly to mapped stick (byte 19 = byte 3 exactly). Orientation rotation inverts and swaps axes as expected.

### LED Systems — Confirmed by Physical Testing

The Access controller has **4 independent LED systems**. None light up on PC without host software sending output report commands. Comprehensive testing with `scripts/access_led_probe.py`, `scripts/access_led_narrow.py`, `scripts/access_led_narrow2.py`, `scripts/access_led_narrow3.py`, and `scripts/access_led_narrow4.py` confirmed the complete control protocol for each system (see Section 2 output report for full byte-level details).

| LED System | Location | Control | Color |
|-----------|----------|---------|-------|
| **Lightbar** | RGB ring around hat | mut 0x04 + bytes 6/7/8 = R/G/B | Full RGB |
| **Profile LEDs** | 3 LEDs next to profile button | mut 0x01 + b12 bit 0 + b13 mode | White only |
| **Player Indicator** | 6-segment pattern on hat | mut 0x10 + byte 5 (player 0–4) | White only |
| **Status LED** | Small light on hat, towards joystick | b12 bit 4 + b23=1 | White only |

Key behaviors:
- Each system persists independently — commands to one don't affect others
- Profile LEDs show N LEDs matching active profile number (host cannot override count)
- Player indicator uses predefined segment patterns per player count (1–4)
- Lightbar color is profile-independent (not stored in profile, not affected by profile switch)

**Profile cycling**: Byte 40 cycles through values 1, 2, 3 (directly, not 0-indexed) when pressing the profile button. Controller remembers the last active profile across unplug/replug. Stick mapping changes immediately with profile switch (e.g., profile 1 had right stick mapping, profiles 2/3 had left stick).

### Mapping Script

A guided mapping script lives at `scripts/access_button_map.py`:

```bash
sudo python3 scripts/access_button_map.py           # auto-detect device
sudo python3 scripts/access_button_map.py /dev/hidraw1  # explicit device
```

Hold each button, press Enter, release when prompted. Saves full JSON to `/tmp/access_button_map.json`.

---

## 4. Profile Protocol (Feature Reports 0x60/0x61)

Reverse-engineered from [jfedor.org/ps-access](https://www.jfedor.org/ps-access/) `code.js` (fully readable, not minified) and cross-referenced with [titania](https://sr.ht/~chronovore/titania/)'s `access.c` implementation. The jfedor tool uses WebHID with filter `{ vendorId: 0x054c, productId: 0x0e5f }` and only works over USB — it detects Bluetooth by checking for Feature Report ID 0x63, which is present in the BT descriptor but absent in USB.

### Constants

- **Payload size per chunk**: 56 bytes (0x38) of profile data within a 64-byte feature report
- **Profile data size**: 956 bytes (per profile)
- **Profiles**: 3 user profiles on-device + 1 default/base profile (profile 0)
- **Total chunks**: 18 (17 × 56 + 1 partial = 960 bytes, capped at 956)
- **CRC seed**: `0x53` (for profile feature reports — distinct from BT CRC seeds)

### Page Command IDs (Report 0x60, byte 0)

Confirmed by titania's `playstation_access_page_id` enum:

| Command | Value | Purpose |
|---------|-------|---------|
| DELETE | 0x03 | Delete profile (profile ID 0xFF = delete all) |
| UPDATE_PROFILE_1 | 0x09 | Write profile 1 |
| UPDATE_PROFILE_2 | 0x0A | Write profile 2 |
| UPDATE_PROFILE_3 | 0x0B | Write profile 3 |
| QUERY_PROFILE_0 | 0x0F | Read default/base profile |
| QUERY_PROFILE_1 | 0x10 | Read profile 1 |
| QUERY_PROFILE_2 | 0x11 | Read profile 2 |
| QUERY_PROFILE_3 | 0x12 | Read profile 3 |

### Read Protocol

1. Send command to Report 0x60: byte 0 = page command ID (0x0F–0x12)
2. Read 18 sequential chunks from Report 0x61 (56 payload bytes per chunk, starting at offset 4)
3. Total: 18 × 56 = 1008 bytes, capped at 956
4. Each read increments the internal page counter automatically

### Write Protocol

1. Send 18 chunks to Report 0x60:
   - Byte 0: Update command (0x09/0x0A/0x0B for profiles 1/2/3)
   - Byte 1: Chunk index (0–17)
   - Bytes 2–57: 56 bytes of profile data
   - Last chunk (17): CRC32 at bytes 6–9 (little-endian, CRC32 with seed byte `0x53` prepended, over full 956 bytes)
2. Poll Report 0x61 until byte 2 == 0 (controller finished storing)
3. Titania performs a verification read after writing

### Delete Protocol

1. Send Report 0x60: byte 0 = `0x03`, byte 1 = profile ID (1–3, or 0xFF for all)
2. Controller erases the specified profile(s)

### Profile Data Structure (956 bytes)

Cross-referenced with titania's `playstation_access_profile_msg` packed struct (`static_assert` verified):

```
Offset  Size  Content
------  ----  -------
0-3     4     Version (uint32 LE — titania uses version enum: 1=Edge, 2=Access)
4-83    80    Profile name (UTF-16LE, up to 40 chars)
84-99   16    UUID (random, generated on each save)
100-149 50    10 button configs (5 bytes each)
150-151 2     Toggle/hold bitmask (uint16 LE)
152-376 225   5 port configs (45 bytes each)
377-947 571   Reserved (all zeros)
948-955 8     Timestamp (uint64 LE, ms since epoch)
```

Note: jfedor's code treats offset 0 as a single version byte (0x02). Titania treats offsets 0–3 as a `uint32` version field. The effective difference is negligible since valid version values are small, but titania's 4-byte interpretation is technically more correct per the wire struct.

#### Button Configs (bytes 100–149)

10 buttons × 5 bytes each at `100 + (button_index) * 5`:

| Offset | Content |
|--------|---------|
| +0 | Primary button mapping |
| +1 | Secondary button mapping |
| +2 | Unknown (always 0) |
| +3–4 | Unknown (uint16, always 0 — titania notes "possibly for trigger extensions") |

The 10 slots in order: b1–b8 (physical ring buttons), center button, stick press (L3).

#### Button Mapping Values

| Value | Button | Value | Button |
|-------|--------|-------|--------|
| 0 | nothing | 10 | R1 |
| 1 | circle | 11 | L2 |
| 2 | cross | 12 | R2 |
| 3 | triangle | 13 | L3 |
| 4 | square | 14 | R3 |
| 5 | up | 15 | options |
| 6 | down | 16 | create |
| 7 | left | 17 | PS |
| 8 | right | 18 | touchpad |
| 9 | L1 | | |

#### Toggle/Hold Bitmask (bytes 150–151)

Titania names this `playstation_access_profile_hold`. uint16 LE bitfield:

| Bit | Slot |
|-----|------|
| 0–7 | Buttons b1–b8 |
| 8 | Center button |
| 9 | Stick press |
| 10 | Extension port 1 |
| 11 | Extension port 2 |
| 12 | Extension port 3 |
| 13 | Extension port 4 |
| 14–15 | Reserved |

When set, the button acts as a toggle (press to activate, press again to deactivate).

#### Port Configs (bytes 152–376)

5 ports × 45 bytes each at `152 + port_index * 45`. Port 0 = built-in stick, ports 1–4 = expansion E1–E4.

Titania's `playstation_access_profile_extension` struct (45 bytes each):

| Offset | Size | Content |
|--------|------|---------|
| +0 | 1 | Port type (see below) |
| +1 | 1 | Subtype |
| +2 | 43 | Union: button config (5 bytes) OR stick config (12 bytes) OR padding |

**Port type byte (+0) — profile config values:**

| Value | Type |
|-------|------|
| 0x00 | Disabled/disconnected |
| 0x01 | Stick |
| 0x02 | Button (analog) |
| 0x03 | Button (digital) |

Note: These profile config type values differ from the **input report runtime** type values (Section 2), where 1=button, 2=trigger, 3=stick. The profile stores the *configured* type; the input report reports the *detected hardware* type.

**Stick mode (type 0x01) — titania's `playstation_access_profile_stick` (12 bytes):**

| Offset | Size | Content | Notes |
|--------|------|---------|-------|
| +2 | 1 | Orientation | 0=down, 1=left, 2=up, 3=right |
| +3 | 1 | Unknown | "Sometimes this is 2?" |
| +4 | 2 | Unknown | "Flags, probably?" |
| +6 | 2 | Deadzone (uint16 LE) | |
| +8 | 2 | Curve point 1 (uint16 LE) | `[3] > [2] > [1] > deadzone` |
| +10 | 2 | Curve point 2 (uint16 LE) | |
| +12 | 2 | Curve point 3 (uint16 LE) | |

Jfedor's representation: +1 = assignment (1=left, 2=right), +2 = orientation, +5 = sensitivity (default: 3), +8–13 = deadzone/curve (defaults: 0x80, 0x80, 0xC4, 0xC4, 0xE1, 0xE1). The two representations overlap but interpret some offsets differently — needs hardware verification.

**Button mode (type 0x02/0x03) — titania's `playstation_access_profile_button` (5 bytes):**

| Offset | Size | Content |
|--------|------|---------|
| +2 | 1 | Primary button mapping (same value table as above) |
| +3 | 1 | Secondary button mapping |
| +4 | 1 | Unknown |
| +5 | 2 | Unknown (uint16, always 0) |

### Authentication Reports (0xF0–0xF3)

From analysis of [jfedor2/paaas](https://github.com/jfedor2/paaas) (PlayStation Authentication as a Service):

| Report | Size | Direction | Purpose |
|--------|------|-----------|---------|
| 0xF0 | 63 | Host→Device | Auth nonce (5 chunks × 56 bytes, CRC32 in last 4 bytes) |
| 0xF1 | 63 | Device→Host | Auth signature (19 chunks × 56 bytes) |
| 0xF2 | 15 | Device→Host | Signing state (byte 1: 0=done, 16=pending) |
| 0xF3 | 7 | Device→Host | Reset auth state |

These are identical to the standard PlayStation authentication protocol used across DualSense/DualShock 4 accessories.

---

### Comparison: Access vs Edge Profile Protocols

The DualSense Edge (054c:0df2) also supports on-device profiles with button remapping. The two protocols are **completely independent and incompatible** — they share no feature report IDs, data structures, or button mapping values.

| Aspect | DualSense Access | DualSense Edge |
|--------|-----------------|----------------|
| Profile reports | 0x60 (command) / 0x61 (response) | 0x70–0x7B (12 dedicated, 3 per profile) |
| Transfer method | 18 × 56-byte chunks via shared register | Direct read/write of 3 × 64-byte reports |
| Profile size | 956 bytes | 192 bytes (3 × 64) |
| Profile count | 3 | 4 (1 default + 3 custom) |
| CRC | Standard zlib CRC32 over 956-byte payload | CRC32 with 0xA3 seed byte prepended |
| Button value 0 | "nothing" (unmapped) | D-pad Up |
| Button ordering | Face buttons first (1–4), then D-pad (5–8) | D-pad first (0–3), then face buttons (4–7) |
| Unique buttons | PS (17), Create (16) | Paddle Left (0x0E), Paddle Right (0x0F) |
| Stick curves | 6 bytes + 1 sensitivity byte per port | 6 bytes + 1 modifier + 1 preset ID per stick |
| Trigger config | N/A (no physical triggers) | Min/max deadzone per trigger |
| Expansion ports | 5 port configs × 45 bytes each | N/A (no expansion ports) |
| Profile name | UTF-16LE, 40 chars at offset 4 | Split across buffers 0 and 1 (even indices) |
| Profile selection | Physical profile button (3 LEDs) | FN + face button (Triangle/Circle/Cross/Square) |

**Shared heritage**: Both inherit the standard DualSense core HID input layout (bytes 0–10), Feature Report 0x09 (MAC), Feature Report 0x20 (firmware info), and 0xF0–0xF2 authentication. Beyond that, they diverge completely.

**Edge profile tools**: [ds-edge-configurator.com](https://ds-edge-configurator.com/) (open-source Vue/WebHID by steffalon), [edge-config.com](https://www.edge-config.com/) (closed-source WebHID), and Sony's official [PlayStation Accessories app](https://controller.dl.playstation.net/controller/lang/en/2100005.html) (since August 2024). No jfedor tool exists for the Edge.

**Implications for `dualsense-ts`**: Edge profile support would require a completely separate implementation from Access profile code. However, the Edge protocol is simpler (192 bytes across 3 fixed reports vs 956 bytes across 18 chunked transfers). If Edge support is desired in the future, the `DualsenseEdge` class could extend the existing `Dualsense` class with profile read/write methods, since the Edge's input/output reports are identical to the standard DualSense.

---

## 5. Combined Controller Mode

### How It Works

The pairing/merging of multiple controllers is performed **entirely by PS5 system software** — the controllers do NOT communicate with each other and have no awareness of being paired.

**Mechanism**: When multiple controllers are assigned to the **same PSN user account** at login, the PS5 merges their inputs into a single virtual controller. Access controllers do this automatically; standard DualSense controllers require the explicit "Assist Controller" toggle (Settings > Accessibility > Controllers).

**Supported combinations:**
- 1 Access controller alone
- 2 Access controllers together
- 1 Access controller + 1 DualSense/DualSense Edge
- 2 Access controllers + 1 DualSense/DualSense Edge

### Key Technical Facts

- **Each controller remains a separate HID device** sending independent reports
- **No pairing information** is stored in controller firmware — only BT bonding and profiles
- **No "virtual controller ID"** in any HID report byte
- **Left/right configuration** is achieved through profiles (mapping buttons/stick to left-half or right-half of the DualSense layout), not hardware pairing
- **Conflict resolution** (both controllers pressing the same button): Inclusive OR for buttons, likely max-value for triggers/sticks

### Implications for `dualsense-ts`

The library can implement combined controllers in software:
1. Accept two `DualsenseAccess` instances (or one Access + one Dualsense)
2. Merge their HID states (OR for buttons, max for triggers, sum-clamped for sticks)
3. Present a unified state object

This would make `dualsense-ts` the first open-source library to support Access controller combining on PC. The user would configure each controller's profile (via PS5 or jfedor's web tool) to cover different halves of the DualSense layout.

### PC Ecosystem for Controller Combining

No native OS support exists. Third-party options:
- **reWASD** (commercial, Windows): Can group devices into one virtual controller
- **ViGEm/VirtualPad + custom software**: Kernel-level virtual gamepad emulation
- **Joystick Gremlin**: Remap and combine inputs from multiple devices

---

## 6. Proposed Architecture

### Option A: Separate `DualsenseAccess` Class (Recommended)

Create a dedicated `DualsenseAccess` class with its own input tree tailored to the Access controller's actual features. Share the HID transport layer (`HIDProvider`, `NodeHIDProvider`, `WebHIDProvider`) and the foundational `Input<T>` event system, but give the Access controller its own input layout, output builder, and connection logic.

```
                ┌──────────────────┐         ┌──────────────────────┐
                │    Dualsense     │         │   DualsenseAccess    │
                │  ps, cross, ...  │         │  ps, buttons, ports  │
                │  touchpad, gyro  │         │  profiles, expansion │
                └────────┬─────────┘         └──────────┬───────────┘
                         │                              │
                    processHID()                   processHID()
                         │                              │
                ┌────────┴─────────┐         ┌──────────┴───────────┐
                │  DualsenseHID    │         │  AccessHID           │
                │  (48-byte out)   │         │  (32-byte out)       │
                └────────┬─────────┘         └──────────┬───────────┘
                         │                              │
                         └──────────┬───────────────────┘
                                    │
                           ┌────────┴─────────┐
                           │    HIDProvider    │  (shared transport)
                           │  NodeHID / WebHID │
                           └──────────────────┘
```

**Why this approach:**
- **No dead inputs**: The Access API only exposes what exists — no `touchpad`, `gyroscope`, `accelerometer`, `lightbar`, or `playerLeds` properties that never fire events. Consumers don't have to wonder what's real.
- **Tailored features**: The Access controller has unique features (expansion ports, profiles, toggle buttons, combined controller mode) that don't fit naturally into the DualSense input tree.
- **Accessibility-first API**: The target audience for the Access controller has different needs. A dedicated class can offer an API that respects the controller's intended use as an accessibility device.
- **Shared infrastructure**: The `Input<T>` event system, `HIDProvider` transport, enumeration, and identity system are fully reusable. The duplication is in the input tree composition and HID byte mapping — which is exactly the code that *should* differ.

**Key changes:**
1. **Generalize `HIDProvider`**: Remove hardcoded product ID. Add Access PID to enumeration. Make `connect()` skip Feature Report 0x05 when the device is an Access controller.
2. **New `AccessHID` class**: Analogous to `DualsenseHID` — 32-byte output builder, profile read/write via 0x60/0x61, no IMU calibration.
3. **New `DualsenseAccess` class**: Own input tree with buttons 1–10, stick, expansion ports 1–4, profile state, battery. Each expansion port is polymorphic (button/trigger/stick detected at runtime).
4. **Update `DualsenseManager`** (or new `ControllerManager`): Discover both device types, create the right class based on PID, support identity-based reconnection for both.
5. **Optional `CombinedController`**: Accepts two controller instances, merges their state, and presents a unified interface.

### Option B: Controller Type Abstraction (ReportCodec)

Extract a `ReportCodec` interface and keep a single `Dualsense` class driven by different codecs.

**Pros**: Single public API for all controller types.

**Cons**: Access-unique features (expansion ports, profiles, toggle mode) don't fit the existing input tree. Consumers would interact with dead `touchpad`/`gyroscope`/`lightbar` properties. The "one class for everything" abstraction leaks because the controllers genuinely have different capabilities.

### Option C: Thin Adapter in HIDProvider

Minimal change: add Access report parsing methods to `HIDProvider` alongside the existing ones, selected by a flag set during connection.

**Pros**: Smallest diff, quickest to ship.

**Cons**: `HIDProvider` becomes a dumping ground. No clean extension path for Edge or FlexStrike. Mixes report-format concerns with transport concerns.

### Recommendation

**Option A** is the best fit. The Access controller is a fundamentally different device from the DualSense — different form factor, different features, different audience. A separate class with a tailored API avoids the mess of dead inputs and lets us build an interface that genuinely serves the Access controller's users. The shared HID transport layer keeps code duplication minimal.

---

## 7. Accessibility UX Considerations

The Access controller exists specifically to serve people with disabilities. The `dualsense-ts` API for this device should reflect that intent.

### Design Principles

1. **No assumptions about physical ability.** The API should never assume which inputs are "primary" or require simultaneous input. Every button, stick, and expansion port should be independently addressable and equally first-class.

2. **Toggle-friendly.** The controller natively supports toggle mode (press to activate, press again to deactivate) for any button or expansion port input. The library should expose toggle state directly, not just raw press/release. Consumers building accessible UIs need to know whether a toggle button is currently "on" without tracking press history.

3. **Expansion ports are inputs, not accessories.** For many Access controller users, expansion modules (switches, triggers, sticks) plugged into E1–E4 are their *primary* input method, not an optional add-on. The API should treat expansion port inputs with the same fidelity as the built-in stick and buttons — same event system, same async iteration, same responsiveness.

4. **Hot-plug without state loss.** Expansion modules can be connected and disconnected at runtime. The library should handle this gracefully — emitting connection/disconnection events, resetting axis values to center, and not crashing or requiring reconnection.

5. **Profile awareness.** Users configure profiles to match their physical setup. The active profile determines which physical input maps to which virtual button. The library should expose the active profile number and, optionally, the profile contents (button mappings, port configs) so that consuming applications can adapt their UI/prompts to match the user's actual layout.

6. **Combined controller as a first-class pattern.** Many users split controls across two controllers (or use a caregiver with a second controller for cooperative play). The `CombinedController` abstraction should be easy to discover and use, not buried as an advanced feature.

### API Implications

- **`DualsenseAccess.buttons`**: Expose all 10 assignable buttons (b1–b8 ring buttons, b9 center, b10 stick press) with their current toggle state where applicable.
- **`DualsenseAccess.expansion[1-4]`**: Each port should be a polymorphic input that reports its detected device type (none/button/trigger/stick) and emits typed events accordingly.
- **`DualsenseAccess.profile`**: Observable property for the active profile number (1–3), with events on change.
- **`DualsenseAccess.readProfile()` / `writeProfile()`**: Full profile read/write for applications that want to help users configure their controller without a PS5.
- **`CombinedController`**: Constructor accepts any combination of Access/DualSense instances. Unified state with configurable merge strategy.

### Industry Guidelines

These standards/guidelines from accessibility organizations should inform the API design:

**AbleGamers (CAPD Guidelines)**:
- Separate input detection from input interpretation — the raw input layer should be completely decoupled from game/app logic
- Support one-switch play — the entire interface should be navigable with a single binary input via scanning
- Provide input sensitivity/threshold controls — stick deadzones, trigger thresholds, and timing windows should all be configurable
- Support sequential input as an alternative to simultaneous input
- Timing should be adjustable — hold times, repeat rates, debounce periods
- Input visualization: provide a way to see what inputs the system is detecting (essential for troubleshooting accessible setups)

**Microsoft Xbox Accessibility Guidelines (XAGs)**:
- XAG 101: Support remapping of all inputs (certification requirement for Xbox games)
- No input type assumptions — don't assume the user has two analog sticks, triggers, etc.
- Clear input state feedback — the current input state should always be queryable
- Haptic feedback must be optional and adjustable — some users find haptics painful or distracting; others rely on them as essential feedback

**SpecialEffect recommendations**:
- Never assume a standard controller layout — users may have any combination of inputs
- Respect low-input configurations — some users may only have 1–3 switches available
- Minimize simultaneous input requirements
- Always offer toggle alternatives to hold actions

**IGDA Game Accessibility SIG**:
- Expose all input as events, not just polling — event-driven input is essential for switch users with precise timing needs
- Provide input history/logging — invaluable for debugging accessible setups
- Dead inputs should fail obviously — if a port has nothing connected, indicate this clearly rather than silently returning zero

### Ecosystem Context

The DualSense Access is **unusually software-rich** compared to other accessible controllers. Every other major accessible controller (Xbox Adaptive Controller, Hori Flex, QuadStick, ByoWave Proteus) deliberately presents as a standard HID gamepad — all the accessibility logic lives in hardware/firmware. The Access is unique in exposing profile configuration, port mapping, and rich input data over its HID protocol.

This means `dualsense-ts` can do things no other accessible controller library can: read/write profiles, detect expansion port types, and expose the full device state. Other accessible controllers don't need device-specific libraries because they look identical to standard gamepads.

The **3.5mm mono jack (TS)** is the universal standard for assistive technology switches — simple normally-open momentary contacts with no electronics. The DualSense Access follows this convention for its expansion ports, ensuring compatibility with the entire AT switch ecosystem (switches, sip-and-puff devices, head trackers, etc.).

### Documentation Considerations

- README examples should include Access controller usage prominently, not as a footnote.
- Button names in events/logs should use the Access controller's own naming (b1–b8, center, stick press) rather than DualSense equivalents (square, cross, circle, triangle) — since the physical-to-logical mapping is opaque and user-configured.
- Note that the HID report reflects the *remapped* output, not physical buttons — applications should not try to reverse-engineer which physical button was pressed.

---

## 8. Implementation Plan

### Phase 1: Device Detection

**Goal**: Make `dualsense-ts` recognize and connect to the Access controller.

- Add Access product ID (0x0E5F) to device enumeration in `NodeHIDProvider.enumerate()` and `WebHIDProvider`
- Detect controller type from product ID during `connect()`
- Skip Feature Report 0x05 (IMU calibration) for Access controllers
- Feature Report 0x20 works and can be read for firmware info
- Feature Report 0x09 works for MAC address / identity

### Phase 2: Input Report Parsing

**Goal**: Parse all Access controller inputs.

- Reuse bytes 1–10 parsing (post-profile mapped sticks, triggers, buttons, hat) — identical to DualSense
- Parse Access-specific bytes 16–55 (see Section 2 Access-specific byte map):
  - Raw buttons (bytes 16–17): 12-bit bitfield for physical button presses
  - Raw stick (bytes 18–19): pre-profile hardware stick position
  - Extension positions (bytes 20–27): E1–E4 analog X/Y pairs
  - Battery (byte 37): same nibble encoding as DualSense
  - Profile ID and switching state (byte 40)
  - Expansion port types (bytes 41, 49): nibble fields for E1–E4 hardware detection
  - Post-profile virtual sticks (bytes 43–44, 47–48)
- Default unmapped DualSense fields (gyro, accel, touch) to zero/false

### Phase 3: Output Report

**Goal**: Support the 32-byte Access output report.

- Build Access-specific 32-byte output report using the `access_output_msg` layout (see Section 2)
- NOT a truncated DualSense output — completely different struct with its own mutator flags
- LED control via Access mutator flags — 4 independent systems:
  - Lightbar: RGB ring around hat (bytes 6/7/8, mutator bit 2)
  - Profile LEDs: 3 LEDs next to profile button (mutator bit 0, mode byte 13)
  - Player Indicator: 6-segment pattern on hat (byte 5, mutator bit 4)
  - Status LED: small white light on hat (byte 12 bit 4 + byte 23)
  - Reset: mutator bit 3 restores defaults
- No rumble, triggers, audio control
- **⚠ Do NOT set `override_profile` control bit** — titania warns this "bricks profiles"

### Phase 4: Expansion Port Support

**Goal**: Expose expansion module inputs.

Per the Sony Expansion Port Specifications, three device types connect via the E1–E4 ports:

- **Button devices** (2-contact 3.5mm): Digital ON/OFF. Simple switch.
- **Trigger devices** (4-contact 3.5mm): Single-axis analog (potentiometer, 10k±3k Ω).
- **Stick devices** (4-contact 3.5mm): Two-axis analog (dual potentiometer, 10k±3k Ω each).

The MCU auto-detects which type is connected via the DET pin voltage levels. Implementation:

- Each expansion port has a 2-byte X/Y position (bytes 20–27 in input report)
- Port types are reported in real-time via nibble fields at bytes 41 (E3/E4) and 49 (E1/E2)
- Runtime type values: 0=disconnected, 1=button, 2=trigger, 3=stick, 4=invalid
- Titania derives button state from `e[n].x != 0 || e[n].y != 0` for expansion button detection
- Create a polymorphic `ExpansionPort` input element that can represent any device type
- Support hot-plug: expansion modules can be connected/disconnected at runtime

### Phase 5: Profile Support

**Goal**: Read/write controller profiles via Feature Reports 0x60/0x61.

- Read active profile number from byte 40 bits 0–1 (values 1–3 directly, confirmed by testing)
- Implement profile read: send page command (0x0F–0x12) to 0x60, read 18 chunks from 0x61
- Implement profile write: send 18 chunks with update command (0x09–0x0B), CRC32 with seed 0x53 on final chunk
- Implement profile delete: send 0x03 command with profile ID (or 0xFF for all)
- Parse profile data structure (956 bytes): version, name, UUID, 10 button mappings, hold/toggle bitmask, 5 port configs, timestamp
- Expose `readProfile()` / `writeProfile()` / `deleteProfile()` API
- Note: PS5 overwrites on-device profiles when the controller connects to it

### Phase 6: Combined Controller

**Goal**: Support merging two controllers into one virtual controller.

- Implement a `CombinedController` class that accepts two controller instances
- Merge HID states: inclusive OR for buttons, max for triggers, configurable for sticks
- Support Access+Access and Access+DualSense combinations
- Expose the combined state as a unified `DualsenseHIDState`-compatible object

---

## 9. Unknowns and Risks

### Must-Resolve Before Implementation

1. ~~**Button mapping verification**~~: **RESOLVED** — All 12 physical buttons confirmed via `scripts/access_button_map.py`. Bytes 16–17 produce exactly one bit per button (b1–b8 in byte 16, center/stick/PS/profile in byte 17). Raw bits are stable across profiles. Mapped output (bytes 8–10) correctly reflects the active profile's button assignments. D-pad assignments use the hat nibble. Results saved to `/tmp/access_button_map.json`.

2. ~~**Bluetooth support**~~: **RESOLVED** — The Access uses the same BT output report format as DualSense (Report 0x31, 78 bytes, CRC32 with seed 0xA2). All 4 LED systems work over BT. Key difference: **lightbar requires scope B bit 2** (BT byte 3 = 0x04) — USB only needs mutator bit 2. BT input starts as compact Report 0x01 (10 bytes), switches to full Report 0x31 (78 bytes) after reading Feature Report 0x05. BT detection: Feature Report ID 0x63 present in BT descriptor, absent in USB. See "Bluetooth Output Report" section for full protocol.

### Resolved

3. ~~**Battery encoding**~~: **RESOLVED** — Battery is at byte 37 in the Access-specific section (confirmed by titania's `access_input_msg` struct, offset +5 from earlier estimate due to union starting at byte 16 not 11). Same nibble encoding as DualSense: `state = upper_nibble + 1`, `level = lower_nibble * 0.1 + 0.1`. State values: TITANIA_BATTERY_FULL triggers level=1.0 override.

4. ~~**Expansion port protocol**~~: **RESOLVED** — Extension modules report via:
   - 4 × 2-byte X/Y position pairs at bytes 20–27 (E1–E4)
   - Port type nibble fields at bytes 41 (E3/E4) and 49 (E1/E2)
   - Runtime types: 0=disconnected, 1=button, 2=trigger, 3=stick
   - Button detection: `e[n].x != 0 || e[n].y != 0`
   - Confirmed by titania's `titania_convert_input_access()` implementation.

5. ~~**LED systems**~~: **RESOLVED (confirmed by physical testing)** — Four independent LED systems fully mapped:
   - **Lightbar** (RGB ring around hat): bytes 6/7/8 = R/G/B with mutator bit 2 (`led`). Full color, profile-independent.
   - **Profile LEDs** (3 LEDs next to profile button): mutator bit 0 (`status_led`) + byte 12 bit 0 + byte 13 mode (0=off, 1=on, 2=fade, 3=sweep). Count matches active profile automatically.
   - **Player Indicator** (6-segment pattern on hat): mutator bit 4 (`player_indicator_led`) + byte 5 as player count 0–4 with predefined segment patterns.
   - **Status LED** (small white light on hat): byte 12 bit 4 + byte 23 (center_indicator) = 1. Both required.
   - DualSense mute LED byte has no effect. All systems persist independently. See Section 2 output report for full details.

6. ~~**Profile storage**~~: **RESOLVED** — Profiles are stored in controller firmware (3 user slots + 1 default/base), readable/writable over USB via Feature Reports 0x60/0x61. CRC seed is 0x53. See Section 4 for the full protocol. PS5 overwrites on-device profiles when the controller connects.

7. ~~**Bytes 3–4 usage**~~: **RESOLVED** — These are post-profile mapped right stick X/Y axes. They idle at 0x80 and become active when an expansion port stick module is assigned to "right stick" in the active profile.

8. ~~**Combined controller protocol**~~: **RESOLVED** — There is no controller-to-controller communication or special HID protocol. Merging is done entirely by PS5 system software when controllers are assigned to the same user account. See Section 5.

### Lower-Priority Unknowns

9. **Feature Report 0x22**: Contains firmware version and MAC address in a different layout than 0x20. May contain Access-specific device info (hardware revision, expansion port capabilities). Titania names this `DUALSENSE_REPORT_HARDWARE`.

10. ~~**Feature Reports 0x80/0x82**~~: **PARTIALLY RESOLVED** — On DualSense, 0x80 uses a `[DeviceID, ActionID, ...params]` sub-command structure (see Section 11). Error on read is expected — these require specific sub-command writes first. 0x82 is for calibration start/store/sample. Titania names these `DUALSENSE_REPORT_SET_SYS`, `DUALSENSE_REPORT_RECALIBRATE`.

11. ~~**Output report layout**~~: **RESOLVED** — The Access output report is NOT a truncated DualSense common section. It has its own `access_output_msg` struct with Access-specific mutator flags, LED control, and control fields. No rumble, triggers, audio, or haptic bytes. See Section 2.

12. ~~**CRC bytes 56–63**~~: **RESOLVED** — USB reports do NOT use CRC. These bytes are vendor-specific timestamp or status data. Only Bluetooth reports use CRC32 (last 4 bytes, with seed 0xA1 for input). See Reference Data for the BT CRC algorithm.

13. **Stick sensitivity/deadzone**: The jfedor tool writes default values but doesn't expose UI for editing these. Titania's `playstation_access_profile_stick` struct shows: 1 deadzone (uint16) + 3 curve points (uint16 each), where `curve[3] > curve[2] > curve[1] > deadzone`. Exact response curve mapping is still unknown.

14. **iOS Gamepad API**: Access controller is NOT recognized as a Gamepad API device on iOS (confirmed by Japanese testing). Unknown if this is an Apple limitation or a missing MFi identifier.

15. **Gamepad API partial mapping**: When using the W3C Gamepad API (not WebHID), only circle, cross, and SELECT buttons are recognized without a fully-mapped profile configured on a PS5. A profile with all buttons assigned resolves this (confirmed by Japanese Gamepad API testing).

### Known Real-World Limitations (from Japanese accessibility reviewers)

- Only 4 expansion ports total (8 across two controllers) — can be exhausted in complex games
- No rapid-fire/turbo function available
- Cannot map stick positions to body buttons (e.g., "stick-up = triangle")
- No touchpad quadrant detection — touchpad button is a single input
- All profile/button configuration requires a PS5 console (no standalone PC configurator besides jfedor's web tool)
- PS5 blocks controller converter devices (Titan One/Two) at the game level, not system level

---

## 10. Exploration Tools

### TypeScript HID Explorer (in-repo)

A comprehensive TypeScript explorer using `node-hid` lives at `scripts/access_explore.ts`. Modes:

```bash
tsx ./scripts/access_explore.ts feature   # Read all feature reports
tsx ./scripts/access_explore.ts led       # Probe LED/output commands
tsx ./scripts/access_explore.ts monitor   # Real-time input monitoring (60s)
tsx ./scripts/access_explore.ts all       # Everything (default)
```

May need `sudo` or appropriate udev rules for HID access.

### Python Report Explorer (standalone)

A Python script for real-time button mapping is saved at `/tmp/access_explore.py`. Usage:

```bash
sudo python3 /tmp/access_explore.py /dev/hidraw1
```

Press buttons and move sticks — changed bytes are highlighted in red. On exit (Ctrl+C), prints a summary of all bytes that changed during the session.

### Feature Report Reader

```python
# Quick one-liner to read a specific feature report
python3 -c "
import os, fcntl, array
fd = os.open('/dev/hidraw1', os.O_RDWR | os.O_NONBLOCK)
HIDIOCGFEATURE = lambda n: (3 << 30) | (n << 16) | (ord('H') << 8) | 0x07
buf = array.array('B', [0x20] + [0] * 63)  # Change 0x20 to desired report ID
fcntl.ioctl(fd, HIDIOCGFEATURE(64), buf)
print(' '.join(f'{b:02x}' for b in buf.tobytes()))
os.close(fd)
"
```

---

## 11. Reference Data

### Feature Report 0x20 (Firmware Info)
```
20 4a 75 6e 20 32 32 20 32 30 32 33 31 36 3a 32   Jun 22 202316:2
33 3a 34 37 02 00 60 00 20 02 00 02 00 00 00 01   3:47..`. .......
00 88 00 00 00 00 00 00 00 00 00 00 00 01 00 00   ................
03 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
```

### Feature Report 0x09 (MAC / Pairing Info, 20 bytes)
```
09 8c 30 6d 49 18 10 08 25 00 c8 37 12 5b 02 00   ..0mI...%..7.[..
00 00 00 00
```
Structure (from DualSense kernel driver): bytes 1–6 = client MAC (controller BT address), bytes 7–9 = hard-coded values (0x08, 0x25, 0x00), bytes 10–15 = host MAC (paired host BT address). MAC addresses stored in standard byte order. Our MAC: `8C:30:6D:49:18:10`, paired host: `C8:37:12:5B:02:00`.

### Feature Report 0x22 (Access-specific Device Info)
```
22 02 00 20 02 00 02 00 00 00 01 00 00 00 00 00   ".. ............
00 8c 30 6d 49 18 10 00 00 00 00 00 00 00 00 18   ..0mI...........
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00   ................
00 00 00 00 00 03 00 00 00 00 01 00 00 00 00 00   ................
```

### Feature Report 0x80 Sub-Command Protocol (DualSense, likely shared)

On DualSense, Report 0x80 uses a `[DeviceID, ActionID, ...params]` structure for system commands. Report 0x81 returns GET responses. Key sub-commands that may work on Access:

| DeviceID | ActionID | Function | Notes |
|----------|----------|----------|-------|
| 1 | 1 | Reset | |
| 1 | 4 | Read PCBA ID | |
| 1 | 9 | Get MCU Unique ID | |
| 1 | 12 | Read Device Info | |
| 3 | 1 | **NVS Lock** | |
| 3 | 2 | **NVS Unlock** | Params: 0x65, 0x32, 0x40, 0x0C |
| 3 | 3 | NVS Lock Status | Returns: 0=unlocked, 1=locked |
| 9 | 1 | Set BT Address | DataLen=6 |
| 13 | 3 | **LED Test** | GG, RR, BB, WW, XX, YY, ZZ = per-LED brightness |

**Calibration (Reports 0x82/0x83)**: 0x82 SET with `[mode, deviceId, targetId]` — mode 1=start, 2=store, 3=sample. 0x83 GET returns `[deviceId, targetId, status, 0xFF]`. For analog stick center calibration: deviceId=1, targetId=1. For range calibration: deviceId=1, targetId=2.

**NVS (Non-Volatile Storage)**: Must be unlocked before writing calibration or configuration data. Report 0xA0 byte 0 likely reflects NVS lock state on the Access controller (it errors on read, suggesting it's locked).

### Bluetooth CRC32

DualSense BT reports use CRC32 (zlib polynomial 0x04C11DB7) with per-report-type seeds:
- **Input reports**: seed = 0xA1
- **Output reports**: seed = 0xA2
- **Feature reports**: seed = 0xA3
- Calculation: `crc = crc32(0xFFFFFFFF, &seed, 1); crc = ~crc32(crc, data, len-4);`
- CRC stored in last 4 bytes, little-endian

BT output (Report 0x31): `[0x31][seq_tag][0x10 magic][47-byte common section][padding][4-byte CRC32]`
BT input (Report 0x31): `[0x31][2-byte header][data][4-byte CRC32]` — all offsets shifted by +2 vs USB.

**Confirmed**: The Access controller uses the same BT CRC algorithm as the DualSense for output reports (seed 0xA2, custom hash table, computed over bytes 0–73, stored LE at bytes 74–77).

The varying bytes 56–63 in our USB input report captures are NOT a CRC (USB reports don't have CRC) — they are likely timestamps or other vendor data.

### Bluetooth Output Report (Report ID 0x31, 78 bytes)

The Access BT output report uses the same framing as DualSense BT (Report ID 0x31, 78 bytes, CRC at bytes 74–77) but the **mutator flag mapping differs** — the lightbar requires scope B (byte 2 in USB terms / BT byte 3).

#### BT Output Layout

| BT Byte | USB Byte | Content |
|---------|----------|---------|
| 0 | — | Report ID (0x31) |
| 1 | — | Constant (0x02) |
| 2 | 1 | **Mutator flags** (scope A) |
| 3 | 2 | **Scope B flags** (required for lightbar over BT) |
| 4+ | 3+ | Payload (USB bytes shifted +1) |
| 74–77 | — | CRC32 (little-endian) |

General rule: USB byte N maps to BT byte N+1.

#### BT Mutator Flags

Over BT, the mutator (BT byte 2) and scope B (BT byte 3) **both** serve as flag bytes. Some LED systems require scope B where USB only needed the mutator.

| LED System | USB Mutator | BT Mutator (byte 2) | BT Scope B (byte 3) |
|------------|-------------|---------------------|---------------------|
| Status LED | bit 0 (0x01) | bit 0 (0x01) | bit 0 (0x01) also works |
| Profile LEDs | bit 0 (0x01) | bit 0 (0x01) | — |
| Lightbar RGB | bit 2 (0x04) | bit 2 (0x04) required | **bit 2 (0x04) required** |
| Player Indicator | bit 4 (0x10) | bit 4 (0x10) | — |

**Key difference from USB**: The lightbar requires **both** mutator bit 2 **and** scope B bit 2 over BT. Neither alone is sufficient. Over USB, only mutator bit 2 is needed.

#### Combined BT Example (all 4 LED systems)

```
BT[0]  = 0x31  (report ID)
BT[1]  = 0x02  (constant)
BT[2]  = 0x15  (mutator: status_led | led | player_indicator_led)
BT[3]  = 0x04  (scope B: lightbar enable)
BT[6]  = 0x02  (player indicator: 2 segments)
BT[7]  = 0xFF  (lightbar R)
BT[8]  = 0x00  (lightbar G)
BT[9]  = 0xFF  (lightbar B = magenta)
BT[13] = 0x11  (profile LED enable + status LED enable)
BT[14] = 0x02  (profile LED mode: fade)
BT[24] = 0x01  (status LED center indicator)
BT[74–77] = CRC32 LE
```

#### BT Input Reports

#### BT Input Reports

The Access starts sending compact **Report 0x01** (10 bytes) over BT. Reading Feature Report 0x05 triggers a switch to full **Report 0x31** (78 bytes) — the same mechanism as DualSense BT.

**Important**: The Access BT 0x31 input report has a **+1 byte offset** (one header byte after report ID), NOT +2 like the DualSense:

| BT Byte | USB Byte | Content |
|---------|----------|---------|
| 0 | — | Report ID (0x31) |
| 1 | — | Sequence/tag byte (increments by ~0x50 per report) |
| 2 | 1 | Mapped left stick X (profile-dependent) |
| 3 | 2 | Mapped left stick Y (profile-dependent) |
| 4 | 3 | Mapped right stick X (profile-dependent) |
| 5 | 4 | Mapped right stick Y (profile-dependent) |
| 6 | 5 | L2 trigger |
| 7 | 6 | R2 trigger |
| 8 | 7 | Sequence counter |
| 9 | 8 | Hat (lo nibble) + buttons (hi nibble) |
| 10–11 | 9–10 | Buttons bytes 2–3 |
| 17 | 16 | Raw buttons b1–b8 |
| 18 | 17 | Raw buttons: center/stick/PS/profile |
| 48 | 47 | Raw stick X (profile-independent, mirrors mapped position) |
| 49 | 48 | Raw stick Y (profile-independent, mirrors mapped position) |
| 74–77 | — | CRC32 (little-endian) |

General rule for BT input: USB byte N → BT byte N+1 (offset of 1, NOT 2 like DualSense).

**Raw stick position**: USB bytes 47/48 always reflect the physical stick position regardless of which profile mapping is active. The mapped stick bytes (1–4) depend on the active profile's button/axis assignments — e.g., the physical stick may appear at right stick (bytes 3–4) instead of left stick (bytes 1–2).

**Asymmetry note**: BT output uses +1 offset (same as input), but the output constant byte at BT[1]=0x02 is still required. The input has a single sequence/tag byte at BT[1] instead.

### Full HID Report Descriptor (273 bytes)
```
05 01 09 05 a1 01 85 01 09 30 09 31 09 32 09 35
09 33 09 34 15 00 26 ff 00 75 08 95 06 81 02 06
00 ff 09 20 95 01 81 02 05 01 09 39 15 00 25 07
35 00 46 3b 01 65 14 75 04 95 01 81 42 65 00 05
09 19 01 29 0f 15 00 25 01 75 01 95 0f 81 02 06
00 ff 09 21 95 0d 81 02 06 00 ff 09 22 15 00 26
ff 00 75 08 95 34 81 02 85 02 09 23 95 1f 91 02
85 08 09 34 95 2f b1 02 85 09 09 24 95 13 b1 02
85 0a 09 25 95 1a b1 02 85 20 09 26 95 3f b1 02
85 22 09 40 95 3f b1 02 85 60 09 41 95 3f b1 02
85 61 09 42 95 3f b1 02 85 80 09 28 95 3f b1 02
85 81 09 29 95 3f b1 02 85 82 09 2a 95 09 b1 02
85 83 09 2b 95 3f b1 02 85 84 09 2c 95 3f b1 02
85 85 09 2d 95 02 b1 02 85 a0 09 2e 95 01 b1 02
85 e0 09 2f 95 3f b1 02 85 f0 09 30 95 3f b1 02
85 f1 09 31 95 3f b1 02 85 f2 09 32 95 0f b1 02
85 f4 09 35 95 3f b1 02 85 f5 09 36 95 03 b1 02
c0
```

### Expansion Port Electrical Details (from Sony Spec)

The expansion ports are **purely analog inputs** — the MCU inside the Access controller reads ADC values from potentiometers or switch closures. The HID report then digitizes these into 8-bit values (0–255). This means:

- **Button**: Binary — either the default idle value or a pressed value in the HID report
- **Trigger**: 0–255 range on a single byte, similar to L2/R2
- **Stick**: Two bytes at 0x80 center, +/- 127 range, similar to the main stick

The MCU distinguishes device types via the DET pin circuit (100kΩ pull-up/pull-down resistor network). Detection likely happens at connection time and is reported in the status bytes. The controller firmware handles ADC sampling and maps the raw voltage to the appropriate HID report byte — no software driver work is needed to support different expansion types.

**Port layout** (from line drawing, Figure 10): E1 and E2 on the left face, E3 and E4 on the right face.

### Idle Input Report (annotated)
```
Offset: 00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f
    0:  01 80 80 80 80 00 00 b6 08 00 00 00 8b 84 cd 0e
        │  │  │  │  │  │  │  │  │  │  │  │  │  │  │  └─ status
        │  │  │  │  │  │  │  │  │  │  │  │  │  │  └──── status
        │  │  │  │  │  │  │  │  │  │  │  │  │  └─────── battery?
        │  │  │  │  │  │  │  │  │  │  │  │  └────────── counter 2
        │  │  │  │  │  │  │  │  │  │  │  └───────────── zero
        │  │  │  │  │  │  │  │  │  │  └──────────────── buttons byte 3 + vendor
        │  │  │  │  │  │  │  │  │  └─────────────────── buttons byte 2
        │  │  │  │  │  │  │  │  └────────────────────── hat(0x8=null) + buttons
        │  │  │  │  │  │  │  └───────────────────────── counter 1
        │  │  │  │  │  │  └──────────────────────────── R2 trigger
        │  │  │  │  │  └─────────────────────────────── L2 trigger
        │  │  │  │  └────────────────────────────────── axis Rz (stick Y2?)
        │  │  │  └───────────────────────────────────── axis Z (stick X2?)
        │  │  └──────────────────────────────────────── stick Y
        │  └─────────────────────────────────────────── stick X
        └────────────────────────────────────────────── Report ID

   16:  00 00 80 80 00 00 00 00 00 00 00 00 80 00 00 00
                │  │                          └─ expansion axis?
                │  └──── expansion axis (Y)?
                └─────── expansion axis (X)?

   32:  80 00 00 00 00 15 06 00 03 00 01 80 80 00 00 80
        │              │  │     │     │  │  │        └─ expansion axis?
        │              │  │     │     │  │  └──── expansion axis?
        │              │  │     │     │  └─────── expansion axis?
        │              │  │     │     └────────── profile/status?
        │              │  │     └──────────────── status
        │              │  └────────────────────── status
        │              └───────────────────────── status/expansion flags
        └──────────────────────────────────────── expansion axis?

   48:  80 00 00 00 00 00 00 00 a1 da 70 37 c6 2b 01 05
        │                       └──────────────────────── timestamp/CRC (varies)
        └──────────────────────────────────────────────── expansion axis?
```

### Linux evdev Mapping (hid-generic)

The kernel's generic HID driver maps the Access controller's standard gamepad fields to evdev:

**Buttons (15 mapped):**
BTN_SOUTH(A), BTN_EAST(B), BTN_C, BTN_NORTH(X), BTN_WEST(Y), BTN_Z,
BTN_TL, BTN_TR, BTN_TL2, BTN_TR2, BTN_SELECT, BTN_START,
BTN_MODE, BTN_THUMBL, BTN_THUMBR

**Axes:**
| evdev Axis | Idle | Range | Maps to |
|---|---|---|---|
| ABS_X | 128 | 0–255 | Stick X (byte 1) |
| ABS_Y | 128 | 0–255 | Stick Y (byte 2) |
| ABS_Z | 128 | 0–255 | Axis Z (byte 3) |
| ABS_RZ | 128 | 0–255 | Axis Rz (byte 4) |
| ABS_RX | 0 | 0–255 | L2 trigger (byte 5) |
| ABS_RY | 0 | 0–255 | R2 trigger (byte 6) |
| ABS_HAT0X | 0 | -1–1 | Hat switch X |
| ABS_HAT0Y | 0 | -1–1 | Hat switch Y |

### DualSense vs Access Comparison

| Aspect | Standard DualSense | DualSense Access |
|---|---|---|
| USB PID | 0x0CE6 | 0x0E5F |
| USB Interfaces | 4 (2 HID + 2 Audio) | 1 (HID only) |
| HID descriptor | 265 bytes | 273 bytes |
| Input report | 64 bytes | 64 bytes (same) |
| Output report | 48 bytes | 32 bytes |
| Buttons in HID | 14 | 15 |
| Axis layout | X,Y,Z,Rz,Rx,Ry | X,Y,Z,Rz,Rx,Ry (same) |
| EP poll interval | 4 (0.5ms) | 6 (0.75ms) |
| IMU (Feature 0x05) | Yes (41 bytes) | **No** |
| Touchpad | Yes | **No** |
| Adaptive triggers | Yes | **No** |
| Speaker/Microphone | Yes (audio interfaces) | **No** |
| Lightbar RGB | Yes (output bytes 45–47) | **No** (output too short) |
| Player LEDs | Yes (output byte 44) | **No** (output too short) |
| Rumble motors | Yes (output bytes 3–4) | **No** (bytes accepted but no hardware) |
| Expansion ports | None | 4 (E1–E4, 3.5mm) |
| Profiles | None | Up to 3 |
| Feature 0x60/0x61 | Absent | Present (profile R/W — see Section 4) |
| Kernel driver | hid-playstation | hid-generic |
| iSerial | Present | 0 (absent) |

---

## 12. Ecosystem Status

The Access controller exists in a support gap. Only one other open-source library — **titania** (C23, hidapi-based, MPL-2.0) — provides full Access support (input parsing, LED control, profile R/W/delete, expansion ports). `dualsense-ts` would be the first TypeScript/JavaScript library with Access support and the first to treat it as a distinct device class with an accessibility-first API.

| Platform / Project | 0x0E5F Listed? | Functional Support | Access-Specific Handling |
|---|---|---|---|
| Linux hid-playstation | No | Falls to hid-generic | None — no patches pending |
| SDL controller_list.h | **Yes** (Dec 2023, commit cae65714) | Classified as `k_eControllerType_PS5Controller` | None — assumes touchpad/IMU/lightbar exist |
| SDL HIDAPI PS5 driver | No special handling | Treated identically to standard DualSense | Wrong capabilities assumed |
| SDL GameControllerDB | No | No mapping entry | — |
| Steam Input | Recognized by name | Partial — limited, profile switching broken | None |
| Valve steam-devices udev | No | No uaccess rules for hidraw | — |
| Windows | DirectInput auto-detect | Basic DirectInput only (not XInput) | None |
| macOS GCController | Not listed | Not officially supported | None |
| dualsensectl | Not supported | No | — |
| pydualsense | No | No | — |
| DS4Windows | No | No | — |
| nondebug/dualsense | No | No | — |
| jfedor.org/ps-access | N/A | Profile editor only (WebHID) | **Yes** — full profile R/W (see Section 4) |
| titania (C23, hidapi) | **Yes** | **Full Access support** | **Yes** — input parsing, LED control, profile R/W/delete, expansion ports (see below) |

### Platform Details

**Linux kernel**: The hid-playstation driver distinguishes DualSense (0x0CE6) from Edge (0x0DF2) only by a single vibration v2 flag — no profile support, no paddle buttons, no Edge-specific features are exposed. Adding the Access controller would require conditionals to skip touchpad/sensor/microphone subsystem creation. No patches or RFC have been submitted.

**SDL**: Added to `controller_list.h` in Dec 2023, but `SDL_hidapi_ps5.c` has no `SDL_IsJoystickDualSenseAccess()` function. The HIDAPI driver assumes all Sony PS5 controllers have touchpad, gyro/accel, lightbar, and vibration — all wrong for the Access controller. SDL distinguishes Edge by giving it 17 buttons (paddles) and 1000Hz sensor rate vs standard's 13 buttons and 250Hz.

**Steam**: Recognizes the Access controller by name but has significant limitations: profile switching doesn't work on PC, only one controller at a time (no combined mode), custom mappings lost on disconnect, and remapping can fail unpredictably.

**Valve udev**: The `60-steam-input.rules` does NOT include 0x0E5F, meaning on Linux the Access controller's hidraw node won't get automatic `uaccess` permissions — users need manual udev rules.

**macOS**: Apple's GCController framework supports DualShock 4, DualSense, and DualSense Edge, but does NOT list the Access controller. It may work via IOKit as a raw HID device.

### Titania C Library — Detailed Analysis

[Titania](https://sr.ht/~chronovore/titania/) (`~chronovore/titania` on SourceHut, mirrored to GitHub as `neptuwunium/titania`) is a C23 cross-platform library using hidapi that provides **the only other complete open-source implementation of Access controller support**. Licensed MPL-2.0. Last pushed January 5, 2026.

**What titania implements for Access:**

| Feature | Status | Key Details |
|---------|--------|-------------|
| Device detection | ✅ | VID 054c, PID 0E5F; `IS_ACCESS()` macro |
| Input parsing | ✅ | Full `access_input_msg` struct — raw buttons, raw stick, 4 expansion ports, battery, profile ID, post-profile virtual sticks |
| Output report | ✅ | `access_output_msg` (32 bytes) — LED control, center indicator, mutator flags |
| LED control | ✅ | Profile LED + center LED + brightness + center indicator boolean |
| Profile read | ✅ | Via 0x60/0x61 with 18-page protocol |
| Profile write | ✅ | With CRC32 (seed 0x53) verification read |
| Profile delete | ✅ | Single profile or all (0xFF) |
| Profile export/import | ✅ | JSON format (version 2) via CLI tool |
| Expansion ports | ✅ | Type detection via nibble fields, X/Y position pairs |
| Bluetooth | ✅ | Shared BT report framing with DualSense |
| Calibration | Skipped | Access has no IMU — correctly omits Feature Report 0x05 |

**What titania explicitly blocks for Access** (returns `TITANIA_ERROR_NOT_SUPPORTED`):
- Rumble, haptics, vibration modes
- Adaptive triggers
- Audio control
- System requests (`sysrq`)

**Key architectural decisions in titania:**
- Uses a union of `dualsense_input_msg` and `access_input_msg` in the same 64-byte buffer — shared header parsed first, then Access branch via `IS_ACCESS()` guard with early return
- Separate `access_output_msg` struct (NOT a truncated DualSense output)
- Profile version enum: `DUALSENSE_PROFILE_VERSION_EDGE_V1 = 1`, `DUALSENSE_PROFILE_VERSION_ACCESS_V1 = 2`
- Preserves 9 `unknown` fields in the Access input for future investigation
- Notes `override_profile` control bit is dangerous ("this bricks profiles")
- No `state_id` located in Access output yet ("this likely exists on access as well, idk where yet")

**Timeline:** Access support added in v1.5.0 (partial), expanded in v2.0.0 (profile import/export). Early commits (Jan 2024) show: "access LED control", "fix access profiles being bricked", "E1..E4 button support".

Titania is the **primary cross-reference** for this document's byte-level protocol details. Where jfedor's profile editor and titania agree, the data is considered confirmed. Where they disagree (e.g., version field width), both interpretations are noted.

### Accessible Controller Ecosystem Comparison

| Controller | Vendor ID | HID Protocol | Profile System | Expansion Ports | Software Library Needed? |
|---|---|---|---|---|---|
| **DualSense Access** | 054c:0e5f | DualSense-like (custom vendor bytes) | 3 on-device via HID Feature Reports | 4 × 3.5mm (button/trigger/stick) | **Yes** — rich device-specific protocol |
| Xbox Adaptive Controller | 045e:0b0a | Standard XInput | Via Xbox Accessories app (proprietary) | 19 × 3.5mm + 2 × USB-A | No — looks like a standard Xbox controller |
| Hori Flex | 0f0d:xxxx | Standard DirectInput | On-device controls only | 2 × 3.5mm per unit + USB | No — standard gamepad |
| QuadStick | Custom VID | Standard HID gamepad + keyboard + mouse | Companion desktop app | Sip/puff + switches | No — standard HID |
| ByoWave Proteus | Standard | Standard HID gamepad | Magnetic module assembly | Modular magnetic | No — standard gamepad |

The DualSense Access is the **only accessible controller that exposes its configuration protocol over HID**. Every other device hides its accessibility logic in firmware and presents a standard gamepad to the host. This makes `dualsense-ts` uniquely valuable — it can offer profile management, port configuration awareness, and expansion device type detection that no other library can provide for any accessible controller.

## 13. External References

- [PlayStation Access Controller product page](https://www.playstation.com/en-us/accessories/access-controller/)
- [Access Controller Expansion Port Specifications (Sony PDF)](https://www.playstation.com/content/dam/global_pdc/en/corporate/support/manuals/accessories/ps5-accessories/access-controller/access-docs/Access%20Controller%20for%20PlayStation%205%20Expansion%20Port%20Specifications.pdf)
- [PlayStation Access Controller Profile Editor (jfedor.org)](https://www.jfedor.org/ps-access/)
- [jfedor2/hid-remapper (RP2040 adapter for expansion ports)](https://github.com/jfedor2/hid-remapper)
- [DualSense Data Structures (Game Controller Collective Wiki)](https://controllers.fandom.com/wiki/Sony_DualSense/Data_Structures)
- [Linux hid-playstation.c](https://github.com/torvalds/linux/blob/master/drivers/hid/hid-playstation.c)
- [Logitech Adaptive Gaming Kit for Access Controller](https://direct.playstation.com/en-us/buy-accessories/logitech-adaptive-gaming-kit-for-access-controller)
- [jfedor2/paaas (PlayStation Authentication as a Service)](https://github.com/jfedor2/paaas)
- [PlayStation: Connect Multiple Access Controllers](https://www.playstation.com/en-us/support/hardware/connect-multiple-access/)
- [PlayStation: Access Controller Profiles](https://www.playstation.com/en-us/support/hardware/access-profiles/)
- [PlayStation Blog: Access Controller Starter's Guide](https://blog.playstation.com/2023/12/04/the-access-controller-for-ps5-starters-guide/)
- [Access-Ability: PlayStation Access Controller Review](https://access-ability.uk/2023/12/04/playstation-access-controller-review/)
- [SpecialEffect GameAccess: PS5 Access Controller Guide](https://gameaccess.info/playstation-5-access-controller-video-an-introductory-look/)
- [Sony Japan: Access Controller Expansion Port Spec (Japanese PDF)](https://www.playstation.com/content/dam/global_pdc/en/corporate/support/manuals/accessories/ps5-accessories/access-controller/access-docs/PlayStation5%20%E7%94%A8%20Access%20%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%A9%E3%83%BC%20%E6%8B%A1%E5%BC%B5%E7%AB%AF%E5%AD%90%E4%BB%95%E6%A7%98%E6%9B%B8.pdf)
- [Fukuno.jig.jp: Web Steelpan with Access Controller (Japanese)](https://fukuno.jig.jp/4218)
- [Uetora: Bedridden Gamer Access Controller Review (Japanese)](https://uetora.hatenablog.com/entry/ps5-access-controller-strong-point-and-weak-point)
- [Game*Spark: Severely Disabled Gamer Access Controller Interview (Japanese)](https://www.gamespark.jp/article/2023/12/28/137192.html)
- [GameAccess: HID Remapper v7 with Access Controller](https://gameaccess.info/using-usb-joysticks-with-the-ps5-access-controller-hid-remapper-v7/)
- [DualSense Edge Profile Web App (steffalon, open-source)](https://github.com/steffalon/dualsense-edge-profile-web-application)
- [edge-config.com (DualSense Edge WebHID configurator)](https://www.edge-config.com/)
- [Sony PlayStation Accessories App (Edge profile management)](https://controller.dl.playstation.net/controller/lang/en/2100005.html)
- [PSDevWiki: DualSense HID Commands](https://www.psdevwiki.com/ps5/DualSense_HID_Commands)
- [Al's Blog: Calibrating DualSense](https://blog.the.al/2024/04/02/calibrating-dualsense.html)
- [Al's Blog: DualSense Edge Calibration](https://blog.the.al/2025/04/11/dualshock-tools-ds-edge.html)
- [nondebug/dualsense (HID descriptor analysis)](https://github.com/nondebug/dualsense)
- [titania — C library targeting DualSense + Access Controller (SourceHut primary)](https://sr.ht/~chronovore/titania/)
- [titania — GitHub mirror (neptuwunium/titania)](https://github.com/neptuwunium/titania)
- [FCC Filing AK8CFIZAC1 — Access Controller (internal photos available)](https://fcc.report/FCC-ID/AK8CFIZAC1)
- [jfedor2/hid-remapper v7 — USB-to-3.5mm adapter for Access Controller expansion ports](https://github.com/jfedor2/hid-remapper/tree/master/custom-boards/v7)
- [Techlab APF France Handicap — Access Controller physical specs (French)](https://techlab-handicap.org/produit/manette-access-sony/)
- [Canard PC — Access Controller hardware analysis (French, paywalled)](https://www.canardpc.com/hardware/dossier-hardware/manette-playstation-access-bienvenue-mais-insuffisante/)
- [esp32beans/M5Stack_Touch_SAC_Joystick — Touchscreen-to-expansion-port adapter](https://github.com/esp32beans/M5Stack_Touch_SAC_Joystick)
- [esp32beans/nunchuk2sac — Wii Nunchuk-to-expansion-port adapter](https://github.com/esp32beans/nunchuk2sac)
- [PCGamingWiki: PlayStation Access Controller](https://www.pcgamingwiki.com/wiki/Controller:PlayStation_Access_Controller)
