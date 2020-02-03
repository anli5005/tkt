"use strict";

const { Pool } = require("pg");
require("dotenv").config();

let poolConfig = {};
poolConfig.connectionString = process.env.NOW_GITHUB_COMMIT_REF === "master" ? process.env.PROD_DATABASE_URL : process.env.DATABASE_URL;

let pool = new Pool(poolConfig);

module.exports = pool;