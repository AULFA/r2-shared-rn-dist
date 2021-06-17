export declare class Reference {
    Title: string;
    Type: string;
    Href1: string;
    get Href(): string;
    set Href(href: string);
    private _urlDecoded;
    get HrefDecoded(): string | undefined;
    set HrefDecoded(href: string | undefined);
    setHrefDecoded(href: string): void;
}
