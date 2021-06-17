"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationParsePromise = void 0;
var tslib_1 = require("tslib");
var path = require("path");
var audiobook_1 = require("./audiobook");
var cbz_1 = require("./cbz");
var daisy_1 = require("./daisy");
var epub_1 = require("./epub");
var divina_1 = require("./divina");
function PublicationParsePromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var isAudio, isDivina, _a, _b, _c, _d, _e, _f;
        return tslib_1.__generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4, epub_1.isEPUBlication(filePath)];
                case 1:
                    if (!(_g.sent())) return [3, 2];
                    _a = epub_1.EpubParsePromise(filePath);
                    return [3, 16];
                case 2:
                    if (!cbz_1.isCBZPublication(filePath)) return [3, 3];
                    _b = cbz_1.CbzParsePromise(filePath);
                    return [3, 15];
                case 3: return [4, divina_1.isDivinaPublication(filePath)];
                case 4:
                    if (!(isDivina = _g.sent())) return [3, 5];
                    _c = divina_1.DivinaParsePromise(filePath, isDivina);
                    return [3, 14];
                case 5:
                    if (!/\.webpub$/.test(path.extname(path.basename(filePath)).toLowerCase())) return [3, 6];
                    _d = divina_1.DivinaParsePromise(filePath, (/^http[s]?:\/\//.test(filePath) ? divina_1.Divinais.RemotePacked : divina_1.Divinais.LocalPacked), "webpub");
                    return [3, 13];
                case 6:
                    if (!/\.lcpdf$/.test(path.extname(path.basename(filePath)).toLowerCase())) return [3, 7];
                    _e = divina_1.DivinaParsePromise(filePath, (/^http[s]?:\/\//.test(filePath) ? divina_1.Divinais.RemotePacked : divina_1.Divinais.LocalPacked), "pdf");
                    return [3, 12];
                case 7: return [4, daisy_1.isDaisyPublication(filePath)];
                case 8:
                    if (!(_g.sent())) return [3, 9];
                    _f = daisy_1.DaisyParsePromise(filePath);
                    return [3, 11];
                case 9: return [4, audiobook_1.isAudioBookPublication(filePath)];
                case 10:
                    _f = (isAudio = _g.sent()) ? audiobook_1.AudioBookParsePromise(filePath, isAudio) :
                        Promise.reject("Unrecognized publication type " + filePath);
                    _g.label = 11;
                case 11:
                    _e = (_f);
                    _g.label = 12;
                case 12:
                    _d = (_e);
                    _g.label = 13;
                case 13:
                    _c = (_d);
                    _g.label = 14;
                case 14:
                    _b = (_c);
                    _g.label = 15;
                case 15:
                    _a = (_b);
                    _g.label = 16;
                case 16: return [2, _a];
            }
        });
    });
}
exports.PublicationParsePromise = PublicationParsePromise;
//# sourceMappingURL=publication-parser.js.map