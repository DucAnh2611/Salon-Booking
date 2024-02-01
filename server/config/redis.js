const { createClient } = require('redis');
require("dotenv").config();

const planA = createClient(process.env.REDISURL);
const planB = createClient({
    password: process.env.REDISPASSWORD,
    socket: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT
    }
});

const client = planA;
