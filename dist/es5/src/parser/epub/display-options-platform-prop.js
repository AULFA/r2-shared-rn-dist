"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptionsPlatformProp = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var DisplayOptionsPlatformProp = (function () {
    function DisplayOptionsPlatformProp() {
    }
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
    return DisplayOptionsPlatformProp;
}());
exports.DisplayOptionsPlatformProp = DisplayOptionsPlatformProp;
//# sourceMappingURL=display-options-platform-prop.js.map