import { Publication } from "../models/publication";
export declare function isCBZPublication(filePath: string): boolean;
export declare function CbzParsePromise(filePath: string): Promise<Publication>;
