"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE invites(
            token bytea UNIQUE NOT NULL PRIMARY KEY DEFAULT gen_random_bytes(20),
            event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            date_added timestamp DEFAULT now()
        );`);
    },
    async down(db) {
        await db.query("DROP TABLE invites;");
    }
};