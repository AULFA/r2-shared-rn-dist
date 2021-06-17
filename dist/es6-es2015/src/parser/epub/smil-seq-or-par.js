"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeqOrPar = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
let SeqOrPar = class SeqOrPar {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@epub:type"),
    tslib_1.__metadata("design:type", String)
], SeqOrPar.prototype, "EpubType", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@id | @xml:id"),
    tslib_1.__metadata("design:type", String)
], SeqOrPar.prototype, "ID", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@dur"),
    tslib_1.__metadata("design:type", String)
], SeqOrPar.prototype, "Duration", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@customTest"),
    tslib_1.__metadata("design:type", String)
], SeqOrPar.prototype, "CustomTest", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@class"),
    tslib_1.__metadata("design:type", String)
], SeqOrPar.prototype, "Class", void 0);
SeqOrPar = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        epub: "http://www.idpf.org/2007/ops",
        smil: "http://www.w3.org/ns/SMIL",
        smil2: "http://www.w3.org/2001/SMIL20/",
        xml: "http://www.w3.org/XML/1998/namespace",
    }),
    xml_js_mapper_1.XmlDiscriminatorProperty("localName")
], SeqOrPar);
exports.SeqOrPar = SeqOrPar;
//# sourceMappingURL=smil-seq-or-par.js.map