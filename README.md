# dualsense-ts

Under construction - come back later

## What works

- Nothing

## What doesn't work

- Headphone jack
- Speaker
- Touchpad
- Everything else

## Usage

```Typescript
import { Dualsense } from 'dualsense-ts';

/**
 * Connect to a Dualsense controller
 */

// Grab a free device connected via USB or Bluetooth
const controller = new Dualsense();

/**
 * Read the current input state at any time
 */

// Buttons
controller.circle.active // false
controller.cross.active // true
controller.left.bumper.active // true

// Triggers
controller.right.trigger.active // true
controller.right.trigger.pressure // 0.72 (0 - 1)

// Analog Sticks
controller.left.analog.x // 148 (0 - 255)
controller.left.analog.y // 168 (0 - 255)

// Some derived values are provided for convenience
controller.left.analog.angle.deg // 63.43 (0 - 360)
controller.left.analog.angle.rad // 1.11 (0 - 2)
controller.left.analog.magnitude // 62.87 (0 - 255)
controller.left.analog.active // true (while the stick is away from center)

/**
 * React to changed inputs
 */

// Set a callback to get updates when an input's state changes
controller.options.bind(input => console.log(`${input}: ${input.active}`))
// stdout -> ☰ [X]: true
// stdout -> ☰ [_]: false

// Wait for a button to be pressed
await controller.triangle.pressed()

// Wait for a button to be released (immediate if not current active)
await controller.triangle.released()
// They're chainable
await controller.triangle.pressed().released()

/**
 * Give haptic feedback
 */

// Control haptic rumble
controller.left.haptic.intensity // 0 (0 - 1)
controller.left.haptic.set(0.7) // left side begins to rumble modestly
controller.left.haptic.intensity // 0.7

// Stop haptic feedback when you're ready
setTimeout(controller.left.haptic.stop, 40) // left side stops rumbling after 40 milliseconds

// Or provide a duration in milliseconds
controller.right.haptic.set(1.0, 40) // right side rumbles strongly for 40 milliseconds
controller.right.haptic.stop(40) // right side stops rumbling after 40 milliseconds

// The trigger has its own haptics
controller.right.trigger.bind(trigger => {
  // Continuously increase rumble as the trigger is pulled
  trigger.haptic.set(trigger.pressure)
})

/**
 * Control LEDs
 */

// You can set individual color channels on the main indicator
controller.indicator.red(0.5)
controller.indicator.green(0.2)
controller.indicator.blue(0.7)

// Or...
controller.indicator.color([0.5, 0.2, 0.7])

// Durations apply here as well
controller.indicator.red(0.7, 65) // Red for 65 milliseconds
controller.indicator.color([0.2,0.1,0.4], 100) // Lavender for 100 milliseconds

// Toggle a simple indicator
controller.mute.indicator.enable(25) // Turn on the mute LED for 25 milliseconds
controller.mute.indicator.disable() // Turn off the mute LED immediately
controller.mute.indicator.toggle(true, 20) // Turn on the mute LED for 20 milliseconds
```

## Credits

- [CamTosh](https://github.com/CamTosh)'s [node-dualsense](https://github.com/CamTosh/node-dualsense)
- [flok](https://github.com/flok)'s [pydualsense](https://github.com/flok/pydualsense)
