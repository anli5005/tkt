module.exports = require("nodemailer").createTransport({
    pool: true,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 465,
    secure: !process.env.MAIL_INSECURE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});