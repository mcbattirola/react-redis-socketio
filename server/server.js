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
   interval = setInterval(() => getApiAndEmit(socket), 1000);

   emmitOpenArticles(socket);

   console.log('server side - socket connected!');

   socket.on("editArticle", (data) => {
      console.log(data)
      openArticles.push(data)
      emmitOpenArticles(socket);
   })
   
   socket.on("disconnect", () => {
      console.log("Client disconnected");
      clearInterval(interval);
   });

});

app.use(cors())
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
articleRoutes(app)
 
http.listen(port, () => {
   console.log(`listening on http://localhost:${port}`);
});


// socket methods
const getApiAndEmit = socket => {
   const response = new Date();
   // Emitting a new message. Will be consumed by the client
   socket.emit("FromAPI", response);
};

const emmitOpenArticles = socket => {
   socket.emit("openArticles", openArticles)
}

const openArticles = [1, 9];