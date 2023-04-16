import crypto from 'react-native-quick-crypto';
import { QuickArgon2 } from './install';
import type {
  Argon2Type,
  Argon2TypeNative,
  JsHash,
  Options,
  OptionsNative,
} from './type';
import { str2ab } from './utils';
const { randomBytes } = crypto;

const { hash: jsiHash } = QuickArgon2;

const ARGON_2_TYPE_TO_NATIVE: Record<Argon2Type, Argon2TypeNative> = {
  argon2d: 0,
  argon2i: 1,
  argon2id: 2,
} as const;

// Default from node-argon2
const defaults = Object.freeze({
  hashLength: 32,
  saltLength: 16,
  timeCost: 3,
  memoryCost: 1 << 16,
  parallelism: 4,
  type: ARGON_2_TYPE_TO_NATIVE.argon2id,
  version: 0x13,
});

const limits = Object.freeze({
  hashLength: { min: 4, max: 2 ** 32 - 1 },
  memoryCost: { min: 1 << 10, max: 2 ** 32 - 1 },
  timeCost: { min: 2, max: 2 ** 32 - 1 },
  parallelism: { min: 1, max: 2 ** 24 - 1 },
});

const randomBytesArrayBuffer = (length: number) => {
  const bytes = randomBytes(length) as Buffer;
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  );
};

const assertLimits = (options: OptionsNative) =>
  (
    Object.entries(limits) as [
      keyof typeof limits,
      (typeof limits)[keyof typeof limits]
    ][]
  ).forEach(([key, { max, min }]) => {
    const value = options[key];
    if (min <= value && value <= max) {
      return;
    }
    throw new Error(`Invalid ${key}, must be between ${min} and ${max}.`);
  });

const toNativeOptions = (options: Options): OptionsNative => {
  const salt =
    'salt' in options && options.salt
      ? options.salt
      : randomBytesArrayBuffer(defaults.saltLength);
  const type =
    'type' in options && options.type
      ? ARGON_2_TYPE_TO_NATIVE[options.type]
      : defaults.type;

  return {
    ...defaults,
    ...options,
    type,
    salt,
  };
};

const toArrayBuffer = (plain: string | ArrayBuffer) =>
  plain instanceof ArrayBuffer ? plain : str2ab(plain);

export const hash: JsHash = (plain, options) => {
  const nativeOptions = toNativeOptions(options ?? ({} as Options));
  if (__DEV__) {
    assertLimits(nativeOptions);
  }
  console.log(
    'nativeOptions',
    nativeOptions,
    'plain',
    plain,
    'salt',
    nativeOptions.salt,
    new Uint8Array(nativeOptions.salt)
  );

  return jsiHash(toArrayBuffer(plain), nativeOptions);
};
