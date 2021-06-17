import { Publication } from "../models/publication";
export declare function AudioBookParsePromise(filePath: string, isAudio?: AudioBookis): Promise<Publication>;
export declare enum AudioBookis {
    LocalExploded = "LocalExploded",
    LocalPacked = "LocalPacked",
    RemoteExploded = "RemoteExploded"
}
export declare function isAudioBookPublication(urlOrPath: string): Promise<AudioBookis>;
