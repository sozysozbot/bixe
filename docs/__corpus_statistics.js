import { EARTHLING_LIST, EARTHLING_WORDS, isEarthlingWord } from './earthling.js';
import { tokenize } from './get_singly_annotated_line.js';
import { corpus_new_to_old } from "./search.js";
import { queryLemma } from "./query_lemma.js";
window.gen_stat = function () {
    const occurrence_map = new Map();
    for (const item of corpus_new_to_old) {
        const { pmcp: pmcp_text } = item;
        const tokens = tokenize(pmcp_text);
        for (const tok of tokens) {
            if (tok.kind === "pmcp-word") {
                const query_res = queryLemma(tok.content, true);
                if (query_res.kind === "ok") {
                    const lemma = query_res.words.map(w => `(${w.語}|${w.品詞})`).join("");
                    occurrence_map.set(lemma, (occurrence_map.get(lemma) || 0) + 1);
                }
            }
        }
    }
    const countedOccurrences = [...occurrence_map.entries()];
    const sum = countedOccurrences.reduce((acc, [_k, v]) => acc + v, 0);
    document.getElementById("total-count").textContent = sum.toString();
    countedOccurrences.sort(([_k1, v1], [_k2, v2]) => v2 - v1);
    document.getElementById("output-freq-ranking").value = countedOccurrences.map(([k, v]) => `${v}\t${k}`).join("\n");
    const highlightable = [];
    const non_highlightable = [];
    const earthling = [];
    const t0 = performance.now();
    for (const item of corpus_new_to_old) {
        //  const t0 = performance.now();
        const { pmcp: pmcp_text } = item;
        const tokens = tokenize(pmcp_text);
        for (const tok of tokens) {
            if (tok.kind === "pmcp-word") {
                const query_res = queryLemma(tok.content, true);
                if (query_res.kind === "ok") {
                    highlightable.push(tok.content);
                }
                else if (isEarthlingWord(tok.content)) {
                    earthling.push(tok.content);
                }
                else {
                    non_highlightable.push(tok.content);
                }
            }
        }
        //  const t1 = performance.now();
        //  console.log(`Inner loop required ${(t1 - t0).toFixed(2)} milliseconds.`);
    }
    const t1 = performance.now();
    console.log(`In count_highlightable():\nOuter loop required ${(t1 - t0).toFixed(2)} milliseconds.`);
    const highlightable_uniq = new Set(highlightable);
    const non_highlightable_uniq = new Set(non_highlightable);
    const earthling_uniq = new Set(earthling);
    const counted = [...non_highlightable.reduce((count, cur) => (count.set(cur, (count.get(cur) || 0) + 1), count), new Map())];
    counted.sort(([_k1, v1], [_k2, v2]) => v2 - v1);
    const non_uniq_total = highlightable.length + non_highlightable.length + earthling.length;
    const uniq_total = highlightable_uniq.size + non_highlightable_uniq.size + earthling_uniq.size;
    document.getElementById("output-non-highlightable").value = `
        highlightable (not uniq): ${highlightable.length}; ${(highlightable.length / non_uniq_total * 100).toPrecision(4)}%
    non-highlightable (not uniq): ${non_highlightable.length}; ${(non_highlightable.length / non_uniq_total * 100).toPrecision(4)}%
        earthling     (not uniq): ${earthling.length}; ${(earthling.length / non_uniq_total * 100).toPrecision(4)}%
    
        highlightable (uniq): ${highlightable_uniq.size}; ${(highlightable_uniq.size / uniq_total * 100).toPrecision(4)}%
    non-highlightable (uniq): ${non_highlightable_uniq.size}; ${(non_highlightable_uniq.size / uniq_total * 100).toPrecision(4)}%
        earthling     (uniq): ${earthling_uniq.size}; ${(earthling_uniq.size / uniq_total * 100).toPrecision(4)}%
        
    top-tier non-highlightable: ${JSON.stringify(counted)}
    `;
    document.getElementById("earthling_list").textContent = JSON.stringify(EARTHLING_LIST, null, 2);
    document.getElementById("allowed_sources").innerHTML = "<ul>" + [...EARTHLING_WORDS].map(([source, words]) => `<li>${source}: ${words.join(", ")}</li>`).join("") + "</ul>";
};
