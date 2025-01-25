export const BLATANT_TYPO_LIST = [
    { wrong: "lujpt", correct: "lujot" },
    { wrong: "xenup", correct: "nuxep" },
    { wrong: "cunetelti", correct: "cunetleti" },
    { wrong: "cetkail", correct: "cetkaik" },
    { wrong: "nincetaik", correct: "nincetkaik" },
    { wrong: "panlenti", correct: "panleti" },
];
export function isBlatantTypo(word) {
    return BLATANT_TYPO_LIST.some(({ wrong }) => wrong === word);
}
export function correctBlatantTypo(word) {
    const found = BLATANT_TYPO_LIST.find(({ wrong }) => wrong === word);
    return found?.correct;
}
