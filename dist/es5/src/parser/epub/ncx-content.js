"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var Content = (function () {
    function Content() {
    }
    Object.defineProperty(Content.prototype, "Src", {
        get: function () {
            return this.Src1;
        },
        set: function (href) {
            this.Src1 = href;
            this._urlDecoded = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Content.prototype, "SrcDecoded", {
        get: function () {
            if (this._urlDecoded) {
                return this._urlDecoded;
            }
            if (this._urlDecoded === null) {
                return undefined;
            }
            if (!this.Src) {
                this._urlDecoded = null;
                return undefined;
            }
            this._urlDecoded = decodeURI_1.tryDecodeURI(this.Src);
            return !this._urlDecoded ? undefined : this._urlDecoded;
        },
        set: function (href) {
            this._urlDecoded = href;
        },
        enumerable: false,
        configurable: true
    });
    Content.prototype.setSrcDecoded = function (href) {
        this.Src = href;
        this.SrcDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@src"),
        tslib_1.__metadata("design:type", String)
    ], Content.prototype, "Src1", void 0);
    Content = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            ncx: "http://www.daisy.org/z3986/2005/ncx/",
        })
    ], Content);
    return Content;
}());
exports.Content = Content;
//# sourceMappingURL=ncx-content.js.map