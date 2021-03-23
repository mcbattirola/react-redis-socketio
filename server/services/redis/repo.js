const Redis = require('ioredis')
const redis = new Redis()

const LOCK_CHANNEL = require('./constants').LOCK_CHANNEL

redis.on('ready', () => {
  redis.config('SET', 'notify-keyspace-events', 'KA')
})

const publishLock = data => {
  const strData = JSON.stringify(data || [])
  console.log('[redis event] - publish lock ', strData)
  try {
    redis.set(LOCK_CHANNEL, strData)
  } catch (err) {
    console.log(err)
  }
}

const getLocked = async () => {
  try {
    const data = await redis.get(LOCK_CHANNEL)
    return JSON.parse(data)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { publishLock, getLocked }
