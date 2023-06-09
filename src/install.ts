// Copy pasted from: https://github.com/mrousavy/react-native-jsi-library-template/blob/main/src/FastCrypto.ts

import { NativeModules, Platform } from 'react-native';
import type { NativeHash } from './type';

// global func declaration for JSI functions
declare global {
  function nativeCallSyncHook(): unknown;
  var __QuickArgon2Proxy: object | undefined;
}

const PACKAGE_NAME = 'react-native-quick-argon2';
const MODULE_NAME = "QuickArgon2"

// Check if the constructor exists. If not, try installing the JSI bindings.
if (global.__QuickArgon2Proxy == null) {
  // Get the native module ReactModule
  const module = NativeModules[MODULE_NAME]
  if (module == null) {
    let message = `Failed to install ${PACKAGE_NAME}: The native '${MODULE_NAME}' Module could not be found.`;
    message += `
* Make sure ${PACKAGE_NAME} is correctly autolinked (run \`npx react-native config\` to verify)`;
    if (Platform.OS === 'ios' || Platform.OS === 'macos') {
      message += '\n* Make sure you ran `pod install` in the ios/ directory.';
    }
    if (Platform.OS === 'android') {
      message += '\n* Make sure gradle is synced.';
    }
    // check if Expo
    const ExpoConstants =
      NativeModules.NativeUnimoduleProxy?.modulesConstants?.ExponentConstants;
    if (ExpoConstants != null) {
      if (ExpoConstants.appOwnership === 'expo') {
        // We're running Expo Go
        throw new Error(
          `${PACKAGE_NAME} is not supported in Expo Go! Use EAS (\`expo prebuild\`) or eject to a bare workflow instead.`
        );
      } else {
        // We're running Expo bare / standalone
        message += '\n* Make sure you ran `expo prebuild`.';
      }
    }

    message += '\n* Make sure you rebuilt the app.';
    throw new Error(message);
  }

  // Check if we are running on-device (JSI)
  if (global.nativeCallSyncHook == null || module.install == null) {
    throw new Error(
      `Failed to install ${PACKAGE_NAME}: React Native is not running on-device. FastCrypto can only be used when synchronous method invocations (JSI) are possible. If you are using a remote debugger (e.g. Chrome), switch to an on-device debugger (e.g. Flipper) instead.`
    );
  }

  // Call the synchronous blocking install() function
  const result = module.install();
  if (result !== true)
    throw new Error(
      `Failed to install ${PACKAGE_NAME}: The native FastCrypto Module could not be installed! Looks like something went wrong when installing JSI bindings: ${result}`
    );

  // Check again if the constructor now exists. If not, throw an error.
  if (global.__QuickArgon2Proxy == null)
    throw new Error(
      `Failed to install ${PACKAGE_NAME}, the native initializer function does not exist. Are you trying to use FastCrypto from different JS Runtimes?`
    );
}

export const QuickArgon2 = global.__QuickArgon2Proxy as any as {
  hash: NativeHash;
};
