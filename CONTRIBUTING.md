# Contributing to `dualsense-ts` 

Thanks for caring enough about this project to check out these guidelines - new contributors are always welcome!

## Bugs & Feature Requests

Please let us know by opening an [issue](https://github.com/nsfm/dualsense-ts/issues).

## Development Process

### Dependencies

* node v16
* yarn

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

# Run in debug mode, with live compilation and source mapping for the Inspector
yarn debug
```

### Operating System

The project and tools have been tested on these operating systems:

* Arch Linux x64 (kernel 5.16.15 onwards)
* Ubuntu 20.04.4 x64

If your system isn't covered here and everything works, please open a PR and let us know!

Changes facilitating compatibility with new platforms are always welcome.

### Dependencies

This project prefers to maintain a minimal dependency footprint within the final build.

* `dependencies` will face scrutiny; they should demonstrate significant value and come from a stable source.
* `optionalDependencies` are preferred over `dependencies`.
* `devDependencies` should simplify or improve the dev experience.

### PR Merge Requirements

* CI checks must pass
* Test coverage maintained where appropriate
* Change should improve the repo :+1:
