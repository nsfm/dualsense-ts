# Roadmap

Planned features and improvements for `dualsense-ts`. These are roughly ordered by priority but not committed to a timeline.

## DualSense variants

### DualSense Edge

The Edge controller shares the same VID/PID as the standard DualSense but adds four extra inputs (L4, L5, R4, R5 back buttons) and remappable profiles. Basic functionality likely works today, but the extra buttons need to be parsed and exposed.

### DualSense FlexStrike

Sony's modular competitive controller. HID report structure TBD — needs hardware for testing.

## Expand support for DualSense Access

Sony's accessibility controller for PS5. Quite a different feature landscape compared to the DualSense Classic.

### Profile Management

The Access controller stores up to 3 user profiles via Feature Reports 0x60/0x61 using an 18-chunk transfer protocol (956 bytes per profile, CRC32 with seed 0x53). Each profile defines button-to-action mappings, stick sensitivity curves, toggle/hold behavior, and expansion port assignments. This item adds read, write, and delete support so users can back up, restore, or programmatically create profiles. Reference implementations exist in titania (C) and jfedor's PS Access profile editor.

### Expansion Slot Support

The four 3.5mm E1–E4 expansion ports accept button, trigger, and stick accessory modules. The input report provides raw analog axes for each port (bytes 20–27) and runtime device type detection via nibble fields (bytes 41 and 49, values: 0=disconnected, 1=button, 2=trigger, 3=stick). This item exposes expansion port state — device type, connection status, and analog axes — so applications can react to plugged-in accessories and read their inputs directly.

### Unified API (support for either type of controller via one interface)

A common interface or base class shared by `Dualsense` and `DualsenseAccess` that lets application code work with either controller type generically. This would cover the overlapping surface — connection state, battery, lightbar, and the concept of "buttons" and "sticks" — while allowing type narrowing for device-specific features. Useful for games and tools that want to support both controllers without branching on the device type.

### Multi-controller Merge API

On PS5, up to 3 physical controllers — 1 DualSense Classic plus 2 Access controllers, or any subset — can be merged into a single virtual player input. This item adds a merge/combine mode where any combination of `Dualsense` and `DualsenseAccess` instances are joined into one logical input source. Each physical device contributes its buttons, sticks, and features, and the combined view presents a complete virtual controller to the application. Two Access controllers can also be merged without a DualSense, with each providing a different subset of inputs.

### Advanced LED Control

Phase 1 uses a 0xFF shotgun dismiss to release the BT firmware animation on connect. The output report has additional LED features to explore: a brightness byte (USB byte 4) that controls status/profile LED intensity over BT (high/medium/low observed during testing), and animation trigger commands in the LED effect byte (USB byte 3) and higher mutator/scope B combinations that can produce firmware-driven pulse and fade effects. This item narrows the dismiss to the minimum bits needed, exposes LED brightness as an API, and investigates which animation effects are available for host-triggered use.

### DualsenseManager Integration

`DualsenseManager` currently only discovers and manages standard DualSense controllers. This item adds Access controller discovery (VID 054c / PID 0e5f) to the manager, with separate player slot tracking, appropriate LED assignment, and reconnection matching. Also includes awareness of merged Access+DualSense pairs so the manager can treat them as a single player slot.

## Analog stick calibration tool

The DualSense has a built-in stick calibration routine triggered via Feature Report `0x82`/`0x83`. The host orchestrates a begin/sample/end command sequence while the user holds sticks at center (center calibration) or rotates them through full range (range calibration), and the controller firmware captures positions internally. Results are persisted to NVS via an unlock/lock sequence on Feature Report `0x80`. A factory reset command can restore defaults. The DualSense Edge adds per-module lock/unlock and 12-bit finetune parameters for per-quadrant range adjustment. Full protocol details are documented in `src/hid/STICK_CALIBRATION.md`.

## Extended system info commands

The test command protocol (`Feature Report 0x80/0x81`) exposes several device info sub-commands beyond what we currently read. Known queries include MCU unique ID (`[1, 9]`), PCBA ID (`[1, 17]`), battery barcode (`[1, 24]`), left/right vibration motor barcodes (`[1, 26]`/`[1, 28]`), touchpad ID (`[5, 2]`), and touchpad firmware version (`[5, 4]`). The hardware info byte from Feature Report `0x20` can also identify newer board revisions (BDM-060M, BDM-060X) not covered by the current serial-number-based approach.

## DSP diagnostic commands

The test command framework (`Feature Report 0x80/0x81`) enumerates 20+ internal device types beyond the system info and stick calibration commands above — trigger force curves, motion sensor self-test, touch sensor data, and more. High-level APIs for the most useful diagnostics (raw trigger force readings, motion sensor calibration status) would benefit advanced users and tooling. Note that codec register access is disabled in production firmware.
