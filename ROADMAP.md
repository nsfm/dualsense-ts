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
