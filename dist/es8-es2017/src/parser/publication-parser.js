"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationParsePromise = void 0;
const path = require("path");
const audiobook_1 = require("./audiobook");
const cbz_1 = require("./cbz");
const daisy_1 = require("./daisy");
const epub_1 = require("./epub");
const divina_1 = require("./divina");
async function PublicationParsePromise(filePath) {
    let isAudio;
    let isDivina;
    return (await epub_1.isEPUBlication(filePath)) ? epub_1.EpubParsePromise(filePath) :
        (cbz_1.isCBZPublication(filePath) ? cbz_1.CbzParsePromise(filePath) :
            ((isDivina = await divina_1.isDivinaPublication(filePath)) ? divina_1.DivinaParsePromise(filePath, isDivina) :
                (/\.webpub$/.test(path.extname(path.basename(filePath)).toLowerCase()) ? divina_1.DivinaParsePromise(filePath, (/^http[s]?:\/\//.test(filePath) ? divina_1.Divinais.RemotePacked : divina_1.Divinais.LocalPacked), "webpub") :
                    (/\.lcpdf$/.test(path.extname(path.basename(filePath)).toLowerCase()) ? divina_1.DivinaParsePromise(filePath, (/^http[s]?:\/\//.test(filePath) ? divina_1.Divinais.RemotePacked : divina_1.Divinais.LocalPacked), "pdf") :
                        (await daisy_1.isDaisyPublication(filePath) ? daisy_1.DaisyParsePromise(filePath) :
                            (isAudio = await audiobook_1.isAudioBookPublication(filePath)) ? audiobook_1.AudioBookParsePromise(filePath, isAudio) :
                                Promise.reject(`Unrecognized publication type ${filePath}`))))));
}
exports.PublicationParsePromise = PublicationParsePromise;
//# sourceMappingURL=publication-parser.js.map