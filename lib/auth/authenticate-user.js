const db = require("../../db/db");
const config = require("config");
const { sign } = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async ({authType, subject}, res) => {
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
                [config.get("auth.tokenSubjectLength"), user.id]
            )).rows[0];
        }
    } else {
        user = (await db.query(
            "INSERT INTO users (token_subject) VALUES (gen_random_bytes($1)) RETURNING id, token_subject;",
            [config.get("auth.tokenSubjectLength")]
        )).rows[0];
        await db.query("INSERT INTO auth_providers (user_id, auth_type, subject) VALUES ($1, $2, $3);", [user.id, authType, subject])
    }

    const maxAge = config.get("auth.tokenMaxAge");
    const token = await promisify(sign)({sub: user.token_subject.toString("base64")}, config.get("auth.jwtSecret"), {expiresIn: maxAge});
    res.status(303);
    res.setHeader("Set-Cookie", [`auth=${token}; Max-Age=${maxAge}; Path=/`]);
    res.setHeader("Location", "/");
    res.end();
};