"use strict";

module.exports = {
    async up(db) {
        await db.query(`CREATE TABLE auth_providers(
            id uuid UNIQUE NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid NOT NULL REFERENCES users(id),
            auth_type varchar(255) NOT NULL,
            subject varchar(255),
            meta jsonb
        );`)
    },
    async down(db) {
        await db.query("DROP TABLE auth_providers;")
    }
};