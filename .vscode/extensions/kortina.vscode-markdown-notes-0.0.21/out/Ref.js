"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refFromWikiLinkText = exports.refHasExtension = exports.getRefAt = exports.NULL_REF = exports.debugRef = exports.RefType = void 0;
/*
A `Ref` is a match for:

- a [[wiki-link]]
- a #tag

in the content of a Note document in your workspace.

*/
const vscode = require("vscode");
const NoteWorkspace_1 = require("./NoteWorkspace");
var RefType;
(function (RefType) {
    RefType[RefType["Null"] = 0] = "Null";
    RefType[RefType["WikiLink"] = 1] = "WikiLink";
    RefType[RefType["Tag"] = 2] = "Tag";
})(RefType = exports.RefType || (exports.RefType = {}));
exports.debugRef = (ref) => {
    const { type, word, hasExtension, range } = ref;
    console.debug({
        type: RefType[ref.type],
        word: ref.word,
        hasExtension: ref.hasExtension,
        range: ref.range,
    });
};
exports.NULL_REF = {
    type: RefType.Null,
    word: '',
    hasExtension: null,
    range: undefined,
};
function getRefAt(document, position) {
    let ref;
    let regex;
    let range;
    // let rp = new RemarkParser(document.getText());
    // rp.walkWikiLinksAndTags();
    // let currentNode = rp.getNodeAtPosition(position);
    // #tag regexp
    regex = NoteWorkspace_1.NoteWorkspace.rxTagNoAnchors();
    range = document.getWordRangeAtPosition(position, regex);
    if (range) {
        // here we do nothing to modify the range because the replacements
        // will include the # character, so we want to keep the leading #
        ref = document.getText(range);
        if (ref) {
            return {
                type: RefType.Tag,
                word: ref.replace(/^\#+/, ''),
                hasExtension: null,
                range: range,
            };
        }
    }
    regex = NoteWorkspace_1.NoteWorkspace.rxWikiLink();
    range = document.getWordRangeAtPosition(position, regex);
    if (range) {
        // Our rxWikiLink contains [[ and ]] chars
        // but the replacement words do NOT.
        // So, account for the (exactly) 2 [[  chars at beginning of the match
        // since our replacement words do not contain [[ chars
        let s = new vscode.Position(range.start.line, range.start.character + 2);
        // And, account for the (exactly) 2 ]]  chars at beginning of the match
        // since our replacement words do not contain ]] chars
        let e = new vscode.Position(range.end.line, range.end.character - 2);
        // keep the end
        let r = new vscode.Range(s, e);
        ref = document.getText(r);
        if (ref) {
            // Check for piped wiki-links
            ref = NoteWorkspace_1.NoteWorkspace.cleanPipedWikiLink(ref);
            return {
                type: RefType.WikiLink,
                word: ref,
                hasExtension: exports.refHasExtension(ref),
                range: r,
            };
        }
    }
    return exports.NULL_REF;
}
exports.getRefAt = getRefAt;
exports.refHasExtension = (word) => {
    return !!word.match(NoteWorkspace_1.NoteWorkspace.rxFileExtensions());
};
exports.refFromWikiLinkText = (wikiLinkText) => {
    return {
        type: RefType.WikiLink,
        word: wikiLinkText,
        hasExtension: exports.refHasExtension(wikiLinkText),
        range: undefined,
    };
};
//# sourceMappingURL=Ref.js.map