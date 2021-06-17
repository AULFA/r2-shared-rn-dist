"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var Reference = (function () {
    function Reference() {
    }
    Object.defineProperty(Reference.prototype, "Href", {
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
    Object.defineProperty(Reference.prototype, "HrefDecoded", {
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
    Reference.prototype.setHrefDecoded = function (href) {
        this.Href = href;
        this.HrefDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@title"),
        tslib_1.__metadata("design:type", String)
    ], Reference.prototype, "Title", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@type"),
        tslib_1.__metadata("design:type", String)
    ], Reference.prototype, "Type", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@href"),
        tslib_1.__metadata("design:type", String)
    ], Reference.prototype, "Href1", void 0);
    Reference = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            dc: "http://purl.org/dc/elements/1.1/",
            opf: "http://www.idpf.org/2007/opf",
        })
    ], Reference);
    return Reference;
}());
exports.Reference = Reference;
//# sourceMappingURL=opf-reference.js.map