"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE users(
            id uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
            token_subject bytea UNIQUE
        );`)
    },
    async down(db) {
        await db.query("DROP TABLE users;")
    }
};