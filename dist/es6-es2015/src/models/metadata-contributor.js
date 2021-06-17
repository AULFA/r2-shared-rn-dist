"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contributor = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const ta_json_string_converter_1 = require("r2-utils-rn/dist/es6-es2015/src/_utils/ta-json-string-converter");
const publication_link_1 = require("./publication-link");
const LINKS_JSON_PROP = "links";
let Contributor = class Contributor {
    get SortAs() {
        return this.SortAs2 ? this.SortAs2 : this.SortAs1;
    }
    set SortAs(sortas) {
        if (sortas) {
            this.SortAs1 = undefined;
            this.SortAs2 = sortas;
        }
    }
    _OnDeserialized() {
        if (!this.Name) {
            console.log("Contributor.Name is not set!");
        }
    }
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("name"),
    tslib_1.__metadata("design:type", Object)
], Contributor.prototype, "Name", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sortAs"),
    tslib_1.__metadata("design:type", String)
], Contributor.prototype, "SortAs2", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sort_as"),
    tslib_1.__metadata("design:type", Object)
], Contributor.prototype, "SortAs1", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("role"),
    ta_json_x_1.JsonConverter(ta_json_string_converter_1.JsonStringConverter),
    ta_json_x_1.JsonElementType(String),
    tslib_1.__metadata("design:type", Array)
], Contributor.prototype, "Role", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("identifier"),
    tslib_1.__metadata("design:type", String)
], Contributor.prototype, "Identifier", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("position"),
    tslib_1.__metadata("design:type", Number)
], Contributor.prototype, "Position", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty(LINKS_JSON_PROP),
    ta_json_x_1.JsonElementType(publication_link_1.Link),
    tslib_1.__metadata("design:type", Array)
], Contributor.prototype, "Links", void 0);
tslib_1.__decorate([
    ta_json_x_1.OnDeserialized(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Contributor.prototype, "_OnDeserialized", null);
Contributor = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Contributor);
exports.Contributor = Contributor;
//# sourceMappingURL=metadata-contributor.js.map