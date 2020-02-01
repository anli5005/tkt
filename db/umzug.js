"use strict";

const pool = require("./db.js");
const umzug = require("umzug");
const path = require("path");

module.exports = new umzug({
    storage: {
        async logMigration(name) {
            await pool.query(`CREATE TABLE IF NOT EXISTS migrations(
                name text unique not null primary key
            );`);
            await pool.query(`INSERT INTO migrations (name) VALUES ($1)`, [name]);
        },
        async unlogMigration(name) {
            await pool.query(`DELETE FROM migrations WHERE name=$1`, [name]);
        },
        async executed() {
            await pool.query(`CREATE TABLE IF NOT EXISTS migrations(
                name text unique not null primary key
            );`);
            return (await pool.query(`SELECT name from migrations ORDER BY name;`)).rows.map(row => row.name);
        }
    },
    migrations: {
        params: [pool],
        path: path.join(__dirname, "migrations")
    }
});