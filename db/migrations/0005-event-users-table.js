"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE event_users(
            event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
            user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT event_users_pkey PRIMARY KEY (event_id, user_id)
        );`);
    },
    async down(db) {
        await db.query("DROP TABLE event_users;");
    }
};