import { Author } from "./opf-author";
import { MetaDate } from "./opf-date";
import { Identifier } from "./opf-identifier";
import { Subject } from "./opf-subject";
import { Title } from "./opf-title";
export declare class DCMetadata {
    Title: Title[];
    Language: string[];
    Identifier: Identifier[];
    Creator: Author[];
    Subject: Subject[];
    Description: string[];
    Publisher: string[];
    Contributor: Author[];
    Date: MetaDate[];
    Type: string[];
    Format: string[];
    Source: string[];
    Relation: string[];
    Coverage: string[];
    Rights: string[];
}
