# Migration Guide

### v5 to v6

`TriggerMode` is deprecated. The low-level `DualsenseHID` methods for setting trigger effects now accept 11-byte effect blocks instead of individual mode/value pairs.

Use the new element-based API instead:

```typescript
import { TriggerEffect } from "dualsense-ts";

controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.2,
  end: 0.6,
  strength: 0.9,
});

controller.right.trigger.feedback.reset();
```

### v4 to v5

`node-hid` is now an optional peer dependency, simplifying the use of this library in the browser.

Node.js users will need to add `node-hid` as a dependency.

### v3 to v4

The constructor no longer throws when a Dualsense controller is unavailable. It will keep attempting to connect in the background. A new input is provided for monitoring the connection state.

### v2 to v3

In v2, inputs were EventEmitters. In v3 a new, similar class is used, but the API differs slightly.

If you are using unavailable EventEmitter features or relying on `instanceof EventEmitter`, you will need to refactor accordingly.

### v1 to v2

Version 2 adds an abstraction over the `node-hid` interface; if you were accessing it directly, you'll need to refactor accordingly.
