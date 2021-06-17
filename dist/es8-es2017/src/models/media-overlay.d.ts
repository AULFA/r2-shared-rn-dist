export declare function timeStrToSeconds(timeStr: string): number;
export declare class MediaOverlayNode {
    Text: string;
    Audio: string;
    Role: string[];
    Children: MediaOverlayNode[];
    SmilPathInZip: string | undefined;
    initialized: boolean;
    ParID: string | undefined;
    SeqID: string | undefined;
    AudioClipBegin: number | undefined;
    AudioClipEnd: number | undefined;
    duration: number | undefined;
    totalElapsedTime: number | undefined;
}
