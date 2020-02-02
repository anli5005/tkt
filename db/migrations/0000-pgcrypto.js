"use strict";

module.exports = {
    async up(db) {
        await db.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    },
    async down(db) {
        await db.query("DROP EXTENSION pgcrypto;")
    }
};