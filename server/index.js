const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require("dotenv").config();

const port  = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
    origin: ["localhost:3000", "127.0.0.0:3000"],
    methods: "GET, POST, DELETE, UPDATE, PATCH"
}));

app.get('/', async (req, res) => {
    res.json({status: "ok"});
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.on('error', err => {
    console.log("Error:: ", err)
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});