import { Buffer } from '@craftzdog/react-native-buffer';
import crypto from 'react-native-quick-crypto';
const { randomBytes } = crypto;

export const ab2str = (buf: ArrayBuffer) => {
  return String.fromCharCode.apply(
    null,
    new Uint16Array(buf) as unknown as number[]
  );
};

export const str2ab = (str: string) => {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

export const randomBytesArrayBuffer = (length: number) => {
  // its bind for react native so I think it should be sync
  const bytes = randomBytes(length) as Buffer;
  return toArrayBuffer(bytes);
};

export const toArrayBuffer = (plain: string | ArrayBuffer | Buffer) =>
  Buffer.isBuffer(plain)
    ? plain.buffer.slice(plain.byteOffset, plain.byteOffset + plain.byteLength)
    : plain instanceof ArrayBuffer
    ? plain
    : str2ab(plain);
