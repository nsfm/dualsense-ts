## Testing

To test with node.js, try `ts-node util/debug.ts`

To test in the browser, build the project with `yarn webpack`, then run the webpack dev server with `yarn start`

## Project structure

### /

- dualsense.ts - pulls together all other modules to form the Dualsense class, the primary entrypoint to the module
- input.ts - base class all controller inputs inherit from, providing most input events/APIs

### hid/

- hid_provider.ts - base class all HID event sources inherit from, defining a common API for HID providers
- node_hid_provider.ts - provider for `node-hid`-based connections in node.js
- web_hid_provider.ts - provider for WebHID-based connections in the browser
- platform_hid_provider.ts - decides the type of the provider that will be chosen based on the execution environment
- dualsense_hid.ts - sets up a hid provider specifically for a dualsense controller

### elements/

All controller inputs, implementing the Input class from `input.ts`.

There are some basic, primitive inputs like Button and Axis.

Complex Inputs are composed from primitive ones, like the Analog stick, which uses two Axis Inputs and a Button Input.
