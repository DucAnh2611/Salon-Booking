const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const ServerAPIBuilder = require("./builder/server_builder");
const ServerAPI = require("./models/server");
const io = new Server(server);
require("dotenv").config();

const port  = parseInt(process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
    origin: ["localhost:3000", "127.0.0.0:3000"],
    methods: "GET, POST, DELETE, UPDATE, PATCH"
}));

// io.on('connection', (socket) => {
//     console.log('a user connected');
// });

app.get('/', async (req, res) => {
    res.json({status: "ok"});
});

const server1 = new ServerAPI(
new ServerAPIBuilder()
    .setApp(app)
    .setPort(port)
    .setServername("Server 1")
).listen();

const server2 = new ServerAPI(
new ServerAPIBuilder()
    .setApp(app)
    .setPort(port+1)
    .setServername("Server 2")
).listen();

const server3 = new ServerAPI(
new ServerAPIBuilder()
    .setApp(app)
    .setPort(port+2)
    .setServername("Server 3")
).listen();

const server4 = new ServerAPI(
new ServerAPIBuilder()
    .setApp(app)
    .setPort(port+3)
    .setServername("Server 4")
).listen();

