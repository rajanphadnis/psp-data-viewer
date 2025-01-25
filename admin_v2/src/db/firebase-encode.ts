// http://stackoverflow.com/a/6969486/692528
const escapeRegExp = (str: string) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

const create = (chars: any[]) => {
  const charCodes = chars.map((c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

  const charToCode: any = {};
  const codeToChar: any = {};
  chars.forEach((c, i) => {
    charToCode[c] = charCodes[i];
    codeToChar[charCodes[i]] = c;
  });

  const charsRegex = new RegExp(`[${escapeRegExp(chars.join(""))}]`, "g");
  const charCodesRegex = new RegExp(charCodes.join("|"), "g");

  const encode = (str: string) => str.replace(charsRegex, (match) => charToCode[match]);
  const decode = (str: string) => str.replace(charCodesRegex, (match) => codeToChar[match]);

  return { encode, decode };
};

const { encode, decode } = create(".$[]#/%".split(""));

const { encode: encodeComponents, decode: decodeComponents } = create(".$[]#%".split(""));

export { create, encode, decode, encodeComponents, decodeComponents };

export default {
  create,
  encode,
  decode,
  encodeComponents,
  decodeComponents,
};
