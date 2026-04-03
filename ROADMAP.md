# Roadmap

Planned features and improvements for `dualsense-ts`. These are roughly ordered by priority but not committed to a timeline.

## Multi-controller support

Allow multiple `Dualsense` instances to connect to separate physical controllers simultaneously. This requires changes to the HID provider layer to support device selection and prevent two instances from claiming the same device.

## DualSense variants

### DualSense Edge

The Edge controller shares the same VID/PID as the standard DualSense but adds four extra inputs (L4, L5, R4, R5 back buttons) and remappable profiles. Basic functionality likely works today, but the extra buttons need to be parsed and exposed.

### DualSense FlexStrike

Sony's modular competitive controller. HID report structure TBD — needs hardware for testing.

### DualSense Access

Sony's accessibility controller for PS5. Different form factor and likely a different HID report layout. Needs hardware for testing.

## Microphone LED control

The HID layer already implements `setMicrophoneLED()`, but it is not exposed in the public API. The firmware also controls this LED independently via the mute button, so writes may conflict. Needs testing to determine if coexistence is viable or if we should only expose it as opt-in.

## Rich battery callbacks

Convenience APIs for common battery patterns — for example, threshold-based notifications (`battery.level.onLowerThan(0.2, callback)`). The event system already supports change events, but dedicated helpers would reduce boilerplate for the most common use case.

## Speaker and audio output

The DualSense has a built-in speaker and can receive audio data over HID. The command scope bits for audio volume and speaker toggle are defined but not wired up. Implementing audio output likely requires isochronous USB transfers or a dedicated audio HID report path. This is a significant effort with limited reference implementations.

## Motion sensor helpers

Expose higher-level derived values from the raw gyroscope and accelerometer data — orientation (roll, pitch, yaw), shake detection, tilt angles. Currently users must process the raw axis values themselves. A small utility layer could cover the most common use cases without adding weight to the core input model.
