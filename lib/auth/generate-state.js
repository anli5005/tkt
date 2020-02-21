const { promisify } = require("util");
const { randomBytes } = require("crypto");

const random = promisify(randomBytes);

module.exports = async (req, res) => {
    const buf = await random(12);
    let state = buf.toString("base64").replace(/\//g, "-");
    if (req.query.invite && req.query.invite.match(/^[A-Za-z0-9+=\- ]*$/)) {
        state += `.${req.query.invite}`;
    }

    res.setHeader("Set-Cookie", [`state=${state}; Max-Age=600; Path=/api/auth`]);

    return state;
};