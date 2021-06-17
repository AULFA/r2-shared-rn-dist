"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipHasEntry = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const debug = debug_("r2:shared#utils/zipHasEntry");
function zipHasEntry(zip, zipPath, zipPathOther) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let has = zip.hasEntry(zipPath);
        if (zip.hasEntryAsync) {
            try {
                has = yield zip.hasEntryAsync(zipPath);
            }
            catch (err) {
                console.log(err);
            }
        }
        if (!has && zipPathOther && zipPathOther !== zipPath) {
            debug(`zipHasEntry: ${zipPath} => ${zipPathOther}`);
            has = zip.hasEntry(zipPathOther);
            if (zip.hasEntryAsync) {
                try {
                    has = yield zip.hasEntryAsync(zipPathOther);
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        return has;
    });
}
exports.zipHasEntry = zipHasEntry;
//# sourceMappingURL=zipHasEntry.js.map