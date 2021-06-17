import { Publication } from "../models/publication";
import { Link } from "../models/publication-link";
import { IStreamAndLength } from "r2-utils-rn/dist/es5/src/_utils/zip/zip";
import { ITransformer } from "./transformer";
export declare class TransformerObfIDPF implements ITransformer {
    supports(_publication: Publication, link: Link): boolean;
    transformStream(publication: Publication, link: Link, _url: string | undefined, stream: IStreamAndLength, _isPartialByteRangeRequest: boolean, _partialByteBegin: number, _partialByteEnd: number, _sessionInfo: string | undefined): Promise<IStreamAndLength>;
    private transformBuffer;
}
