# Linux HID and the DualSense

## The Problem

On Linux, the kernel's `hid_playstation` driver claims DualSense controllers and creates gamepad, motion sensor, and touchpad input devices. This has two side effects that affect `dualsense-ts`:

1. **SET_REPORT feature reports are blocked over Bluetooth.** The `hidp` Bluetooth HID transport does not support the `HIDIOCSFEATURE` ioctl, returning `EIO`. This means the test command protocol (Feature Reports `0x80`/`0x81`) cannot be used, and factory info (controller body color, serial number, board revision) is unavailable over Bluetooth when using `node-hid`.

2. **Unwanted input devices are created.** The kernel registers the controller as a gamepad, touchpad, and motion sensor, which can cause the controller to move the mouse cursor or generate unwanted input events on the desktop.

Neither issue affects WebHID in Chrome, which bypasses the kernel's HID driver entirely and communicates with the Bluetooth controller through its own userspace stack.

## What Works Today

| Feature | USB (node-hid) | USB (WebHID) | BT (node-hid, Linux) | BT (WebHID) |
|---------|---------------|-------------|----------------------|-------------|
| Input reports (buttons, sticks, etc.) | Yes | Yes | Yes | Yes |
| Output reports (rumble, LEDs, etc.) | Yes | Yes | Yes | Yes |
| Firmware info (Feature Report 0x20 read) | Yes | Yes | Yes | Yes |
| Factory info (Feature Report 0x80 write) | Yes | Yes | **No** | Yes |

## Why It Fails

The data flow for HID feature reports on Linux:

```
Application (node-hid)
  -> ioctl(HIDIOCSFEATURE) on /dev/hidrawN
    -> hid_hw_raw_request() in kernel HID core
      -> hid_playstation driver (or hid-generic)
        -> hidp_set_raw_report() for Bluetooth transport
          -> Returns -EIO (not implemented)
```

The `hidp` transport layer's `SET_REPORT` implementation for feature reports returns an error because the Bluetooth HID specification's SET_REPORT transaction is not fully implemented in the Linux `hidp` driver.

Chrome's WebHID takes a different path:

```
Chrome WebHID API
  -> Chrome's internal Bluetooth HID client
    -> BlueZ D-Bus API or direct L2CAP
      -> SET_REPORT transaction sent directly to device
```

## Potential Kernel Patch

The `hid_playstation` driver could be patched to pass through SET_REPORT feature reports to the underlying transport. The relevant kernel source files are:

- `drivers/hid/hid-playstation.c` — the PlayStation HID driver
- `net/bluetooth/hidp/core.c` — the Bluetooth HID transport

### Approach 1: Fix `hidp` SET_REPORT for Feature Reports

The root cause is in `net/bluetooth/hidp/core.c`. The `hidp_set_raw_report()` function needs to properly implement SET_REPORT for feature reports over the Bluetooth control channel (L2CAP). Currently, this code path either returns `-EIO` or is missing entirely.

The fix would involve:
1. Constructing a `HIDP_TRANS_SET_REPORT | HIDP_DATA_RTYPE_FEATURE` header
2. Sending the report data over the L2CAP control channel
3. Waiting for the acknowledgment from the device

This would benefit all Bluetooth HID devices on Linux, not just the DualSense.

### Approach 2: Route Through `uhid`

An alternative approach is to have `hid_playstation` create a `uhid` device alongside the standard hidraw interface, similar to how Chrome's WebHID works. This would allow userspace applications to send feature reports through the `uhid` interface while the kernel driver continues to handle standard input processing.

### Approach 3: Userspace Bluetooth HID

As a library-level workaround, `dualsense-ts` could implement direct L2CAP communication for Bluetooth DualSense controllers on Linux, bypassing the kernel HID stack entirely. This is similar to what Chrome does and would involve:

1. Using the BlueZ D-Bus API to discover and connect to the controller
2. Opening L2CAP sockets directly to the HID control and interrupt channels
3. Sending SET_REPORT transactions over the control channel

This approach is complex but would give full feature parity without requiring kernel modifications.

## References

- [Linux kernel HID subsystem documentation](https://www.kernel.org/doc/html/latest/hid/index.html)
- [Bluetooth HID Profile specification](https://www.bluetooth.com/specifications/specs/human-interface-device-profile-1-1/)
- [hid-playstation driver source](https://github.com/torvalds/linux/blob/master/drivers/hid/hid-playstation.c)
- [hidp core source](https://github.com/torvalds/linux/blob/master/net/bluetooth/hidp/core.c)
- [Chrome WebHID implementation](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/services/device/hid/)
- [daidr/dualsense-tester](https://github.com/daidr/dualsense-tester) — WebHID reference implementation that works over Bluetooth
