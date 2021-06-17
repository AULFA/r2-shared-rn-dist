"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomAttributes = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
const smil_custom_test_1 = require("./smil-custom-test");
let CustomAttributes = class CustomAttributes {
};
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
exports.CustomAttributes = CustomAttributes;
//# sourceMappingURL=smil-custom-attributes.js.map