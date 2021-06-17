"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const tslib_1 = require("tslib");
const ta_json_x_1 = require("ta-json-x");
const publication_link_1 = require("./publication-link");
const LINKS_JSON_PROP = "links";
let Subject = class Subject {
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
            console.log("Subject.Name is not set!");
        }
    }
};
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("name"),
    tslib_1.__metadata("design:type", Object)
], Subject.prototype, "Name", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sortAs"),
    tslib_1.__metadata("design:type", String)
], Subject.prototype, "SortAs2", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("sort_as"),
    tslib_1.__metadata("design:type", Object)
], Subject.prototype, "SortAs1", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("scheme"),
    tslib_1.__metadata("design:type", String)
], Subject.prototype, "Scheme", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty("code"),
    tslib_1.__metadata("design:type", String)
], Subject.prototype, "Code", void 0);
tslib_1.__decorate([
    ta_json_x_1.JsonProperty(LINKS_JSON_PROP),
    ta_json_x_1.JsonElementType(publication_link_1.Link),
    tslib_1.__metadata("design:type", Array)
], Subject.prototype, "Links", void 0);
tslib_1.__decorate([
    ta_json_x_1.OnDeserialized(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Subject.prototype, "_OnDeserialized", null);
Subject = tslib_1.__decorate([
    ta_json_x_1.JsonObject()
], Subject);
exports.Subject = Subject;
//# sourceMappingURL=metadata-subject.js.map