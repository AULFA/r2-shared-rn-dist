"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayOptions = void 0;
const tslib_1 = require("tslib");
const xml_js_mapper_1 = require("r2-utils-rn/dist/es8-es2017/src/_utils/xml-js-mapper");
const display_options_platform_1 = require("./display-options-platform");
let DisplayOptions = class DisplayOptions {
};
tslib_1.__decorate([
    xml_js_mapper_1.XmlXPathSelector("platform"),
    xml_js_mapper_1.XmlItemType(display_options_platform_1.DisplayOptionsPlatform),
    tslib_1.__metadata("design:type", Array)
], DisplayOptions.prototype, "Platforms", void 0);
DisplayOptions = tslib_1.__decorate([
    xml_js_mapper_1.XmlObject()
], DisplayOptions);
exports.DisplayOptions = DisplayOptions;
//# sourceMappingURL=display-options.js.map