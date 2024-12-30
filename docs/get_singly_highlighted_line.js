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
            "waka", "dxanken", "tataite", "kabutte", "gijoku", "cugoloku", "ximonoku", "xogi", "koma", "ginkaku", "tolihuda", "nijokki", "dxankenpon", "kecolin", "haxidate", "dxan", "dxu", "jomihuda", "kandxi", "kaminoku", "uzi", "sume", "hihu", "ogijoku", "kolomode", "phonc", "kacolin", "kijaculingu", "anpaccan", "pulomoxon", "kuwin", "kingu", "hohe", "naligin", "caixowa", "kakinomoto", "hitomalo", "axibiki", "jacuhide", "ikunonomizi", "nalikijo", "kakugijo", "bixoppu", "puwamouxan", "aikodexo", "nijokkikki", "jamakase", "gijokuxo", "kijoto", "humi", "misu", "ginxo", "ikuno", "kijoxa", "ooejama", "ogula", "oejama", "koxikibu", "naganagaxi", "cadaije", "hilagana", "tendxi", "tenno", "xiolule", "koxikibu", "hudxiwala", "italija", "jamadoli", "takenoko", "xidalio", "cteil", "hitoli", "hunja", "cuteilu", "meito", "huku", "kala", "kucaki", "mube", "alaxi", "juu", "lan", "oxo", "kinxo", "kalio", "toma", "alami", "zuju", "nule", "zuzu", "dexo", "zoki", "izi", "jon", "go", "nana", "kiju", "naixi", "too", "kele", "mada", "iku", "mizi", "ula", "alu", "kaxa", "uma", "kema", "nalike", "hixa", "luk", "kecol", "kacol", "luku", "bexap", "nait", "naito", "dotai", "aki", "pacon", "kinke", "ba", "hazi", "kaku", "kakugijo", "aikodexo", "kode", "loku", "zec", "xogi", "aiko", "ama", "meit", "tolijo", "kijo"
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
/**
 * The basic functionality is to highlight the matched portion.
 * That is, we want
 *
 *  <div>icco <strong class="matched-portion">cecnutit</strong> lata pi lata cecnutit icco</div>
 *
 * However, the tricky thing is that
 * - anything between an `{` and a `}` should be given a special font
 * - we also want to add tooltips to each word
 *
 * which makes the whole thing so much trickier.
 

- 検索ハイライトは単に背景色がつくだけであり、その背景色付与は単一の HTML タグによって行わなくてもよい
    - ただし、「一文字ずつ背景色」とすると、サロゲートペアやら grapheme cluster やらが泣き別れするので、ちゃんと区間で扱う
- 単語ツールチップは単一タグで行うことがマスト
- 波カッコ内部においては単語ツールチップが出ることはないが、検索ハイライトはつく

ということで、設計はこうあるべき：

テキストは「単語」と「非単語」に分けられる
- 「非単語」はパンクチュエーションやスペースや燐字や波カッコ

トークンの [start, end) とハイライトの [start, end) を比べる
    - 区間が被っていないなら当然無視
    - 被っている場合、トークンの区間に clamp された範囲をハイライトすればよい
        - max(tok_start, highlight_start) から始めて min(tok_end, highlight_end) までハイライトすればいい
        - よってその位置で slice すればいい

 */
