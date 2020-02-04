"use strict";

const { Pool } = require("pg");
require("dotenv").config();

let poolConfig = {};
poolConfig.connectionString = process.env.NOW_GITHUB_COMMIT_REF === "master" ? process.env.PROD_DATABASE_URL : process.env.DATABASE_URL;
poolConfig.max = parseInt(process.env.NOW_GITHUB_COMMIT_REF === "master" ? process.env.PROD_DATABASE_MAX_CONNECTIONS : process.env.DATABASE_MAX_CONNECTIONS) || 10;

let pool = new Pool(poolConfig);

module.exports = pool;