const publishLock = require("../redis/publisher")
const subscribeToLocked = require("../redis/subscriber")

const setupSocket = io => {
  let openArticles = [];

  subscribeToLocked((_, data) => {
    openArticles = JSON.parse(data)
    emitOpenArticles(io);
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
  
  
  const emitOpenArticles = socket => {    
    const data = openArticles || []
    socket.emit("openArticles", data)

    console.log("Emmiting articles: ", data)
  }
  
  const lockArticle = (id, socket) => {
    if (!openArticles.find(a => a.article === id)) {
      const newOpenArticles = [...openArticles, {article: id, user: socket.id}]
      publishLock(newOpenArticles)
   }
  }

  const unlockArticle = (id, socket) => {
    const newOpenArticles = openArticles.filter(a => a.article !== id);
    publishLock(newOpenArticles);
  }
  
  const unlockSocketArticles = socket => {
    const newOpenArticles = openArticles.filter(a => a.user === socket.id)
    publishLock(newOpenArticles);
  }

}

module.exports = setupSocket;