require("dotenv").config();
const { Pool } = require('pg');
const Knex = require('knex');
const config = require("./knexconfig");
const { table } = require("../models/config");
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

class InsertService extends DatabasePG {
    static async insert({trx, table, values, returning, ...props}) {
        return trx
            .insert(values, returning)
            .into(table);
    }
}

class SelectService extends DatabasePG {
    static async select({trx, table, fields, ...props}) {
        return trx
            .select(fields)
            .from(table);

    }
}

class UpdateServer extends DatabasePG {
    static async update({trx, table, updates, ...props}) {
        return trx
            .update(updates)
            .updateFrom(table)
    }
}

module.exports = {
    DatabasePG
};