# dualsense-ts

`dualsense-ts` is the natural interface for your DualSense controller. Simple to use, fully-typed, fully-featured, and supports wired and wireless connections in both node.js and the browser.

**[Live demo](https://nsfm.github.io/dualsense-ts/)** - connect a controller and try it out!

## Features

- **Rich input API** providing synchronous, event, iterator, or promise-based updates
- **Bluetooth and USB** support in the browser or node.js
- **Automatic connection and reconnection** even when connection type changes
- **Multiplayer support**, allowing up to 31 connected controllers at a time
- **Lighting control** covering RGB light bars, player LEDs, and mute button
- **Full haptics control** over independent left/right rumble plus complete trigger haptics
- **Touchpad support** with full multi-touch handling
- **Motion tracking** via gyroscope and accelerometer readings
- **Battery status** including level and charging state
- **Audio controls** for speaker, headphone, and microphone volume, routing, and muting
- **Peripheral status** for connected headphones and microphone
- **Firmware info** checks providing controller color, hardware/software versions, and more

## Getting started

### Installation

[This package is distributed via npm](https://www.npmjs.com/package/dualsense-ts). Install it the usual way:

- `npm add dualsense-ts`

#### In the browser

`dualsense-ts` has zero dependencies and relies on the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). At this time, only Chrome, Edge, and Opera are compatible.

#### In node.js

`dualsense-ts` relies on `node-hid` as a peer dependency. You'll need to add it to your project as well:

- `npm add node-hid`

### Connecting

When you construct a `new Dualsense()`, it will begin searching for a controller. If it finds one, it will connect automatically.

```typescript
import { Dualsense } from "dualsense-ts";

// Grab a controller connected via USB or Bluetooth
const controller = new Dualsense();
```

If the device disconnects, `dualsense-ts` will quietly wait for it to come back. You can monitor the connection status with `controller.connection` using any of the Input APIs listed in the next section.

```typescript
controller.connection.on("change", ({ active }) => {
  console.log(`controller ${active ? "" : "dis"}connected`);
});

controller.connection.active; // returns true while the controller is available
controller.wireless; // returns true while connected over bluetooth
```

When the user switches from wired to wireless or vice versa, `dualsense-ts` will reconnect to the same device seamlessly.

### Input APIs

`dualsense-ts` provides several interfaces for reading input:

- _Synchronous_: It's safe to read the current input state at any time. When the controller disconnects, these all reset to their neutral states.

```typescript
// Buttons
controller.circle.state; // false
controller.left.bumper.state; // true

// Triggers
controller.right.trigger.active; // true
controller.right.trigger.pressure; // 0.72, 0 - 1

// Analog Sticks - represented as a position on a unit circle
controller.left.analog.x.active; // true, when away from center
controller.left.analog.x.state; // 0.51, -1 to 1
controller.left.analog.direction; // 4.32, radians
controller.left.analog.magnitude; // 0.23, 0 to 1

// Touchpad - each touch point works like an analog input
controller.touchpad.right.contact.state; // false
controller.touchpad.right.x.state; // -0.44, -1 to 1
```

- _Callbacks_: Each input is an EventEmitter or EventTarget that provides `input`, `press`, `release`, and `change` events:

```typescript
// Change events are triggered only when an input's value changes
controller.triangle.on("change", (input) =>
  console.log(`${input} changed: ${input.active}`),
);
// ▲ changed: true
// ▲ changed: false

// The callback provides two arguments, so you can monitor nested inputs
// You'll get a reference to your original input, and the one that changed
controller.dpad.on("press", (dpad, input) => {
  assert(dpad === controller.dpad);
  console.log(`${input} pressed`);
});
// ↑ pressed
// → pressed
// ↑ pressed

// `input` events are triggered whenever there is new information from the controller
// Your Dualsense may provide over 250 `input` events per second, so use this sparingly
// These events are not available for nested inputs, like the example above
controller.left.analog.x.on("input", console.log);

// Remove a specific listener
const handler = ({ active }) => console.log(active);
controller.cross.on("press", handler);
controller.cross.off("press", handler);

// Remove all listeners for an event
controller.cross.removeAllListeners("press");
```

- _Promises_: Wait for one-off inputs using `await`:

```typescript
// Resolves next time `dpad up` is released
const { active } = await controller.dpad.up.promise("release");

// Wait for the next press of any dpad button
const { left, up, down, right } = await controller.dpad.promise("press");

// Wait for any input at all
await controller.promise();
```

- _Async Iterators_: Each input is an async iterator that provides state changes:

```typescript
for await (const { pressure } of controller.left.trigger) {
  console.log(`L2: ${Math.round(pressure * 100)}%`);
}
```

### Other Supported Features

#### Touchpad

The touchpad supports two simultaneous touches, each modeled as an analog input with x/y axes ranging from -1 to 1 (center is 0,0). The physical touchpad button is a separate input:

```typescript
// React to the first touch point (or single-finger touch)
controller.touchpad.left.on("change", (touch) => {
  console.log(
    `Touch: x=${touch.x.state.toFixed(2)}, y=${touch.y.state.toFixed(2)}`,
  );
});

// Detect touch contact and release
controller.touchpad.left.contact.on("press", () => console.log("Finger down"));
controller.touchpad.left.contact.on("release", () => console.log("Finger up"));

// Second touch point for multi-touch
controller.touchpad.right.on("change", (touch) => {
  if (touch.contact.active) {
    console.log(
      `Touch 2: x=${touch.x.state.toFixed(2)}, y=${touch.y.state.toFixed(2)}`,
    );
  }
});

// Physical click of the touchpad
controller.touchpad.button.on("press", () => console.log("Touchpad clicked"));
// And another way to detect a touch
controller.touchpad.on("press", () => console.log("Touchpad touched"));
```

Each touch point also exposes a `tracker` ([Increment](src/elements/increment.ts)) that provides a touch ID, which increments each time a new finger is placed on the pad.

#### Motion Control

You can access raw gyroscope and accelerometer readings from the device:

```typescript
controller.gyroscope.on("change", ({ x, y, z }) => {
  console.log(`Gyroscope: \n\t${x}\n\t${y}\n\t${z}`);
});

controller.accelerometer.on("change", ({ x, y, z }) => {
  console.log(`Accelerometer: \n\t${x}\n\t${y}\n\t${z}`);
});

controller.accelerometer.z.on("change", ({ magnitude }) => {
  if (magnitude > 0.3) console.log("Controller is moving!");
});
```

You'll need to perform additional processing to get the most use out of them - for example, by buffering accelerometer inputs and using a rolling Fourier transform to detect shaking.

#### Battery

The controller provides its current battery level and charging status:

```typescript
// Check charging status
import { ChargeStatus } from "dualsense-ts";

controller.battery.status.on("change", ({ state }) => {
  switch (state) {
    case ChargeStatus.Charging:
      console.log("Charging");
      break;
    case ChargeStatus.Discharging:
      console.log("On battery");
      break;
    case ChargeStatus.Full:
      console.log("Fully charged");
      break;
  }
});

// React to battery level changes
controller.battery.level.on("change", ({ state }) => {
  console.log(`Battery: ${Math.round(state * 100)}%`);
  if (state < 0.2) console.log("Low battery!");
});
```

After connection it may take a second for these values to populate. Please note that the battery level is not a precise reading - it changes in 10% increments and is prone to flip-flopping. `dualsense-ts` makes an attempt to buffer and normalize these values.

#### Rumble

The controller has two haptic rumbles. The left motor produces a stronger, lower-frequency rumble, while the right actuator produces a lighter, higher-frequency vibration. They are controlled independently:

```typescript
controller.rumble(1.0); // 100% rumble intensity
controller.left.rumble(0.5); // 50% rumble intensity on the left
console.log(controller.left.rumble()); // Prints 0.5
console.log(controller.right.rumble()); // Prints 1
controller.rumble(0); // Stop rumbling

controller.rumble(true); // Another way to set 100% intensity
controller.rumble(false); // Another way to stop rumbling

// Control right rumble intensity with the right trigger
controller.right.trigger.on("change", (trigger) => {
  controller.right.rumble(trigger.pressure);
});
```

#### Adaptive Triggers

Adaptive trigger feedback is controlled via `controller.left.trigger.feedback` / `controller.right.trigger.feedback`.

```typescript
import { Dualsense, TriggerEffect } from "dualsense-ts";

const controller = new Dualsense();

// Continuous resistance starting at 30% travel
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Feedback,
  position: 0.3, // 0 - 1
  strength: 0.8,
});

// Weapon trigger — resistance with snap release
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

// Vibration with frequency
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Vibration,
  position: 0.1,
  amplitude: 0.7,
  frequency: 40, // in Hz, 0 - 255
});

// Reset to default linear feel
controller.right.trigger.feedback.reset();

// Reset both triggers
controller.resetTriggerFeedback();

// Read current config
console.log(controller.right.trigger.feedback.config);
console.log(controller.right.trigger.feedback.effect); // TriggerEffect.Off
```

Feedback state is automatically restored if the controller disconnects and reconnects - no handling required on your end.

#### Trigger effects

| Effect                    | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `TriggerEffect.Off`       | No resistance (default linear feel)                        |
| `TriggerEffect.Feedback`  | Zone-based continuous resistance from a start position     |
| `TriggerEffect.Weapon`    | Resistance with a snap release point                       |
| `TriggerEffect.Bow`       | Weapon feel with snap-back force                           |
| `TriggerEffect.Galloping` | Rhythmic two-stroke oscillation                            |
| `TriggerEffect.Vibration` | Zone-based oscillation with amplitude and frequency        |
| `TriggerEffect.Machine`   | Dual-amplitude vibration with frequency and period control |

Each effect accepts a unique set of configuration options; your editor's type hints will guide you through the available parameters for each effect. The [interactive demo](https://nsfm.github.io/dualsense-ts/) includes full slider controls for every effect and parameter, making it a great tool for finding the right values.

Effect names are based on [Nielk1's DualSense trigger effect documentation](https://gist.github.com/Nielk1/6d54cc2c00d2201ccb8c2720ad7538db).

#### Lights

You can control the controller's lightbar as well as the player indicator and mute LEDs:

```typescript
import { PlayerID, Brightness } from "dualsense-ts";

// Light bar — set color with {r, g, b} (0–255 per channel)
controller.lightbar.set({ r: 255, g: 0, b: 128 });
controller.lightbar.color; // { r: 255, g: 0, b: 128 }

// Light bar pulse effects — firmware-driven one-shot animations
// This overrides your custom color
controller.lightbar.fadeBlue(); // Fades to blue and holds
// You must call `fadeOut()` to restore custom lightbar colors
controller.lightbar.fadeOut(); // Fades to black, then returns to set color

// Player indicator LEDs — 5 white LEDs, individually addressable
controller.playerLeds.set(PlayerID.Player1); // Use a preset pattern
controller.playerLeds.setLed(0, true); // Toggle individual LEDs (0–4)
controller.playerLeds.setLed(4, true);
controller.playerLeds.clear(); // All off
controller.playerLeds.setBrightness(Brightness.Medium); // High, Medium, or Low

// Override the mute LED with a software-controlled mode
import { MuteLedMode } from "dualsense-ts";
controller.mute.setLed(MuteLedMode.On); // Solid on
controller.mute.setLed(MuteLedMode.Pulse); // Slow pulse
controller.mute.setLed(MuteLedMode.Off); // Force off
controller.mute.resetLed(); // Return control to firmware
```

The `{r, g, b}` format is compatible with popular color libraries. Pass the output of `colord().toRgb()`, `tinycolor().toRgb()`, or `Color().object()` straight to `lightbar.set()`.

By default the mute LED is managed by the controller firmware (toggled by the physical button). Use `setLed()` to override with a specific mode, and `resetLed()` to hand control back. A physical button press will also return the LED to firmware control.

#### Audio Peripherals

The controller reports whether a microphone and/or headphones are connected via the 3.5mm jack:

```typescript
controller.headphone.on("change", ({ state }) => {
  console.log(`Headphones ${state ? "" : "dis"}connected`);
});

controller.microphone.on("change", ({ state }) => {
  console.log(`Microphone ${state ? "" : "dis"}connected`);
});

controller.headphone.state; // true when headphones are plugged in
controller.microphone.state; // true when a microphone is available

// `mute.status` is true when the user has muted the microphone
// Usually it's tied to the LED state, unless you've overridden the LED
controller.mute.status.on("change", ({ state }) => {
  console.log(`Mute: ${state ? "muted" : "unmuted"}`);
});
```

#### Audio Control

The DualSense has a built-in speaker and microphone. Over USB, it registers as a standard audio device at the OS level. `dualsense-ts` provides volume, routing, and mute controls:

```typescript
import { AudioOutput, MicSelect, MicMode } from "dualsense-ts";

// Volume control (0.0-1.0)
controller.audio.setSpeakerVolume(0.8);
controller.audio.setHeadphoneVolume(0.5);
controller.audio.setMicrophoneVolume(1.0);

// Audio output routing
controller.audio.setOutput(AudioOutput.Speaker); // Internal speaker only
controller.audio.setOutput(AudioOutput.Headphone); // Headphone only (default)
controller.audio.setOutput(AudioOutput.Split); // Left: headphone, right: speaker

// Per-output muting
controller.audio.muteSpeaker(true);
controller.audio.muteHeadphone(true);
controller.audio.muteMicrophone(true);
controller.audio.muteSpeaker(false); // Unmute

// Microphone source and processing
controller.audio.setMicSelect(MicSelect.Internal); // Built-in mic
controller.audio.setMicSelect(MicSelect.Headset); // Headset mic
controller.audio.setMicMode(MicMode.Chat); // Chat mode

// Speaker preamp gain (0–7) and beam forming
controller.audio.setPreamp(4);
controller.audio.setPreamp(2, true); // Enable beam forming
```

These HID commands control volume and routing but do not stream audio data. To send audio to the controller's speaker or capture from its microphone, use the OS audio device (Web Audio API or a native audio library like PortAudio). The helper function `findDualsenseAudioDevices()` locates matching audio devices in the browser:

```typescript
import { findDualsenseAudioDevices } from "dualsense-ts";

const { outputs, inputs } = await findDualsenseAudioDevices();

// Route audio to the controller's speaker
if (outputs.length > 0) {
  const ctx = new AudioContext({ sinkId: outputs[0].deviceId });
}

// Capture from the controller's microphone
if (inputs.length > 0) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: { exact: inputs[0].deviceId } },
  });
}
```

For Node.js, enumerate audio devices by USB vendor ID `0x054C` and product ID `0x0CE6` using your audio library of choice. These constants are exported as `DUALSENSE_AUDIO_VENDOR_ID` and `DUALSENSE_AUDIO_PRODUCT_ID`.

Unfortunately, multi-controller support is limited. We don't have a dependable way to link individual controllers to their device IDs across all connection types at this time - if you have any ideas, please submit a PR!

#### Color and Serial Number

`dualsense-ts` reads the controller's body color and serial number from factory info after connection:

```typescript
import { DualsenseColor } from "dualsense-ts";

controller.color; // DualsenseColor.CosmicRed
controller.serialNumber; // Factory-stamped serial number
```

`color` returns a `DualsenseColor` enum value (`DualsenseColor.Unknown` when factory info is unavailable).

#### Firmware and Factory Info

`dualsense-ts` automatically reads firmware details and factory information from the device after connection. These values may take a moment to populate.

```typescript
const fw = controller.firmwareInfo;
const v = fw.mainFirmwareVersion;
console.log(`Firmware: ${v.major}.${v.minor}.${v.patch}`);
console.log(`Built: ${fw.buildDate} ${fw.buildTime}`);
console.log(`Hardware: ${fw.hardwareInfo}`);

const fi = controller.factoryInfo;
console.log(`Color: ${fi.colorName}`); // e.g. "Cosmic Red"
console.log(`Board: ${fi.boardRevision}`); // e.g. "BDM-030"
console.log(`Serial: ${fi.serialNumber}`);
```

The `firmwareInfo` property includes build date/time, firmware versions, hardware info, and device info. The `factoryInfo` property includes the controller's body color, board revision, and serial number.

## Using `dualsense-ts` with React

Check out [the demo app](./webhid_example/) for reference implementations. All features supported by the controller are available in the app.

```typescript
// DualsenseContext.tsx
import { createContext } from "react";
import { Dualsense } from "dualsense-ts";

const controller = new Dualsense();
export const DualsenseContext = createContext(controller);
DualsenseContext.displayName = "DualsenseContext";

controller.connection.on("change", ({ state }) => {
  console.group("dualsense-ts");
  console.log(`Controller ${state ? "" : "dis"}connected`);
  console.groupEnd();
});

controller.hid.on("error", (err) => {
  console.group("dualsense-ts");
  console.log(err);
  console.groupEnd();
});
```

The user will need to grant permission before we can access new devices using the WebHID API. The `Dualsense` class provides a callback that can be used as a handler for `onClick` or [other user-triggered events](https://developer.mozilla.org/en-US/docs/Web/Security/User_activation):

```typescript
// PermissionComponent.tsx
import { useContext } from "react";
import { DualsenseContext } from "./DualsenseContext";

export const RequestController = () => {
  const controller = useContext(DualsenseContext);
  return (
    <button onClick={controller.hid.provider.getRequest()}>
      Grant Permission
    </button>
  );
};
```

Now components with access to this context can enjoy the shared `dualsense-ts` interface:

```typescript
// ConnectionComponent.tsx
import { useContext, useEffect, useState } from "react";
import { DualsenseContext } from "./DualsenseContext";

export const ControllerConnection = () => {
  const controller = useContext(DualsenseContext);
  const [connected, setConnected] = useState(controller.connection.state);
  const [triangle, setTriangle] = useState(controller.triangle.state);

  useEffect(() => {
    controller.connection.on("change", ({ state }) => setConnected(state));
    controller.triangle.on("change", ({ state }) => setTriangle(state));
  }, []);

  return (
    <p dir={triangle ? "ltr" : "rtl"}>{`Controller ${
      connected ? "" : "dis"
    }connected`}</p>
  );
};
```

## Multiplayer

`dualsense-ts` supports multiple controllers through the `DualsenseManager` class. The manager automatically discovers controllers, assigns player LEDs, and preserves player slots across disconnects and USB/Bluetooth switches.

### Quick start

```typescript
import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// React to controller count changes
manager.on("change", ({ active, players }) => {
  console.log(`${active} controller(s) connected`);
  for (const [index, controller] of players) {
    console.log(
      `Player ${index + 1}: ${controller.connection.active ? "ready" : "away"}`,
    );
  }
});
```

In Node.js, the manager polls for new devices automatically. In the browser, you'll still need to request permission via a user gesture:

```typescript
// React / plain JS
<button onClick={manager.getRequest()}>Add Controllers</button>
```

This only applies to the first connection for each controller.

### Accessing controllers

```typescript
manager.controllers; // readonly Dualsense[] — all managed controllers
manager.get(0); // Dualsense | undefined — by slot index
manager.count; // number of managed slots (including disconnected)
manager.state.active; // number of currently connected controllers

// Iterate
for (const controller of manager) {
  console.log(controller.triangle.state);
}
```

### Player LEDs

The manager auto-assigns player LED patterns as controllers connect. The first four match the PS5 console convention; slots 5-31 use the remaining 5-bit LED combinations.

```typescript
import { DualsenseManager, PlayerID, Brightness } from "dualsense-ts";

const manager = new DualsenseManager();

// Override a specific slot's LED pattern (5-bit bitmask, 0x00–0x1f)
manager.setPlayerPattern(4, 0b10001); // Player 5: outer two LEDs
manager.getPlayerPattern(0); // 0x04 (PlayerID.Player1)

// Disable auto-assignment and manage LEDs yourself
manager.autoAssignPlayerLeds = false;
manager.get(0)?.playerLeds.set(PlayerID.All);
manager.get(0)?.playerLeds.setBrightness(Brightness.Low);
```

### Reconnection

When a controller disconnects, its slot is preserved. If the same controller reconnects, even through a different connection type (USB to Bluetooth or vice versa), it returns to its original slot with the same player number. Reconnection matching uses hardware identity provided by the controller's firmware.

### Slot management

Disconnected controllers hold their slot open for reconnection. To free slots:

```typescript
// Release a specific slot
manager.release(2);

// Release all disconnected slots at once
manager.releaseDisconnected();

// Stop discovery and disconnect everything
manager.dispose();
```

### Single player

Using `new Dualsense()` directly continues to work exactly as before, allowing you to manage a single controller. `DualsenseManager` is entirely opt-in - you only need it when managing multiple controllers. Do not use standalone `Dualsense` instances and a `DualsenseManager` at the same time.

## Known Issues

### Audio streaming requires USB

The DualSense registers as a USB Audio Class device only over USB. Over Bluetooth, there is no audio transport. Audio controls (volume, routing, muting) work over both USB and Bluetooth, but they only affect audio playback over USB.

### Linux - headphone audio plays in one ear only

PulseAudio defaults to the mono "Speaker" profile when the DualSense is connected. This sends a single audio channel, which the controller routes to the right side only. To get stereo headphone output, switch to the headphones profile:

```bash
# Switch to stereo headphone profile
pactl set-card-profile alsa_card.usb-Sony_Interactive_Entertainment_Wireless_Controller-00 "HiFi (Headphones, Mic)"

# Set it as the default output and adjust volume
pactl set-default-sink alsa_output.usb-Sony_Interactive_Entertainment_Wireless_Controller-00.HiFi__Headphones__sink
pactl set-sink-volume alsa_output.usb-Sony_Interactive_Entertainment_Wireless_Controller-00.HiFi__Headphones__sink 100%
```

### Linux - can't use multiple controllers over Bluetooth

Identical Bluetooth devices are not given separate HID interfaces under some circumstances. You may still use multiple USB-connected controllers plus one Bluetooth controller.

## Other Dualsense Variants

The DualSense FlexStrike, DualSense Edge, and DualSense Access controllers are not yet supported. This functionality is on the roadmap.

The PS4 DualShock controller is not supported.

## Migration Guide

`dualsense-ts` uses semantic versioning. For more info on breaking changes, [check out the migration guide](MIGRATION_GUIDE.md).

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense) - HID report reference
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense) - HID report reference
- [nondebug](https://github.com/nondebug)'s [dualsense reference](https://github.com/nondebug/dualsense) - WebHID reference
- [daidr](https://github.com/daidr)'s [dualsense-tester](https://github.com/daidr/dualsense-tester) - firmware/factory info reference
- [nowrep](https://github.com/nowrep)'s [dualsensectl](https://github.com/nowrep/dualsensectl) - firmware info reference
- [Contributors to `dualsense-ts` on Github](https://github.com/nsfm/dualsense-ts/graphs/contributors)
