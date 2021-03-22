const Redis = require("ioredis");
const redis = new Redis();

const LOCK_CHANNEL = require("./constants").LOCK_CHANNEL;

const publishLock = data => {
    console.log("[redis event] - publish lock ", JSON.stringify(data))
    redis.publish(LOCK_CHANNEL, JSON.stringify(data));
}

module.exports = publishLock;