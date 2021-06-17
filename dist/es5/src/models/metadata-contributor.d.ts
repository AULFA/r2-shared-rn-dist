import { IStringMap } from "./metadata-multilang";
import { Link } from "./publication-link";
export declare class Contributor {
    Name: string | IStringMap;
    SortAs2: string;
    SortAs1: string | undefined;
    get SortAs(): string | undefined;
    set SortAs(sortas: string | undefined);
    Role: string[];
    Identifier: string;
    Position: number;
    Links: Link[];
    protected _OnDeserialized(): void;
}
