import { Buffer } from '@craftzdog/react-native-buffer'
import {
  OutputPhcOptions,
  PhcOptions,
  deserialize,
  serialize,
} from '@phc/format'
import {
  ARGON2_TYPE_FROM_NATIVE,
  ARGON2_TYPE_TO_NATIVE,
  DEFAULTS,
  LIMITS_ENTRIES,
} from './constants'
import { timingSafeEqual } from './crypto'
import { QuickArgon2 } from './install'
import type { Options, OptionsNative, VerifyOptions } from './type'
import {
  ExactArrayBuffer,
  randomBytesArrayBuffer,
  toArrayBuffer,
} from './utils'
export * from './type'
export { LIMITS as limits } from './constants'

export const { argon2d, argon2i, argon2id } = ARGON2_TYPE_TO_NATIVE
export const ARGON2_MAP = ARGON2_TYPE_TO_NATIVE

// @phc/format is using global.Buffer
global.Buffer = Buffer as any

const { hash: jsiHash } = QuickArgon2
const EMPTY = Object.freeze({} as const)

const assertLimits = (options: OptionsNative) =>
  LIMITS_ENTRIES.forEach(([key, { max, min }]) => {
    const value = options[key]
    if (min <= value && value <= max) {
      return
    }
    throw new Error(`Invalid ${key}, must be between ${min} and ${max}.`)
  })

const toNativeOptions = ({
  secret,
  associatedData,
  ...options
}: Options): OptionsNative => {
  const salt =
    'salt' in options && options.salt
      ? toArrayBuffer(options.salt)
      : randomBytesArrayBuffer(DEFAULTS.saltLength)
  const type =
    'type' in options && options.type !== undefined
      ? typeof options.type === 'number'
        ? options.type
        : ARGON2_TYPE_TO_NATIVE[options.type]
      : DEFAULTS.type

  return {
    ...DEFAULTS,
    ...options,
    associatedData: associatedData ? toArrayBuffer(associatedData) : undefined,
    secret: secret ? toArrayBuffer(secret) : undefined,
    type,
    salt,
  }
}

const toSerializedOptions = (
  options: OptionsNative,
  hashResult: ArrayBuffer
): PhcOptions => ({
  id: ARGON2_TYPE_FROM_NATIVE[options.type],
  params: {
    m: options.memoryCost,
    t: options.timeCost,
    p: options.parallelism,
    ...(options.associatedData
      ? { data: Buffer.from(options.associatedData) }
      : EMPTY),
  },
  hash: Buffer.from(hashResult),
  salt: Buffer.from(options.salt),
  version: options.version,
})
const fromSerializedOptions = (
  serializedOptions: OutputPhcOptions
): Options & { hash: Buffer } => ({
  version: +(serializedOptions.version ?? ARGON2_TYPE_TO_NATIVE.argon2id),
  salt: serializedOptions.salt,
  hash: serializedOptions.hash,
  memoryCost: +serializedOptions.params.m,
  timeCost: +serializedOptions.params.t,
  parallelism: +serializedOptions.params.p,
  type: serializedOptions.id as keyof typeof ARGON2_TYPE_TO_NATIVE,

  hashLength: serializedOptions.hash.length,
  ...(serializedOptions.params.data
    ? {
        associatedData: toArrayBuffer(
          Buffer.from(serializedOptions.params.data, 'base64' as const)
        ),
      }
    : EMPTY),
})

export const needRehash = (argon2Hash: string, options: Options = EMPTY) => {
  const optionsNative = toNativeOptions(options)
  const hashOptions = deserialize(argon2Hash)

  return (
    +hashOptions.version !== +optionsNative.version ||
    +hashOptions.params.m !== +optionsNative.memoryCost ||
    +hashOptions.params.t !== +optionsNative.timeCost
  )
}

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options?: Options & { raw?: false }
): Promise<string>

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options?: Options & { raw: true }
): Promise<ArrayBuffer>

export async function hash(
  plain: string | ArrayBuffer | Buffer,
  options: Options = EMPTY
) {
  const nativeOptions = toNativeOptions(options)
  assertLimits(nativeOptions)

  const hashResult = await jsiHash(toArrayBuffer(plain), nativeOptions)
  if (options.raw) {
    return hashResult as ArrayBuffer
  }

  return serialize(toSerializedOptions(nativeOptions, hashResult))
}

export const verify = async (
  argon2Hash: string,
  plain: string | ArrayBuffer | Buffer,
  options?: VerifyOptions
) => {
  const obj = deserialize(argon2Hash)
  // Only these have the "params" key, so if the password was encoded
  // using any other method, the destructuring throws an error
  if (!(obj.id in ARGON2_TYPE_TO_NATIVE)) {
    return false
  }

  const { hash: _hash, ...fromStringOptions } = fromSerializedOptions(obj)

  return timingSafeEqual(
    (await hash(plain, {
      ...options,
      ...fromStringOptions,
      raw: true,
    })) as ExactArrayBuffer,
    _hash
  )
}
