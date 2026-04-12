# Contributing to `dualsense-ts`

Thanks for caring enough about this project to check out these guidelines! New contributors are always welcome.

## Bugs & Feature Requests

Please let us know by opening an [issue](https://github.com/nsfm/dualsense-ts/issues).

## Development Process

### Dependencies

- node v22+
- yarn

### Building and Testing

```bash
git clone https://github.com/nsfm/dualsense-ts
cd dualsense-ts
yarn install

# Compiles the project to `dist/`
yarn build

# Check lint and style adherence
yarn lint

# Run unit tests
yarn test

# Run unit tests with code coverage
yarn coverage

# Run the node example app, with live compilation and source mapping for the Inspector
yarn debug

# Run the webhid example app at localhost:3000
# This will update automatically as you save changes to the app, but if you
# modify the core library you must stop the server and run `yarn build`
yarn --cwd webhid_example start
```

### Hardware Verification

An interactive verification script walks through all controller features using the controller itself for input — no keyboard needed after launch:

```bash
yarn verify
```

The script runs through two phases:

1. **Input tests** — checklists that auto-clear as you press buttons, move sticks, use the touchpad, and shake the controller.
2. **Output tests** — activates rumble, lightbar, trigger feedback, mute LED, and test tones one at a time. Press **Cross** to confirm each works, or **Triangle** to report a failure.

A pass/fail summary is printed at the end. Contributors should run this against both USB and Bluetooth connections before submitting PRs that touch input handling or output commands.

### Operating System

The project and tools have been tested on these operating systems:

- Arch Linux x64 (kernel 5.16.15 onwards)
- Ubuntu 20.04.4 x64

If your system isn't covered here and everything works, please let us know!

Changes improving compatibility with new platforms are always welcome.

### Dependencies

This project prefers to maintain a minimal dependency footprint within the final build.

- `dependencies` are more or less forbidden
- `optionalDependencies` are acceptable when necessary
- `devDependencies` should simplify or improve the dev experience

### PR Merge Requirements

- CI checks must pass
- You must test over bluetooth and USB in node.js and the browser
- Test coverage maintained where appropriate
- Change should improve the repo :+1:
