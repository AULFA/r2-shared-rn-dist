"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ava_1 = require("ava");
var debug_ = require("debug");
var filehound = require("filehound");
var jsonDiff = require("json-diff");
var path = require("path");
var media_overlay_1 = require("../src/models/media-overlay");
var publication_1 = require("../src/models/publication");
var publication_parser_1 = require("../src/parser/publication-parser");
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var init_globals_1 = require("../src/init-globals");
init_globals_1.initGlobalConverters_SHARED();
init_globals_1.initGlobalConverters_GENERIC();
var debug = debug_("r2:shared#test");
function fn() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2, Promise.resolve("foo")];
        });
    });
}
ava_1.default("dummy async test", function (t) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return tslib_1.__generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                debug("test ASYNC");
                _b = (_a = t).is;
                return [4, fn()];
            case 1:
                _b.apply(_a, [_c.sent(), "foo"]);
                return [2];
        }
    });
}); });
ava_1.default("SMIL clock values", function (t) {
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
function delay(okay) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, _reject) {
                    setTimeout(function () {
                        resolve(okay);
                    }, 1000);
                })];
        });
    });
}
ava_1.default("EPUB parsing (de)serialize roundtrip", function (t) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var dirPath, filePaths, _i, filePaths_1, filePath, pub, err_1, publicationJson1, publication, publicationJson2, str1, str2, _a, _b, _c, _d;
    return tslib_1.__generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                dirPath = path.join(process.cwd(), "misc/epubs/");
                return [4, filehound.create()
                        .discard("node_modules")
                        .depth(5)
                        .paths(dirPath)
                        .ext([".epub", ".epub3"])
                        .find()];
            case 1:
                filePaths = _e.sent();
                _i = 0, filePaths_1 = filePaths;
                _e.label = 2;
            case 2:
                if (!(_i < filePaths_1.length)) return [3, 9];
                filePath = filePaths_1[_i];
                debug("------------------------");
                debug(filePath);
                pub = void 0;
                _e.label = 3;
            case 3:
                _e.trys.push([3, 5, , 6]);
                return [4, publication_parser_1.PublicationParsePromise(filePath)];
            case 4:
                pub = _e.sent();
                return [3, 6];
            case 5:
                err_1 = _e.sent();
                console.log(err_1);
                return [3, 8];
            case 6:
                publicationJson1 = serializable_1.TaJsonSerialize(pub);
                publication = serializable_1.TaJsonDeserialize(publicationJson1, publication_1.Publication);
                publicationJson2 = serializable_1.TaJsonSerialize(publication);
                str1 = JSON.stringify(publicationJson1, null, 2);
                str2 = JSON.stringify(publicationJson2, null, 2);
                if (!(str1 !== str2)) return [3, 8];
                process.stdout.write("###########################\n");
                process.stdout.write("###########################\n");
                process.stdout.write("#### JSON DIFF\n");
                process.stdout.write(jsonDiff.diffString(publicationJson1, publicationJson2) + "\n");
                process.stdout.write("###########################\n");
                process.stdout.write("###########################\n");
                _b = (_a = t).true;
                return [4, delay(false)];
            case 7:
                _b.apply(_a, [_e.sent()]);
                return [2];
            case 8:
                _i++;
                return [3, 2];
            case 9:
                _d = (_c = t).true;
                return [4, delay(true)];
            case 10:
                _d.apply(_c, [_e.sent()]);
                return [2];
        }
    });
}); });
//# sourceMappingURL=test.js.map