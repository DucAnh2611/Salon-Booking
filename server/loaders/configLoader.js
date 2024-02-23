require("dotenv").config();

const ENV = process.env.NODE_ENV || "development";

const redirect_uri = {
    development: {
        client: process.env.URLREEDIRECTCLIENT_DEV,
        employee: process.env.URLREEDIRECTEMPLOYEE_DEV        
    },
    production: {
        client: process.env.URLREEDIRECTCLIENT_PRODUCTION,
        employee: process.env.URLREEDIRECTEMPLOYEE_PRODUCTION        
    }
}

const host = {
    development: `${process.env.HOST_DEV}:${process.env.PORT}`,
    production: process.env.HOST_PRODUCTION
}

module.exports = {
    redirect_uri,
    host,
    ENV
}