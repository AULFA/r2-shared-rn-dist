"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var Text = (function () {
    function Text() {
    }
    Object.defineProperty(Text.prototype, "Src", {
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
    Object.defineProperty(Text.prototype, "SrcDecoded", {
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
    Text.prototype.setSrcDecoded = function (href) {
        this.Src = href;
        this.SrcDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@epub:type"),
        tslib_1.__metadata("design:type", String)
    ], Text.prototype, "EpubType", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@src"),
        tslib_1.__metadata("design:type", String)
    ], Text.prototype, "Src1", void 0);
    Text = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            epub: "http://www.idpf.org/2007/ops",
            smil: "http://www.w3.org/ns/SMIL",
            smil2: "http://www.w3.org/2001/SMIL20/",
            xml: "http://www.w3.org/XML/1998/namespace",
        })
    ], Text);
    return Text;
}());
exports.Text = Text;
//# sourceMappingURL=smil-text.js.map