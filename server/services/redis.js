const { createClient } = require('redis');
require("dotenv").config();

const REDIS_CONFIG = {
    key_expire: 5
}

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

class RedisSetValue extends Redis {

    static async setValue(key, value, expire) {
        const setV = await this.client.set(
            key, 
            value, 
            {
                EX: expire
            }
        );

        return setV;
    }

}

class RedisGetValue extends Redis {

    static async getValue(key) {
        const value = await this.client.hGetAll(key);

        return value;
    }

}  

class RedisDelValue extends Redis {

    static async delKey(key) { 
        const deleted = await this.client.del(key);

        return deleted;
    }
}

module.exports = {
    Redis,
    RedisSetValue,
    RedisGetValue,
    RedisDelValue
};
