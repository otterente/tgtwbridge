
interface tweetObj {
    firstname: string;
    text?: string;
    media?: {
        buffer: Buffer;
        mimeType: string;
    };
}

export { tweetObj }