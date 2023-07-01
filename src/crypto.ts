import {Buffer} from '@craftzdog/react-native-buffer'
import { ExactArrayBuffer, } from "./utils"

// https://github.com/browserify/timing-safe-equal/blob/master/browser.js
export function timingSafeEqual(_a: Buffer |ExactArrayBuffer, _b: Buffer |ExactArrayBuffer) {
  const a = Buffer.from(_a)
  const b = Buffer.from(_b)

  if (a.length !== b.length) {
    return false
  }
  var len = a.length
  var out = 0
  var i = -1
  while (++i < len) {
    out |= a[i] ^ b[i]
  }
  return out === 0
}
