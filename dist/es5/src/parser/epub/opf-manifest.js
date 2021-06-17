"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var Manifest = (function () {
    function Manifest() {
    }
    Object.defineProperty(Manifest.prototype, "Href", {
        get: function () {
            return this.Href1;
        },
        set: function (href) {
            this.Href1 = href;
            this._urlDecoded = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Manifest.prototype, "HrefDecoded", {
        get: function () {
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
        },
        set: function (href) {
            this._urlDecoded = href;
        },
        enumerable: false,
        configurable: true
    });
    Manifest.prototype.setHrefDecoded = function (href) {
        this.Href = href;
        this.HrefDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@id | @xml:id"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "ID", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@media-type"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "MediaType", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@media-fallback"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "Fallback", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@properties"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "Properties", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@media-overlay"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "MediaOverlay", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@href"),
        tslib_1.__metadata("design:type", String)
    ], Manifest.prototype, "Href1", void 0);
    Manifest = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            dc: "http://purl.org/dc/elements/1.1/",
            opf: "http://www.idpf.org/2007/opf",
            xml: "http://www.w3.org/XML/1998/namespace",
        })
    ], Manifest);
    return Manifest;
}());
exports.Manifest = Manifest;
//# sourceMappingURL=opf-manifest.js.map