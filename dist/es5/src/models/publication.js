"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publication = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var ta_json_x_1 = require("ta-json-x");
var ta_json_string_converter_1 = require("r2-utils-rn/dist/es5/src/_utils/ta-json-string-converter");
var metadata_1 = require("./metadata");
var publication_link_1 = require("./publication-link");
var debug = debug_("r2:shared#models/publication");
var METADATA_JSON_PROP = "metadata";
var LINKS_JSON_PROP = "links";
var READINGORDER_JSON_PROP = "readingOrder";
var SPINE_JSON_PROP = "spine";
var RESOURCES_JSON_PROP = "resources";
var TOC_JSON_PROP = "toc";
var PAGELIST_JSON_PROP = "page-list";
var PAGELIST_CAMEL_JSON_PROP = "pageList";
var LANDMARKS_JSON_PROP = "landmarks";
var LOI_JSON_PROP = "loi";
var LOA_JSON_PROP = "loa";
var LOV_JSON_PROP = "lov";
var LOT_JSON_PROP = "lot";
var Publication = (function () {
    function Publication() {
    }
    Object.defineProperty(Publication.prototype, "Spine", {
        get: function () {
            return this.Spine2 ? this.Spine2 : this.Spine1;
        },
        set: function (spine) {
            if (spine) {
                this.Spine1 = undefined;
                this.Spine2 = spine;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Publication.prototype, "PageList", {
        get: function () {
            return this.PageList2 ? this.PageList2 : this.PageList1;
        },
        set: function (pagelist) {
            if (pagelist) {
                this.PageList1 = undefined;
                this.PageList2 = pagelist;
            }
        },
        enumerable: false,
        configurable: true
    });
    Publication.prototype.freeDestroy = function () {
        debug("freeDestroy: Publication");
        if (this.Internal) {
            var zipInternal = this.findFromInternal("zip");
            if (zipInternal) {
                var zip = zipInternal.Value;
                zip.freeDestroy();
            }
        }
    };
    Publication.prototype.findFromInternal = function (key) {
        if (this.Internal) {
            var found = this.Internal.find(function (internal) {
                return internal.Name === key;
            });
            if (found) {
                return found;
            }
        }
        return undefined;
    };
    Publication.prototype.AddToInternal = function (key, value) {
        var existing = this.findFromInternal(key);
        if (existing) {
            existing.Value = value;
        }
        else {
            if (!this.Internal) {
                this.Internal = [];
            }
            var internal = { Name: key, Value: value };
            this.Internal.push(internal);
        }
    };
    Publication.prototype.GetCover = function () {
        return this.searchLinkByRel("cover");
    };
    Publication.prototype.GetNavDoc = function () {
        return this.searchLinkByRel("contents");
    };
    Publication.prototype.searchLinkByRel = function (rel) {
        if (this.Resources) {
            var ll = this.Resources.find(function (link) {
                return link.HasRel(rel);
            });
            if (ll) {
                return ll;
            }
        }
        if (this.Spine) {
            var ll = this.Spine.find(function (link) {
                return link.HasRel(rel);
            });
            if (ll) {
                return ll;
            }
        }
        if (this.Links) {
            var ll = this.Links.find(function (link) {
                return link.HasRel(rel);
            });
            if (ll) {
                return ll;
            }
        }
        return undefined;
    };
    Publication.prototype.AddLink = function (typeLink, rel, url, templated) {
        var link = new publication_link_1.Link();
        link.AddRels(rel);
        link.setHrefDecoded(url);
        link.TypeLink = typeLink;
        if (typeof templated !== "undefined") {
            link.Templated = templated;
        }
        if (!this.Links) {
            this.Links = [];
        }
        this.Links.push(link);
    };
    Publication.prototype._OnDeserialized = function () {
        if (!this.Metadata) {
            console.log("Publication.Metadata is not set!");
        }
        if (!this.Spine) {
            console.log("Publication.Spine/ReadingOrder is not set!");
        }
    };
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty("@context"),
        ta_json_x_1.JsonElementType(String),
        ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "Context", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(METADATA_JSON_PROP),
        tslib_1.__metadata("design:type", metadata_1.Metadata)
    ], Publication.prototype, "Metadata", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LINKS_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "Links", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(READINGORDER_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "Spine2", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(SPINE_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Object)
    ], Publication.prototype, "Spine1", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(RESOURCES_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "Resources", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(TOC_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "TOC", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(PAGELIST_CAMEL_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "PageList2", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(PAGELIST_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Object)
    ], Publication.prototype, "PageList1", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LANDMARKS_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "Landmarks", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LOI_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "LOI", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LOA_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "LOA", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LOV_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "LOV", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(LOT_JSON_PROP),
        ta_json_x_1.JsonElementType(publication_link_1.Link),
        tslib_1.__metadata("design:type", Array)
    ], Publication.prototype, "LOT", void 0);
    tslib_1.__decorate([
        ta_json_x_1.OnDeserialized(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], Publication.prototype, "_OnDeserialized", null);
    Publication = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], Publication);
    return Publication;
}());
exports.Publication = Publication;
//# sourceMappingURL=publication.js.map