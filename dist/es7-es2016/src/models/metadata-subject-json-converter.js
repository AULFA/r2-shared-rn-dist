"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSubjectConverter = void 0;
const serializable_1 = require("r2-lcp-rn/dist/es7-es2016/src/serializable");
const metadata_subject_1 = require("./metadata-subject");
class JsonSubjectConverter {
    serialize(s) {
        if (s.Name &&
            !s.SortAs &&
            !s.Scheme &&
            !s.Code &&
            (!s.Links || !s.Links.length)) {
            if (typeof s.Name === "string") {
                return s.Name;
            }
        }
        return serializable_1.TaJsonSerialize(s);
    }
    deserialize(value) {
        if (typeof value === "string") {
            const s = new metadata_subject_1.Subject();
            s.Name = value;
            return s;
        }
        return serializable_1.TaJsonDeserialize(value, metadata_subject_1.Subject);
    }
    collapseArrayWithSingleItem() {
        return true;
    }
}
exports.JsonSubjectConverter = JsonSubjectConverter;
//# sourceMappingURL=metadata-subject-json-converter.js.map