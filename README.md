# dualsense-ts

This module provides a natural interface for your DualSense controller.

## Getting started

### Installation

[This package is distributed via npm](https://www.npmjs.com/package/dualsense-ts). Install it the usual way:

- `npm add dualsense-ts`

In the browser, `dualsense-ts` has zero dependencies and relies on the [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API). At this time, only Chrome, Edge, and Opera are compatible.

In node.js, `dualsense-ts` relies on `node-hid` as a peer dependency, so you'll need to add it as well:

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
const connected = controller.connection.active

controller.connection.on("change", ({ active }) = > {
  console.log(`controller ${active ? '' : 'dis'}connected`)
});
```

`dualsense-ts` supports both wired and Bluetooth devices. When connected over Bluetooth, `controller.wireless` will return `true`.

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
+controller.touchpad.right.x; // -0.44, -1 to 1
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

```typescript
controller.gyroscope.on("change", ({ x, y, z }) => {
  console.log(`Gyroscope: \n\t${x}\n\t${y}\n\t${z}`)
}

controller.accelerometer.on("change", ({ x, y, z }) => {
  console.log(`Accelerometer: \n\t${x}\n\t${y}\n\t${z}`)
}

controller.accelerometer.z.on("change", ({ force }) => {
  if (force > 0.3) console.log('Controller moving')
})
```

#### Rumble (node.js only)

The controller features independent rumble settings for the left and right sides.

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

#### Adaptive Triggers (node.js only)

You can set the feedback mode of each trigger to provide tactile response:

```typescript
import { TriggerMode } from "dualsense-ts";

// Apply a resistance effect to the right trigger
controller.right.trigger.feedback.set(
  TriggerMode.Pulse,
  [128, 0, 0, 0, 0, 0, 0],
);

// Reset to default linear feel
controller.right.trigger.feedback.reset();

// Reset both triggers to the default state
controller.resetTriggerFeedback();

// Read the current state
console.log(controller.right.trigger.feedback.mode); // TriggerMode.Pulse
console.log(controller.right.trigger.feedback.forces); // [128, 0, 0, 0, 0, 0, 0]
```

Feedback state is automatically restored if the controller disconnects and reconnects — no handling required on your end.

#### Trigger modes

Each mode interprets the force parameters differently. Force values are integers 0–255.

**`TriggerMode.Off`** — No resistance. Default linear feel.

**`TriggerMode.Rigid`** — Constant resistance starting at a position along the trigger's travel.

| Parameter | Description                                                  |
| --------- | ------------------------------------------------------------ |
| forces[0] | Start position (0 = immediately, 255 = nearly fully pressed) |
| forces[1] | Resistance strength                                          |

**`TriggerMode.Pulse`** — Resistance applied within a defined window of the trigger's travel.

| Parameter | Description         |
| --------- | ------------------- |
| forces[0] | Start position      |
| forces[1] | End position        |
| forces[2] | Resistance strength |

**`TriggerMode.PulseFull`** — Full effect mode with a strength curve and optional vibration frequency.

| Parameter | Description                                            |
| --------- | ------------------------------------------------------ |
| forces[0] | Start position                                         |
| forces[1] | Flags (bit 2: pause effect when trigger fully pressed) |
| forces[2] | —                                                      |
| forces[3] | Strength at start of resistance zone                   |
| forces[4] | Strength at mid travel                                 |
| forces[5] | Strength at end of travel                              |
| forces[6] | Vibration frequency in Hz (0 = no vibration)           |

> The intermediate modes (`RigidA`, `RigidB`, `RigidFull`, `PulseA`, `PulseB`) activate partial combinations of the extended parameter set. Parameter documentation for these is pending testing. `Calibration` is firmware-internal and not intended for general use.

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

If inputs are not working or wrong, use the debugger to view the report buffer and include this with your issue to help us reproduce the problem.

## Migration Guide

`dualsense-ts` uses semantic versioning. For more info on breaking changes, [check out the migration guide](MIGRATION_GUIDE.md).

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
- [nondebug](https://github.com/nondebug)'s [dualsense reference](https://github.com/nondebug/dualsense)
- [Contributors to `dualsense-ts` on Github](https://github.com/nsfm/dualsense-ts/graphs/contributors)
