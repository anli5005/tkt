"use strict";

module.exports = {
    async up(db) {
        await db.query(`ALTER TABLE events ADD can_send_emails boolean not null default false;`);
        await db.query(`UPDATE events SET can_send_emails = true;`);
    },
    async down(db) {
        await db.query("ALTER TABLE events DROP COLUMN can_send_emails;");
    }
};