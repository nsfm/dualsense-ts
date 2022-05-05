# dualsense-ts

This library provides convenient, strictly type-safe tools for interfacing with a Playstation 5 Dualsense controller.

## Getting started

### Connecting

By default, `dualsense-ts` will try to connect to the first Dualsense controller it finds.

```typescript
import { Dualsense } from "dualsense-ts";

// Grab a controller connected via USB or Bluetooth
const controller = new Dualsense();
```

### Input

`dualsense-ts` provides several interfaces for reading input:

- _Synchronous_: It's safe to read the current input state at any time

```typescript
// Buttons
controller.circle.active; // false
controller.cross.active; // true
controller.left.bumper.active; // true

// Triggers
controller.right.trigger.active; // true
controller.right.trigger.pressure; // 0.72 (0 - 1)

// Analog Sticks
controller.left.analog.x.active; // true
controller.left.analog.x.state; // 0.51 (0 - 1)
controller.right.analog.y.active; // false
+controller.right.analog.y; // 0 (0 - 1)
```

- _Callbacks_: Each input is an EventEmitter that provides `input` or `change` events

```typescript
// Change events are triggered only when an input's value changes
controller.triangle.on("change", (input) =>
  console.log(`${input} changed: ${input.active}`)
);
// ▲ changed: true
// ▲ changed: false

controller.triangle.removeAllListeners();

// The callback provides two arguments, so you can monitor nested inputs
controller.dpad.on("change", (dpad, input) =>
  assert(dpad === controller.dpad) // The input you subscribed to
  console.log(`${input} changed: ${input.active}`) // The input that actually changed
);
// ↑ changed: true
// → changed: true
// ↑ changed: false

// `input` events are triggered whenever there is new information from the controller
// Your Dualsense may provide over 250 `input` events per second, so use this sparingly
// These events are not available for nested inputs, like in the example above
controller.left.analog.x.on("input", console.log)
```

- _Promises_: Wait for one-off inputs using `await`

```typescript
// Wait for up to be pressed or released
const { active } = await controller.dpad.up.promise();

// Wait for the next change to any dpad button's state
const { left, up, down, right } = await controller.dpad.promise();

// Wait for any input at all
await controller.promise();
```

- _Async Iterators_: Each input is an async iterator that provides state changes

```typescript
for await (const { left, right, up, down } of controller.dpad) {
  console.log(`dpad: ${left} ${up} ${down} ${right}`);
}
```

## Other features

Not much else is supported yet. Check out the [roadmap](./ROADMAP.md) for more info about upcoming features.

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
