"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAttributes = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var smil_custom_test_1 = require("./smil-custom-test");
var CustomAttributes = (function () {
    function CustomAttributes() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("customTest"),
        xml_js_mapper_1.XmlItemType(smil_custom_test_1.CustomTest),
        tslib_1.__metadata("design:type", Array)
    ], CustomAttributes.prototype, "CustomTest", void 0);
    CustomAttributes = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject({
            epub: "http://www.idpf.org/2007/ops",
            smil: "http://www.w3.org/ns/SMIL",
            smil2: "http://www.w3.org/2001/SMIL20/",
        })
    ], CustomAttributes);
    return CustomAttributes;
}());
exports.CustomAttributes = CustomAttributes;
//# sourceMappingURL=smil-custom-attributes.js.map