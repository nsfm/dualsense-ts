# Analog Stick Calibration Protocol

Reference documentation for the DualSense (and related) analog stick calibration protocol, derived from analysis of the [dualshock-tools](https://github.com/dualshock-tools/dualshock-tools.github.io) project. This documents the HID feature reports used to trigger the controller's built-in stick calibration routine, persist results to NVS (non-volatile storage), and manage per-stick finetune parameters.

Stick calibration is **firmware-level** — the controller hardware captures stick positions and updates its own internal calibration. The host only orchestrates the begin/sample/end command sequence and triggers the NVS write. No client-side correction is needed after calibration is complete.

---

## Report IDs by Controller Family

| Controller | Send | Receive | Notes |
|---|---|---|---|
| DualSense (054C:0CE6) | `0x82` | `0x83` | Single response per command |
| DualSense Edge (054C:0DF2) | `0x82` | `0x83` | End commands sent twice with different expected responses |
| PS VR2 Left/Right (054C:0E45/0E46) | `0x82` | `0x83` | Same as standard DualSense |
| DualShock 4 V1 (054C:05C4) | `0x90` | `0x91` + `0x92` | Two responses validated per command |
| DualShock 4 V2 (054C:09CC) | `0x90` | `0x91` + `0x92` | Two responses validated per command |

---

## Calibration Command Format

All controllers use the same 3-byte payload structure:

```
[action, 0x01, calibration_type]
```

| Field | Values |
|---|---|
| `action` | `1` = begin, `2` = end, `3` = sample |
| byte 2 | Always `0x01` |
| `calibration_type` | `1` = center calibration, `2` = range calibration |

### Response Validation

DualSense responses are a single 4-byte value read from Feature Report `0x83`, interpreted as a big-endian uint32:

```
0x83 | action | calibration_type | status
```

DualShock 4 validates **two** responses per command (`0x91` and `0x92`), where `0x92` appears to be an additional confirmation/status register:

```
0x91: same format as DS5's 0x83
0x92: [0x92, action, calibration_type, status]  — status 0xFF = in progress, 0x01 = committed
```

---

## Center Calibration Sequence

The user holds both sticks at their natural resting position throughout.

```
1. Send [1, 1, 1]  — begin center calibration
   Expect response: 0x83010101

2. Send [3, 1, 1]  — capture center sample (repeat as needed)
   Expect response: 0x83010101

3. Send [2, 1, 1]  — end center calibration
   Expect response: 0x83010102
```

DualShock 4 additionally validates `0x92` responses:
- Begin: `0x920101FF` (in progress)
- Sample: `0x920101FF`
- End: `0x92010101` (committed)

### DualSense Edge Variation

The Edge sends the end command **twice** with different expected responses:

```
3a. Send [2, 1, 1]  — first end
    Expect: 0x83010101

3b. Send [2, 1, 1]  — second end (commit)
    Expect: 0x83010103
```

---

## Range Calibration Sequence

The user rotates both sticks through their full range of motion throughout.

```
1. Send [1, 1, 2]  — begin range calibration
   Expect response: 0x83010201

2. (User rotates sticks fully in all directions)

3. Send [2, 1, 2]  — end range calibration
   Expect response: 0x83010202
```

No sample command (`action=3`) is used for range calibration — the controller firmware continuously captures extremes between begin and end.

### DualSense Edge Variation

```
3a. Send [2, 1, 2]  — first end
    Expect: 0x83010201

3b. Send [2, 1, 2]  — second end (commit)
    Expect: 0x83010203
```

---

## NVS (Non-Volatile Storage) Operations

After the calibration command sequence, results must be persisted to the controller's flash memory.

### DualSense / VR2

```
Unlock:  sendFeatureReport(0x80, [3, 2, 101, 50, 64, 12])
                                        ^^^^^^^^^^^^^^^^
                                        magic key: 0x65 0x32 0x40 0x0C
Lock:    sendFeatureReport(0x80, [3, 1])
```

### DualShock 4

```
Unlock:  sendFeatureReport(0xA0, [10, 2, 0x3E, 0x71, 0x7F, 0x89])
                                         ^^^^^^^^^^^^^^^^^^^^^^
                                         magic key
Lock:    sendFeatureReport(0xA0, [10, 1, 0])
```

### NVS Status Query

DualSense supports querying NVS state via sub-command `[3, 3]` on Feature Report `0x80`, response on `0x81`:

| Response (uint32 BE) | Meaning |
|---|---|
| `0x03030201` | Locked (normal state) |
| `0x03030200` | Unlocked (calibration mode) |
| `0x15010100` | Pending reboot (calibration written, restart needed) |

### Factory Reset

Restores the controller's stick calibration to factory defaults:

```
DualSense:  sendFeatureReport(0x80, [1, 1])
DualShock 4: sendFeatureReport(0xA0, [4, 1, 0])
```

---

## Complete DualSense Calibration Flow

Putting it all together for a standard DualSense:

```
1. nvsUnlock()              → sendFeatureReport(0x80, [3, 2, 101, 50, 64, 12])
2. calibrateCenterBegin()   → sendFeatureReport(0x82, [1, 1, 1])  → validate 0x83
3. calibrateCenterSample()  → sendFeatureReport(0x82, [3, 1, 1])  → validate 0x83
   (repeat samples as needed while user holds sticks at rest)
4. calibrateCenterEnd()     → sendFeatureReport(0x82, [2, 1, 1])  → validate 0x83
5. calibrateRangeBegin()    → sendFeatureReport(0x82, [1, 1, 2])  → validate 0x83
   (user rotates both sticks through full range)
6. calibrateRangeEnd()      → sendFeatureReport(0x82, [2, 1, 2])  → validate 0x83
7. nvsLock()                → sendFeatureReport(0x80, [3, 1])
```

---

## DualSense Edge: Finetune Parameters

The DualSense Edge (and VR2) support 12 uint16 **finetune values** — per-quadrant range adjustments and center offsets for both sticks. These are software-level trim values stored alongside the hardware calibration.

### Value Layout

| Index | Parameter | Description |
|---|---|---|
| 0 | Left stick left bound | Max negative X extent |
| 1 | Left stick top bound | Max negative Y extent |
| 2 | Left stick right bound | Max positive X extent |
| 3 | Left stick bottom bound | Max positive Y extent |
| 4 | Left stick center X | Resting X offset |
| 5 | Left stick center Y | Resting Y offset |
| 6 | Right stick left bound | Max negative X extent |
| 7 | Right stick top bound | Max negative Y extent |
| 8 | Right stick right bound | Max positive X extent |
| 9 | Right stick bottom bound | Max positive Y extent |
| 10 | Right stick center X | Resting X offset |
| 11 | Right stick center Y | Resting Y offset |

### Value Ranges

| Controller | Range | Bits |
|---|---|---|
| DualSense Edge | 0–4095 | 12-bit |
| PS VR2 | 0–65535 | 16-bit |

### Read Finetune Data

```
Send:    sendFeatureReport(0x80, [12, 4])     // Edge
         sendFeatureReport(0x80, [12, 2])     // VR2
Receive: receiveFeatureReport(0x81)
         → 12 × uint16 LE starting at byte offset 4
```

### Write Finetune Data

```
sendFeatureReport(0x80, [12, 1, lo0, hi0, lo1, hi1, ..., lo11, hi11])
                         ^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                         header    12 × uint16 LE = 24 bytes
```

Total payload: 26 bytes.

### Edge Module Lock/Unlock

The Edge has physically replaceable stick modules, each with its own calibration. The modules must be unlocked before writing finetune data:

```
Unlock module:  sendFeatureReport(0x80, [21, 6, module_idx, 11])
Lock module:    sendFeatureReport(0x80, [21, 4, module_idx, 8])
Store module:   sendFeatureReport(0x80, [21, 5, module_idx])
Read barcode:   sendFeatureReport(0x80, [21, 34, module_idx])
                → 17-char ASCII string at bytes 21–37 of 0x81 response
```

Where `module_idx` is `0` (left stick) or `1` (right stick).

### Complete Edge Flash Sequence

```
1. unlockModule(0)          → sendFeatureReport(0x80, [21, 6, 0, 11])
2. unlockModule(1)          → sendFeatureReport(0x80, [21, 6, 1, 11])
3. nvsUnlock()              → sendFeatureReport(0x80, [3, 2, 101, 50, 64, 12])
4. getInMemoryModuleData()  → read current finetune values
5. writeFinetuneData()      → sendFeatureReport(0x80, [12, 1, ...data])
6. lockModule(0)            → sendFeatureReport(0x80, [21, 4, 0, 8])
7. lockModule(1)            → sendFeatureReport(0x80, [21, 4, 1, 8])
8. nvsLock()                → sendFeatureReport(0x80, [3, 1])
```

---

## Additional System Info Sub-Commands (Feature Report 0x80/0x81)

These extend the existing test command protocol documented in `dsp.ts`. The sub-command format is `[device_id, action_id, ...]` sent via Feature Report `0x80`, with responses read from `0x81`.

| Sub-command | Response length | Data |
|---|---|---|
| `[1, 19]` | 17 bytes | Serial number (ASCII) |
| `[1, 9]` | 9 bytes | MCU unique ID |
| `[1, 17]` | 14 bytes | PCBA ID |
| `[1, 24]` | 23 bytes | Battery barcode |
| `[1, 26]` | 16 bytes | VCM left barcode (vibration motor) |
| `[1, 28]` | 16 bytes | VCM right barcode (vibration motor) |
| `[5, 2]` | 8 bytes | Touchpad ID |
| `[5, 4]` | 8 bytes | Touchpad firmware version |
| `[9, 2]` | variable | Bluetooth MAC address (at byte offset 4) |

Note: `[1, 19]` for serial number and `[9, 2]` for Bluetooth MAC are already implemented in our `factory_info.ts` and `pairing_info.ts` respectively. The others (MCU ID, PCBA ID, battery barcode, VCM barcodes, touchpad info) are not yet exposed.

---

## Board Model Identification

### DualSense (from Feature Report 0x20 hardware info byte)

| HW byte | Board model |
|---|---|
| `0x03` | BDM-010 |
| `0x04` | BDM-020 |
| `0x05` | BDM-030 |
| `0x06` | BDM-040 |
| `0x07` | BDM-050 |
| `0x08` | BDM-050 |
| `0x11` | BDM-060M |
| `0x13` | BDM-060X |

Note: our `factory_info.ts` currently derives board revision from the serial number character at position 1, which only covers BDM-010 through BDM-050. The HW info byte from Feature Report `0x20` is more authoritative and covers newer revisions including BDM-060M/060X.

### DualShock 4 (from Feature Report 0xA3 HW version upper byte)

| HW byte | Board model |
|---|---|
| `0x31` | JDM-001 |
| `0x43` | JDM-011 |
| `0x54` | JDM-030 |
| `0x64`–`0x74` | JDM-040 |
| `0x80`–`0x83`, `0x93` | JDM-020 |
| `0x90`, `0xA0`, `0xA4` | JDM-050 |
| `0xB0` | JDM-055 (Scuf?) |
| `0xB4` | JDM-055 |

---

## Future Work

- **Stick calibration tool**: Expose a `calibrateSticks()` API or diagnostic utility that orchestrates the begin/sample/end sequence. This is a destructive NVS write operation — appropriate for a standalone tool or diagnostic page, not the core input loop.
- **New system info commands**: Expose MCU ID, PCBA ID, battery barcode, VCM barcodes, and touchpad info via `DspDevice.System` sub-commands.
- **Board model from HW info**: Use the Feature Report `0x20` hardware byte for more accurate board revision identification, covering BDM-060M/060X revisions not present in the serial number.
- **DualSense Edge support**: The Edge's replaceable stick modules, module barcodes, and 12-bit finetune parameters are a separate feature surface worth exploring if Edge hardware becomes available for testing.

---

## Source Attribution

Protocol details derived from [dualshock-tools](https://github.com/dualshock-tools/dualshock-tools.github.io) by the dualshock-tools contributors, cross-referenced with the Linux kernel `hid-playstation.c` driver and our own probing results.
