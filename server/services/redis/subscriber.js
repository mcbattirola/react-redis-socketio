const Redis = require("ioredis");
const redis = new Redis();

const LOCK_CHANNEL = require("./constants").LOCK_CHANNEL;

const subscribeToLocked = (callback, errCallback) => {
  // redis.subscribe(LOCK_CHANNEL, (err) => {
    redis.subscribe("__keyspace@0__:lock", err => {
    if (err) {
      // Just like other commands, subscribe() can fail for some reasons,
      // ex network issues.
      console.error("Failed to subscribe: %s", err.message);
      if (errCallback) {
        errCallback(err);
      }
    } else {
      console.log(`Subscribed successfully!`);
    }
  });
    
  // we have to listen to pmessage, if we used psubscribe to match a pattern
  redis.on("message", (channel, message) => {
    console.log("[redis subscriber] - channel:", channel, "----- message:", message,)
    if (message === 'set') {
      console.log("ouviu um set")
      callback()
    }
  });
}



module.exports = subscribeToLocked;