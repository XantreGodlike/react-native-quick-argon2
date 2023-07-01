import { ValueOf } from 'type-fest'
import { ARGON2_TYPE_TO_NATIVE } from './constants'
import { ExactArrayBuffer } from './utils'

export type Argon2Type = keyof typeof ARGON2_TYPE_TO_NATIVE

// Argon2d
// | 0
// Argon2i
// | 1
// Argon2id
// | 2;
export type Argon2TypeNative = ValueOf<typeof ARGON2_TYPE_TO_NATIVE>

export type Options = {
  hashLength?: number
  timeCost?: number
  memoryCost?: number
  parallelism?: number
  type?: Argon2Type | Argon2TypeNative
  version?: number
  // raw?: boolean;
  secret?: ArrayBuffer
  raw?: boolean
  associatedData?: ArrayBuffer
} & (
  | {
      salt: ArrayBuffer
    }
  | {
      saltLength: number
    }
  | {}
)
export type VerifyOptions = Omit<Options, 'raw'>

export interface OptionsNative {
  hashLength: number
  timeCost: number
  memoryCost: number
  parallelism: number
  type: Argon2TypeNative
  version: number
  // raw?: boolean;
  secret?: ExactArrayBuffer
  associatedData?: ExactArrayBuffer
  salt: ExactArrayBuffer
}

export interface NumericLimit {
  max: number
  min: number
}

export interface OptionLimits {
  hashLength: NumericLimit
  memoryCost: NumericLimit
  timeCost: NumericLimit
  parallelism: NumericLimit
}

export type NativeHash = (
  plain: ExactArrayBuffer,
  options: OptionsNative
) => Promise<ExactArrayBuffer>
