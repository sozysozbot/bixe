// There are two Roman numerals:
// U+216D Roman Numeral One Hundred
// U+217D Small Roman Numeral One Hundred

// We only want the capital Roman numeral, 
// so we replace the small Roman numeral with the capital Roman numeral right after converting the string to lowercase.

export function toLowerCaseIgnoringRomanC(str: string): string {
  return str.toLowerCase().replaceAll("\u217d", "\u216d");
}
