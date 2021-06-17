"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptionsPlatform = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/xml-js-mapper");
const display_options_platform_prop_1 = require("./display-options-platform-prop");
let DisplayOptionsPlatform = class DisplayOptionsPlatform {
};
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
exports.DisplayOptionsPlatform = DisplayOptionsPlatform;
//# sourceMappingURL=display-options-platform.js.map