"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BelongsTo = void 0;
var tslib_1 = require("tslib");
var ta_json_x_1 = require("ta-json-x");
var metadata_contributor_1 = require("./metadata-contributor");
var metadata_contributor_json_converter_1 = require("./metadata-contributor-json-converter");
var SERIES_JSON_PROP = "series";
var COLLECTION_JSON_PROP = "collection";
var BelongsTo = (function () {
    function BelongsTo() {
    }
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(SERIES_JSON_PROP),
        ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
        ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
        tslib_1.__metadata("design:type", Array)
    ], BelongsTo.prototype, "Series", void 0);
    tslib_1.__decorate([
        ta_json_x_1.JsonProperty(COLLECTION_JSON_PROP),
        ta_json_x_1.JsonElementType(metadata_contributor_1.Contributor),
        ta_json_x_1.JsonConverter(metadata_contributor_json_converter_1.JsonContributorConverter),
        tslib_1.__metadata("design:type", Array)
    ], BelongsTo.prototype, "Collection", void 0);
    BelongsTo = tslib_1.__decorate([
        ta_json_x_1.JsonObject()
    ], BelongsTo);
    return BelongsTo;
}());
exports.BelongsTo = BelongsTo;
//# sourceMappingURL=metadata-belongsto.js.map