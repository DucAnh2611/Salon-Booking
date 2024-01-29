const { createClient } = require('redis');
require("dotenv").config();

const client = createClient({
    password: process.env.REDISPASSWORD,
    socket: {
        host: process.env.REDISHOST,
        port: process.env.REDISPORT
    }
});