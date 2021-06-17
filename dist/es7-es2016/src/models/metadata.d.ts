import { IWithAdditionalJSON, JsonMap } from "r2-lcp-rn/dist/es7-es2016/src/serializable";
import { BelongsTo } from "./metadata-belongsto";
import { Contributor } from "./metadata-contributor";
import { MediaOverlay } from "./metadata-media-overlay";
import { IStringMap } from "./metadata-multilang";
import { Properties } from "./metadata-properties";
import { Subject } from "./metadata-subject";
export declare enum DirectionEnum {
    Auto = "auto",
    RTL = "rtl",
    LTR = "ltr"
}
export declare const MetadataSupportedKeys: string[];
export declare class Metadata implements IWithAdditionalJSON {
    AccessMode: string[];
    AccessibilityFeature: string[];
    AccessibilityHazard: string[];
    AccessibilitySummary: string | IStringMap;
    AccessModeSufficient: (string[])[];
    AccessibilityAPI: string[];
    AccessibilityControl: string[];
    CertifiedBy: string[];
    CertifierCredential: string[];
    CertifierReport: string[];
    ConformsTo: string[];
    RDFType: string;
    Title: string | IStringMap;
    SubTitle: string | IStringMap;
    Identifier: string;
    Author: Contributor[];
    Translator: Contributor[];
    Editor: Contributor[];
    Artist: Contributor[];
    Illustrator: Contributor[];
    Letterer: Contributor[];
    Penciler: Contributor[];
    Colorist: Contributor[];
    Inker: Contributor[];
    Narrator: Contributor[];
    Contributor: Contributor[];
    Publisher: Contributor[];
    Imprint: Contributor[];
    Language: string[];
    Modified: Date;
    PublicationDate: Date;
    SortAs2: string;
    SortAs1: string | undefined;
    get SortAs(): string | undefined;
    set SortAs(sortas: string | undefined);
    Description: string;
    Direction2: string;
    Direction1: string | undefined;
    get Direction(): string | undefined;
    set Direction(direction: string | undefined);
    BelongsTo2: BelongsTo;
    BelongsTo1: BelongsTo | undefined;
    get BelongsTo(): BelongsTo | undefined;
    set BelongsTo(belongsto: BelongsTo | undefined);
    Duration: number;
    NumberOfPages: number;
    MediaOverlay: MediaOverlay;
    Rights: string;
    Rendition: Properties;
    Source: string;
    Subject: Subject[];
    AdditionalJSON: JsonMap;
    protected _OnDeserialized(): void;
}
