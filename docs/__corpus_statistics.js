import { EARTHLING_LIST, EARTHLING_WORDS, isEarthlingWord } from './earthling.js';
import { tokenize } from './get_singly_annotated_line.js';
import { corpus_new_to_old } from "./search.js";
import { queryLemma } from "./query_lemma.js";
import { isBlatantTypo } from './blatant-typo.js';
import { generateLogLogScatterPlotSVG } from './scatter_plot.js';
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
    document.getElementById("output-power-law").textContent = "Calculating...";
    const svg = generateLogLogScatterPlotSVG(highlightable_occurrence_arr.map(([_k, v], i) => ({ x: i + 1, y: v })));
    document.getElementById("power-law-plot").innerHTML = svg;
    console.log(svg);
    (() => setTimeout(() => {
        const { b, gamma, gammaPrecision, C } = fitDoublePowerLaw(highlightable_occurrence_arr);
        document.getElementById("output-power-law").textContent = `b: ${b}, γ: ${gamma} ± ${gammaPrecision / 2} [normalization constant C: ${C}]`;
    }, 0))();
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
/**
 * Fit a double power law to data.
 *
 * The model is
 *    p(r) = C * r^{-1}               for r <= b
 *         = C * b^{γ-1} * r^{-γ}      for r > b
 *
 * with the normalization constant
 *
 *    C = 1 / ( Σ_{r=1}^{b} r^{-1} + b^{γ-1} Σ_{r=b+1}^{N} r^{-γ} ).
 *
 * The best fit is defined as the pair (b, γ) that maximizes the log likelihood:
 *
 *    LL(b,γ) = Σ_{r <= b} f(r)[ln C - ln r] + Σ_{r > b} f(r)[ln C + (γ-1) ln b - γ ln r].
 *
 * We perform a grid search over possible values of b (taken as observed ranks)
 * and over a candidate range for γ.
 */
function fitDoublePowerLaw(sorted_occurrences) {
    const t0 = performance.now();
    const sum = sorted_occurrences.reduce((acc, [_k, v]) => acc + v, 0);
    const sortedData = sorted_occurrences.map(([k, v], i) => ({ freq: v / sum }));
    const N = sortedData.length;
    // Define the search range for gamma.
    const gammaMin = 1 + 1 / 256;
    const gammaMax = 3.0;
    const gammaStep = 1 / 256;
    let bestLL = -Infinity;
    let bestB = 0;
    let bestGamma = 0;
    let C_at_best = 0;
    // Loop over candidate gamma values.
    for (let gammaCandidate = gammaMin; gammaCandidate <= gammaMax; gammaCandidate += gammaStep) {
        // We only consider thresholds b that leave at least one rank in the tail.
        // Here we loop over the indices of sortedData and take b as the observed rank.
        for (let bIndex = 0; bIndex < N - 1; bIndex++) {
            const bCandidate = bIndex + 1;
            // First compute the normalization constant C for this (b, gamma).
            let sumCore = 0;
            let sumTail = 0;
            for (let i = 0; i < N; i++) {
                const r = i + 1;
                if (r <= bCandidate) {
                    sumCore += Math.pow(r, -1);
                }
                else {
                    sumTail += Math.pow(r, -gammaCandidate); // to be multiplied by b^{γ-1}
                }
            }
            const C = 1 / (sumCore + Math.pow(bCandidate, gammaCandidate - 1) * sumTail);
            // Compute the log likelihood for this parameter pair.
            let ll = 0;
            for (let i = 0; i < N; i++) {
                const r = i + 1;
                const freq = sortedData[i].freq;
                if (r <= bCandidate) {
                    // For r <= b: ln(p(r)) = ln(C) - ln(r)
                    ll += freq * (Math.log(C) - Math.log(r));
                }
                else {
                    // For r > b: ln(p(r)) = ln(C) + (gamma-1) ln(b) - gamma ln(r)
                    ll += freq * (Math.log(C) + (gammaCandidate - 1) * Math.log(bCandidate) - gammaCandidate * Math.log(r));
                }
            }
            // Update the best parameters if we found a higher log likelihood.
            if (ll > bestLL) {
                bestLL = ll;
                bestB = bCandidate;
                bestGamma = gammaCandidate;
                C_at_best = C;
            }
        }
    }
    const t1 = performance.now();
    console.log(`Calculating the best fit required ${(t1 - t0).toFixed(2)} milliseconds.`);
    return { b: bestB, gamma: bestGamma, gammaPrecision: gammaStep, C: C_at_best };
}
