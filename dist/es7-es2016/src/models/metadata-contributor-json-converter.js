"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonContributorConverter = void 0;
const serializable_1 = require("r2-lcp-rn/dist/es7-es2016/src/serializable");
const metadata_contributor_1 = require("./metadata-contributor");
class JsonContributorConverter {
    serialize(c) {
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
    }
    deserialize(value) {
        if (typeof value === "string") {
            const c = new metadata_contributor_1.Contributor();
            c.Name = value;
            return c;
        }
        return serializable_1.TaJsonDeserialize(value, metadata_contributor_1.Contributor);
    }
    collapseArrayWithSingleItem() {
        return true;
    }
}
exports.JsonContributorConverter = JsonContributorConverter;
//# sourceMappingURL=metadata-contributor-json-converter.js.map