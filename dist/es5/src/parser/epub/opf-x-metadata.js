"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMetadata = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var opf_metafield_1 = require("./opf-metafield");
var XMetadata = (function () {
    function XMetadata() {
    }
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
    return XMetadata;
}());
exports.XMetadata = XMetadata;
//# sourceMappingURL=opf-x-metadata.js.map