# Roadmap

Planned features and improvements for `dualsense-ts`. These are roughly ordered by priority but not committed to a timeline.

## DualSense variants

### DualSense Edge

The Edge controller shares the same VID/PID as the standard DualSense but adds four extra inputs (L4, L5, R4, R5 back buttons) and remappable profiles. Basic functionality likely works today, but the extra buttons need to be parsed and exposed.

### DualSense FlexStrike

Sony's modular competitive controller. HID report structure TBD — needs hardware for testing.

### DualSense Access

Sony's accessibility controller for PS5. Different form factor and likely a different HID report layout. Needs hardware for testing.

## Rich battery callbacks

Convenience APIs for common battery patterns — for example, threshold-based notifications (`battery.level.onLowerThan(0.2, callback)`). The event system already supports change events, but dedicated helpers would reduce boilerplate for the most common use case.

## Analog stick calibration tool

The DualSense has a built-in stick calibration routine triggered via Feature Report `0x82`/`0x83`. The host orchestrates a begin/sample/end command sequence while the user holds sticks at center (center calibration) or rotates them through full range (range calibration), and the controller firmware captures positions internally. Results are persisted to NVS via an unlock/lock sequence on Feature Report `0x80`. A factory reset command can restore defaults. The DualSense Edge adds per-module lock/unlock and 12-bit finetune parameters for per-quadrant range adjustment. Full protocol details are documented in `src/hid/STICK_CALIBRATION.md`.

## Extended system info commands

The test command protocol (`Feature Report 0x80/0x81`) exposes several device info sub-commands beyond what we currently read. Known queries include MCU unique ID (`[1, 9]`), PCBA ID (`[1, 17]`), battery barcode (`[1, 24]`), left/right vibration motor barcodes (`[1, 26]`/`[1, 28]`), touchpad ID (`[5, 2]`), and touchpad firmware version (`[5, 4]`). The hardware info byte from Feature Report `0x20` can also identify newer board revisions (BDM-060M, BDM-060X) not covered by the current serial-number-based approach.

## DSP diagnostic commands

The test command framework (`Feature Report 0x80/0x81`) enumerates 20+ internal device types beyond the system info and stick calibration commands above — trigger force curves, motion sensor self-test, touch sensor data, and more. High-level APIs for the most useful diagnostics (raw trigger force readings, motion sensor calibration status) would benefit advanced users and tooling. Note that codec register access is disabled in production firmware.
