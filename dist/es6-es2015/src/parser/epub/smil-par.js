"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Par = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
const smil_audio_1 = require("./smil-audio");
const smil_img_1 = require("./smil-img");
const smil_seq_or_par_1 = require("./smil-seq-or-par");
const smil_text_1 = require("./smil-text");
let Par = class Par extends smil_seq_or_par_1.SeqOrPar {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("text"),
    tslib_1.__metadata("design:type", smil_text_1.Text)
], Par.prototype, "Text", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("audio"),
    tslib_1.__metadata("design:type", smil_audio_1.Audio)
], Par.prototype, "Audio", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("img"),
    tslib_1.__metadata("design:type", smil_img_1.Img)
], Par.prototype, "Img", void 0);
Par = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        epub: "http://www.idpf.org/2007/ops",
        smil: "http://www.w3.org/ns/SMIL",
        smil2: "http://www.w3.org/2001/SMIL20/",
    }),
    xml_js_mapper_1.XmlDiscriminatorValue("par")
], Par);
exports.Par = Par;
//# sourceMappingURL=smil-par.js.map