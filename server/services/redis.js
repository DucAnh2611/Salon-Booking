const { createClient } = require('redis');
require("dotenv").config();

class Redis {
    constructor() {
        this.planA = createClient(process.env.REDISURL);
        this.planB = createClient({
            password: process.env.REDISPASSWORD,
            socket: {
                host: process.env.REDISHOST,
                port: process.env.REDISPORT
            }
        });
        this.client = null;
    }

    static getInstance() {
        if(!Redis.instance) {
            Redis.instance = new Redis();
        }
        return Redis.instance;
    }

    async getClient() {
        if(!this.client) {
            this.client = await this.planB.connect();
        }
        return this.client;
    }

}

module.exports = Redis;
