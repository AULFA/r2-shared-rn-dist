export declare class Manifest {
    ID: string;
    MediaType: string;
    Fallback: string;
    Properties: string;
    MediaOverlay: string;
    Href1: string;
    get Href(): string;
    set Href(href: string);
    private _urlDecoded;
    get HrefDecoded(): string | undefined;
    set HrefDecoded(href: string | undefined);
    setHrefDecoded(href: string): void;
}
