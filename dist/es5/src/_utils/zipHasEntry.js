"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipHasEntry = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var debug = debug_("r2:shared#utils/zipHasEntry");
function zipHasEntry(zip, zipPath, zipPathOther) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var has, err_1, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    has = zip.hasEntry(zipPath);
                    if (!zip.hasEntryAsync) return [3, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, zip.hasEntryAsync(zipPath)];
                case 2:
                    has = _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3, 4];
                case 4:
                    if (!(!has && zipPathOther && zipPathOther !== zipPath)) return [3, 8];
                    debug("zipHasEntry: " + zipPath + " => " + zipPathOther);
                    has = zip.hasEntry(zipPathOther);
                    if (!zip.hasEntryAsync) return [3, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4, zip.hasEntryAsync(zipPathOther)];
                case 6:
                    has = _a.sent();
                    return [3, 8];
                case 7:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3, 8];
                case 8: return [2, has];
            }
        });
    });
}
exports.zipHasEntry = zipHasEntry;
//# sourceMappingURL=zipHasEntry.js.map