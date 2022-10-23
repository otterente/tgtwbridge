import { TwitterApi } from "twitter-api-v2";
import * as config from "../config.json";
import { tweetObj } from "./types";

const twc = new TwitterApi({
    appKey: config.tw.apiKey,
    appSecret: config.tw.apiKeySecret,
    accessToken: config.tw.accessToken,
    accessSecret: config.tw.accessTokenSecret
}).readWrite;

const tweet = async(tweetObj: tweetObj) => {
    const str = `${tweetObj.firstname}: ${tweetObj.text}`;
    if(tweetObj.media) {
        const id = await twc.v1.uploadMedia(tweetObj.media.buffer, {mimeType: tweetObj.media.mimeType});
        return await twc.v1.tweet(str, {media_ids: id})
    }
    return twc.v1.tweet(str)
}

const remove = async(tweetId_str: string) => {
    return twc.v1.deleteTweet(tweetId_str)
}

export { tweet, remove }