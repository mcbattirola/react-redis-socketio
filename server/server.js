const express = require('express')
const cors = require('cors')
const articleRoutes = require('./routes/index')


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const port = 3000;
 
app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/index.html`);
});
 
io.on('connection', socket => {
   emitOpenArticles(socket);

   console.log('server side - socket connected!');

   socket.on("lockArticle", (data) => {
      console.log("lock", data, socket.id)
      lockArticle(data, socket);
      emitOpenArticles(io);
   })

   socket.on("unlockArticle", id => {
      console.log("unlock ", id, socket.id)
      openArticles = openArticles.filter(a => a.article !== id)
      emitOpenArticles(io);
   })
   
   socket.on("disconnect", socket => {
      console.log("Client disconnected");
      unlockSocketArticles(socket);
      emitOpenArticles(io);
   });

});

app.use(cors())
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
articleRoutes(app)
 
http.listen(port, () => {
   console.log(`listening on http://localhost:${port}`);
});


const emitOpenArticles = socket => {
   socket.emit("openArticles", openArticles)
}

const lockArticle = (id, socket) => {
   if (!openArticles.find(a => a.article === id)) {
      openArticles.push({article: id, user: socket.id})
   }
}

const unlockSocketArticles = socket => {
   openArticles = openArticles.filter(a => a.user === socket.id)
}

let openArticles = [];