import { MediaOverlayNode } from "./media-overlay";
import { Properties } from "./metadata-properties";
export declare class Link {
    TypeLink: string;
    Height: number;
    Width: number;
    Title: string;
    Properties: Properties;
    Duration: number;
    Bitrate: number;
    Templated: boolean;
    Children: Link[];
    Alternate: Link[];
    Rel: string[];
    MediaOverlays: MediaOverlayNode | undefined;
    Href1: string;
    get Href(): string;
    set Href(href: string);
    private _urlDecoded;
    get HrefDecoded(): string | undefined;
    set HrefDecoded(href: string | undefined);
    setHrefDecoded(href: string): void;
    AddRels(rels: string[]): void;
    AddRel(rel: string): void;
    HasRel(rel: string): boolean;
    protected _OnDeserialized(): void;
}
