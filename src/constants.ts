export const ARGON2_TYPE_TO_NATIVE = Object.freeze({
  argon2d: 0,
  argon2i: 1,
  argon2id: 2,
} as const)

export const ARGON2_TYPE_FROM_NATIVE = Object.freeze({
  0: 'argon2d',
  1: 'argon2i',
  2: 'argon2id',
} as const)

// Default from node-argon2
export const DEFAULTS = Object.freeze({
  hashLength: 32,
  saltLength: 16,
  timeCost: 3,
  memoryCost: 1 << 16,
  parallelism: 4,
  type: ARGON2_TYPE_TO_NATIVE.argon2id,
  version: 0x13,
} as const)

export const LIMITS = Object.freeze({
  hashLength: { min: 4, max: 2 ** 32 - 1 },
  memoryCost: { min: 1 << 10, max: 2 ** 32 - 1 },
  timeCost: { min: 2, max: 2 ** 32 - 1 },
  parallelism: { min: 1, max: 2 ** 24 - 1 },
} as const)

export const LIMITS_ENTRIES = Object.entries(LIMITS) as [
  keyof typeof LIMITS,
  (typeof LIMITS)[keyof typeof LIMITS]
][]
