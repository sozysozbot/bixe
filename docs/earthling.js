"use strict";
// 百人一首とかについて、「この資料以外で出てこないでくれ」と指定できる
const EARTHLING_WORDS = new Map([
    [
        // global: words that is allowed to be found in any source
        "__GLOBAL__", ["nippon", "gemu", "maketo", "adbent", "kalenda", "bucu", "gemu", "maketo", "madxan", "lewa"]
    ],
    ["PMCFショーケース", ["alic"]],
    ["改良版アリス", ["alic"]],
    ["かるたスライド", ["kaluta", "jakunin", "icxu"]],
    [
        "日本の遊戯 第一号", ["jakunin", "icxu",
            "waka", "dxanken", "tataite", "kabutte", "gijoku", "cugoloku", "ximonoku", "xogi", "koma", "ginkaku", "tolihuda", "nijokki", "dxankenpon", "kecolin", "haxidate", "dxan", "dxu", "jomihuda", "kandxi", "kaminoku", "uzi", "sume", "hihu", "ogijoku", "kolomode", "phonc", "kacolin", "kijaculingu", "anpaccan", "pulomoxon", "kuwin", "kingu", "hohe", "naligin", "caixowa", "kakinomoto", "hitomalo", "axibiki", "jacuhide", "ikunonomizi", "nalikijo", "kakugijo", "bixoppu", "puwamouxan", "aikodexo", "nijokkikki", "jamakase", "gijokuxo", "kijoto", "humi", "misu", "ginxo", "ikuno", "kijoxa", "ooejama", "ogula", "oejama", "koxikibu", "naganagaxi", "cadaije", "hilagana", "tendxi", "tenno", "xiolule", "koxikibu", "hudxiwala", "italija", "jamadoli", "takenoko", "xidalio", "cteil", "hitoli", "hunja", "cuteilu", "meito", "huku", "kala", "kucaki", "mube", "alaxi", "juu", "lan", "oxo", "kinxo", "kalio", "toma", "alami", "zuju", "nule", "zuzu", "dexo", "zoki", "izi", "jon", "go", "nana", "kiju", "naixi", "too", "kele", "mada", "iku", "mizi", "ula", "alu", "kaxa", "uma", "kema", "nalike", "hixa", "luk", "kecol", "kacol", "luku", "bexap", "nait", "naito", "dotai", "aki", "pacon", "kinke", "ba", "hazi", "kaku", "kakugijo", "aikodexo", "kode", "loku", "zec", "xogi", "aiko", "ama", "meit", "tolijo", "kijo", "pic"
        ]
    ]
]);
// TODO: When EARTHLING_LIST contains a word that has legitimate use, then we must report the clash
// 現世都合の単語一覧
const EARTHLING_LIST = [...EARTHLING_WORDS].flatMap(([_, words]) => words);
function isEarthlingWord(word) {
    return EARTHLING_LIST.includes(word);
}
function expectedSourcesForEarthlingWord(word) {
    const ans = [];
    for (const [source, words] of EARTHLING_WORDS) {
        if (words.includes(word)) {
            ans.push(source);
        }
    }
    return ans;
}
