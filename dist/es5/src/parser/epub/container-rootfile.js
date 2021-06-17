"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rootfile = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var decodeURI_1 = require("../../_utils/decodeURI");
var Rootfile = (function () {
    function Rootfile() {
    }
    Object.defineProperty(Rootfile.prototype, "Path", {
        get: function () {
            return this.Path1;
        },
        set: function (href) {
            this.Path1 = href;
            this._urlDecoded = undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rootfile.prototype, "PathDecoded", {
        get: function () {
            if (this._urlDecoded) {
                return this._urlDecoded;
            }
            if (this._urlDecoded === null) {
                return undefined;
            }
            if (!this.Path) {
                this._urlDecoded = null;
                return undefined;
            }
            this._urlDecoded = decodeURI_1.tryDecodeURI(this.Path);
            return !this._urlDecoded ? undefined : this._urlDecoded;
        },
        set: function (href) {
            this._urlDecoded = href;
        },
        enumerable: false,
        configurable: true
    });
    Rootfile.prototype.setPathDecoded = function (href) {
        this.Path = href;
        this.PathDecoded = href;
    };
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@media-type"),
        tslib_1.__metadata("design:type", String)
    ], Rootfile.prototype, "Type", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@version"),
        tslib_1.__metadata("design:type", String)
    ], Rootfile.prototype, "Version", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@full-path"),
        tslib_1.__metadata("design:type", String)
    ], Rootfile.prototype, "Path1", void 0);
    Rootfile = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject()
    ], Rootfile);
    return Rootfile;
}());
exports.Rootfile = Rootfile;
//# sourceMappingURL=container-rootfile.js.map