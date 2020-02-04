"use strict";

module.exports = {
    async up(db) {
        await db.query(`ALTER TABLE event_users ADD date_added timestamp;`);
    },
    async down(db) {
        await db.query("ALTER TABLE event_users DROP COLUMN date_added;");
    }
};