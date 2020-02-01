"use strict";

module.exports = {
    async up(db) {
        await db.query("CREATE EXTENSION pgcrypto;")
    },
    async down(db) {
        await db.query("DROP EXTENSION pgcrypto;")
    }
};