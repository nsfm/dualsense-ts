#### Haptics (soon)

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

#### Lighting (soon)

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

#### Managing multiple controllers

- Wait for new devices
- Reconnect automatically when a device is lost
- Devices are fingerprinted to ensure reconnection is consistent

#### Virtual inputs

`dualsense-ts` provides some "virtual" inputs for convenience. They work exactly
the same as the native ones.

```typescript
// The device provides X and Y magnitudes for each analog stick
for (await const { x, y } of controller.left.analog) {
  console.log(`Left analog: ${x}, ${y}`)
}
// # Left analog: X: 0.5, Y: 0.5

// `dualsense-ts` provides some virtual inputs based on the analog's `x` and `y`
for (await const { direction, magnitude } of controller.left.analog) {
  console.log(`Left analog: ${direction}, ${magnitude}`)
}
// # Left analog: Direction (rad): 1.2, Magnitude: 0.74332

// Where applicable, you can get values in the units you prefer
const { radians, degrees } = await controller.left.analog.direction.next()
console.log(radians, degrees)
// # Direction (deg): 68.75 Direction (rad): 1.19`
```

#### Indicator & haptics scripting

More tools for providing nuanced, multi-dimensional feedback to the user.

#### Input smoothing

Use virtual inputs to get debounced or time-averaged values.

#### Input contexts

Create and manage input contexts on the controller to filter subscriptions and awaitables.

#### Idle sensing

Use the gyroscope and accelerometer to check whether the controller is resting on a surface
or if all inputs have been idle for some time.

#### Input recording & replay

Capture an input log, and replay the inputs for testing or other automation purposes.
