/**
 * getHoverableText(["pi"], {
 *  headword: "pi",
 *  part_of_speech: "文接続詞",
 *  content: "～して、～したが、～すると"
 * })
 * returns 
 * 
<span class="hover-text">
    <span class="main-text">pi</span>
    <span class="tooltip-text bottom-tooltip-text">
        <span class="tooltip-headword">PI</span>
        <span class="tooltip-pronunciation" lang="ja">［ピ］</span>
        <br>
        <span class="tooltip-word-description" lang="ja">
            <span class="tooltip-part-of-speech">文接続詞</span>
            <span class="tooltip-translation">～して、～したが、～すると</span>
        </span>
    </span>
</span>
 */
function getHoverableText(
    maybe_highlighted_lemma: (string | Node)[],
    descriptions: {
        headword: string,
        part_of_speech: string,
        content: string
    }[]
) {
    const container_fragment: DocumentFragment = document.importNode((document.querySelector("#hoverable-container-template")! as HTMLTemplateElement).content, true);
    container_fragment.querySelector(".main-text")!.textContent = "";
    container_fragment.querySelector(".main-text")!.append(...maybe_highlighted_lemma);

    const tooltip_text: Element = container_fragment.querySelector(".tooltip-text")!;
    for (let i = 0; i < descriptions.length; i++) {
        if (i !== 0) {
            tooltip_text.append(document.createElement("hr"));
        }
        tooltip_text.append(getOneEntryFragment(descriptions[i]));
    }

    const hover_text = document.createElement("span");
    hover_text.classList.add("hover-text");
    hover_text.append(container_fragment);
    return hover_text;
}

function getOneEntryFragment(description: {
    headword: string,
    part_of_speech: string,
    content: string
}) {
    const one_entry_fragment: DocumentFragment = document.importNode((document.querySelector("#one-entry-template")! as HTMLTemplateElement).content, true);
    one_entry_fragment.querySelector(".tooltip-headword")!.textContent = description.headword.toUpperCase();
    one_entry_fragment.querySelector(".tooltip-part-of-speech")!.textContent = description.part_of_speech;
    one_entry_fragment.querySelector(".tooltip-translation")!.innerHTML =
        description.content
            .replaceAll(/\[/g, `[<span style="font-family: 'rounded'; letter-spacing: 0.03em; vertical-align: -2.5px;">`)
            .replaceAll(/\]/g, `</span>]`)
        ; // TODO: XSS
    const split_leti_but_join_it = (str: string) => str.toLowerCase()
        .replaceAll(/-it\b(?!-)/g, "it")
        .replaceAll(/(?<!-|mo)(leti|lt)\b(?!-)/g, "-leti");

    one_entry_fragment.querySelector(".tooltip-pronunciation")!.textContent = `［${kana_words(
        split_leti_but_join_it(description.headword)
    )}］`;
    return one_entry_fragment;
}
