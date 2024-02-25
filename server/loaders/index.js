const { DatabasePG } = require("../services/db");
const RedisInit = require("./redis");
const experssLoader = require("./express");
const socketLoader = require('./socket');

module.exports = async ({ expressApp }) => { 
    const instanceDbKnex =  await DatabasePG.getInstance().getKnex();
    console.log("Postgresql instance initialized!");

    const redisConnection = await RedisInit();
    console.log("Redis initialized!");

    expressApp = experssLoader({app: expressApp});
    console.log("Express initialized!");


    expressApp = socketLoader({app: expressApp});
    console.log("Socket.io initialized!");

    return expressApp;
}