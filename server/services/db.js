require("dotenv").config();
const { Pool } = require('pg');
const Knex = require('knex');
const config = require("./knexconfig");
const env = process.env.NODE_ENV || "development";

class DatabasePG {

    constructor() {
        this.knex = null;
    }

    static getInstance() {
        if(!DatabasePG.instance) {
            DatabasePG.instance = new DatabasePG();
        }

        return DatabasePG.instance;
    }

    async getKnex() {
        if (!this.knex) {
            this.knex = Knex({
                ...config[env],
                pool: {
                    min: 0,
                    max: 5,
                    afterCreate: (conn, done) => {
                      console.log("Connection Established.");
                      done();
                    },
                },
            });
        }

        return this.knex;
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = DatabasePG;