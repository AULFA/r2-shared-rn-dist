"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaLink = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var MetaLink = (function () {
    function MetaLink() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@property"),
        tslib_1.__metadata("design:type", String)
    ], MetaLink.prototype, "Property", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@href"),
        tslib_1.__metadata("design:type", String)
    ], MetaLink.prototype, "Href", void 0);
    MetaLink = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            opf: "http://www.idpf.org/2007/opf",
        })
    ], MetaLink);
    return MetaLink;
}());
exports.MetaLink = MetaLink;
//# sourceMappingURL=opf-link.js.map