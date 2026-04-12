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
