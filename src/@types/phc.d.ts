declare module '@phc/format' {
  import type { Buffer } from '@craftzdog/react-native-buffer'
  declare interface PhcOptions {
    id: string
    version: number
    params: {
      m: number
      t: number
      p: number
      data?: Buffer
    }
    salt: Buffer
    hash: Buffer
  }
  declare interface OutputPhcOptions {
    id: string
    version: number
    params: {
      m: number
      t: number
      p: number
      data?: string
    }
    salt: Buffer
    hash: Buffer
  }

  declare function serialize(opts: PhcOptions): string

  declare function deserialize(phcstr: string): OutputPhcOptions
}