function getSinglyAnnotatedLine(full_text, source, highlight_) {
    const h = highlight_ ?? { beginIndex: 0, endIndex: 0, match: "" };
    const tokens = tokenize(full_text);
    const single_line = document.createElement("div");
    let offset = 0;
    for (const tok of tokens) {
        const tok_start = offset;
        const tok_end = offset + tok.content.length;
        const maybe_highlighted = (() => {
            if (h.beginIndex === h.endIndex /* is zero-width match */
                && tok_start <= h.beginIndex /* when the match lies at the leftmost position of the token, we want to include it */
                && (tok.kind === "eof" || h.endIndex < tok_end
                /* We don't want to include the highlight when the match lies at the rightmost position of the token, to avoid duplication.
                The exception is when the token is a zero-width EOF token
                */
                )) {
                // zero-width match requires special handling
                // but in a way it is simpler
                const splitting_index = h.beginIndex - offset;
                const zeroWidth = document.createElement("span");
                // If the "highlight" object in the argument is undefined, we actually don't want to highlight anything
                if (highlight_ !== undefined) {
                    zeroWidth.classList.add("matched-portion", "zero-width");
                }
                zeroWidth.textContent = "";
                return [
                    tok.content.slice(0, splitting_index),
                    zeroWidth,
                    tok.content.slice(splitting_index)
                ];
            }
            else if (h.endIndex <= tok_start || tok_end <= h.beginIndex) { // non-zero width and no overlap
                return [tok.content];
            }
            else {
                // non-zero width; we have to consider the case when the token partially contains the highlight
                // We already know that `tok_start < o.endIndex` and `o.beginIndex < tok_end`
                const highlight_start = Math.max(tok_start, h.beginIndex);
                const highlight_end = Math.min(tok_end, h.endIndex);
                const beforeMatch = tok.content.slice(0, highlight_start - offset);
                const matchedPortion = document.createElement("span");
                matchedPortion.classList.add("matched-portion");
                matchedPortion.textContent = tok.content.slice(highlight_start - offset, highlight_end - offset);
                const afterMatch = tok.content.slice(highlight_end - offset);
                return [beforeMatch, matchedPortion, afterMatch];
            }
        })();
        switch (tok.kind) {
            case "pmcp-word":
                {
                    if (isEarthlingWord(tok.content)) {
                        single_line.append(getHoverableForEarthlingWord(maybe_highlighted, tok.content));
                        const expected_sources = expectedSourcesForEarthlingWord(tok.content);
                        if (expected_sources.includes(source)
                            || expected_sources.includes("__GLOBAL__")) {
                            break;
                        }
                        alert(`Word "${tok.content}" is expected to be found only in sources ${JSON.stringify(expected_sources)} but was found in "${source}"`);
                    }
                    const query_res = queryLemma(tok.content, true);
                    if (query_res.kind === "ok") {
                        const descriptions = query_res.words.map(w => ({
                            headword: toLowerCaseIgnoringRomanC(w.語),
                            part_of_speech: w.品詞,
                            content: w.意味_日
                        }));
                        single_line.append(getHoverableText(maybe_highlighted, descriptions));
                    }
                    else {
                        single_line.append(...maybe_highlighted);
                    }
                }
                break;
            case "others":
            case "eof":
                {
                    single_line.append(...maybe_highlighted);
                }
                break;
            case "problematic-brace":
                {
                    const problematic_brace = document.createElement("span");
                    problematic_brace.classList.add('problematic_brace');
                    problematic_brace.append(...maybe_highlighted);
                    single_line.appendChild(problematic_brace);
                }
                break;
            default: {
                tok;
                throw new Error("unreachable");
            }
        }
        offset += tok.content.length;
    }
    return single_line;
}
function tokenize(full_text) {
    const ans = [];
    let state = { kind: "handling-word", current: "" };
    for (let i = 0; i < full_text.length; i++) {
        // Since we will be using regex's index, we need the surrogate pair to be separated
        const c = full_text[i];
        switch (state.kind) {
            case "handling-word":
                {
                    if (c === '{') {
                        if (state.current !== "") {
                            ans.push({ kind: "pmcp-word", content: state.current });
                        }
                        state = { kind: "inside-brace", depth: 1, content: "{" };
                    }
                    else if (c === '}') {
                        throw new Error(`Unexpected closing } encountered while handling words. The full text is:\n\n${full_text}`);
                    }
                    else if (/[a-zA-Z]/.exec(c)) { // word character
                        state.current += c;
                    }
                    else { // other character; word ends
                        if (state.current !== "") {
                            ans.push({ kind: "pmcp-word", content: state.current });
                        }
                        state = { kind: "handling-others", current: c };
                    }
                }
                break;
            case "handling-others":
                {
                    if (c === '{') {
                        if (state.current !== "") {
                            ans.push({ kind: "others", content: state.current });
                        }
                        state = { kind: "inside-brace", depth: 1, content: "{" };
                    }
                    else if (c === '}') {
                        throw new Error(`Unexpected closing } encountered while handling words. The full text is:\n\n${full_text}`);
                    }
                    else if (/[a-zA-Z]/.exec(c)) { // word character; word begins
                        if (state.current !== "") {
                            ans.push({ kind: "others", content: state.current });
                        }
                        state = { kind: "handling-word", current: c };
                    }
                    else { // other character;
                        state.current += c;
                    }
                }
                break;
            case "inside-brace":
                {
                    if (c === '{') {
                        state = { kind: "inside-brace", depth: state.depth + 1, content: state.content + "{" };
                    }
                    else if (c === '}') {
                        if (state.depth === 1) {
                            ans.push({ kind: "problematic-brace", content: state.content + "}" });
                            state = { kind: "handling-word", current: "" };
                        }
                        else {
                            state = { kind: "inside-brace", depth: state.depth - 1, content: state.content + "}" };
                        }
                    }
                    else {
                        state.content += c;
                    }
                }
                break;
            default:
                state;
                throw new Error("unreachable");
        }
    }
    if (state.kind === "handling-word") {
        if (state.current !== "") {
            ans.push({ kind: "pmcp-word", content: state.current });
        }
    }
    else if (state.kind === "handling-others") {
        if (state.current !== "") {
            ans.push({ kind: "others", content: state.current });
        }
    }
    else if (state.kind === "inside-brace") {
        throw new Error(`Closing } not encountered. The full text is:\n\n${full_text}`);
    }
    else {
        state;
        throw new Error("unreachable");
    }
    // Add EOF token so that the zero-width match at the end of the string is properly displayed
    ans.push({ kind: "eof", content: "" });
    return ans;
}
function count_highlightable() {
    const ok = [];
    const not_ok = [];
    const earthling = [];
    const t0 = performance.now();
    for (const item of corpus_new_to_old) {
        const t0 = performance.now();
        const { pmcp: pmcp_text } = item;
        const tokens = tokenize(pmcp_text);
        for (const tok of tokens) {
            if (tok.kind === "pmcp-word") {
                const query_res = queryLemma(tok.content, true);
                if (query_res.kind === "ok") {
                    ok.push(tok.content);
                }
                else if (isEarthlingWord(tok.content)) {
                    earthling.push(tok.content);
                }
                else {
                    not_ok.push(tok.content);
                }
            }
        }
        const t1 = performance.now();
        console.log(`Inner loop required ${(t1 - t0).toFixed(2)} milliseconds.`);
    }
    const t1 = performance.now();
    console.log(`Outer loop required ${(t1 - t0).toFixed(2)} milliseconds.`);
    const highlightable_uniq = new Set(ok);
    const non_highlightable_uniq = new Set(not_ok);
    const earthling_uniq = new Set(earthling);
    const counted = [...not_ok.reduce((count, cur) => (count.set(cur, (count.get(cur) || 0) + 1), count), new Map())];
    counted.sort(([_k1, v1], [_k2, v2]) => v2 - v1);
    const non_uniq_total = ok.length + not_ok.length + earthling.length;
    const uniq_total = highlightable_uniq.size + non_highlightable_uniq.size + earthling_uniq.size;
    return `
    highlightable (not uniq): ${ok.length}; ${(ok.length / non_uniq_total * 100).toPrecision(4)}%
non-highlightable (not uniq): ${not_ok.length}; ${(not_ok.length / non_uniq_total * 100).toPrecision(4)}%
    earthling     (not uniq): ${earthling.length}; ${(earthling.length / non_uniq_total * 100).toPrecision(4)}%

    highlightable (uniq): ${highlightable_uniq.size}; ${(highlightable_uniq.size / uniq_total * 100).toPrecision(4)}%
non-highlightable (uniq): ${non_highlightable_uniq.size}; ${(non_highlightable_uniq.size / uniq_total * 100).toPrecision(4)}%
    earthling     (uniq): ${earthling_uniq.size}; ${(earthling_uniq.size / uniq_total * 100).toPrecision(4)}%
    
top-tier non-highlightable: ${JSON.stringify(counted)}
`;
}
