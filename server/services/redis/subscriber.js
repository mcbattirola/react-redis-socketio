const Redis = require('ioredis')
const redis = new Redis()

const listenKey = (key, callback, errCallback) => {
  redis.subscribe('__keyspace@0__:' + key, err => {
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

module.exports = listenKey
