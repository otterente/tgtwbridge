import { dbObj, database } from "./types";
import { writeFileSync, readFileSync, existsSync, readdirSync, mkdirSync } from "fs";

class db {
    private name!: string
    private database: database
    private dbObj?: dbObj
    constructor(name: string) {
        this.name = name;

        this.database = {
            id: 0,
            store: []
        }
        if(this.database.store) this.init();
    }
    private init() {
        if(existsSync(`./datastore/${this.name}.json`)) {
            this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
            return this.database.store
        }

        if(!existsSync("./datastore")) mkdirSync("./datastore");
        this.database.id = readdirSync("./datastore").length;
        writeFileSync(`./datastore/${this.name}.json`, JSON.stringify(this.database), "utf-8");
        this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
        return this.database.store
    }

    insert(dbObj: dbObj) {
        this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
        this.dbObj = dbObj;
        if(this.database.store.indexOf(this.dbObj) == -1) {
            this.database.store.push(this.dbObj)
            writeFileSync(`./datastore/${this.name}.json`, JSON.stringify(this.database), "utf-8");
            this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
            return this.database.store
        }
    }

    remove(dbObj: dbObj) {
        this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
        this.dbObj = dbObj;
        this.database.store.splice(this.database.store.indexOf(this.dbObj))
        writeFileSync(`./datastore/${this.name}.json`, JSON.stringify(this.database), "utf-8");
        this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
        return this.database.store
    }
    search(messageId?: number, tweetId?: number) {
        this.database = JSON.parse(readFileSync(`./datastore/${this.name}.json`, "utf-8")) as database;
        if(!messageId && !tweetId) return this.database.store;
        const dbObj = this.database.store.map(e => {
            if(e.messageId == messageId || e.tweetId == tweetId) {
                return e
            }
        })
        return dbObj
    }
}

const Db = new db("users");

export { Db }