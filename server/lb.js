const express = require("express");
const request = require("request");
require("dotenv").config();

const LB_PORT = process.env.LOADBALANCERPORT;

const servers = [
    "http://localhost:3002",
    "http://localhost:3001",
    "http://localhost:3003",
    "http://localhost:3004",
]

let current = 0;

const handler = (req, res) => {
    const server = servers[current];

    req.pipe(request({url: server+req.url})).pipe(res);
    current =(current + 1)% servers.length;
}

const lbServer = express();

lbServer.use((req, res)=> (handler(req, res)));

lbServer.listen(LB_PORT, (err) =>{
    err
    ? console.log("Fail to run LB server")
    : console.log("LB server is listening on PORT ", LB_PORT);
})
