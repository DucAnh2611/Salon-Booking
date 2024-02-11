require("dotenv").config();
const { Pool }  = require("pg");

const config = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
}

class DatabasePG {

    constructor() {
        this.conn = null;
        this.pool = new Pool(config);
    }

    static getInstance() {
        if(!DatabasePG.instance) {
            DatabasePG.instance = new DatabasePG();
        }

        return DatabasePG.instance;
    }

    async connect() {
        // connect to database
        if(!this.conn){
            this.conn = await this.pool.connect();
        }

        return this.conn;
    }

    async query(text, params) {
        if(!this.conn){
            return "err";
        }

        const result = await this.conn.query(text, params);
        return result;

    }

    async close() {
        this.conn = await this.pool.end();
    }

}

module.exports = DatabasePG;