const ServerAPIBuilder = require("./builder/server_builder");
const ServerAPI = require("./models/server");
require("dotenv").config();

const port = parseInt(process.env.PORT || 3001);

const server1 = new ServerAPI(
new ServerAPIBuilder()
    .createApp()
    .setPort(port)
    .setServername("Server 1")
);

const server2 = new ServerAPI(
new ServerAPIBuilder()
    .createApp()
    .setPort(port+1)
    .setServername("Server 2")
);

const server3 = new ServerAPI(
new ServerAPIBuilder()
    .createApp()
    .setPort(port+2)
    .setServername("Server 3")
);

const server4 = new ServerAPI(
new ServerAPIBuilder()
    .createApp()
    .setPort(port+3)
    .setServername("Server 4")
);

server1.listen();
server2.listen();
server3.listen();
server4.listen();

