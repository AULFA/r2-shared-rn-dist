"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptions = void 0;
var tslib_1 = require("tslib");
var xml_js_mapper_1 = require("r2-utils-rn/dist/es5/src/_utils/xml-js-mapper");
var display_options_platform_1 = require("./display-options-platform");
var DisplayOptions = (function () {
    function DisplayOptions() {
    }
    tslib_1.__decorate([
        xml_js_mapper_1.XmlXPathSelector("platform"),
        xml_js_mapper_1.XmlItemType(display_options_platform_1.DisplayOptionsPlatform),
        tslib_1.__metadata("design:type", Array)
    ], DisplayOptions.prototype, "Platforms", void 0);
    DisplayOptions = tslib_1.__decorate([
        xml_js_mapper_1.XmlObject()
    ], DisplayOptions);
    return DisplayOptions;
}());
exports.DisplayOptions = DisplayOptions;
//# sourceMappingURL=display-options.js.map