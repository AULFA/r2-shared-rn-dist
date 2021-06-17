"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPF = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const opf_manifest_1 = require("./opf-manifest");
const opf_metadata_1 = require("./opf-metadata");
const opf_reference_1 = require("./opf-reference");
const opf_spine_1 = require("./opf-spine");
let OPF = class OPF {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("opf:metadata | opf2:metadata"),
    tslib_1.__metadata("design:type", opf_metadata_1.Metadata)
], OPF.prototype, "Metadata", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("manifest/item"),
    xml_js_mapper_1.XmlItemType(opf_manifest_1.Manifest),
    tslib_1.__metadata("design:type", Array)
], OPF.prototype, "Manifest", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("spine"),
    tslib_1.__metadata("design:type", opf_spine_1.Spine)
], OPF.prototype, "Spine", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("guide/reference"),
    xml_js_mapper_1.XmlItemType(opf_reference_1.Reference),
    tslib_1.__metadata("design:type", Array)
], OPF.prototype, "Guide", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@unique-identifier"),
    tslib_1.__metadata("design:type", String)
], OPF.prototype, "UniqueIdentifier", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@dir"),
    tslib_1.__metadata("design:type", String)
], OPF.prototype, "Dir", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@lang | @xml:lang"),
    tslib_1.__metadata("design:type", String)
], OPF.prototype, "Lang", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@version"),
    tslib_1.__metadata("design:type", String)
], OPF.prototype, "Version", void 0);
OPF = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        dc: "http://purl.org/dc/elements/1.1/",
        opf: "http://www.idpf.org/2007/opf",
        opf2: "http://openebook.org/namespaces/oeb-package/1.0/",
        xml: "http://www.w3.org/XML/1998/namespace",
    })
], OPF);
exports.OPF = OPF;
//# sourceMappingURL=opf.js.map