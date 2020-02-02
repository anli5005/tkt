const db = require("../../db/db");
const config = require("config");
const { verify } = require("jsonwebtoken");
const { promisify } = require("util");

export default async (context) => {    
    if (context.didCheckAuth) {
        return;
    }

    context.didCheckAuth = true;

    const token = context.token;
    if (token) {
        try {
            const subject = (await promisify(verify)(token, config.get("auth.jwtSecret"), {algorithms: ["HS256"]})).sub;
            if (typeof subject !== "string") {
                throw new Error("Malformed subject");
            }

            const users = (await db.query("SELECT id FROM users WHERE token_subject = decode($1, 'base64');", [subject])).rows;
            if (users.length > 1) {
                throw new Error("Multiple users for subject");
            }

            if (users.length === 1) {
                context.userId = users[0].id;
            } else {
                context.userId = null;
            }
        } catch (e) {
            console.log(e);
            context.userId = null;
        }
    } else {
        context.userId = null;
    }
};