import { Publication } from "../models/publication";
import { Link } from "../models/publication-link";
import { IStreamAndLength } from "r2-utils-rn/dist/es6-es2015/src/_utils/zip/zip";
import { ITransformer } from "./transformer";
export declare class TransformerLCP implements ITransformer {
    supports(publication: Publication, link: Link): boolean;
    transformStream(publication: Publication, link: Link, _url: string | undefined, stream: IStreamAndLength, isPartialByteRangeRequest: boolean, partialByteBegin: number, partialByteEnd: number, _sessionInfo: string | undefined): Promise<IStreamAndLength>;
}
