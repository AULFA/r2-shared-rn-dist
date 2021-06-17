"use strict";
var Link_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const ta_json_string_converter_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/ta-json-string-converter");
const decodeURI_1 = require("../_utils/decodeURI");
const metadata_properties_1 = require("./metadata-properties");
const PROPERTIES_JSON_PROP = "properties";
const CHILDREN_JSON_PROP = "children";
const ALTERNATE_JSON_PROP = "alternate";
let Link = Link_1 = class Link {
    get Href() {
        return this.Href1;
    }
    set Href(href) {
        this.Href1 = href;
        this._urlDecoded = undefined;
    }
    get HrefDecoded() {
        if (this._urlDecoded) {
            return this._urlDecoded;
        }
        if (this._urlDecoded === null) {
            return undefined;
        }
        if (!this.Href) {
            this._urlDecoded = null;
            return undefined;
        }
        this._urlDecoded = decodeURI_1.tryDecodeURI(this.Href);
        return !this._urlDecoded ? undefined : this._urlDecoded;
    }
    set HrefDecoded(href) {
        this._urlDecoded = href;
    }
    setHrefDecoded(href) {
        this.Href = href;
        this.HrefDecoded = href;
    }
    AddRels(rels) {
        rels.forEach((rel) => {
            this.AddRel(rel);
        });
    }
    AddRel(rel) {
        if (this.HasRel(rel)) {
            return;
        }
        if (!this.Rel) {
            this.Rel = [rel];
        }
        else {
            this.Rel.push(rel);
        }
    }
    HasRel(rel) {
        return this.Rel && this.Rel.indexOf(rel) >= 0;
    }
    _OnDeserialized() {
        if (!this.Href && (!this.Children || !this.Children.length)) {
            console.log("Link.Href is not set! (and no child Links)");
        }
    }
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("type"),
    tslib_1.__metadata("design:type", String)
], Link.prototype, "TypeLink", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("height"),
    tslib_1.__metadata("design:type", Number)
], Link.prototype, "Height", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("width"),
    tslib_1.__metadata("design:type", Number)
], Link.prototype, "Width", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("title"),
    tslib_1.__metadata("design:type", String)
], Link.prototype, "Title", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty(PROPERTIES_JSON_PROP),
    tslib_1.__metadata("design:type", metadata_properties_1.Properties)
], Link.prototype, "Properties", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("duration"),
    tslib_1.__metadata("design:type", Number)
], Link.prototype, "Duration", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("bitrate"),
    tslib_1.__metadata("design:type", Number)
], Link.prototype, "Bitrate", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("templated"),
    tslib_1.__metadata("design:type", Boolean)
], Link.prototype, "Templated", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty(CHILDREN_JSON_PROP),
    ta_json_x_1.JsonElementType(Link_1),
    tslib_1.__metadata("design:type", Array)
], Link.prototype, "Children", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty(ALTERNATE_JSON_PROP),
    ta_json_x_1.JsonElementType(Link_1),
    tslib_1.__metadata("design:type", Array)
], Link.prototype, "Alternate", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("rel"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Link.prototype, "Rel", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("href"),
    tslib_1.__metadata("design:type", String)
], Link.prototype, "Href1", void 0);
tslib_1.__decorate([
    ta_json_x_1.OnDeserialized(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Link.prototype, "_OnDeserialized", null);
Link = Link_1 = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Link);
exports.Link = Link;
//# sourceMappingURL=publication-link.js.map