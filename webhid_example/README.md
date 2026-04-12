## `dualsense-ts` React Example

An interactive demo app that exercises every feature of `dualsense-ts` using React and WebHID. Try the [live demo](https://nsfm.github.io/dualsense-ts/).

### Running locally

```bash
yarn --cwd webhid_example install
yarn --cwd webhid_example start
```

The app runs at `localhost:3000` and hot-reloads as you edit components. If you modify the core library (`src/`), you must rebuild first with `yarn build`.

### Structure

- [Controller.tsx](./src/Controller.tsx) — creates a shared `Dualsense` context
- [App.tsx](./src/App.tsx) — provides the controller context and renders the HUD
- [hud/ControllerConnection.tsx](./src/hud/ControllerConnection.tsx) — requests WebHID permission
- [hud/HUDLayout.tsx](./src/hud/HUDLayout.tsx) — main layout composing all visualizations

### Input visualizations

- [hud/Reticle.tsx](./src/hud/Reticle.tsx) — left analog stick cursor
- [hud/RightStick.tsx](./src/hud/RightStick.tsx) — right analog stick cursor
- [hud/StickVisualization.tsx](./src/hud/StickVisualization.tsx) — analog stick position rings
- [hud/FaceButtons.tsx](./src/hud/FaceButtons.tsx) — triangle, circle, cross, square
- [hud/DpadVisualization.tsx](./src/hud/DpadVisualization.tsx) — directional pad
- [hud/ShoulderVisualization.tsx](./src/hud/ShoulderVisualization.tsx) — bumpers
- [hud/TriggerVisualization.tsx](./src/hud/TriggerVisualization.tsx) — trigger pressure bars
- [hud/LeftTrigger.tsx](./src/hud/LeftTrigger.tsx) / [RightTrigger.tsx](./src/hud/RightTrigger.tsx) — individual trigger displays
- [hud/BumperVisualization.tsx](./src/hud/BumperVisualization.tsx) — bumper indicators
- [hud/TouchpadVisualization.tsx](./src/hud/TouchpadVisualization.tsx) — multi-touch positions
- [hud/Gyro.tsx](./src/hud/Gyro.tsx) — 3D gyroscope visualization
- [hud/UtilityButtons.tsx](./src/hud/UtilityButtons.tsx) — PS, create, options, mute buttons

### Output controls

- [hud/LightbarControls.tsx](./src/hud/LightbarControls.tsx) — RGB color picker
- [hud/LightbarFadeButtons.tsx](./src/hud/LightbarFadeButtons.tsx) — fade blue / fade out
- [hud/LightbarStrip.tsx](./src/hud/LightbarStrip.tsx) — lightbar color preview
- [hud/PlayerLedControls.tsx](./src/hud/PlayerLedControls.tsx) — player LED pattern and brightness
- [hud/PlayerLedBar.tsx](./src/hud/PlayerLedBar.tsx) — player LED indicator
- [hud/MuteLedControls.tsx](./src/hud/MuteLedControls.tsx) — mute LED mode
- [hud/RumbleControl.tsx](./src/hud/RumbleControl.tsx) — left/right rumble intensity
- [hud/TriggerEffectControls.tsx](./src/hud/TriggerEffectControls.tsx) — adaptive trigger effect sliders
- [hud/AudioControls.tsx](./src/hud/AudioControls.tsx) — volume, routing, muting, and test tones

### Status indicators

- [hud/BatteryIndicator.tsx](./src/hud/BatteryIndicator.tsx) — battery level and charging state
- [hud/AudioIndicator.tsx](./src/hud/AudioIndicator.tsx) — headphone and microphone status
- [hud/ColorIndicator.tsx](./src/hud/ColorIndicator.tsx) — controller body color
- [hud/Debugger.tsx](./src/hud/Debugger.tsx) — raw input state inspector
