# dualsense-ts

This library provides convenient, type-safe tools for getting useful input from a Playstation 5 Dualsense controller.

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
controller.triangle.on("change", (input) =>
  console.log(`${input} changed: ${input.active}`)
);
// ▲ [X] changed: true
// ▲ [_] changed: false

controller.triangle.removeAllListeners();
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

### Haptics (coming soon)

```typescript
// Control haptic rumble
controller.left.haptic.intensity; // 0 (0 - 1)
controller.left.haptic.set(0.7); // left side begins to rumble modestly
controller.left.haptic.intensity; // 0.7

// Stop haptic feedback when you're ready
setTimeout(controller.left.haptic.stop, 40); // left side stops rumbling after 40 milliseconds

// Or provide a duration in milliseconds
controller.right.haptic.set(1.0, 40); // right side rumbles strongly for 40 milliseconds
controller.right.haptic.stop(40); // right side stops rumbling after 40 milliseconds

// The trigger has its own haptics
// Continuously increase rumble as the trigger is pulled
controller.right.trigger.subscribe(({ haptic, pressure }) =>
  haptic.set(pressure)
);
```

### Lighting (coming soon)

```typescript
// You can set individual color channels on the main indicator
controller.indicator.red(0.5);
controller.indicator.green(0.2);
controller.indicator.blue(0.7);

// Or...
controller.indicator.color([0.5, 0.2, 0.7]);

// Durations apply here as well
controller.indicator.red(0.7, 65); // Red for 65 milliseconds
controller.indicator.color([0.2, 0.1, 0.4], 100); // Lavender for 100 milliseconds

// Toggle a simple indicator
controller.mute.indicator.enable(25); // Turn on the mute LED for 25 milliseconds
controller.mute.indicator.disable(); // Turn off the mute LED immediately
controller.mute.indicator.toggle(true, 20); // Turn on the mute LED for 20 milliseconds
```

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
