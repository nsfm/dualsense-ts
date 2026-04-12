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

## Motion sensor helpers

Expose higher-level derived values from the raw gyroscope and accelerometer data — orientation (roll, pitch, yaw), shake detection, tilt angles. Currently users must process the raw axis values themselves. A small utility layer could cover the most common use cases without adding weight to the core input model.

## Sensor timestamps

The DualSense input report includes a 32-bit sensor timestamp (bytes 28–31 in USB reports) that is currently ignored. Exposing this would allow precise motion-to-input synchronization — useful for gesture detection, motion-controlled aiming, and any application that needs to correlate gyroscope/accelerometer readings with button or stick inputs across frames.

## Calibration data

The controller stores factory calibration data for the gyroscope, accelerometer, and analog sticks in feature reports. Reading and applying these offsets and scale factors would improve motion accuracy compared to the current hardcoded mappings. This is especially relevant for applications that depend on absolute orientation or precise dead-reckoning.

## Power subsystem control

The `PowerSave` flags in the output report allow selectively disabling touch, motion, haptics, or audio processing on the controller to conserve battery. The enum is already defined but there are no convenience methods to toggle individual subsystems. Adding explicit APIs (e.g., `controller.setPowerSave({ motion: false, touch: false })`) would let applications optimize battery life when certain features aren't needed.

## DSP diagnostic commands

The test command framework (`Feature Report 0x80/0x81`) enumerates 20+ internal device types — stick diagnostics, trigger force curves, motion sensor calibration, touch sensor data, and more. High-level APIs for the most useful diagnostics (raw trigger force readings, stick calibration ranges, motion sensor self-test) would benefit advanced users and tooling. Note that codec register access is disabled in production firmware.
