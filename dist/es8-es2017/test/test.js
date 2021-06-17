"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const debug_ = require("debug");
const filehound = require("filehound");
const jsonDiff = require("json-diff");
const path = require("path");
const media_overlay_1 = require("../src/models/media-overlay");
const publication_1 = require("../src/models/publication");
const publication_parser_1 = require("../src/parser/publication-parser");
const serializable_1 = require("r2-lcp-rn/dist/es8-es2017/src/serializable");
const init_globals_1 = require("../src/init-globals");
init_globals_1.initGlobalConverters_SHARED();
init_globals_1.initGlobalConverters_GENERIC();
const debug = debug_("r2:shared#test");
async function fn() {
    return Promise.resolve("foo");
}
ava_1.default("dummy async test", async (t) => {
    debug("test ASYNC");
    t.is(await fn(), "foo");
});
ava_1.default("SMIL clock values", (t) => {
    t.plan(16);
    t.is(media_overlay_1.timeStrToSeconds("12.345"), 12.345);
    t.is(media_overlay_1.timeStrToSeconds("2345ms"), 2.345);
    t.is(media_overlay_1.timeStrToSeconds("345ms"), 0.345);
    t.is(media_overlay_1.timeStrToSeconds("7.75h"), 27900);
    t.is(media_overlay_1.timeStrToSeconds("76.2s"), 76.2);
    t.is(media_overlay_1.timeStrToSeconds("00:56.78"), 56.78);
    t.is(media_overlay_1.timeStrToSeconds("09:58"), 598);
    t.is(media_overlay_1.timeStrToSeconds("09.5:58"), 628);
    t.is(media_overlay_1.timeStrToSeconds("0:00:04"), 4);
    t.is(media_overlay_1.timeStrToSeconds("0:05:01.2"), 301.2);
    t.is(media_overlay_1.timeStrToSeconds("124:59:36"), 449976);
    t.is(media_overlay_1.timeStrToSeconds("5:34:31.396"), 20071.396);
    t.is(media_overlay_1.timeStrToSeconds("5:34.5:31.396"), 20101.396);
    t.is(media_overlay_1.timeStrToSeconds("7.5z"), 7.5);
    t.is(media_overlay_1.timeStrToSeconds("4:5:34:31.396"), 0);
    t.is(media_overlay_1.timeStrToSeconds(""), 0);
});
async function delay(okay) {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(okay);
        }, 1000);
    });
}
ava_1.default("EPUB parsing (de)serialize roundtrip", async (t) => {
    const dirPath = path.join(process.cwd(), "misc/epubs/");
    const filePaths = await filehound.create()
        .discard("node_modules")
        .depth(5)
        .paths(dirPath)
        .ext([".epub", ".epub3"])
        .find();
    for (const filePath of filePaths) {
        debug("------------------------");
        debug(filePath);
        let pub;
        try {
            pub = await publication_parser_1.PublicationParsePromise(filePath);
        }
        catch (err) {
            console.log(err);
            continue;
        }
        const publicationJson1 = serializable_1.TaJsonSerialize(pub);
        const publication = serializable_1.TaJsonDeserialize(publicationJson1, publication_1.Publication);
        const publicationJson2 = serializable_1.TaJsonSerialize(publication);
        const str1 = JSON.stringify(publicationJson1, null, 2);
        const str2 = JSON.stringify(publicationJson2, null, 2);
        if (str1 !== str2) {
            process.stdout.write("###########################\n");
            process.stdout.write("###########################\n");
            process.stdout.write("#### JSON DIFF\n");
            process.stdout.write(jsonDiff.diffString(publicationJson1, publicationJson2) + "\n");
            process.stdout.write("###########################\n");
            process.stdout.write("###########################\n");
            t.true(await delay(false));
            return;
        }
    }
    t.true(await delay(true));
});
//# sourceMappingURL=test.js.map