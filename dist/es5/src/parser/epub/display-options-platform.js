"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptionsPlatform = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var display_options_platform_prop_1 = require("./display-options-platform-prop");
var DisplayOptionsPlatform = (function () {
    function DisplayOptionsPlatform() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("@name"),
        tslib_1.__metadata("design:type", String)
    ], DisplayOptionsPlatform.prototype, "Name", void 0);
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("option"),
        xml_js_mapper_1.XmlItemType(display_options_platform_prop_1.DisplayOptionsPlatformProp),
        tslib_1.__metadata("design:type", Array)
    ], DisplayOptionsPlatform.prototype, "Options", void 0);
    DisplayOptionsPlatform = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject()
    ], DisplayOptionsPlatform);
    return DisplayOptionsPlatform;
}());
exports.DisplayOptionsPlatform = DisplayOptionsPlatform;
//# sourceMappingURL=display-options-platform.js.map