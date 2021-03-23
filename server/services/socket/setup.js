const publishLock = require("../redis/repo")
const subscribeToLocked = require("../redis/subscriber")

const setupSocket = io => {

  subscribeToLocked((_, data) => {
    emitOpenArticles(io, data);
  })

  io.on('connection', socket => {
    emitOpenArticles(socket);  
  
    socket.on("lockArticle", (data) => {
        lockArticle(data, socket);
    })
  
    socket.on("unlockArticle", id => {
        unlockArticle(id, socket.id)
    })
    
    socket.on("disconnect", socket => {
        unlockSocketArticles(socket);
    });
  
  });
  
  
  const emitOpenArticles = (socket, data) => {    
    socket.emit("openArticles", data || [])

    console.log("Emmiting articles: ", data || [])
  }
  
  const lockArticle = (id, socket) => {
    // get open articles from redis
    const openArticles = []  
    if (!openArticles.find(a => a.article === id)) {
      const newOpenArticles = [...openArticles, {article: id, user: socket.id}]
      publishLock(newOpenArticles)
   }
  }

  const unlockArticle = (id, socket) => {
    // get open articles from redis
    const openArticles = []
    const newOpenArticles = openArticles.filter(a => a.article !== id);
    publishLock(newOpenArticles);
  }
  
  const unlockSocketArticles = socket => {
    // get open articles from redis
    const openArticles = []
    const newOpenArticles = openArticles.filter(a => a.user === socket.id)
    publishLock(newOpenArticles);
  }

}

module.exports = setupSocket;