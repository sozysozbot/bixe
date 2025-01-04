import { CORPUS } from "./corpus.js";
import { sources_new_to_old } from "./linkMap.js";

export const corpus_new_to_old = [...CORPUS].toSorted((a, b) => sources_new_to_old.indexOf(a.source) - sources_new_to_old.indexOf(b.source))


export function get_matches(regex_str: string, lang: "pmcp" | "ja" | "direct_ja") {
    return corpus_new_to_old.filter(item => item[lang].match(new RegExp(regex_str, "gi"))).map(item => {
        const matched_portions = [];
        /* 
        g - global 
        i - case insensitive
        d - get the indices */
        const myRe = new RegExp(regex_str, "gid");
        let myArray: RegExpExecArray | null;
        while ((myArray = myRe.exec(item[lang])) !== null) {
            matched_portions.push({
                match: myArray[0],
                beginIndex: myArray.indices![0][0],
                endIndex: myRe.lastIndex
            });

            // zero-width match
            if (myArray.indices![0][0] === myRe.lastIndex) {
                // According to MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
                // > If the regex may match zero-length characters (e.g. /^/gm), increase its lastIndex manually each time to avoid being stuck in the same place.
                myRe.lastIndex++;
            }
        }
        return { item, matched_portions };
    });
}
