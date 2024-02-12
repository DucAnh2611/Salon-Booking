const express = require("express");
const request = require("request");
require("dotenv").config();

const LB_PORT = process.env.LOADBALANCERPORT;

const RoundRobinServer = [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
];

const leastConnectionsServer = [
    {url: "http://localhost:3001", connections: 0},
    {url: "http://localhost:3002", connections: 0},
    {url: "http://localhost:3003", connections: 0},
    {url: "http://localhost:3004", connections: 0},
]

let current = 0;

const RoundRobinHandler = (req, res) => {
    const server = RoundRobinServer[current];

    console.log(server);

    req.pipe(request({url: server + req.url})).pipe(res);
    current = (current + 1) % RoundRobinServer.length;
}

const LeastConnectionHandler = (req, res) => {
    
    const targetServer = leastConnectionsServer.reduce((prev, curr) => {
        return (prev.connections < curr.connections) ? prev : curr;
    });
    targetServer.connections++;

    console.log(targetServer.url)

    req.pipe(request({url: targetServer.url + req.url})).pipe(res);

    targetServer.connections--;
}

const lbServer = express();

lbServer.use((req, res)=> (RoundRobinHandler(req, res)));

lbServer.listen(LB_PORT, (err) =>{
    err
    ? console.log("Fail to run LB server")
    : console.log("LB server is listening on PORT ", LB_PORT);
})

lbServer.on("error", (e) => {
    console.log(e);
})
