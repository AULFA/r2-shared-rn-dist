"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Head = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const opf_x_metadata_1 = require("./opf-x-metadata");
const smil_custom_attributes_1 = require("./smil-custom-attributes");
let Head = class Head extends opf_x_metadata_1.XMetadata {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("customAttributes"),
    tslib_1.__metadata("design:type", smil_custom_attributes_1.CustomAttributes)
], Head.prototype, "CustomAttributes", void 0);
Head = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        epub: "http://www.idpf.org/2007/ops",
        smil: "http://www.w3.org/ns/SMIL",
        smil2: "http://www.w3.org/2001/SMIL20/",
    })
], Head);
exports.Head = Head;
//# sourceMappingURL=smil-head.js.map