# Changelog

All notable changes to `dualsense-ts` are documented here. This project uses [Semantic Versioning](https://semver.org/).

## [6.12.0] - 2026-04-14

### Added

- **IMU calibration**:gyroscope and accelerometer readings now use per-unit factory calibration data (Feature Report 0x05) read automatically on connection. Removes gyro bias drift, corrects accelerometer zero-point offset, and normalises per-axis sensitivity so all three axes report consistent values for the same physical input
- `controller.calibration` exposes the resolved calibration factors for inspection and diagnostics

## [6.11.0] - 2026-04-13

### Added

- **Power save control**: `controller.powerSave` allows selectively disabling touch, motion, haptics, or audio processing on the controller to conserve battery. Supports individual property setters, bulk `set()`, and `reset()`

## [6.10.0] - 2026-04-13

### Added

- **Sensor timestamp**: `controller.sensorTimestamp` exposes the 32-bit monotonic microsecond counter from each input report, enabling precise time deltas for gyroscope integration and frame-rate-independent motion processing
- `ByteArray.readUint32LE` for reading 32-bit little-endian values from HID reports

### Changed

- **TypeScript 6.0**: upgraded from 5.8; migrated to `module: "Node16"` / `moduleResolution: "Node16"` with explicit `types` declarations and `isolatedModules: true`
- **ESLint 10**: upgraded from 9; added `@eslint/js` as explicit dependency (unbundled in ESLint 10)
- Bumped CI actions: `actions/checkout` v6, `actions/setup-node` v6, `actions/download-artifact` v8, `dependabot/fetch-metadata` v3

## [6.9.10] - 2026-04-13

### Fixed

- Fix for rendering docs pages in unsupported browsers

### Added

- `null_hid_provider` to simplify compatibility for incompatible browser environments

## [6.9.5] - 2026-04-13

### Added

- A new interactive documentation app is now available for your enjoyment

## [6.9.4] - 2026-04-13

### Fixed

- Input events no longer fire when there are no listeners, improving performance by 11%

### Added

- A new benchmarking script is provided to set performance baselines for the package

## [6.9.3] - 2026-04-13

### Fixed

- Cleaned up npm bundling, reducing package size by over 50%

## [6.9.0] - 2026-04-12

### Added

- `dispose()` method on `Dualsense` and `DualsenseHID` for proper cleanup
- `exports` field in package.json for modern bundler/ESM resolution

### Changed

- Upgraded Node 16 → 22, TypeScript 4.6 → 5.8, Jest 27 → 29, ESLint 8 → 9
- Migrated ESLint to flat config (`eslint.config.mjs`)
- Replaced `ts-node` with `tsx` for dev scripts
- Removed unused webpack dev server setup and 6 excess devDependencies
- Trimmed npm package from 437 files to ~170 (whitelist via `files` field)
- Updated CI workflow: modern action versions, `--frozen-lockfile`, build artifacts
- Expanded test suite from 26 to 200 tests across 25 suites

### Fixed

- Timer leak in `Dualsense` and `DualsenseHID` (intervals not cleared on dispose)
- README syntax errors in code examples

## [6.8.0] - 2026-04-12

### Changed

- License changed to LGPL-v3

## [6.7.0] - 2026-04-11

### Added

- Audio support (speaker output)

### Fixed

- Fixes for node-hid compatibility issues
- Fixes for rumble quirks

## [6.6.0] - 2026-04-11

### Added

- Mute LED override support

## [6.5.0] - 2026-04-11

### Added

- EventEmitter-style listener management (`on`, `off`, `once`, etc.)

## [6.4.0] - 2026-04-11

### Added

- Firmware version lookup
- Improved multi-controller behavior

## [6.3.0] - 2026-04-04

### Added

- Microphone and headphone detection

## [6.2.0] - 2026-04-04

### Added

- Multiplayer support (connect and manage multiple controllers)
- Seamless switching between wired and wireless connections

### Fixed

- Bad browser fallback in demo app

### Changed

- Improved the WebHID example/demo app

## [6.1.0] - 2026-04-03

### Added

- Light bar control (player LEDs and light bar color)
- Battery level readings

## [6.0.0] - 2026-04-02

### Added

- Trigger haptic feedback (adaptive triggers)
- Haptic feedback support over Bluetooth and WebHID

### Changed

- **Breaking:** Haptics API restructured for trigger feedback support

## [5.5.0] - 2023-11-26

### Added

- Gyroscope and accelerometer (motion sensor) support

## [5.4.0] - 2023-11-19

### Fixed

- HID report mapping for all report styles (USB, Bluetooth, WebHID)
- D-pad input conflicts resolved

## [5.3.0] - 2023-11-16

### Added

- Debugging tools for inspecting controller state

### Fixed

- GitHub Pages deployment for the demo app

## [5.2.0] - 2023-11-15

### Added

- Wired/wireless connection detection in WebHID mode

## [5.1.0] - 2023-03-04

### Added

- Rumble (haptic motor) support
- Tool for forcing wired/wireless behavior

### Changed

- Enabled `@typescript-eslint/strict` for stricter type checking

### Fixed

- Undefined `window` check for HID provider

## [5.0.0] - 2022-10-10

### Changed

- **Breaking:** No-throw constructor; the `Dualsense` constructor no longer throws when a controller is not connected
- New connection state interface for monitoring controller connectivity

### Fixed

- Reduced excess analog input events
- Improved analog input handling

## [4.0.0] - 2022-10-01

### Changed

- **Breaking:** `node-hid` is now a peer dependency (consumers must install it themselves)

### Fixed

- Excessive HID reconnect attempts
- Overhauled WebHID connection strategy for improved reliability
- Fixed bad HID connection check

## [3.1.0] - 2022-09-03

### Added

- Scaled deadzone for analog inputs (sticks and triggers)

## [3.0.0] - 2022-07-15

### Added

- **Breaking:** Browser support via WebHID API
- Tests and fixed default analog threshold

## [2.2.0] - 2022-06-24

### Changed

- Improved analog threshold setting
- Improved README examples

## [2.1.39] - 2022-06-21

Initial tagged release. Basic DualSense controller support via `node-hid` with button, stick, and trigger inputs.
