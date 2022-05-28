# dualsense-ts

## Table of contents

### Enumerations

- [Brightness](../wiki/Brightness)
- [CommandScopeA](../wiki/CommandScopeA)
- [CommandScopeB](../wiki/CommandScopeB)
- [InputId](../wiki/InputId)
- [LedOptions](../wiki/LedOptions)
- [PlayerID](../wiki/PlayerID)
- [PulseOptions](../wiki/PulseOptions)
- [TriggerMode](../wiki/TriggerMode)

### Classes

- [Accelerometer](../wiki/Accelerometer)
- [Analog](../wiki/Analog)
- [Axis](../wiki/Axis)
- [Dpad](../wiki/Dpad)
- [Dualsense](../wiki/Dualsense)
- [DualsenseHID](../wiki/DualsenseHID)
- [Gyroscope](../wiki/Gyroscope)
- [Haptic](../wiki/Haptic)
- [Indicator](../wiki/Indicator)
- [Input](../wiki/Input)
- [Momentary](../wiki/Momentary)
- [Motion](../wiki/Motion)
- [Mute](../wiki/Mute)
- [Touchpad](../wiki/Touchpad)
- [Trigger](../wiki/Trigger)
- [Unisense](../wiki/Unisense)

### Interfaces

- [AnalogParams](../wiki/AnalogParams)
- [DpadParams](../wiki/DpadParams)
- [DualSenseCommand](../wiki/DualSenseCommand)
- [DualsenseHIDState](../wiki/DualsenseHIDState)
- [DualsenseParams](../wiki/DualsenseParams)
- [InputParams](../wiki/InputParams)
- [UnisenseParams](../wiki/UnisenseParams)

### Type aliases

- [Degrees](../wiki/Exports#degrees)
- [Force](../wiki/Exports#force)
- [InputEvent](../wiki/Exports#inputevent)
- [Intensity](../wiki/Exports#intensity)
- [Magnitude](../wiki/Exports#magnitude)
- [Radians](../wiki/Exports#radians)

### Variables

- [InputChanged](../wiki/Exports#inputchanged)
- [InputIcon](../wiki/Exports#inputicon)
- [InputName](../wiki/Exports#inputname)
- [InputSet](../wiki/Exports#inputset)

### Functions

- [mapAxis](../wiki/Exports#mapaxis)
- [mapTrigger](../wiki/Exports#maptrigger)

## Type aliases

### Degrees

Ƭ **Degrees**: `number`

A numeric value between 0 and 360.

#### Defined in

[src/math.ts:9](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/math.ts#L9)

___

### Force

Ƭ **Force**: `number`

A numeric value between -1 and 1.

#### Defined in

[src/math.ts:19](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/math.ts#L19)

___

### InputEvent

Ƭ **InputEvent**: ``"change"`` \| ``"input"`` \| ``"press"`` \| ``"release"``

#### Defined in

[src/input.ts:34](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L34)

___

### Intensity

Ƭ **Intensity**: `number`

A numeric value between 0 and 1.

#### Defined in

[src/math.ts:24](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/math.ts#L24)

___

### Magnitude

Ƭ **Magnitude**: `number`

A numeric value between 0 and 1.

#### Defined in

[src/math.ts:14](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/math.ts#L14)

___

### Radians

Ƭ **Radians**: `number`

A numeric value between ±Math.PI.

#### Defined in

[src/math.ts:4](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/math.ts#L4)

## Variables

### InputChanged

• `Const` **InputChanged**: typeof [`InputChanged`](../wiki/Exports#inputchanged)

#### Defined in

[src/input.ts:27](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L27)

___

### InputIcon

• `Const` **InputIcon**: typeof [`InputIcon`](../wiki/Exports#inputicon)

#### Defined in

[src/input.ts:32](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L32)

___

### InputName

• `Const` **InputName**: typeof [`InputName`](../wiki/Exports#inputname)

#### Defined in

[src/input.ts:31](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L31)

___

### InputSet

• `Const` **InputSet**: typeof [`InputSet`](../wiki/Exports#inputset)

#### Defined in

[src/input.ts:30](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L30)

## Functions

### mapAxis

▸ **mapAxis**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[src/hid/dualsense_hid.ts:51](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/hid/dualsense_hid.ts#L51)

___

### mapTrigger

▸ **mapTrigger**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[src/hid/dualsense_hid.ts:56](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/hid/dualsense_hid.ts#L56)
