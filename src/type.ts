export type Argon2Type = 'argon2d' | 'argon2i' | 'argon2id';

export type Argon2TypeNative =
  // Argon2d
  | 0
  // Argon2i
  | 1
  // Argon2id
  | 2;

export type Options = {
  hashLength?: number;
  timeCost?: number;
  memoryCost?: number;
  parallelism?: number;
  type?: Argon2Type;
  version?: number;
  // raw?: boolean;
  secret?: ArrayBuffer;
  associatedData?: ArrayBuffer;
} & (
  | {
      salt: ArrayBuffer;
    }
  | {
      saltLength: number;
    }
  | {}
);

export interface OptionsNative {
  hashLength: number;
  timeCost: number;
  memoryCost: number;
  parallelism: number;
  type: Argon2TypeNative;
  version: number;
  // raw?: boolean;
  secret?: ArrayBuffer;
  associatedData?: ArrayBuffer;
  salt: ArrayBuffer;
}

export interface NumericLimit {
  max: number;
  min: number;
}

export interface OptionLimits {
  hashLength: NumericLimit;
  memoryCost: NumericLimit;
  timeCost: NumericLimit;
  parallelism: NumericLimit;
}

export type NativeHash = (
  plain: ArrayBuffer,
  options: OptionsNative
) => Promise<Uint8Array>;

export type JsHash = (
  plain: string | ArrayBuffer,
  options?: Options
) => Promise<Uint8Array>;
