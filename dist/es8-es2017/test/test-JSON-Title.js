"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const path = require("path");
const metadata_1 = require("../src/models/metadata");
const lcp_1 = require("r2-lcp-rn/dist/es8-es2017/src/parser/epub/lcp");
const serializable_1 = require("r2-lcp-rn/dist/es8-es2017/src/serializable");
const init_globals_1 = require("../src/init-globals");
const helpers_1 = require("./helpers");
init_globals_1.initGlobalConverters_SHARED();
init_globals_1.initGlobalConverters_GENERIC();
lcp_1.setLcpNativePluginPath(path.join(process.cwd(), "LCP", "lcp.node"));
const titleStr1 = "str1";
const titleStr2 = "str2";
const titleLang1 = "lang1";
const titleLang2 = "lang2";
const titleLangStr1 = {};
titleLangStr1[titleLang1] = titleStr1;
titleLangStr1[titleLang2] = titleStr2;
const titleLangStr2 = {};
titleLangStr2[titleLang1] = titleStr2;
titleLangStr2[titleLang2] = titleStr1;
ava_1.default("JSON SERIALIZE: Metadata.Title => string", (t) => {
    const md = new metadata_1.Metadata();
    md.Title = titleStr1;
    helpers_1.inspect(md);
    const json = serializable_1.TaJsonSerialize(md);
    helpers_1.logJSON(json);
    helpers_1.checkType_String(t, json.title);
    t.is(json.title, titleStr1);
});
ava_1.default("JSON SERIALIZE: Metadata.Title => string-lang", (t) => {
    const md = new metadata_1.Metadata();
    md.Title = titleLangStr1;
    helpers_1.inspect(md);
    const json = serializable_1.TaJsonSerialize(md);
    helpers_1.logJSON(json);
    helpers_1.checkType_Object(t, json.title);
    const title = json.title;
    helpers_1.checkType_String(t, title[titleLang1]);
    t.is(title[titleLang1], titleStr1);
    helpers_1.checkType_String(t, title[titleLang2]);
    t.is(title[titleLang2], titleStr2);
});
ava_1.default("JSON DESERIALIZE: Metadata.Title => string", (t) => {
    const json = {};
    json.title = titleStr1;
    helpers_1.logJSON(json);
    const md = serializable_1.TaJsonDeserialize(json, metadata_1.Metadata);
    helpers_1.inspect(md);
    helpers_1.checkType_String(t, md.Title);
    t.is(md.Title, titleStr1);
});
ava_1.default("JSON DESERIALIZE: Metadata.Title => string-lang", (t) => {
    const json = {};
    json.title = titleLangStr1;
    helpers_1.logJSON(json);
    const md = serializable_1.TaJsonDeserialize(json, metadata_1.Metadata);
    helpers_1.inspect(md);
    helpers_1.checkType_Object(t, md.Title);
    helpers_1.checkType_String(t, md.Title[titleLang1]);
    t.is(md.Title[titleLang1], titleStr1);
    helpers_1.checkType_String(t, md.Title[titleLang2]);
    t.is(md.Title[titleLang2], titleStr2);
});
//# sourceMappingURL=test-JSON-Title.js.map