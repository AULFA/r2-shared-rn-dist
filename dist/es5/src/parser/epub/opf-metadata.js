"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var opf_dc_metadata_1 = require("./opf-dc-metadata");
var opf_link_1 = require("./opf-link");
var opf_metafield_1 = require("./opf-metafield");
var opf_x_metadata_1 = require("./opf-x-metadata");
var Metadata = (function (_super) {
    tslib_1.__extends(Metadata, _super);
    function Metadata() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("link"),
        xml_js_mapper_1.XmlItemType(opf_link_1.MetaLink),
        tslib_1.__metadata("design:type", Array)
    ], Metadata.prototype, "Link", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("meta"),
        xml_js_mapper_1.XmlItemType(opf_metafield_1.Metafield),
        tslib_1.__metadata("design:type", Array)
    ], Metadata.prototype, "Meta", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("dc-metadata"),
        tslib_1.__metadata("design:type", opf_dc_metadata_1.DCMetadata)
    ], Metadata.prototype, "DCMetadata", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("x-metadata"),
        tslib_1.__metadata("design:type", opf_x_metadata_1.XMetadata)
    ], Metadata.prototype, "XMetadata", void 0);
    Metadata = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            dc: "http://purl.org/dc/elements/1.1/",
            opf: "http://www.idpf.org/2007/opf",
            opf2: "http://openebook.org/namespaces/oeb-package/1.0/",
        })
    ], Metadata);
    return Metadata;
}(opf_dc_metadata_1.DCMetadata));
exports.Metadata = Metadata;
//# sourceMappingURL=opf-metadata.js.map