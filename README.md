# dualsense-ts

`dualsense-ts` is the natural interface for your DualSense controller. It's fully-typed, fully-featured, easy to use, and supports wired and wireless connections in both node.js and the browser.

**[Live demo](https://nsfm.github.io/dualsense-ts/)** - connect a controller and try it out!

## Getting started

### Installation

[This package is distributed via npm](https://www.npmjs.com/package/dualsense-ts). Install it the usual way:

- `npm add dualsense-ts`

#### In the browser

`dualsense-ts` has zero dependencies and relies on the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). At this time, only Chrome, Edge, and Opera are compatible.

#### In node.js

`dualsense-ts` relies on `node-hid` as a peer dependency, so you'll need to add it to your project as well:

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
  console.log(`${input} changed: ${input.active}`)
);
// ▲ changed: true
// ▲ changed: false

// The callback provides two arguments, so you can monitor nested inputs
// You'll get a reference to your original input, and the one that changed
controller.dpad.on("press", (dpad, input) =>
  assert(dpad === controller.dpad)
  console.log(`${input} pressed`)
);
// ↑ pressed
// → pressed
// ↑ pressed

// `input` events are triggered whenever there is new information from the controller
// Your Dualsense may provide over 250 `input` events per second, so use this sparingly
// These events are not available for nested inputs, like the example above
controller.left.analog.x.on("input", console.log)
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

#### Motion Control

You can access raw gyroscope and accelerometer readings from the device:

```typescript
controller.gyroscope.on("change", ({ x, y, z }) => {
  console.log(`Gyroscope: \n\t${x}\n\t${y}\n\t${z}`)
}

controller.accelerometer.on("change", ({ x, y, z }) => {
  console.log(`Accelerometer: \n\t${x}\n\t${y}\n\t${z}`)
}

controller.accelerometer.z.on("change", ({ magnitude }) => {
  if (magnitude > 0.3) console.log('Controller is moving!')
})
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

You can control the controller's lightbar as well as the player indicator LEDs:

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

// Mute LED — read-only, reflects controller firmware state
controller.mute.status.on("change", ({ state }) => {
  console.log(`Mute: ${state ? "muted" : "unmuted"}`);
});
```

The `{r, g, b}` format is compatible with popular color libraries. Pass the output of `colord().toRgb()`, `tinycolor().toRgb()`, or `Color().object()` straight to `lightbar.set()`.

The mute LED cannot be controlled (the firmware toggles it on and off with the button) but you can read its current state. `controller.mute` allows you to read the button like a normal input, while `controller.mute.status` is a toggle input tied to the LED's state.

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
```

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

Check out [the example app](./webhid_example/) for more details.

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

In Node.js, the manager polls for new devices automatically. In the browser, you'll need to request permission via a user gesture:

```typescript
// React / plain JS
<button onClick={manager.getRequest()}>Add Controllers</button>
```

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

The manager auto-assigns player LED patterns as controllers connect. The first four match the PS5 console convention; slots 5–31 use the remaining 5-bit LED combinations.

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

When a controller disconnects, its slot is preserved. If the same controller reconnects - even through a different connection type (USB to Bluetooth or vice versa) - it returns to its original slot with the same player number. Reconnection matching uses hardware identity read directly from the controller's firmware.

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

### Linux - can't use multiple controllers over Bluetooth

Identical Bluetooth devices are not given separate HID interfaces under some circumstances. You may still use multiple USB-connected controllers plus one Bluetooth controller.

### Linux - can't access factory info over Bluetooth connection in Node.js

Factory info uses the HID SET_REPORT feature report protocol, which the Linux kernel's `hid_playstation` driver does not pass through over Bluetooth. Factory info is still available over USB or Bluetooth in the browser. See [LINUX_HID.md](LINUX_HID.md) for investigation details.

## Other Dualsense Variants

The DualSense FlexStrike, DualSense Edge, and DualSense Access controllers are not yet supported. This functionality is on the roadmap.

The PS4 DualShock controller is not supported.

## Migration Guide

`dualsense-ts` uses semantic versioning. For more info on breaking changes, [check out the migration guide](MIGRATION_GUIDE.md).

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense) - HID report reference
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense) - HID report reference
- [nondebug](https://github.com/nondebug)'s [dualsense reference](https://github.com/nondebug/dualsense) - WebHID reference
- [daidr](https://github.com/daidr)'s [dualsense-tester](https://github.com/daidr/dualsense-tester) — firmware/factory info reference
- [nowrep](https://github.com/nowrep)'s [dualsensectl](https://github.com/nowrep/dualsensectl) - firmware info reference
- [Contributors to `dualsense-ts` on Github](https://github.com/nsfm/dualsense-ts/graphs/contributors)
