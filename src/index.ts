import { Buffer } from '@craftzdog/react-native-buffer';
import { QuickArgon2 } from './install';
import type { Options, OptionsNative } from './type';
import {
  ARGON_2_TYPE_FROM_NATIVE,
  ARGON_2_TYPE_TO_NATIVE,
  DEFAULTS,
  LIMITS_ENTRIES,
} from './constants';
import { toArrayBuffer, randomBytesArrayBuffer } from './utils';
import { PhcOptions, deserialize, serialize } from '@phc/format';
// import { deserialize, serialize,  } from '@phc/format'

// @phc/format is using global.Buffer
global.Buffer = Buffer as any;

const { hash: jsiHash } = QuickArgon2;

const assertLimits = (options: OptionsNative) =>
  LIMITS_ENTRIES.forEach(([key, { max, min }]) => {
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
      : randomBytesArrayBuffer(DEFAULTS.saltLength);
  const type =
    'type' in options && options.type
      ? ARGON_2_TYPE_TO_NATIVE[options.type]
      : DEFAULTS.type;

  return {
    ...DEFAULTS,
    ...options,
    type,
    salt,
  };
};

const toSerializedOptions = (
  options: OptionsNative,
  hashResult: ArrayBuffer
): PhcOptions => ({
  id: ARGON_2_TYPE_FROM_NATIVE[options.type],
  params: {
    m: options.memoryCost,
    t: options.timeCost,
    p: options.parallelism,
    ...(options.associatedData
      ? { data: Buffer.from(options.associatedData) }
      : {}),
  },
  hash: Buffer.from(hashResult),
  salt: Buffer.from(options.salt),
  version: options.version,
});

export const needRehash = (argon2Hash: string, options: Options = {}) => {
  const optionsNative = toNativeOptions(options);
  const hashOptions = deserialize(argon2Hash);

  return (
    +hashOptions.version !== +optionsNative.version ||
    +hashOptions.params.m !== +optionsNative.memoryCost ||
    +hashOptions.params.t !== +optionsNative.timeCost
  );
};

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options?: Options & { raw?: false }
): Promise<string>;

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options?: Options & { raw: true }
): Promise<ArrayBuffer>;

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options: Options = {}
) {
  const nativeOptions = toNativeOptions(options);
  assertLimits(nativeOptions);

  const hashResult = await jsiHash(toArrayBuffer(plain), nativeOptions);
  if (options.raw) {
    return hashResult;
  }

  return serialize(toSerializedOptions(nativeOptions, hashResult));
}

export const verify = async (
  argon2Hash: string,
  plain: string | ArrayBuffer | Buffer,
  options?: Omit<Options, 'raw'>
) => hash(plain, options).then((hashResult) => hashResult === argon2Hash);
