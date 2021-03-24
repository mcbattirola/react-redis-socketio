const { publishLock, getLocked, addLockedArticleData, removeLockedArticleData, getUserArticles, setUserArticles, deleteUserArticles } = require('../redis/repo')
const listenKey = require('../redis/subscriber')

const setupSocket = io => {
  listenKey("lock", async () => {
    const openArticles = await getLocked()
    emitOpenArticles(io, openArticles)
  })

  io.on('connection', socket => {
    emitOpenArticles(socket)

    socket.on('lockArticle', (data) => {
      console.log("[socket] - lock", data, socket.id)
      lockArticle(data, socket.id)
    })

    socket.on('unlockArticle', id => {
      console.log("[socket] - unlock")
      unlockArticle(id, socket.id)
    })

    socket.on('disconnect', () => {
      console.log("[socket] - disconnect", socket.id)
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
      addLockedArticleData({id, user: userId})

      // add lock to user:userId
      const userArticles = await getUserArticles(userId)
      userArticles.push(id)
      
      console.log("lockArticle, user id: ", userId)
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

    console.log("unlockArticle, user id: ", userId)
    setUserArticles(userId, userArticles.filter(a => a !== id))
  }

  const unlockSocketArticles = async userId => {
    console.log("unlockSocketArticles, userId: ", userId)
    if (!userId) {
      return;
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

    
    deleteUserArticles(userId, null);
  }
}

module.exports = setupSocket
