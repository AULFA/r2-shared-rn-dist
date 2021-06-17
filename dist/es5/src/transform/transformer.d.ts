import { Publication } from "../models/publication";
import { Link } from "../models/publication-link";
import { IStreamAndLength } from "r2-utils-rn/dist/es5/src/_utils/zip/zip";
export interface ITransformer {
    supports(publication: Publication, link: Link): boolean;
    transformStream(publication: Publication, link: Link, url: string | undefined, stream: IStreamAndLength, isPartialByteRangeRequest: boolean, partialByteBegin: number, partialByteEnd: number, sessionInfo: string | undefined): Promise<IStreamAndLength>;
}
export declare class Transformers {
    static instance(): Transformers;
    static tryStream(publication: Publication, link: Link, url: string | undefined, stream: IStreamAndLength, isPartialByteRangeRequest: boolean, partialByteBegin: number, partialByteEnd: number, sessionInfo: string | undefined): Promise<IStreamAndLength>;
    private static _instance;
    private transformers;
    constructor();
    add(transformer: ITransformer): void;
    private _tryStream;
}
