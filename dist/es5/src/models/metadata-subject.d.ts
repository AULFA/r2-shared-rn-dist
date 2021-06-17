import { IStringMap } from "./metadata-multilang";
import { Link } from "./publication-link";
export declare class Subject {
    Name: string | IStringMap;
    SortAs2: string;
    SortAs1: string | undefined;
    get SortAs(): string | undefined;
    set SortAs(sortas: string | undefined);
    Scheme: string;
    Code: string;
    Links: Link[];
    protected _OnDeserialized(): void;
}
