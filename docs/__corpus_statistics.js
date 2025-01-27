import { EARTHLING_LIST, EARTHLING_WORDS, isEarthlingWord } from './earthling.js';
import { tokenize } from './get_singly_annotated_line.js';
import { corpus_new_to_old } from "./search.js";
import { queryLemma } from "./query_lemma.js";
import { isBlatantTypo } from './blatant-typo.js';
function categorize() {
    const highlightable_occurrence_map = new Map();
    const non_highlightable = [];
    const earthling = [];
    const blatant_typo = [];
    const t0 = performance.now();
    for (const item of corpus_new_to_old) {
        const { pmcp: pmcp_text } = item;
        const tokens = tokenize(pmcp_text);
        for (const tok of tokens) {
            if (tok.kind === "pmcp-word") {
                const query_res = queryLemma(tok.content, true);
                if (query_res.kind === "ok") {
                    const lemma = query_res.words.map(w => `(${w.語}|${w.品詞})`).join("");
                    highlightable_occurrence_map.set(lemma, (highlightable_occurrence_map.get(lemma) || 0) + 1);
                }
                else if (isEarthlingWord(tok.content)) {
                    earthling.push(tok.content);
                }
                else if (isBlatantTypo(tok.content)) {
                    blatant_typo.push(tok.content);
                }
                else {
                    non_highlightable.push(tok.content);
                }
            }
        }
    }
    const t1 = performance.now();
    console.log(`Analyzing all the words in the corpus required ${(t1 - t0).toFixed(2)} milliseconds.`);
    return { highlightable_occurrence_map, non_highlightable, earthling, blatant_typo };
}
window.gen_stat = function () {
    const { highlightable_occurrence_map, non_highlightable, earthling, blatant_typo } = categorize();
    // handle highlightable
    const highlightable_uniq_count = highlightable_occurrence_map.size;
    const highlightable_occurrence_arr = [...highlightable_occurrence_map.entries()];
    const highlightable_non_uniq_count = highlightable_occurrence_arr.reduce((acc, [_k, v]) => acc + v, 0);
    document.getElementById("total-count").textContent = highlightable_non_uniq_count.toString();
    highlightable_occurrence_arr.sort(([_k1, v1], [_k2, v2]) => v2 - v1);
    document.getElementById("output-freq-ranking").value = highlightable_occurrence_arr.map(([k, v]) => `${v}\t${k}`).join("\n");
    // handle non-highlightable
    const non_highlightable_uniq = new Set(non_highlightable);
    const non_highlightable_occurrence_arr = [...non_highlightable.reduce((count, cur) => (count.set(cur, (count.get(cur) || 0) + 1), count), new Map())];
    non_highlightable_occurrence_arr.sort(([_k1, v1], [_k2, v2]) => v2 - v1);
    document.getElementById("output-non-highlightable").value = `top-tier non-highlightable: ${JSON.stringify(non_highlightable_occurrence_arr)}`;
    const earthling_uniq = new Set(earthling);
    const blatant_typo_uniq = new Set(blatant_typo);
    const non_uniq_total = highlightable_non_uniq_count + non_highlightable.length + earthling.length + blatant_typo.length;
    const uniq_total = highlightable_uniq_count + non_highlightable_uniq.size + earthling_uniq.size + blatant_typo_uniq.size;
    document.getElementById("overall").value = `        highlightable (not uniq): ${highlightable_non_uniq_count}; ${(highlightable_non_uniq_count / non_uniq_total * 100).toPrecision(4)}%
    non-highlightable (not uniq): ${non_highlightable.length}; ${(non_highlightable.length / non_uniq_total * 100).toPrecision(4)}%
        earthling     (not uniq): ${earthling.length}; ${(earthling.length / non_uniq_total * 100).toPrecision(4)}%
        blatant typo  (not uniq): ${blatant_typo.length}; ${(blatant_typo.length / non_uniq_total * 100).toPrecision(4)}%
    
        highlightable (uniq): ${highlightable_uniq_count}; ${(highlightable_uniq_count / uniq_total * 100).toPrecision(4)}%
    non-highlightable (uniq): ${non_highlightable_uniq.size}; ${(non_highlightable_uniq.size / uniq_total * 100).toPrecision(4)}%
        earthling     (uniq): ${earthling_uniq.size}; ${(earthling_uniq.size / uniq_total * 100).toPrecision(4)}%
        blatant typo  (uniq): ${blatant_typo_uniq.size}; ${(blatant_typo_uniq.size / uniq_total * 100).toPrecision(4)}%`;
    document.getElementById("earthling_list").textContent = JSON.stringify(EARTHLING_LIST, null, 2);
    document.getElementById("allowed_sources").innerHTML = "<ul>" + [...EARTHLING_WORDS].map(([source, words]) => `<li>${source}: ${words.join(", ")}</li>`).join("") + "</ul>";
};
