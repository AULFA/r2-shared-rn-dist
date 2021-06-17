"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonContributorConverter = void 0;
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var metadata_contributor_1 = require("./metadata-contributor");
var JsonContributorConverter = (function () {
    function JsonContributorConverter() {
    }
    JsonContributorConverter.prototype.serialize = function (c) {
        if (c.Name &&
            !c.SortAs &&
            (!c.Role || !c.Role.length) &&
            !c.Identifier &&
            (typeof c.Position === "undefined") &&
            (!c.Links || !c.Links.length)) {
            if (typeof c.Name === "string") {
                return c.Name;
            }
        }
        return serializable_1.TaJsonSerialize(c);
    };
    JsonContributorConverter.prototype.deserialize = function (value) {
        if (typeof value === "string") {
            var c = new metadata_contributor_1.Contributor();
            c.Name = value;
            return c;
        }
        return serializable_1.TaJsonDeserialize(value, metadata_contributor_1.Contributor);
    };
    JsonContributorConverter.prototype.collapseArrayWithSingleItem = function () {
        return true;
    };
    return JsonContributorConverter;
}());
exports.JsonContributorConverter = JsonContributorConverter;
//# sourceMappingURL=metadata-contributor-json-converter.js.map