const Redis = require("ioredis");
const redis = new Redis();

const LOCK_CHANNEL = require("./constants").LOCK_CHANNEL;

const subscribeToLocked = (callback, errCallback) => {
  redis.subscribe(LOCK_CHANNEL, (err) => {
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
    
  redis.on("message", (channel, message) => {
    callback(channel, message)
  });
}



module.exports = subscribeToLocked;