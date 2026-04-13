## Testing

```bash
# Run unit tests
yarn test

# Run the node.js debug app
yarn debug

# Run the hardware verification script
yarn verify

# Run the documentation app at localhost:5173
yarn --cwd documentation_app dev
```

## Project structure

### /

- **dualsense.ts** — the `Dualsense` class; composes all elements and connects them to HID state
- **manager.ts** — the `DualsenseManager` class; multi-controller discovery, slot tracking, and player LED assignment
- **input.ts** — base class all controller inputs inherit from, providing event, promise, and async iterator APIs
- **comparators.ts** — state change detection strategies (threshold, deadzone, basic equality)
- **audio.ts** — browser helper for finding DualSense audio devices via the Web Audio API
- **math.ts** — type aliases for radians, degrees, magnitude, force, and intensity
- **id.ts** — enum of all controller input identifiers

### hid/

- **hid_provider.ts** — abstract base class for HID connections; includes input report parsing for USB and Bluetooth
- **node_hid_provider.ts** — provider for `node-hid`-based connections in Node.js
- **web_hid_provider.ts** — provider for WebHID-based connections in the browser
- **platform_hid_provider.ts** — selects the correct provider based on the execution environment
- **dualsense_hid.ts** — coordinates a provider, builds output reports, and manages firmware/factory info loading
- **bt_checksum.ts** — CRC-32 checksum computation for Bluetooth output and feature reports
- **command.ts** — enums and types for the 48-byte output report (scopes, LED modes, audio routing, power save)
- **firmware_info.ts** — reads and parses Feature Report 0x20 (build date, firmware versions, hardware info)
- **factory_info.ts** — reads serial number, body color, and board revision via the test command protocol
- **pairing_info.ts** — reads the Bluetooth MAC address from Feature Report 0x09
- **battery_state.ts** — `ChargeStatus` enum for battery charging state
- **dsp.ts** — documentation of the DSP test command protocol (Feature Report 0x80/0x81)
- **byte_array.ts** — abstraction over Buffer (Node.js) and DataView (browser)

### elements/

All controller inputs, implementing the `Input` class from `input.ts`.

**Primitive inputs:**
- **momentary.ts** — boolean on/off input (buttons, contact detection)
- **axis.ts** — signed numeric input with threshold and deadzone (-1 to 1)
- **trigger.ts** — unsigned pressure input (0 to 1)
- **increment.ts** — monotonic counter (e.g. touch IDs)

**Composite inputs:**
- **analog.ts** — two axes plus a button (analog sticks); provides direction, magnitude, and deadzone
- **dpad.ts** — four Momentary children (up/down/left/right)
- **unisense.ts** — one side of the controller (trigger, bumper, analog stick, rumble)
- **touch.ts** — a single touch point, modeled as an Analog with contact detection and touch ID
- **touchpad.ts** — two Touch instances plus a physical button
- **gyroscope.ts** / **accelerometer.ts** — 3-axis motion sensors (x, y, z)
- **motion.ts** — groups gyroscope and accelerometer
- **battery.ts** — battery level (0–1) and charging status
- **mute.ts** — extends Momentary with LED mode control and firmware status

**Output-only elements:**
- **lightbar.ts** — RGB light bar color and pulse effects
- **player_leds.ts** — 5-bit player indicator LED bitmask and brightness
- **audio.ts** — volume, routing, muting, microphone source, and preamp controls
- **trigger_feedback.ts** — adaptive trigger effects (7 modes) with raw byte serialization
