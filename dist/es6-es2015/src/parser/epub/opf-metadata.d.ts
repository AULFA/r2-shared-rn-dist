import { DCMetadata } from "./opf-dc-metadata";
import { MetaLink } from "./opf-link";
import { Metafield } from "./opf-metafield";
import { XMetadata } from "./opf-x-metadata";
export declare class Metadata extends DCMetadata {
    Link: MetaLink[];
    Meta: Metafield[];
    DCMetadata: DCMetadata;
    XMetadata: XMetadata;
}
