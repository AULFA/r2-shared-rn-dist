"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavLabel = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var ncx_audio_1 = require("./ncx-audio");
var NavLabel = (function () {
    function NavLabel() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("ncx:text/text()"),
        tslib_1.__metadata("design:type", String)
    ], NavLabel.prototype, "Text", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("ncx:audio"),
        tslib_1.__metadata("design:type", ncx_audio_1.Audio)
    ], NavLabel.prototype, "Audio", void 0);
    NavLabel = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            ncx: "http://www.daisy.org/z3986/2005/ncx/",
        })
    ], NavLabel);
    return NavLabel;
}());
exports.NavLabel = NavLabel;
//# sourceMappingURL=ncx-navlabel.js.map