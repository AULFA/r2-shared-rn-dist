"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DCMetadata = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const opf_author_1 = require("./opf-author");
const opf_date_1 = require("./opf-date");
const opf_identifier_1 = require("./opf-identifier");
const opf_subject_1 = require("./opf-subject");
const opf_title_1 = require("./opf-title");
let DCMetadata = class DCMetadata {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Title | dc2:Title | dc:title"),
    xml_js_mapper_1.XmlItemType(opf_title_1.Title),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Title", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Language/text() | dc2:Language/text() | dc:language/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Language", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Identifier | dc2:Identifier | dc:identifier"),
    xml_js_mapper_1.XmlItemType(opf_identifier_1.Identifier),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Identifier", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Creator | dc2:Creator | dc:creator"),
    xml_js_mapper_1.XmlItemType(opf_author_1.Author),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Creator", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Subject | dc2:Subject | dc:subject"),
    xml_js_mapper_1.XmlItemType(opf_subject_1.Subject),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Subject", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Description/text() | dc2:Description/text() | dc:description/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Description", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Publisher/text() | dc2:Publisher/text() | dc:publisher/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Publisher", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Contributor | dc2:Contributor | dc:contributor"),
    xml_js_mapper_1.XmlItemType(opf_author_1.Author),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Contributor", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Date | dc2:Date | dc:date"),
    xml_js_mapper_1.XmlItemType(opf_date_1.MetaDate),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Date", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Type/text() | dc2:Type/text() | dc:type/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Type", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Format/text() | dc2:Format/text() | dc:format/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Format", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Source/text() | dc2:Source/text() | dc:source/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Source", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Relation/text() | dc2:Relation/text() | dc:relation/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Relation", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Coverage/text() | dc2:Coverage/text() | dc:coverage/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Coverage", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("dc:Rights/text() | dc2:Rights/text() | dc:rights/text()"),
    xml_js_mapper_1.XmlItemType(String),
    tslib_1.__metadata("design:type", Array)
], DCMetadata.prototype, "Rights", void 0);
DCMetadata = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject({
        dc: "http://purl.org/dc/elements/1.1/",
        dc2: "http://purl.org/dc/elements/1.0/",
        opf: "http://www.idpf.org/2007/opf",
        opf2: "http://openebook.org/namespaces/oeb-package/1.0/",
    })
], DCMetadata);
exports.DCMetadata = DCMetadata;
//# sourceMappingURL=opf-dc-metadata.js.map