"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE tickets(
            id uuid UNIQUE NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
            event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            meta jsonb NOT NULL,
            email varchar(255),
            token bytea UNIQUE NOT NULL,
            status smallint NOT NULL DEFAULT 0
        );`);
    },
    async down(db) {
        await db.query("DROP TABLE tickets;");
    }
};