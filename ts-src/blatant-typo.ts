export const BLATANT_TYPO_LIST = [
    { wrong: "lujpt", correct: "lujot" },
    { wrong: "xenup", correct: "nuxep" },
    { wrong: "cunetelti", correct: "cunetleti" },
    { wrong: "cetkail", correct: "cetkaik" },
    { wrong: "nincetaik", correct: "nincetkaik" },
    { wrong: "bapapa", correct: "bapala" },
    { wrong: "kanleti", correct: "kaleti" },
]

export function isBlatantTypo(word: string): boolean {
    return BLATANT_TYPO_LIST.some(({ wrong }) => wrong === word);
}

export function correctBlatantTypo(word: string): string | undefined {
    const found = BLATANT_TYPO_LIST.find(({ wrong }) => wrong === word);
    return found?.correct;
}