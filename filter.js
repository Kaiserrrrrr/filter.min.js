(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    root.filterText = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {

  function filterText(input) {
    // Step 0: Remove zero-width / invisible characters
    let text = input.replace(/[\u200B-\u200D\uFEFF]/g, "");

    // Step 1: Unicode normalize + strip diacritics
    text = text
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // Step 2: Multi-character leetspeak
    const multiMap = {
      "/\\": "a",
      "\\/\\/": "w",
      "|3": "b",
      "|-|": "h",
      "(_)": "u",
      "vv": "w",
      "\\|\\|": "n",
      "/\\/": "n",
      "/-\\": "h",
      "><": "x",
      "\\/": "v"
    };
    for (const [pattern, replacement] of Object.entries(multiMap)) {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      text = text.replace(regex, replacement);
    }

    // Step 3: Single-character leetspeak + homoglyphs
    const charMap = {
  // Numbers & symbols
  "0": "o", "1": "i", "!": "i", "|": "i", "3": "e",
  "4": "a", "@": "a", "5": "s", "$": "s", "7": "t",
  "8": "b", "9": "g", "+": "t", "(": "c", ")": "c",
  "#": "h", "©": "c", "®": "r", "ℓ": "l", "℮": "e", "™": "tm",

  // Cyrillic
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c",
  "у": "y", "х": "x", "і": "i", "ј": "j", "ѕ": "s",
  "б": "b", "т": "t", "м": "m", "н": "h", "к": "k",

  // Greek
  "α": "a", "β": "b", "γ": "y", "δ": "d", "ε": "e", "ι": "i",
  "ο": "o", "ρ": "p", "τ": "t", "υ": "u", "χ": "x",
  "λ": "l", "ν": "n", "μ": "m", "θ": "th", "η": "n",

  // Hebrew
  "ו": "v", "ן": "n", "ר": "r", "ק": "q", "ח": "h", "ש": "sh",

  // Armenian
  "օ": "o", "ս": "s", "հ": "h", "գ": "g",

  // Georgian
  "Ⴍ": "o", "Ⴋ": "m", "Ⴐ": "r", "Ⴁ": "b",

  // Korean Hangul Jamo
  "ㅇ": "o", "ㅣ": "i", "ㅂ": "b", "ㄹ": "l",
  "ㅁ": "m", "ㄴ": "n", "ㅎ": "h", "ㅍ": "f", "ㅊ": "t", "ㅅ": "v",

  // Fullwidth
  "ａ": "a","ｂ": "b","ｃ": "c","ｄ": "d","ｅ": "e","ｆ": "f",
  "ｇ": "g","ｈ": "h","ｉ": "i","ｊ": "j","ｋ": "k","ｌ": "l",
  "ｍ": "m","ｎ": "n","ｏ": "o","ｐ": "p","ｑ": "q","ｒ": "r",
  "ｓ": "s","ｔ": "t","ｕ": "u","ｖ": "v","ｗ": "w","ｘ": "x",
  "ｙ": "y","ｚ": "z",

  // Math bold/italic/etc (sample a–d)
  "𝐚": "a","𝑎": "a","𝒂": "a","𝔞": "a","𝖆": "a","𝘢": "a","𝙖": "a","𝚊": "a",
  "𝐛": "b","𝑏": "b","𝒃": "b","𝔟": "b","𝖇": "b","𝘣": "b","𝙗": "b","𝚋": "b",
  "𝐜": "c","𝑐": "c","𝒄": "c","𝔠": "c","𝖈": "c","𝘤": "c","𝙘": "c","𝚌": "c",
  "𝐝": "d","𝑑": "d","𝒅": "d","𝔡": "d","𝖉": "d","𝘥": "d","𝙙": "d","𝚍": "d",

  // IPA / Phonetic
  "ʀ": "r", "ʃ": "sh", "ʒ": "z", "ʏ": "y", "ɡ": "g", "ʜ": "h"
};
    
    text = text.replace(/./g, ch => charMap[ch] || ch);

    // Step 4: Phonetic equivalents
    const phoneticMap = {
      "ph": "f",
      "ck": "k",
      "vv": "w",
      "qu": "kw"
    };
    for (const [pattern, replacement] of Object.entries(phoneticMap)) {
      const regex = new RegExp(pattern, "g");
      text = text.replace(regex, replacement);
    }

    // Step 5: Remove all non-ASCII letters/numbers
    text = text.replace(/[^a-z0-9]/g, "");

    return text;
  }

  return filterText;
});
