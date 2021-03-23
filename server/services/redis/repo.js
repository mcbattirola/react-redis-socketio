const Redis = require("ioredis");
const redis = new Redis();

const LOCK_CHANNEL = require("./constants").LOCK_CHANNEL;

redis.on("ready", () => {
  redis.config("SET", "notify-keyspace-events", "KA");
  console.log("repo redis ready")
});

const publishLock = data => {
  let strData = JSON.stringify(data || [])
  console.log("[redis event] - publish lock ", strData)
  try {
      // redis.set(LOCK_CHANNEL, strData); // returns promise which resolves to string, "OK"
      redis.set(LOCK_CHANNEL, strData)
  } catch (err) {
      console.log(err)
  }
  // redis.publish(LOCK_CHANNEL, JSON.stringify(data));
}

const getLocked = async () => {
  try {
    const data = await redis.get(LOCK_CHANNEL)
    return JSON.parse(data)
  } catch(err) {
    console.log(err)
  }
}

module.exports = {publishLock, getLocked};
