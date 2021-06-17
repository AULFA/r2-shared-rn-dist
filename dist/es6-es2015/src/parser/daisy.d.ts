import { Publication } from "../models/publication";
export declare enum DaisyBookis {
    LocalExploded = "LocalExploded",
    LocalPacked = "LocalPacked",
    RemoteExploded = "RemoteExploded",
    RemotePacked = "RemotePacked"
}
export declare function isDaisyPublication(urlOrPath: string): Promise<DaisyBookis | undefined>;
export declare function DaisyParsePromise(filePath: string): Promise<Publication>;
