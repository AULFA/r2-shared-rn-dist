import { IPropertyConverter, JsonValue } from "ta-json-x";
import { Subject } from "./metadata-subject";
export declare class JsonSubjectConverter implements IPropertyConverter {
    serialize(s: Subject): JsonValue;
    deserialize(value: JsonValue): Subject;
    collapseArrayWithSingleItem(): boolean;
}
