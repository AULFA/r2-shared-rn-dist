"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const path = require("path");
const metadata_1 = require("../src/models/metadata");
const publication_1 = require("../src/models/publication");
const lcp_1 = require("r2-lcp-rn/dist/es7-es2016/src/parser/epub/lcp");
const serializable_1 = require("r2-lcp-rn/dist/es7-es2016/src/serializable");
const init_globals_1 = require("../src/init-globals");
const helpers_1 = require("./helpers");
init_globals_1.initGlobalConverters_SHARED();
init_globals_1.initGlobalConverters_GENERIC();
lcp_1.setLcpNativePluginPath(path.join(process.cwd(), "LCP", "lcp.node"));
const titleStr1 = "str1";
const titleStr2 = "str2";
const titleStr3 = "str3";
const n = 999;
ava_1.default("JSON SERIALIZE: Metadata.AdditionalJSON", (t) => {
    const md = new metadata_1.Metadata();
    md.Title = titleStr1;
    md.AdditionalJSON = {
        title2: titleStr2,
        tizz: {
            sub1: true,
            sub2: null,
            sub3: {
                inner1: n,
                inner2: [titleStr3, 888, false],
            },
        },
    };
    const pub = new publication_1.Publication();
    pub.Metadata = md;
    helpers_1.inspect(pub);
    const jsonPub = serializable_1.TaJsonSerialize(pub);
    helpers_1.logJSON(jsonPub);
    const json = jsonPub.metadata;
    helpers_1.checkType_String(t, json.title);
    t.is(json.title, titleStr1);
    if (!json.tizz) {
        t.fail();
        return;
    }
    helpers_1.checkType_Object(t, json.tizz);
    t.is(json.tizz.sub1, true);
    if (json.tizz.sub2 || json.tizz.sub2 !== null) {
        t.fail();
        return;
    }
    if (!json.tizz.sub3) {
        t.fail();
        return;
    }
    helpers_1.checkType_Number(t, json.tizz.sub3.inner1);
    t.is(json.tizz.sub3.inner1, n);
    if (!json.tizz.sub3.inner2) {
        t.fail();
        return;
    }
    helpers_1.checkType_Array(t, json.tizz.sub3.inner2);
    t.is(json.tizz.sub3.inner2[0], titleStr3);
    if (!json.tizz.sub3.inner1) {
        t.fail();
        return;
    }
});
ava_1.default("JSON DESERIALIZE: Metadata.AdditionalJSON", (t) => {
    const json = {
        title: titleStr1,
        title2: titleStr2,
        tizz: {
            sub1: true,
            sub2: null,
            sub3: {
                inner1: 999,
                inner2: [titleStr3, 888, false],
            },
        },
    };
    const jsonPub = {
        metadata: json,
    };
    helpers_1.logJSON(jsonPub);
    const pub = serializable_1.TaJsonDeserialize(jsonPub, publication_1.Publication);
    const md = pub.Metadata;
    helpers_1.inspect(md);
    helpers_1.checkType_String(t, md.Title);
    t.is(md.Title, titleStr1);
    if (!md.AdditionalJSON) {
        t.fail();
        return;
    }
    helpers_1.checkType_String(t, md.AdditionalJSON.title2);
    t.is(md.AdditionalJSON.title2, titleStr2);
    if (!md.AdditionalJSON.tizz) {
        t.fail();
        return;
    }
    helpers_1.checkType_Object(t, md.AdditionalJSON.tizz);
    t.is(md.AdditionalJSON.tizz.sub1, true);
    if (md.AdditionalJSON.tizz.sub2 ||
        md.AdditionalJSON.tizz.sub2 !== null) {
        t.fail();
        return;
    }
    if (!md.AdditionalJSON.tizz.sub3) {
        t.fail();
        return;
    }
    helpers_1.checkType_Number(t, md.AdditionalJSON.tizz.sub3.inner1);
    t.is(md.AdditionalJSON.tizz.sub3.inner1, n);
    if (!md.AdditionalJSON.tizz.sub3.inner2) {
        t.fail();
        return;
    }
    helpers_1.checkType_Array(t, md.AdditionalJSON.tizz.sub3.inner2);
    t.is(md.AdditionalJSON.tizz.sub3.inner2[0], titleStr3);
    if (!md.AdditionalJSON.tizz.sub3.inner1) {
        t.fail();
        return;
    }
});
//# sourceMappingURL=test-JSON-AdditionalJSON.js.map