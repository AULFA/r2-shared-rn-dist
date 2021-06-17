"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const opf_dc_metadata_1 = require("./opf-dc-metadata");
const opf_link_1 = require("./opf-link");
const opf_metafield_1 = require("./opf-metafield");
const opf_x_metadata_1 = require("./opf-x-metadata");
let Metadata = class Metadata extends opf_dc_metadata_1.DCMetadata {
};
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
exports.Metadata = Metadata;
//# sourceMappingURL=opf-metadata.js.map