"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSubjectConverter = void 0;
var serializable_1 = require("r2-lcp-rn/dist/es5/src/serializable");
var metadata_subject_1 = require("./metadata-subject");
var JsonSubjectConverter = (function () {
    function JsonSubjectConverter() {
    }
    JsonSubjectConverter.prototype.serialize = function (s) {
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
    };
    JsonSubjectConverter.prototype.deserialize = function (value) {
        if (typeof value === "string") {
            var s = new metadata_subject_1.Subject();
            s.Name = value;
            return s;
        }
        return serializable_1.TaJsonDeserialize(value, metadata_subject_1.Subject);
    };
    JsonSubjectConverter.prototype.collapseArrayWithSingleItem = function () {
        return true;
    };
    return JsonSubjectConverter;
}());
exports.JsonSubjectConverter = JsonSubjectConverter;
//# sourceMappingURL=metadata-subject-json-converter.js.map