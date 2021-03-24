const { publishLock, getLocked, addLockedArticleData, removeLockedArticleData, getUserArticles, setUserArticles, deleteUserArticles, getArticleData } = require('../redis/repo')
const listenKey = require('../redis/subscriber')

const setupSocket = io => {
  listenKey('lock', async () => {
    const openArticles = await getLocked()
    emitOpenArticles(io, openArticles)
  })

  // we use this array to make sure we dont subscribe twice to the same key
  const listenedKeys = []

  io.on('connection', socket => {
    emitOpenArticles(socket)
    console.log('---- new user: ', socket.id)

    socket.on('lockArticle', async (data) => {
      console.log('[socket] - lock', data, socket.id)
      // subscribe socket to room `article:id`
      socket.join(`article:${data}`)

      // and subscribe ourselves to its article key on redis
      if (!listenedKeys.includes(data)) {
        listenKey(`article:${data}`, async () => {
          // when data changes, emit to client
          const articleData = await getArticleData(data)
          io.to(`article:${data}`).emit('message', articleData)
          console.log('emmit to article ', data, 'subscribers', articleData)
        })
        listenedKeys.push(data)
      }

      // then, lock the article
      await lockArticle(data, socket.id)
      // and emmit details to socket
      const articleData = await getArticleData(data)
      socket.emit('message', articleData)
    })

    socket.on('unlockArticle', id => {
      console.log('[socket] - unlock')
      unlockArticle(id, socket.id)
    })

    socket.on('disconnect', () => {
      console.log('[socket] - disconnect', socket.id)
      unlockSocketArticles(socket.id)
    })
  })

  const emitOpenArticles = async (socket, data) => {
    const openArticles = await getLocked()
    socket.emit('openArticles', openArticles || [])
  }

  const lockArticle = async (id, userId) => {
    // open transaction / lock redis ?
    const openArticles = await getLocked()
    if (!openArticles.find(a => a === id)) {
      const newOpenArticles = [...openArticles, id]

      // this is bad, we should use a pipeline to perform all operations in bulk!

      // add to `lock`
      publishLock(newOpenArticles)

      // create a key article:articleId
      addLockedArticleData({ id, user: userId })

      // add lock to user:userId
      const userArticles = await getUserArticles(userId)
      userArticles.push(id)

      setUserArticles(userId, userArticles)
    }
  }

  const unlockArticle = async (id, userId) => {
    // open transaction / lock redis ?
    const openArticles = await getLocked()
    const newOpenArticles = openArticles.filter(a => a !== id)
    publishLock(newOpenArticles)
    removeLockedArticleData(id)

    const userArticles = await getUserArticles(userId)

    setUserArticles(userId, userArticles.filter(a => a !== id))
  }

  const unlockSocketArticles = async userId => {
    if (!userId) {
      return
    }

    // open transaction / lock redis ?
    // const openArticles = await getLocked()
    // const newOpenArticles = openArticles.filter(a => a.user === socket.id)
    const userArticles = await getUserArticles(userId)
    const openArticles = await getLocked()

    userArticles.map(article => removeLockedArticleData(article))

    if (openArticles && userArticles) {
      publishLock(openArticles.filter(a => !userArticles.includes(a)))
    }

    deleteUserArticles(userId, null)
  }
}

module.exports = setupSocket
