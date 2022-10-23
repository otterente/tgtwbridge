interface dbObj {
    tweetId: number;
    tweetId_str: string;
    messageId: number;
}

interface database {
    id: number;
    store: dbObj[];
}

export { dbObj, database }