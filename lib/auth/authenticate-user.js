const db = require("../../db/db");
const secret = require("./secret");
const { sign } = require("jsonwebtoken");
const { promisify } = require("util");

const tokenSubjectLength = 32;
const maxAge = 172800;

module.exports = async ({authType, subject}, res, redirect) => {
    const { rows } = (await db.query(
        "SELECT users.id, users.token_subject FROM auth_providers INNER JOIN users ON auth_providers.user_id = users.id WHERE auth_providers.auth_type=$1 AND auth_providers.subject=$2;",
        [authType, subject]
    ));
    if (rows.length > 1) {
        throw new Error("Multiple results for a given auth provider");
    }

    let user;

    if (rows.length === 1) {
        user = rows[0];
        if (!user.token_subject) {
            user = (await db.query(
                "UPDATE users SET token_subject = gen_random_bytes($1) WHERE id = $2 RETURNING id, token_subject;",
                [tokenSubjectLength, user.id]
            )).rows[0];
        }
    } else {
        user = (await db.query(
            "INSERT INTO users (token_subject) VALUES (gen_random_bytes($1)) RETURNING id, token_subject;",
            [tokenSubjectLength]
        )).rows[0];
        await db.query("INSERT INTO auth_providers (user_id, auth_type, subject) VALUES ($1, $2, $3);", [user.id, authType, subject])
    }

    const token = await promisify(sign)({sub: user.token_subject.toString("base64")}, secret, {expiresIn: maxAge});
    res.status(303);
    res.setHeader("Set-Cookie", [`auth=${token}; Max-Age=${maxAge}; Path=/`]);
    res.setHeader("Location", redirect);
    res.end();
};