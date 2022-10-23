import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import * as config from "../config.json";

const tgc = new TelegramClient(
    new StringSession(config.tg.stringSession),
    config.tg.apiId,
    config.tg.apiHash,
    { connectionRetries: 5 });

const init = async() => {
    await tgc.connect();
    await tgc.getMe();
}

init();

export { tgc }