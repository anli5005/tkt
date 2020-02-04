const db = require("../../db/db");
const secret = require("./secret");
const { verify } = require("jsonwebtoken");
const { promisify } = require("util");

export default (context) => {  
    if (context.didCheckAuth) {
        return;
    }
    
    if (!context.checkingAuth) {
        context.checkingAuth = (async () => {
            const token = context.token;
            if (token) {
                try {
                    const subject = (await promisify(verify)(token, secret, {algorithms: ["HS256"]})).sub;
                    if (typeof subject !== "string") {
                        throw new Error("Malformed subject");
                    }
        
                    const users = (await db.query("SELECT id FROM users WHERE token_subject = decode($1, 'base64');", [subject])).rows;
                    if (users.length > 1) {
                        throw new Error("Multiple users for subject");
                    }
        
                    if (users.length === 1) {
                        context.user = users[0];
                    } else {
                        context.user = null;
                    }
                } catch (e) {
                    console.log(e);
                    context.user = null;
                }
            } else {
                context.user = null;
            }
            context.checkingAuth = null;
            context.didCheckAuth = true;
        })();
    }

    return context.checkingAuth;
};