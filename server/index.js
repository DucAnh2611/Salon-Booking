const express = require("express");
const http = require("http");
const app = express();

const route = http.createServer(app);

route.listen(3001, () => {
    console.log("Listening to port 3001");
})