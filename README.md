# react-native-quick-argon2

For now library is depending on react-native-quick-crypto, because for now it relies on randomBytes for salt generation. In future it will be replaced with native randomBytes implementation.
So for now you need to install [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto) as well.

## Installation

```sh
npm install react-native-quick-argon2
yarn add react-native-quick-argon2

# or https://github.com/antfu/ni
ni react-native-quick-argon2
```

For iOS also run `pod install` in `/ios` folder.

## Prerequisites

You must have Android NDK and CMake installed on android to build the library.

## Basic usage example

```tsx
import simpleJsiModule from 'react-native-jsi-template';

simpleJsiModule.helloWorld(); // returns helloworld.
```

Run the example app for more.

## Thanks to these libraries & their authors:

The initial work done by authors of the following libraries has helped a lot in writing the blog and keeping this repo updated.

- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv/)
- [argon2](https://github.com/ranisalt/node-argon2)
- [react-native-quick-crypto](https://github.com/margelo/react-native-quick-crypto)
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated/)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
