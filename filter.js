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
    // Step 1: Unicode normalize + strip diacritics
    let text = input
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

    // Step 3: Single-character leetspeak + homoglyphs (safe subset)
    const charMap = {
      "0": "o", "1": "i", "!": "i", "|": "i", "3": "e",
      "4": "a", "@": "a", "5": "s", "$": "s", "7": "t",
      "8": "b", "9": "g", "+": "t", "(": "c", ")": "c",
      "#": "h",

      // Cyrillic
      "а": "a", "е": "e", "о": "o", "р": "p",
      "с": "c", "у": "y", "х": "x", "і": "i",
      "ј": "j", "ѕ": "s",

      // Greek
      "α": "a", "β": "b", "ε": "e", "ι": "i",
      "ο": "o", "ρ": "p", "τ": "t", "υ": "u", "χ": "x",

      // Extended Latin / symbols
      "æ": "ae", "œ": "oe", "ß": "ss", "þ": "th", "ð": "d",
      "ł": "l", "ø": "o", "ƒ": "f", "©": "c", "®": "r"
    };
    text = text.replace(/./g, ch => charMap[ch] || ch);

    // Step 4: Phonetic equivalents (high-confidence only)
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

    // Step 5: Strip anything not ASCII
    text = text.replace(/[^\x00-\x7F]/g, "");

    return text;
  }

  return filterText;
});
