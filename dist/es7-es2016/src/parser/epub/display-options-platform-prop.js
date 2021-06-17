"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptionsPlatformProp = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es7-es2016/src/_utils/xml-js-mapper");
let DisplayOptionsPlatformProp = class DisplayOptionsPlatformProp {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("@name"),
    tslib_1.__metadata("design:type", String)
], DisplayOptionsPlatformProp.prototype, "Name", void 0);
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("text()"),
    tslib_1.__metadata("design:type", String)
], DisplayOptionsPlatformProp.prototype, "Value", void 0);
DisplayOptionsPlatformProp = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject()
], DisplayOptionsPlatformProp);
exports.DisplayOptionsPlatformProp = DisplayOptionsPlatformProp;
//# sourceMappingURL=display-options-platform-prop.js.map