"use strict";

const { Pool } = require("pg");
const config = require("config");

let poolConfig = {};
if (config.has("databaseUrl")) {
    poolConfig.connectionString = config.get("databaseUrl");
}

let pool = new Pool(poolConfig);

module.exports = pool;