"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.MetadataSupportedKeys = exports.DirectionEnum = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const ta_json_string_converter_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/ta-json-string-converter");
const metadata_belongsto_1 = require("./metadata-belongsto");
const metadata_contributor_1 = require("./metadata-contributor");
const metadata_contributor_json_converter_1 = require("./metadata-contributor-json-converter");
const metadata_media_overlay_1 = require("./metadata-media-overlay");
const metadata_properties_1 = require("./metadata-properties");
const metadata_subject_1 = require("./metadata-subject");
const metadata_subject_json_converter_1 = require("./metadata-subject-json-converter");
var DirectionEnum;
(function (DirectionEnum) {
    DirectionEnum["Auto"] = "auto";
    DirectionEnum["RTL"] = "rtl";
    DirectionEnum["LTR"] = "ltr";
})(DirectionEnum = exports.DirectionEnum || (exports.DirectionEnum = {}));
exports.MetadataSupportedKeys = ["accessMode", "accessibilityFeature", "accessibilityHazard", "accessibilitySummary", "accessModeSufficient", "accessibilityAPI", "accessibilityControl", "certifiedBy", "certifierCredential", "certifierReport", "conformsTo", "title", "subtitle", "identifier", "author", "translator", "editor", "artist", "illustrator", "letterer", "penciler", "colorist", "inker", "narrator", "contributor", "publisher", "imprint", "language", "modified", "published", "sortAs", "description", "readingProgression", "direction", "belongsTo", "duration", "numberOfPages", "rights", "rendition", "source", "subject"];
let Metadata = class Metadata {
    get SortAs() {
        return this.SortAs2 ? this.SortAs2 : this.SortAs1;
    }
    set SortAs(sortas) {
        if (sortas) {
            this.SortAs1 = undefined;
            this.SortAs2 = sortas;
        }
    }
    get Direction() {
        return this.Direction2 ? this.Direction2 : this.Direction1;
    }
    set Direction(direction) {
        if (direction) {
            this.Direction1 = undefined;
            this.Direction2 = direction;
        }
    }
    get BelongsTo() {
        return this.BelongsTo2 ? this.BelongsTo2 : this.BelongsTo1;
    }
    set BelongsTo(belongsto) {
        if (belongsto) {
            this.BelongsTo1 = undefined;
            this.BelongsTo2 = belongsto;
        }
    }
    _OnDeserialized() {
        if (!this.Title) {
            console.log("Metadata.Title is not set!");
        }
    }
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessMode"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessMode", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessibilityFeature"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessibilityFeature", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessibilityHazard"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessibilityHazard", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessibilitySummary"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "AccessibilitySummary", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessModeSufficient"),
    ta_json_x_1.JsonElementType(Array),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessModeSufficient", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessibilityAPI"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessibilityAPI", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("accessibilityControl"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "AccessibilityControl", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("certifiedBy"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "CertifiedBy", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("certifierCredential"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "CertifierCredential", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("certifierReport"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "CertifierReport", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("conformsTo"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "ConformsTo", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("@type"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "RDFType", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("title"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "Title", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("subtitle"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "SubTitle", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("identifier"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "Identifier", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("author"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Author", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("translator"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Translator", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("editor"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Editor", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("artist"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Artist", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("illustrator"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Illustrator", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("letterer"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Letterer", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("penciler"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Penciler", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("colorist"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Colorist", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("inker"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Inker", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("narrator"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Narrator", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("contributor"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Contributor", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("publisher"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Publisher", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("imprint"),
    ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
    ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Imprint", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("language"),
    ta_json_x_1.JsonElementType(String),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Language", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("modified"),
    tslib_1.__metadata("design:type", Date)
], Metadata.prototype, "Modified", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("published"),
    tslib_1.__metadata("design:type", Date)
], Metadata.prototype, "PublicationDate", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sortAs"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "SortAs2", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sort_as"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "SortAs1", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("description"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "Description", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("readingProgression"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "Direction2", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("direction"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "Direction1", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("belongsTo"),
    tslib_1.__metadata("design:type", metadata_belongsto_1.BelongsTo)
], Metadata.prototype, "BelongsTo2", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("belongs_to"),
    tslib_1.__metadata("design:type", Object)
], Metadata.prototype, "BelongsTo1", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("duration"),
    tslib_1.__metadata("design:type", Number)
], Metadata.prototype, "Duration", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("numberOfPages"),
    tslib_1.__metadata("design:type", Number)
], Metadata.prototype, "NumberOfPages", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("media-overlay"),
    tslib_1.__metadata("design:type", metadata_media_overlay_1.MediaOverlay)
], Metadata.prototype, "MediaOverlay", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("rights"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "Rights", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("rendition"),
    tslib_1.__metadata("design:type", metadata_properties_1.Properties)
], Metadata.prototype, "Rendition", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("source"),
    tslib_1.__metadata("design:type", String)
], Metadata.prototype, "Source", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("subject"),
    ta_json_x_1.JsonConverter(metadata_subject_json_converter_1.JsonSubjectConverter),
    ta_json_x_1.JsonElementType(metadata_subject_1.Subject),
    tslib_1.__metadata("design:type", Array)
], Metadata.prototype, "Subject", void 0);
tslib_1.__decorate([
    ta_json_x_1.OnDeserialized(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Metadata.prototype, "_OnDeserialized", null);
Metadata = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Metadata);
exports.Metadata = Metadata;
//# sourceMappingURL=metadata.js.map