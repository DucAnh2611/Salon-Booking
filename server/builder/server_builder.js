const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");
const compression = require("compression");
const ClientRouter = require("../routes/client");
const EmpRouter = require("../routes/employee");

class ServerAPIBuilder {

    constructor() {
        this.app = null;
        this.server = null;
        this.io = null;
        this.port = null;
        this.servername = "";
    }

    createApp() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cors({
            origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://salon-booking-iota.vercel.app"],
        }));
        this.app.use(compression());

        this.app.use("/client", ClientRouter);
        this.app.use("/emp", EmpRouter);

        this.io.on('connection', (socket) => {
            console.log('a user connected');
        }); //socket

        return this;
    }
 
    setPort(port) {
        this.port = port;
        return this;
    }

    setServername(name) {
        this.servername = name;
        return this;
    }

}

module.exports = ServerAPIBuilder;