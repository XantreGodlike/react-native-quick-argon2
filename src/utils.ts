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
