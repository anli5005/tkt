"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE events(
            id uuid UNIQUE NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
            meta jsonb NOT NULL,
            slug varchar(255) UNIQUE NOT NULL
        );`);
    },
    async down(db) {
        await db.query("DROP TABLE events;");
    }
};