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

const addLockedArticleData = data => {
  const strData = JSON.stringify(data || {})
  console.log('[redis event] - publish locked article ', strData)
  try {
    redis.set(`article:${data.id}`, strData)
  } catch (err) {
    console.log(err)
  }
}

const removeLockedArticleData = id => {
  try {
    redis.del(`article:${id}`)
  } catch (err) {
    console.log(err)
  }
}

const getLocked = async () => {
  try {
    const data = await redis.get(LOCK_CHANNEL)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.log(err)
  }
}

const getUserArticles = async (id) => {
  const data = await redis.get(`user:${id}`)
  return data ? JSON.parse(data) : []
}

const setUserArticles = (userId, data) => {
  redis.set(`user:${userId}`, JSON.stringify(data))
}

const deleteUserArticles = userId => {
  redis.del(`user:${userId}`)
}

const getArticleData = async (id) => {
  // console.log('[redis event] - get locked article data:', id)
  try {
    return await redis.get(`article:${id}`)
  } catch (err) {
    console.log(err)
  }
}

module.exports = { publishLock, getLocked, addLockedArticleData, removeLockedArticleData, getUserArticles, setUserArticles, deleteUserArticles, getArticleData }
