export declare class Rootfile {
    Type: string;
    Version: string;
    Path1: string;
    get Path(): string;
    set Path(href: string);
    private _urlDecoded;
    get PathDecoded(): string | undefined;
    set PathDecoded(href: string | undefined);
    setPathDecoded(href: string): void;
}
