const express = require('express')
const cors = require('cors')
const articleRoutes = require('./routes/index');
const setupSocket = require('./services/socket/setup');


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;
 
app.get('/', (req, res) => {
   res.sendFile(`${__dirname}/index.html`);
});
 
setupSocket(io);

app.use(cors())
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
articleRoutes(app)
 
http.listen(port, () => {
   console.log(`listening on http://localhost:${port}`);
});

