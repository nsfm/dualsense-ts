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

#### Rumble

Supported in node.js over **USB and Bluetooth**.

Rumble can be controlled via the high-level `Dualsense` API (`controller.rumble(...)` / `controller.left.rumble(...)`), or via the low-level HID API (`controller.hid.setRumble(...)`) if you want direct byte control.

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

#### Adaptive Triggers (Active Triggers)

Adaptive triggers are supported in node.js over **USB and Bluetooth** via the low-level HID API.

The simplest usage is to call `controller.hid.setLeftTriggerFeedback(...)` / `controller.hid.setRightTriggerFeedback(...)` with a `TriggerMode` and a list of force parameters.

```typescript
import { Dualsense, TriggerMode } from "dualsense-ts";

const controller = new Dualsense();

// Example: turn on a pulse-like effect on the right trigger
controller.hid.setRightTriggerFeedback(TriggerMode.Pulse, [
  128, // force parameter 1
  0,   // force parameter 2
  0,   // ...
]);

// Turn it back off (normal linear trigger)
controller.hid.setRightTriggerFeedback(TriggerMode.Off, []);
```

### Output / HID write reference (node.js)

If you need precise control (or want to send effects independent of the higher-level `Dualsense` helpers),
the `DualsenseHID` instance is available at `controller.hid`.

#### `controller.hid.setRumble(left, right)`

- **left**: integer \(0..255\) (left motor intensity)
- **right**: integer \(0..255\) (right motor intensity)

Notes:
- Values outside \(0..255\) should be clamped by user code.
- Works over **USB and Bluetooth** in node.js.

#### `controller.hid.setLeftTriggerFeedback(mode, forces)` / `setRightTriggerFeedback(mode, forces)`

- **mode**: a `TriggerMode` value
  - `TriggerMode.Off` disables adaptive trigger effects (normal linear feel)
  - other values (e.g. `TriggerMode.Rigid`, `TriggerMode.Pulse`, etc.) enable effects
- **forces**: an array of integers \(0..255\)
  - Each entry is written into the controller’s trigger parameter bytes.
  - You can pass **0 to 6** values; extra values are ignored.

Notes:
- Different `TriggerMode`s interpret the parameter bytes differently; start with small values and iterate.

#### Trigger reset on connect

When a controller becomes connected (including reconnects), `dualsense-ts` will automatically reset both triggers to the default, non-adaptive state by calling:

- `controller.hid.resetTriggerFeedback()`

You can also call it manually at any time:

```typescript
controller.hid.resetTriggerFeedback();
```

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
