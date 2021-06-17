"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Properties = exports.PropertiesSupportedKeys = exports.SpreadEnum = exports.PageEnum = exports.OverflowEnum = exports.OrientationEnum = exports.LayoutEnum = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const metadata_encrypted_1 = require("r2-lcp-rn/dist/es6-es2015/src/models/metadata-encrypted");
var LayoutEnum;
(function (LayoutEnum) {
    LayoutEnum["Fixed"] = "fixed";
    LayoutEnum["Reflowable"] = "reflowable";
})(LayoutEnum = exports.LayoutEnum || (exports.LayoutEnum = {}));
var OrientationEnum;
(function (OrientationEnum) {
    OrientationEnum["Auto"] = "auto";
    OrientationEnum["Landscape"] = "landscape";
    OrientationEnum["Portrait"] = "portrait";
})(OrientationEnum = exports.OrientationEnum || (exports.OrientationEnum = {}));
var OverflowEnum;
(function (OverflowEnum) {
    OverflowEnum["Auto"] = "auto";
    OverflowEnum["Paginated"] = "paginated";
    OverflowEnum["Scrolled"] = "scrolled";
    OverflowEnum["ScrolledContinuous"] = "scrolled-continuous";
})(OverflowEnum = exports.OverflowEnum || (exports.OverflowEnum = {}));
var PageEnum;
(function (PageEnum) {
    PageEnum["Left"] = "left";
    PageEnum["Right"] = "right";
    PageEnum["Center"] = "center";
})(PageEnum = exports.PageEnum || (exports.PageEnum = {}));
var SpreadEnum;
(function (SpreadEnum) {
    SpreadEnum["Auto"] = "auto";
    SpreadEnum["Both"] = "both";
    SpreadEnum["None"] = "none";
    SpreadEnum["Landscape"] = "landscape";
})(SpreadEnum = exports.SpreadEnum || (exports.SpreadEnum = {}));
exports.PropertiesSupportedKeys = ["contains", "layout", "orientation", "overflow", "page", "spread", "encrypted", "media-overlay"];
let Properties = class Properties {
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("contains"),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Properties.prototype, "Contains", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("layout"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "Layout", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("orientation"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "Orientation", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("overflow"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "Overflow", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("page"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "Page", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("spread"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "Spread", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("encrypted"),
    tslib_1.__metadata("design:type", metadata_encrypted_1.Encrypted)
], Properties.prototype, "Encrypted", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("media-overlay"),
    tslib_1.__metadata("design:type", String)
], Properties.prototype, "MediaOverlay", void 0);
Properties = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Properties);
exports.Properties = Properties;
//# sourceMappingURL=metadata-properties.js.map