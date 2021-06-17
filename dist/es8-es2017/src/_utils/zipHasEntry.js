"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zipHasEntry = void 0;
const debug_ = require("debug");
const debug = debug_("r2:shared#utils/zipHasEntry");
async function zipHasEntry(zip, zipPath, zipPathOther) {
    let has = zip.hasEntry(zipPath);
    if (zip.hasEntryAsync) {
        try {
            has = await zip.hasEntryAsync(zipPath);
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
                has = await zip.hasEntryAsync(zipPathOther);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    return has;
}
exports.zipHasEntry = zipHasEntry;
//# sourceMappingURL=zipHasEntry.js.map