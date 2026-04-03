# dualsense-ts

This package provides a natural interface for your DualSense controller. It's fully-typed, fully-featured, and supports wired and wireless connections in both node.js and the browser.

**[Try it out](https://nsfm.github.io/dualsense-ts/)** - connect your controller and explore inputs, haptics, and lighting controls.

## Getting started

### Installation

[This package is distributed via npm](https://www.npmjs.com/package/dualsense-ts). Install it the usual way:

- `npm add dualsense-ts`

In the browser, `dualsense-ts` has zero dependencies and relies on the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). At this time, only Chrome, Edge, and Opera are compatible.

In node.js, `dualsense-ts` relies on `node-hid` as a peer dependency, so you'll need to add it to your project as well:

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
controller.connection.on("change", ({ active }) = > {
  console.log(`controller ${active ? '' : 'dis'}connected`)
});

controller.connection.active // returns true while the controller is available
controller.wireless // returns true while connected over bluetooth
```

### Input APIs

`dualsense-ts` provides several interfaces for reading input:

- _Synchronous_: It's safe to read the current input state at any time

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
controller.touchpad.right.x; // -0.44, -1 to 1
```

- _Callbacks_: Each input is an EventEmitter or EventTarget that provides `input`, `press`, `release`, and `change` events

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

- _Promises_: Wait for one-off inputs using `await`

```typescript
// Resolves next time `dpad up` is released
const { active } = await controller.dpad.up.promise("release");

// Wait for the next press of any dpad button
const { left, up, down, right } = await controller.dpad.promise("press");

// Wait for any input at all
await controller.promise();
```

- _Async Iterators_: Each input is an async iterator that provides state changes

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

controller.accelerometer.z.on("change", ({ force }) => {
  if (force > 0.3) console.log('Controller is moving!')
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
  controller.right.rumble(trigger.magnitude);
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

Feedback state is automatically restored if the controller disconnects and reconnects — no handling required on your end.

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

Each effect accepts a unique set of configuration options — your editor's type hints will guide you through the available parameters for each effect. The [interactive demo](https://nsfm.github.io/dualsense-ts/) includes full slider controls for every effect and parameter, making it a great tool for finding the right values.

Effect names are based on [Nielk1's DualSense trigger effect documentation](https://gist.github.com/Nielk1/6d54cc2c00d2201ccb8c2720ad7538db).

#### Lights

You can control the touchpad's lightbar as well as the player indicator LEDs:

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

The `{r, g, b}` format is directly compatible with popular color libraries — pass the output of `colord().toRgb()`, `tinycolor().toRgb()`, or `Color().object()` straight to `lightbar.set()`.

The mute LED cannot be controlled (the firmware toggles it on and off with the button) but you can read its current state. `controller.mute` allows you to read the button like a normal input, while `controller.mute.status` is a toggle input tied to the LED's state.

### With React

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
    <button
      text="Grant Permission"
      onClick={controller.hid.provider.getRequest()}
    />
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
      state ? "" : "dis"
    }connected`}</p>
  );
};
```

### It's not working

Try out the [example app](https://nsfm.github.io/dualsense-ts/)'s debugger to look for clues. Please open an issue on Github if you have questions or something doesn't seem right.

If something seems wrong, use the debugger to view the report buffer. Collect a few buffers in different states if possible. Please provide your controller's model number in the report - it's located on the back. Some versions have unique quirks.

## Migration Guide

`dualsense-ts` uses semantic versioning. For more info on breaking changes, [check out the migration guide](MIGRATION_GUIDE.md).

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
- [nondebug](https://github.com/nondebug)'s [dualsense reference](https://github.com/nondebug/dualsense)
- [Contributors to `dualsense-ts` on Github](https://github.com/nsfm/dualsense-ts/graphs/contributors)
