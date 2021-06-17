import { SeqOrPar } from "./smil-seq-or-par";
export declare class Seq extends SeqOrPar {
    Children: SeqOrPar[];
    TextRef1: string;
    get TextRef(): string;
    set TextRef(href: string);
    private _urlDecoded;
    get TextRefDecoded(): string | undefined;
    set TextRefDecoded(href: string | undefined);
    setTextRefDecoded(href: string): void;
}
