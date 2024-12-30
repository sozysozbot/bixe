let controller: AbortController | null = null;

const isError = (a: unknown): a is Error => a instanceof Error;
const isAbortError = (err: Error): boolean => err.name === 'AbortError';


async function display_result(search_by_lang: "pmcp" | "ja" = "pmcp") {
    // If there's an ongoing task, cancel it
    if (controller) {
        controller.abort();
    }

    // Create a new controller for the new task
    controller = new AbortController();
    const signal = controller.signal;

    const search_string = (document.getElementById("search-bar") as HTMLInputElement)!.value;

    if (search_string === "") {
        document.getElementById("search-count")!.style.visibility = "hidden";
        document.getElementById("results-section")!.textContent = "東島通商語コーパス検索システム「ビシェ」へようこそ。";
        document.getElementById("search-bar")!.style.backgroundColor = "#ffffff";
        return;
    }

    document.getElementById("search-count")!.style.visibility = "visible";

    try {
        let items: {
            item: CorpusElem;
            matched_portions: {
                match: string;
                beginIndex: number;
                endIndex: number;
            }[];
        }[];
        try {
            if (search_by_lang === "pmcp") {
                items = get_matches(search_string, "pmcp");
            } else {
                items = get_matches(search_string, "ja");
            }
        } catch (e) {
            // RegExp compilation failed
            document.getElementById("search-count")!.textContent = "正規表現の構文エラーです。";
            document.getElementById("search-bar")!.style.backgroundColor = "#ffaaaa";
            return;
        }
        document.getElementById("search-bar")!.style.backgroundColor = "#ffffff";

        const search_count = items.map(item => item.matched_portions.length).reduce((a, b) => a + b, 0);
        document.getElementById("search-count")!.textContent = search_count === 0 ? "見つかりませんでした。" : search_count + " 個見つかりました。"

        /*
        Each item is of the following form:
        {"item":{"source":"プロパガンダかるた","pmcp":"icco cecnutit lata pi lata cecnutit icco","direct_ja":"","ja":"国が人を守り、人が国を守る","en":""},"matched_portions":[{"match":"cecnutit","beginIndex":5,"endIndex":13},{"match":"cecnutit","beginIndex":27,"endIndex":35}]}
    
        I would like to turn this into
        <div class="searched-item">
            <div class="corpus-text">icco <span class="matched-portion">cecnutit</span> lata pi lata cecnutit icco</div>
            <div class="translation-ja">国が人を守り、人が国を守る</div>
          </div>
          <div class="searched-item">
            <div class="corpus-text">icco cecnutit lata pi lata <span class="matched-portion">cecnutit</span> icco</div>
            <div class="translation-ja">国が人を守り、人が国を守る</div>
          </div>
        */

        document.getElementById("results-section")!.innerHTML = "";

        for (const item of items) {
            // Check if the task has been cancelled
            if (signal.aborted) {
                throw new Error("cancelled");
            }
            const { pmcp: pmcp_text, ja, direct_ja, en } = item.item;
            const { matched_portions } = item;
            const kana = (() => {
                try {
                    return kana_words(pmcp_text);
                } catch (e) {
                    return "";
                }
            })();

            const source_signifier = item.item.source;
            if (!is_valid_source(source_signifier)) {
                throw new Error(`Invalid source signifier: ${source_signifier}`);
            }

            const searched_item = document.createElement("div");
            searched_item.className = "searched-item";

            if (search_by_lang === "pmcp") {
                const corpusText = document.createElement("div");
                if (!location.href.includes("search_")) {
                    corpusText.style.fontFamily = "rounded";
                }
                corpusText.className = "corpus-text";
                for (const { match, beginIndex, endIndex } of matched_portions) {
                    corpusText.appendChild(getSinglyAnnotatedLine(pmcp_text, source_signifier, { beginIndex, endIndex, match }));
                    corpusText.appendChild(document.createElement("hr"));
                }
                searched_item.appendChild(corpusText);
            } else {
                const corpusText = document.createElement("div");
                if (!location.href.includes("search_")) {
                    corpusText.style.fontFamily = "rounded";
                }
                corpusText.className = "corpus-text";
                corpusText.appendChild(getSinglyAnnotatedLine(pmcp_text, source_signifier));
                corpusText.appendChild(document.createElement("hr"));
                searched_item.appendChild(corpusText);
            }

            if (kana != "") {
                const transliteration = document.createElement("div");
                transliteration.textContent = kana;
                transliteration.style.fontSize = "90%";
                transliteration.style.color = "#424242";

                searched_item.appendChild(transliteration);
                searched_item.appendChild(document.createElement("hr"));
            }

            const translationJa = document.createElement("div");
            translationJa.className = "translation-ja";
            if (search_by_lang !== "ja") {
                translationJa.textContent = ja;
            } else {
                let ans = "";
                let current_index = 0;
                for (const { beginIndex, endIndex } of matched_portions) {
                    ans += ja.substring(current_index, beginIndex);
                    ans += `<span class="matched-portion">${ja.substring(beginIndex, endIndex)}</span>`;
                    current_index = endIndex;
                }
                ans += ja.substring(current_index);
                translationJa.innerHTML = ans;
            }
            searched_item.appendChild(translationJa);

            if (direct_ja !== "") {
                const translationJaDirect = document.createElement("div");
                translationJaDirect.className = "translation-ja-direct";
                translationJaDirect.textContent = direct_ja;
                searched_item.appendChild(translationJaDirect);
            }

            if (en !== "") {
                const translationEn = document.createElement("div");
                translationEn.className = "translation-en";
                translationEn.textContent = en;
                searched_item.appendChild(translationEn);
            }

            searched_item.appendChild(document.createElement("hr"));

            const details = document.createElement("details");
            const summary = document.createElement("summary");

            summary.textContent = `出典: ${source_signifier}`;
            details.appendChild(summary);
            const ul = document.createElement("ul");
            details.appendChild(ul);
            const links = HYPERLINKS[source_signifier] ?? [];
            for (const url of links) {
                const a = document.createElement("a");
                a.href = url;
                a.textContent = url;
                a.target = "_blank";
                const li = document.createElement("li");
                li.appendChild(a);
                ul.appendChild(li);
            }

            searched_item.appendChild(details);

            document.getElementById("results-section")!.appendChild(searched_item);
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    } catch (e: unknown) {
        if (isError(e)) {
            if (isAbortError(e)) {
                // Do nothing
            } else {
                throw e;
            }
        } else {
            throw e;
        }
    }
}
