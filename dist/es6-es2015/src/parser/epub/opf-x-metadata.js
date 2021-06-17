"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMetadata = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/xml-js-mapper");
const opf_metafield_1 = require("./opf-metafield");
let XMetadata = class XMetadata {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("meta"),
    xml_js_mapper_1.XmlItemType(opf_metafield_1.Metafield),
    tslib_1.__metadata("design:type", Array)
], XMetadata.prototype, "Meta", void 0);
XMetadata = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        dc: "http://purl.org/dc/elements/1.1/",
        opf: "http://www.idpf.org/2007/opf",
        opf2: "http://openebook.org/namespaces/oeb-package/1.0/",
    })
], XMetadata);
exports.XMetadata = XMetadata;
//# sourceMappingURL=opf-x-metadata.js.map