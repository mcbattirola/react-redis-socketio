const Redis = require('ioredis')
const redis = new Redis()

const LOCK_CHANNEL = require('./constants').LOCK_CHANNEL

const subscribeToLocked = (callback, errCallback) => {
  redis.subscribe('__keyspace@0__:' + LOCK_CHANNEL, err => {
    if (err) {
      console.error('Failed to subscribe: %s', err.message)
      if (errCallback) {
        errCallback(err)
      }
    } else {
      console.log('Subscribed successfully!')
    }
  })

  redis.on('message', (channel, message) => {
    if (message === 'set') {
      callback()
    }
  })
}

module.exports = subscribeToLocked
