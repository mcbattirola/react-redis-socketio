const Redis = require("ioredis");
const redis = new Redis();

const LOCK_CHANNEL = require("./constants").LOCK_CHANNEL;

redis.on("ready", () => {
  // redis.config("SET", "notify-keyspace-events", "KEA");
  console.log("repo redis ready")
});

const publishLock = data => {
  let strData = JSON.stringify(data || [])
  console.log("[redis event] - publish lock ", strData)
  try {
      // redis.set(LOCK_CHANNEL, strData); // returns promise which resolves to string, "OK"
      let key = 1;
      redis.set(LOCK_CHANNEL, data)
  } catch (err) {
      console.log(err)
  }
  // redis.publish(LOCK_CHANNEL, JSON.stringify(data));
}


module.exports = publishLock;
