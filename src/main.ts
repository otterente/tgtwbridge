import { Api } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Db } from "./db/db";
import { tgc } from "./tg/telegram";
import { remove, tweet } from "./tw/twitter";
import { tweetObj } from "./tw/types";

const eventPrint = async(event: NewMessageEvent) => {
    const message = (event.message.isReply) ? await event.message.getReplyMessage() as Api.Message: event.message as Api.Message;

    const initator = await event.message.getSender() as Api.User;
    const sender = await message.getSender() as Api.User;

    if(initator.id.toJSNumber() == tgc._selfInputPeer?.userId.toJSNumber()) {
        if(event.message.message.match(/.tweet/i)) {
            if(message.file?.mimeType == "video/webm") return message.reply({message: "noch kein WebM support :/"}).then(res => {
                return setTimeout(() => {
                    event.message.delete({revoke: true})
                    res?.delete({revoke: true})
                }, 2500) //workaround
            })
            const usr = (message.forward) ? await message.forward.getSender() as Api.User : sender;
            const tweetData = await createTweet(usr, message);
            Db.insert({
                messageId: message.id,
                tweetId: tweetData.id,
                tweetId_str: tweetData.id_str
            })
            return message.reply({message: `Gezwischert auf: https://twitter.com/${tweetData.user.name}/status/${tweetData.id_str}`});
        }

        if(event.message.message.match(/.remove/i)) {
            const id = (event.message.isReply) ? message.id : Number(message.message.split(" ")[1]);
            if(isNaN(id)) return message.reply({message: "NaN du Opfer"}).then(res => {
                return setTimeout(() => {
                    event.message.delete({revoke: true})
                    res?.delete({revoke: true})
                }, 2500)
            })
            const dbObj = Db.search(id)[0];
            if(dbObj) {
                Db.remove(dbObj);
                remove(dbObj.tweetId_str);
                return event.message.delete({revoke: true})
            }
        }
    }
}

const createTweet = async(usr: Api.User, msg: Api.Message) => {
   console.log(msg.file?.mimeType);
    const tweetObj: tweetObj = {
        firstname: (usr.firstName) ? usr.firstName : "Anonym",
        media: (msg.file) ? { buffer: msg.downloadMedia() as unknown as Buffer, mimeType: (msg.file?.mimeType) ? msg.file.mimeType : "" } : undefined,
        text: (msg.message) ? msg.message.replace(/.tweet /i, "") : ""
    }
    return tweet(tweetObj);
}

try {
    tgc.addEventHandler(eventPrint, new NewMessage({}));
}catch(e) {
    console.log(e)
}