# Class: Axis

## Hierarchy

- [`Input`](../wiki/Input)<[`Force`](../wiki/Exports#force)\>

  ↳ **`Axis`**

## Table of contents

### Constructors

- [constructor](../wiki/Axis#constructor)

### Properties

- [[InputChanged]](../wiki/Axis#%5Binputchanged%5D)
- [[InputChildless]](../wiki/Axis#%5Binputchildless%5D)
- [[InputIcon]](../wiki/Axis#%5Binputicon%5D)
- [[InputName]](../wiki/Axis#%5Binputname%5D)
- [[InputParent]](../wiki/Axis#%5Binputparent%5D)
- [id](../wiki/Axis#id)
- [lastChange](../wiki/Axis#lastchange)
- [lastInput](../wiki/Axis#lastinput)
- [state](../wiki/Axis#state)
- [threshold](../wiki/Axis#threshold)
- [captureRejectionSymbol](../wiki/Axis#capturerejectionsymbol)
- [captureRejections](../wiki/Axis#capturerejections)
- [defaultMaxListeners](../wiki/Axis#defaultmaxlisteners)
- [errorMonitor](../wiki/Axis#errormonitor)

### Accessors

- [[toStringTag]](../wiki/Axis#%5Btostringtag%5D)
- [active](../wiki/Axis#active)
- [force](../wiki/Axis#force)
- [magnitude](../wiki/Axis#magnitude)

### Methods

- [[InputAdopt]](../wiki/Axis#%5Binputadopt%5D)
- [[InputChangedPrimitive]](../wiki/Axis#%5Binputchangedprimitive%5D)
- [[InputChangedThreshold]](../wiki/Axis#%5Binputchangedthreshold%5D)
- [[InputChangedVirtual]](../wiki/Axis#%5Binputchangedvirtual%5D)
- [[InputSetComparison]](../wiki/Axis#%5Binputsetcomparison%5D)
- [[InputSet]](../wiki/Axis#%5Binputset%5D)
- [[asyncIterator]](../wiki/Axis#%5Basynciterator%5D)
- [[custom]](../wiki/Axis#%5Bcustom%5D)
- [[toPrimitive]](../wiki/Axis#%5Btoprimitive%5D)
- [addListener](../wiki/Axis#addlistener)
- [emit](../wiki/Axis#emit)
- [eventNames](../wiki/Axis#eventnames)
- [getMaxListeners](../wiki/Axis#getmaxlisteners)
- [listenerCount](../wiki/Axis#listenercount)
- [listeners](../wiki/Axis#listeners)
- [next](../wiki/Axis#next)
- [off](../wiki/Axis#off)
- [on](../wiki/Axis#on)
- [once](../wiki/Axis#once)
- [prependListener](../wiki/Axis#prependlistener)
- [prependOnceListener](../wiki/Axis#prependoncelistener)
- [promise](../wiki/Axis#promise)
- [rawListeners](../wiki/Axis#rawlisteners)
- [removeAllListeners](../wiki/Axis#removealllisteners)
- [removeListener](../wiki/Axis#removelistener)
- [setMaxListeners](../wiki/Axis#setmaxlisteners)
- [toString](../wiki/Axis#tostring)
- [getEventListeners](../wiki/Axis#geteventlisteners)
- [listenerCount](../wiki/Axis#listenercount-1)
- [on](../wiki/Axis#on-1)
- [once](../wiki/Axis#once-1)
- [setMaxListeners](../wiki/Axis#setmaxlisteners-1)

## Constructors

### constructor

• **new Axis**(`params?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | [`InputParams`](../wiki/InputParams) |

#### Inherited from

[Input](../wiki/Input).[constructor](../wiki/Input#constructor)

#### Defined in

[src/input.ts:102](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L102)

## Properties

### [InputChanged]

• **[InputChanged]**: (`state`: `number`, `newState`: `number`) => `boolean`

#### Type declaration

▸ (`state`, `newState`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `number` |
| `newState` | `number` |

##### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[[InputChanged]](../wiki/Input#%5Binputchanged%5D)

#### Defined in

[src/input.ts:124](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L124)

___

### [InputChildless]

• **[InputChildless]**: `boolean` = `true`

#### Inherited from

[Input](../wiki/Input).[[InputChildless]](../wiki/Input#%5Binputchildless%5D)

#### Defined in

[src/input.ts:158](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L158)

___

### [InputIcon]

• `Readonly` **[InputIcon]**: `string`

#### Inherited from

[Input](../wiki/Input).[[InputIcon]](../wiki/Input#%5Binputicon%5D)

#### Defined in

[src/input.ts:153](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L153)

___

### [InputName]

• `Readonly` **[InputName]**: `string`

#### Inherited from

[Input](../wiki/Input).[[InputName]](../wiki/Input#%5Binputname%5D)

#### Defined in

[src/input.ts:150](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L150)

___

### [InputParent]

• `Optional` **[InputParent]**: [`Input`](../wiki/Input)<`unknown`\>

#### Inherited from

[Input](../wiki/Input).[[InputParent]](../wiki/Input#%5Binputparent%5D)

#### Defined in

[src/input.ts:156](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L156)

___

### id

• `Readonly` **id**: `symbol`

#### Inherited from

[Input](../wiki/Input).[id](../wiki/Input#id)

#### Defined in

[src/input.ts:58](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L58)

___

### lastChange

• **lastChange**: `number`

#### Inherited from

[Input](../wiki/Input).[lastChange](../wiki/Input#lastchange)

#### Defined in

[src/input.ts:61](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L61)

___

### lastInput

• **lastInput**: `number`

#### Inherited from

[Input](../wiki/Input).[lastInput](../wiki/Input#lastinput)

#### Defined in

[src/input.ts:64](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L64)

___

### state

• **state**: `number` = `0`

#### Overrides

[Input](../wiki/Input).[state](../wiki/Input#state)

#### Defined in

[src/elements/axis.ts:5](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/elements/axis.ts#L5)

___

### threshold

• **threshold**: `number` = `0`

#### Inherited from

[Input](../wiki/Input).[threshold](../wiki/Input#threshold)

#### Defined in

[src/input.ts:67](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L67)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](../wiki/Dualsense#capturerejectionsymbol)

#### Inherited from

[Input](../wiki/Input).[captureRejectionSymbol](../wiki/Input#capturerejectionsymbol)

#### Defined in

node_modules/@types/node/events.d.ts:301

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

[Input](../wiki/Input).[captureRejections](../wiki/Input#capturerejections)

#### Defined in

node_modules/@types/node/events.d.ts:306

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

[Input](../wiki/Input).[defaultMaxListeners](../wiki/Input#defaultmaxlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:307

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](../wiki/Dualsense#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

[Input](../wiki/Input).[errorMonitor](../wiki/Input#errormonitor)

#### Defined in

node_modules/@types/node/events.d.ts:300

## Accessors

### [toStringTag]

• `get` **[toStringTag]**(): `string`

#### Returns

`string`

#### Inherited from

Input.\_\_@toStringTag@66

#### Defined in

[src/input.ts:145](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L145)

___

### active

• `get` **active**(): `boolean`

#### Returns

`boolean`

#### Overrides

Input.active

#### Defined in

[src/elements/axis.ts:7](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/elements/axis.ts#L7)

___

### force

• `get` **force**(): `number`

#### Returns

`number`

#### Defined in

[src/elements/axis.ts:11](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/elements/axis.ts#L11)

___

### magnitude

• `get` **magnitude**(): `number`

#### Returns

`number`

#### Defined in

[src/elements/axis.ts:15](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/elements/axis.ts#L15)

## Methods

### [InputAdopt]

▸ **[InputAdopt]**(): `void`

Cascade events from nested Inputs.
And decide if this is the root Input.

#### Returns

`void`

#### Inherited from

[Input](../wiki/Input).[[InputAdopt]](../wiki/Input#%5Binputadopt%5D)

#### Defined in

[src/input.ts:164](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L164)

___

### [InputChangedPrimitive]

▸ **[InputChangedPrimitive]**(`state`, `newState`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `number` |
| `newState` | `number` |

#### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[[InputChangedPrimitive]](../wiki/Input#%5Binputchangedprimitive%5D)

#### Defined in

[src/input.ts:186](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L186)

___

### [InputChangedThreshold]

▸ **[InputChangedThreshold]**(`state`, `newState`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `number` |
| `newState` | `number` |

#### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[[InputChangedThreshold]](../wiki/Input#%5Binputchangedthreshold%5D)

#### Defined in

[src/input.ts:190](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L190)

___

### [InputChangedVirtual]

▸ **[InputChangedVirtual]**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[[InputChangedVirtual]](../wiki/Input#%5Binputchangedvirtual%5D)

#### Defined in

[src/input.ts:182](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L182)

___

### [InputSetComparison]

▸ **[InputSetComparison]**(): (`state`: `number`, `newState`: `number`) => `boolean`

#### Returns

`fn`

▸ (`state`, `newState`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `number` |
| `newState` | `number` |

##### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[[InputSetComparison]](../wiki/Input#%5Binputsetcomparison%5D)

#### Defined in

[src/input.ts:195](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L195)

___

### [InputSet]

▸ **[InputSet]**(`state`): `void`

Update the input's state and trigger all necessary callbacks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `number` |

#### Returns

`void`

#### Inherited from

[Input](../wiki/Input).[[InputSet]](../wiki/Input#%5Binputset%5D)

#### Defined in

[src/input.ts:211](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L211)

___

### [asyncIterator]

▸ **[asyncIterator]**(): `AsyncIterator`<[`Axis`](../wiki/Axis), `any`, `undefined`\>

#### Returns

`AsyncIterator`<[`Axis`](../wiki/Axis), `any`, `undefined`\>

#### Inherited from

[Input](../wiki/Input).[[asyncIterator]](../wiki/Input#%5Basynciterator%5D)

#### Defined in

[src/input.ts:135](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L135)

___

### [custom]

▸ **[custom]**(): `string`

#### Returns

`string`

#### Inherited from

[Input](../wiki/Input).[[custom]](../wiki/Input#%5Bcustom%5D)

#### Defined in

[src/input.ts:127](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L127)

___

### [toPrimitive]

▸ **[toPrimitive]**(`hint`): `string` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hint` | ``"string"`` \| ``"number"`` \| ``"default"`` |

#### Returns

`string` \| `number`

#### Inherited from

[Input](../wiki/Input).[[toPrimitive]](../wiki/Input#%5Btoprimitive%5D)

#### Defined in

[src/input.ts:139](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L139)

___

### addListener

▸ **addListener**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Alias for `emitter.on(eventName, listener)`.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[addListener](../wiki/Input#addlistener)

#### Defined in

node_modules/@types/node/events.d.ts:327

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`InputEvent`](../wiki/Exports#inputevent) |
| `...args` | [[`Input`](../wiki/Input)<`number`\>, [`Input`](../wiki/Input)<`unknown`\> \| [`Input`](../wiki/Input)<`number`\>] |

#### Returns

`boolean`

#### Inherited from

[Input](../wiki/Input).[emit](../wiki/Input#emit)

#### Defined in

[src/input.ts:44](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L44)

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

Returns an array listing the events for which the emitter has registered
listeners. The values in the array are strings or `Symbol`s.

```js
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

**`since`** v6.0.0

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

[Input](../wiki/Input).[eventNames](../wiki/Input#eventnames)

#### Defined in

node_modules/@types/node/events.d.ts:642

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

Returns the current max listener value for the `EventEmitter` which is either
set by `emitter.setMaxListeners(n)` or defaults to [defaultMaxListeners](../wiki/Axis#defaultmaxlisteners).

**`since`** v1.0.0

#### Returns

`number`

#### Inherited from

[Input](../wiki/Input).[getMaxListeners](../wiki/Input#getmaxlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:499

___

### listenerCount

▸ **listenerCount**(`eventName`): `number`

Returns the number of listeners listening to the event named `eventName`.

**`since`** v3.2.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event being listened for |

#### Returns

`number`

#### Inherited from

[Input](../wiki/Input).[listenerCount](../wiki/Input#listenercount)

#### Defined in

node_modules/@types/node/events.d.ts:589

___

### listeners

▸ **listeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

[Input](../wiki/Input).[listeners](../wiki/Input#listeners)

#### Defined in

node_modules/@types/node/events.d.ts:512

___

### next

▸ **next**(): `Promise`<`IteratorResult`<[`Axis`](../wiki/Axis), `any`\>\>

Resolves on the next change to this input's state.

#### Returns

`Promise`<`IteratorResult`<[`Axis`](../wiki/Axis), `any`\>\>

#### Inherited from

[Input](../wiki/Input).[next](../wiki/Input#next)

#### Defined in

[src/input.ts:78](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L78)

___

### off

▸ **off**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Alias for `emitter.removeListener()`.

**`since`** v10.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[off](../wiki/Input#off)

#### Defined in

node_modules/@types/node/events.d.ts:472

___

### on

▸ **on**(`event`, `listener`): [`Axis`](../wiki/Axis)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | [`InputEvent`](../wiki/Exports#inputevent) |
| `listener` | (`input`: [`Input`](../wiki/Input)<`number`\>, `changed`: [`Input`](../wiki/Input)<`unknown`\>) => `unknown` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[on](../wiki/Input#on)

#### Defined in

[src/input.ts:37](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L37)

___

### once

▸ **once**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Adds a **one-time**`listener` function for the event named `eventName`. The
next time `eventName` is triggered, this listener is removed and then invoked.

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependOnceListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`since`** v0.3.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[once](../wiki/Input#once)

#### Defined in

node_modules/@types/node/events.d.ts:387

___

### prependListener

▸ **prependListener**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Adds the `listener` function to the _beginning_ of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[prependListener](../wiki/Input#prependlistener)

#### Defined in

node_modules/@types/node/events.d.ts:607

___

### prependOnceListener

▸ **prependOnceListener**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Adds a **one-time**`listener` function for the event named `eventName` to the_beginning_ of the listeners array. The next time `eventName` is triggered, this
listener is removed, and then invoked.

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v6.0.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[prependOnceListener](../wiki/Input#prependoncelistener)

#### Defined in

node_modules/@types/node/events.d.ts:623

___

### promise

▸ **promise**(): `Promise`<[`Axis`](../wiki/Axis)\>

Resolves on the next change to this input's state.

#### Returns

`Promise`<[`Axis`](../wiki/Axis)\>

#### Inherited from

[Input](../wiki/Input).[promise](../wiki/Input#promise)

#### Defined in

[src/input.ts:89](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L89)

___

### rawListeners

▸ **rawListeners**(`eventName`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`,
including any wrappers (such as those created by `.once()`).

```js
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

**`since`** v9.4.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

[Input](../wiki/Input).[rawListeners](../wiki/Input#rawlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:542

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`Axis`](../wiki/Axis)

Removes all listeners, or those of the specified `eventName`.

It is bad practice to remove listeners added elsewhere in the code,
particularly when the `EventEmitter` instance was created by some other
component or module (e.g. sockets or file streams).

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[removeAllListeners](../wiki/Input#removealllisteners)

#### Defined in

node_modules/@types/node/events.d.ts:483

___

### removeListener

▸ **removeListener**(`eventName`, `listener`): [`Axis`](../wiki/Axis)

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and_before_ the last listener finishes execution will
not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[removeListener](../wiki/Input#removelistener)

#### Defined in

node_modules/@types/node/events.d.ts:467

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Axis`](../wiki/Axis)

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `emitter.setMaxListeners()` method allows the limit to be
modified for this specific `EventEmitter` instance. The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.3.5

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Axis`](../wiki/Axis)

#### Inherited from

[Input](../wiki/Input).[setMaxListeners](../wiki/Input#setmaxlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:493

___

### toString

▸ **toString**(): `string`

Render a convenient debugging string.

#### Returns

`string`

#### Inherited from

[Input](../wiki/Input).[toString](../wiki/Input#tostring)

#### Defined in

[src/input.ts:98](https://github.com/nsfm/dualsense-ts/blob/ab67fa7/src/input.ts#L98)

___

### getEventListeners

▸ `Static` **getEventListeners**(`emitter`, `name`): `Function`[]

Returns a copy of the array of listeners for the event named `eventName`.

For `EventEmitter`s this behaves exactly the same as calling `.listeners` on
the emitter.

For `EventTarget`s this is the only way to get the event listeners for the
event target. This is useful for debugging and diagnostic purposes.

```js
const { getEventListeners, EventEmitter } = require('events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  getEventListeners(ee, 'foo'); // [listener]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  getEventListeners(et, 'foo'); // [listener]
}
```

**`since`** v15.2.0, v14.17.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` \| `DOMEventTarget` |
| `name` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

[Input](../wiki/Input).[getEventListeners](../wiki/Input#geteventlisteners)

#### Defined in

node_modules/@types/node/events.d.ts:270

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `eventName`): `number`

A class method that returns the number of listeners for the given `eventName`registered on the given `emitter`.

```js
const { EventEmitter, listenerCount } = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

**`since`** v0.9.12

**`deprecated`** Since v3.2.0 - Use `listenerCount` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | The emitter to query |
| `eventName` | `string` \| `symbol` | The event name |

#### Returns

`number`

#### Inherited from

[Input](../wiki/Input).[listenerCount](../wiki/Input#listenercount-1)

#### Defined in

node_modules/@types/node/events.d.ts:242

___

### on

▸ `Static` **on**(`emitter`, `eventName`, `options?`): `AsyncIterableIterator`<`any`\>

```js
const { on, EventEmitter } = require('events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```

Returns an `AsyncIterator` that iterates `eventName` events. It will throw
if the `EventEmitter` emits `'error'`. It removes all listeners when
exiting the loop. The `value` returned by each iteration is an array
composed of the emitted event arguments.

An `AbortSignal` can be used to cancel waiting on events:

```js
const { on, EventEmitter } = require('events');
const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

**`since`** v13.6.0, v12.16.0

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `emitter` | `EventEmitter` | - |
| `eventName` | `string` | The name of the event being listened for |
| `options?` | `StaticEventEmitterOptions` | - |

#### Returns

`AsyncIterableIterator`<`any`\>

that iterates `eventName` events emitted by the `emitter`

#### Inherited from

[Input](../wiki/Input).[on](../wiki/Input#on-1)

#### Defined in

node_modules/@types/node/events.d.ts:221

___

### once

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

Creates a `Promise` that is fulfilled when the `EventEmitter` emits the given
event or that is rejected if the `EventEmitter` emits `'error'` while waiting.
The `Promise` will resolve with an array of all the arguments emitted to the
given event.

This method is intentionally generic and works with the web platform [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) interface, which has no special`'error'` event
semantics and does not listen to the `'error'` event.

```js
const { once, EventEmitter } = require('events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.log('error happened', err);
  }
}

run();
```

The special handling of the `'error'` event is only used when `events.once()`is used to wait for another event. If `events.once()` is used to wait for the
'`error'` event itself, then it is treated as any other kind of event without
special handling:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.log('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

An `AbortSignal` can be used to cancel waiting for the event:

```js
const { EventEmitter, once } = require('events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Abort waiting for the event
ee.emit('foo'); // Prints: Waiting for the event was canceled!
```

**`since`** v11.13.0, v10.16.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `eventName` | `string` \| `symbol` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[Input](../wiki/Input).[once](../wiki/Input#once-1)

#### Defined in

node_modules/@types/node/events.d.ts:157

▸ `Static` **once**(`emitter`, `eventName`, `options?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `eventName` | `string` |
| `options?` | `StaticEventEmitterOptions` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

[Input](../wiki/Input).[once](../wiki/Input#once-1)

#### Defined in

node_modules/@types/node/events.d.ts:162

___

### setMaxListeners

▸ `Static` **setMaxListeners**(`n?`, ...`eventTargets`): `void`

By default `EventEmitter`s will print a warning if more than `10` listeners are
added for a particular event. This is a useful default that helps finding
memory leaks. The `EventEmitter.setMaxListeners()` method allows the default limit to be
modified (if eventTargets is empty) or modify the limit specified in every `EventTarget` | `EventEmitter` passed as arguments.
The value can be set to`Infinity` (or `0`) to indicate an unlimited number of listeners.

```js
EventEmitter.setMaxListeners(20);
// Equivalent to
EventEmitter.defaultMaxListeners = 20;

const eventTarget = new EventTarget();
// Only way to increase limit for `EventTarget` instances
// as these doesn't expose its own `setMaxListeners` method
EventEmitter.setMaxListeners(20, eventTarget);
```

**`since`** v15.3.0, v14.17.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `n?` | `number` |
| `...eventTargets` | (`EventEmitter` \| `DOMEventTarget`)[] |

#### Returns

`void`

#### Inherited from

[Input](../wiki/Input).[setMaxListeners](../wiki/Input#setmaxlisteners-1)

#### Defined in

node_modules/@types/node/events.d.ts:290
