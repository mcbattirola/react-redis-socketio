const { publishLock, getLocked } = require('../redis/repo')
const subscribeToLocked = require('../redis/subscriber')

const setupSocket = io => {
  subscribeToLocked(async () => {
    const openArticles = await getLocked()
    emitOpenArticles(io, openArticles)
  })

  io.on('connection', socket => {
    emitOpenArticles(socket)

    socket.on('lockArticle', (data) => {
      lockArticle(data, socket)
    })

    socket.on('unlockArticle', id => {
      unlockArticle(id, socket.id)
    })

    socket.on('disconnect', socket => {
      unlockSocketArticles(socket)
    })
  })

  const emitOpenArticles = async (socket, data) => {
    const openArticles = await getLocked()
    socket.emit('openArticles', openArticles || [])
  }

  const lockArticle = async (id, socket) => {
    // open transaction / lock redis ?
    const openArticles = await getLocked()
    if (!openArticles.find(a => a.article === id)) {
      const newOpenArticles = [...openArticles, { article: id, user: socket.id }]
      publishLock(newOpenArticles)
    }
  }

  const unlockArticle = async (id, socket) => {
    // open transaction / lock redis ?
    const openArticles = await getLocked()
    const newOpenArticles = openArticles.filter(a => a.article !== id)
    publishLock(newOpenArticles)
  }

  const unlockSocketArticles = async socket => {
    // open transaction / lock redis ?
    const openArticles = await getLocked()
    const newOpenArticles = openArticles.filter(a => a.user === socket.id)
    publishLock(newOpenArticles)
  }
}

module.exports = setupSocket
