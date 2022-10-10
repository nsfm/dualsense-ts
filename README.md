# dualsense-ts

This module provides a natural interface for your DualSense controller.

## Getting started

### Installation

[This package is distributed via npm](https://npmjs.org/package.dualsense-ts). Install it the usual way:

- `yarn add dualsense-ts`
- `npm add dualsense-ts`

In the browser, `dualsense-ts` has zero dependencies and relies on the native WebHID interface.

In Node.js, `dualsense-ts` relies on `node-hid`, so you'll need to add that as well:

- `yarn add node-hid`
- `npm add node-hid`

### Connecting

When you construct a `new Dualsense()`, the connection to your controller will be managed in the background.

```typescript
import { Dualsense } from "dualsense-ts";

// Grab a controller connected via USB or Bluetooth
const controller = new Dualsense();
```

If your device becomes disconnected, `dualsense-ts` will quietly wait for it to come back. You can monitor the connection state using the same APIs as any other input:

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

- _Callbacks_: Each input is an EventEmitter, or EventTarget that provides `input`, `press`, `release`, and `change` events

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

### React

Set up a context for your controller:

```typescript
// Controller.tsx
import React from "react";
import { Dualsense } from "dualsense-ts";

export const ControllerContext = React.createContext<Dualsense>(
  new Dualsense()
);
```

Use the context to set up your component:

```typescript
// MyButton.tsx
import React from "react";
import { ControllerContext } from "./Controller.tsx";

// A button that's only active while the user is holding triangle on the controller
export const MyButton = () => {
  const { state: controller } = React.useContext(ControllerContext);
  const [triangle, setTriangle] = React.useState(controller.triangle);
  React.useCallback(
    () => triangle.on("change", (new) => setTriangle(new)),
    [triangle]
  );

  return <button active={triangle.active}>
}
```

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
